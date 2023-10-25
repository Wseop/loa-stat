import { ApiProperty } from '@nestjs/swagger';
import { TripodPrice } from '../interfaces/tripods.interface';

export class TripodPriceDto implements TripodPrice {
  @ApiProperty({ type: String })
  skillName: string;

  @ApiProperty({ type: String })
  tripodName: string;

  @ApiProperty({ type: Number })
  price: number;

  @ApiProperty({ type: String })
  updated: string;
}
