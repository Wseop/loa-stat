import { Module } from '@nestjs/common';
import { ChaosDungeonService } from './chaos-dungeon.service';
import { GoogleSheetModule } from 'src/google-sheet/google-sheet.module';
import { ChaosDungeonController } from './chaos-dungeon.controller';
import { ItemPriceModule } from 'src/worker/item-price/item-price.module';

@Module({
  imports: [GoogleSheetModule, ItemPriceModule],
  controllers: [ChaosDungeonController],
  providers: [ChaosDungeonService],
  exports: [ChaosDungeonService],
})
export class ChaosDungeonModule {}
