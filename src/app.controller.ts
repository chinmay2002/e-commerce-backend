import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/createUserDto.dto';
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
}
