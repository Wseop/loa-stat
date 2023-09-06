import { Module } from '@nestjs/common';
import { LostarkModule } from 'src/lostark/lostark.module';
import { MarketPriceController } from './market-price.controller';
import { MarketPriceService } from './market-price.service';

@Module({
  imports: [LostarkModule],
  controllers: [MarketPriceController],
  providers: [MarketPriceService],
  exports: [MarketPriceService],
})
export class MarketPriceModule {}
