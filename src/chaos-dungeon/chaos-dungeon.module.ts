import { Module } from '@nestjs/common';
import { ChaosDungeonService } from './chaos-dungeon.service';
import { GoogleSheetModule } from 'src/google-sheet/google-sheet.module';
import { ChaosDungeonController } from './chaos-dungeon.controller';
import { MarketPriceModule } from 'src/market-price/market-price.module';

@Module({
  imports: [GoogleSheetModule, MarketPriceModule],
  controllers: [ChaosDungeonController],
  providers: [ChaosDungeonService],
  exports: [ChaosDungeonService],
})
export class ChaosDungeonModule {}
