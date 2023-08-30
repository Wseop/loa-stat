import { Module } from '@nestjs/common';
import { LostarkService } from './lostark.service';
import { GoogleSheetModule } from 'src/google-sheet/google-sheet.module';
import { EngravingModule } from 'src/engraving/engraving.module';

@Module({
  imports: [GoogleSheetModule, EngravingModule],
  providers: [LostarkService],
  exports: [LostarkService],
})
export class LostarkModule {}
