import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.sevice'; // Adjust the import path as needed
import { CreateUserDto } from './dto/createUserDto.dto'; // Adjust the import path as needed

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
}
