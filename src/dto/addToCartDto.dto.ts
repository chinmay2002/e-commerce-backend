import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({
    description: 'Product Id',
    example: '1',
  })
  @IsInt()
  productId: number;

  @ApiProperty({
    description: 'number of product',
    example: '10',
  })
  @IsInt()
  quantity: number;
}
