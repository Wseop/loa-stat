import { Module } from '@nestjs/common';
import { LostarkService } from './lostark.service';
import { GoogleSheetModule } from 'src/commons/google-sheet/google-sheet.module';

@Module({
  imports: [GoogleSheetModule],
  providers: [LostarkService],
  exports: [LostarkService],
})
export class LostarkModule {}
