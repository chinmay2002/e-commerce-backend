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
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/createUserDto.dto';
import { CreateProductDto } from './dto/createProductDto.dto';
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

  @Post('createOrUpdateProduct')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.appService.createProduct(createProductDto);
  }

  @Get('getAllProducts')
  getAllProducts() {
    return this.appService.getAllProducts();
  }

  @Get('getProductById/:id')
  getProductById(@Param('id') id: string) {
    return this.appService.getProductById(id);
  }

  @Delete('deleteProductById/:id')
  deleteProductById(@Param('id') id: string) {
    return this.appService.deleteProductById(id);
  }

  @Delete('deleteProductByName')
  deleteProductByName(@Headers('name') name: string) {
    return this.appService.deleteProductByName(name);
  }
}
