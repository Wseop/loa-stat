import { Module } from '@nestjs/common';
import { NoticeInformService } from './notice-inform.service';
import { LostarkModule } from 'src/commons/lostark/lostark.module';

@Module({
  imports: [LostarkModule],
  providers: [NoticeInformService],
})
export class NoticeInformModule {}
