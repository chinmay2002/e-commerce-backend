import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  Put,
  Headers,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/createUserDto.dto';
import { CreateProductDto } from './dto/createProductDto.dto';
import { AddToCartDto } from './dto/addToCartDto.dto';
import { UpdateCartItemsDto } from './dto/updateCartItemDto.dto';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.appService.createUser(createUserDto);
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.appService.getUserById(+id);
  }

  @Post('createOrUpdateNamkeen')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.appService.createNamkeen(createProductDto);
  }

  @Get('getAllNamkeens')
  getAllNamkeens() {
    return this.appService.getAllNamkeens();
  }

  @Get('getNamkeenById/:id')
  getNamkeenById(@Param('id') id: string) {
    return this.appService.getNamkeenById(id);
  }

  @Delete('deleteNamkeenById/:id')
  deleteNamkeenById(@Param('id') id: string) {
    return this.appService.deleteNamkeenById(id);
  }

  @Delete('deleteNamkeenByName')
  deleteNamkeenByName(@Headers('name') name: string) {
    return this.appService.deleteNamkeenByName(name);
  }

  @Post('addToCart')
  addToCart(
    @Headers('userId') userId: number,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.appService.addToCart(+userId, addToCartDto);
  }

  @Get('listCartItems')
  listCartItems(@Headers('userId') userId: number) {
    return this.appService.listCartItems(+userId); // Convert userId to number
  }

  @Post('updateCartItem')
  updateCartItem(
    @Headers('userId') userId: number,
    @Body() updateCartItemDto: UpdateCartItemsDto,
  ) {
    return this.appService.updateCartItem(+userId, updateCartItemDto);
  }

  @Delete('removeCartItem')
  removeCartItem(@Headers('cartItemId') cartItemId: number) {
    // Here, you might want to ensure that the cart item belongs to the user specified by userId
    return this.appService.removeCartItem(+cartItemId);
  }

  @Post('createOrder')
  async createOrder(@Headers('userId') userId: number) {
    return this.appService.createOrder(+userId);
  }

  @Get('listUserOrders')
  async listUserOrders(@Headers('userId') userId: number) {
    return this.appService.listUserOrders(+userId);
  }

  @Get('getOrderDetails')
  async getOrderDetails(
    @Headers('userId') userId: number,
    @Headers('orderId') orderId: number,
  ) {
    return this.appService.getOrderDetails(+userId, +orderId);
  }
}
