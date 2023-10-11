import { Module } from '@nestjs/common';
import { PriceUpdaterService } from './price-updater.service';
import { MarketPriceModule } from 'src/apis/market-price/market-price.module';
import { LostarkModule } from 'src/commons/lostark/lostark.module';

@Module({
  imports: [LostarkModule, MarketPriceModule],
  providers: [PriceUpdaterService],
})
export class PriceUpdaterModule {}
