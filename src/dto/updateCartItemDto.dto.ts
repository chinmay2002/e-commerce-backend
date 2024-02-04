import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemsDto {
  @ApiProperty({
    description: 'Cart Item Id',
    example: '1',
  })
  @IsInt()
  cartItemId: number;

  @ApiProperty({
    description: 'number of product',
    example: '10',
  })
  @IsInt()
  quantity: number;
}
