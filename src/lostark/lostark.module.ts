import { Module } from '@nestjs/common';
import { LostarkService } from './lostark.service';

@Module({
  providers: [LostarkService],
  exports: [LostarkService],
})
export class LostarkModule {}
