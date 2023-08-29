import { Module } from '@nestjs/common';
import { ItemPriceService } from './item-price.service';
import { LostarkModule } from 'src/lostark/lostark.module';

@Module({
  imports: [LostarkModule],
  providers: [ItemPriceService],
  exports: [ItemPriceService],
})
export class ItemPriceModule {}
