import { ApiProperty } from '@nestjs/swagger';
import { ItemPrice } from '../interfaces/item-price.interface';

export class ItemPriceDto implements ItemPrice {
  @ApiProperty()
  itemName: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  updated: string;
}
