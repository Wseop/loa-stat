import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LostarkModule } from './lostark/lostark.module';

@Module({
  imports: [ConfigModule.forRoot(), LostarkModule],
})
export class AppModule {}
