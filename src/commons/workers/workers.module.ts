import { Module } from '@nestjs/common';
import { NoticeInformerModule } from './notice-informer/notice-informer.module';

@Module({
  imports: [NoticeInformerModule],
})
export class WorkersModule {}
