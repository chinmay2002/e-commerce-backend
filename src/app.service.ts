import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.sevice'; // Adjust the import path as needed
import { CreateUserDto } from './dto/createUserDto.dto'; // Adjust the import path as needed
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/createProductDto.dto';

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

  async createProduct(createProductDto: CreateProductDto) {
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

  async getAllProducts() {
    return this.prisma.product.findMany({});
  }

  async getProductById(id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.prisma.product.findFirst({ where: { id: numericId } });
  }

  async deleteProductById(id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.prisma.product.delete({ where: { id: numericId } });
  }

  async deleteProductByName(name: string) {
    return this.prisma.product.delete({ where: { name } });
  }
}
