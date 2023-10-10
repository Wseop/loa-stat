import { Module } from '@nestjs/common';
import { MarketPriceController } from './market-price.controller';
import { MarketPriceService } from './market-price.service';

@Module({
  controllers: [MarketPriceController],
  providers: [MarketPriceService],
  exports: [MarketPriceService],
})
export class MarketPriceModule {}
