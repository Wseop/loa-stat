import { Module } from '@nestjs/common';
import { MarketPriceController } from './market-price.controller';
import { MarketPriceService } from './market-price.service';
import { LostarkModule } from 'src/commons/lostark/lostark.module';

@Module({
  imports: [LostarkModule],
  controllers: [MarketPriceController],
  providers: [MarketPriceService],
  exports: [MarketPriceService],
})
export class MarketPriceModule {}
