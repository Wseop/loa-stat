import { Module } from '@nestjs/common';
import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';
import { LostarkModule } from 'src/commons/lostark/lostark.module';

@Module({
  imports: [LostarkModule],
  controllers: [NoticesController],
  providers: [NoticesService],
})
export class NoticesModule {}
