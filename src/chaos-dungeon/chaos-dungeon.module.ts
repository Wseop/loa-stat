import { Module } from '@nestjs/common';
import { ChaosDungeonService } from './chaos-dungeon.service';
import { GoogleSheetModule } from 'src/google-sheet/google-sheet.module';
import { ChaosDungeonController } from './chaos-dungeon.controller';

@Module({
  imports: [GoogleSheetModule],
  controllers: [ChaosDungeonController],
  providers: [ChaosDungeonService],
  exports: [ChaosDungeonService],
})
export class ChaosDungeonModule {}
