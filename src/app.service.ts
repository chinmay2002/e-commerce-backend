import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.sevice'; // Adjust the import path as needed
import { CreateUserDto } from './dto/createUserDto.dto'; // Adjust the import path as needed
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/createProductDto.dto';
import { AddToCartDto } from './dto/addToCartDto.dto';
import { UpdateCartItemsDto } from './dto/updateCartItemDto.dto';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    // Here you might want to hash the password before saving
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: createUserDto.password,
        name: createUserDto.name,
        mobile: createUserDto.number,
      },
    });
    return user;
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  /////////////////////////product///////////////////

  async createNamkeen(createProductDto: CreateProductDto) {
    return this.prisma.product.upsert({
      where: {
        name: createProductDto.name,
      },
      create: {
        name: createProductDto.name,
        price: createProductDto.price,
        quantity: createProductDto.quantity,
      },
      update: {
        price: createProductDto.price,
        quantity: createProductDto.quantity,
      },
    });
  }

  async getAllNamkeens() {
    return this.prisma.product.findMany({});
  }

  async getNamkeenById(id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.prisma.product.findFirst({ where: { id: numericId } });
  }

  async deleteNamkeenById(id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.prisma.product.delete({ where: { id: numericId } });
  }

  async deleteNamkeenByName(name: string) {
    return this.prisma.product.delete({ where: { name } });
  }

  // -------------------------Cart------------------------------

  async addToCart(userId: number, addToCartDto: AddToCartDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user)
      throw new NotFoundException('Please log in before you continue!!');
    const product = await this.prisma.product.findUnique({
      where: {
        id: addToCartDto.productId,
      },
    });
    if (!product) throw new NotFoundException("Product don't exist!!");
    let cart = null;
    if (product.quantity < addToCartDto.quantity) {
      throw new NotFoundException(`only ${product.quantity} exists`);
    } else {
      cart = await this.prisma.cart.create({
        data: {
          quantity: addToCartDto.quantity,
          userId: userId,
          productId: addToCartDto.productId,
        },
      });
    }
    return cart;
  }

  async listCartItems(userId: number) {
    const cartItems = await this.prisma.cart.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: true, // Include product details in the response
      },
    });

    if (!cartItems) {
      throw new NotFoundException('Cart is empty');
    }

    return cartItems;
  }

  async updateCartItem(userId: number, updateCartItemDto: UpdateCartItemsDto) {
    const existingCartItem = await this.prisma.cart.findUnique({
      where: { id: updateCartItemDto.cartItemId },
      include: { product: true },
    });

    if (!existingCartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (existingCartItem.product.quantity < updateCartItemDto.quantity) {
      throw new BadRequestException(
        `Only ${existingCartItem.product.quantity} of ${existingCartItem.product.name} available`,
      );
    }

    const updatedCartItem = await this.prisma.cart.update({
      where: { id: updateCartItemDto.cartItemId },
      data: { quantity: updateCartItemDto.quantity },
    });

    return updatedCartItem;
  }

  async removeCartItem(cartItemId: number) {
    const existingCartItem = await this.prisma.cart.findUnique({
      where: { id: cartItemId },
    });

    if (!existingCartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cart.delete({
      where: { id: cartItemId },
    });

    return { message: 'Cart item removed successfully' };
  }

  async createOrder(userId: number): Promise<any> {
    return this.prisma.$transaction(async (prisma) => {
      const cartItems = await prisma.cart.findMany({
        where: { userId },
        include: { product: true },
      });

      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      const allItemsAvailable = cartItems.every(
        (item) => item.product.quantity >= item.quantity,
      );
      if (!allItemsAvailable) {
        throw new Error('One or more cart items exceed available quantity');
      }

      const totalPrice = cartItems.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);

      const order = await prisma.order.create({
        data: {
          userId,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      await Promise.all(
        cartItems.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { quantity: { decrement: item.quantity } },
          }),
        ),
      );

      await prisma.cart.deleteMany({ where: { userId } });

      return {
        order,
        totalPrice,
      };
    });
  }

  async listUserOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async getOrderDetails(userId: number, orderId: number) {
    return this.prisma.order.findMany({
      where: { userId, id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
