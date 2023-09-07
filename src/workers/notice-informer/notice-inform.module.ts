import { Module } from '@nestjs/common';
import { LostarkModule } from 'src/lostark/lostark.module';
import { NoticeInformService } from './notice-inform.service';

@Module({
  imports: [LostarkModule],
  providers: [NoticeInformService],
})
export class NoticeInformModule {}
