import { Module } from '@nestjs/common';
import { ItemPriceService } from './item-price.service';
import { LostarkModule } from 'src/lostark/lostark.module';
import { MarketPriceModule } from 'src/market-price/market-price.module';

@Module({
  imports: [LostarkModule, MarketPriceModule],
  providers: [ItemPriceService],
  exports: [ItemPriceService],
})
export class ItemPriceModule {}
