import { Module } from '@nestjs/common';
import { ItemPriceService } from './item-price.service';
import { MarketPriceModule } from 'src/apis/market-price/market-price.module';
import { LostarkModule } from 'src/commons/lostark/lostark.module';

@Module({
  imports: [LostarkModule, MarketPriceModule],
  providers: [ItemPriceService],
})
export class ItemPriceModule {}
