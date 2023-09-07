import { ApiProperty } from '@nestjs/swagger';
import { ItemPrice } from '../interfaces/item-price.interface';

export class ItemPriceDto implements ItemPrice {
  @ApiProperty({ type: String })
  itemName: string;

  @ApiProperty({ type: Number })
  price: number;

  @ApiProperty({ type: String })
  updated: string;
}
