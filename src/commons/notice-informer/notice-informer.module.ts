import { Module } from '@nestjs/common';
import { NoticeInformerService } from './notice-informer.service';
import { LostarkModule } from 'src/commons/lostark/lostark.module';

@Module({
  imports: [LostarkModule],
  providers: [NoticeInformerService],
})
export class NoticeInformerModule {}
