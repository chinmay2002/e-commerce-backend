import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product Name',
    example: 'iphone 15 pro',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'number of product',
    example: '10',
  })
  @IsInt()
  quantity: number;

  @ApiProperty({
    description: 'Price of product',
    example: '70000',
  })
  @IsInt()
  price: number;
}
