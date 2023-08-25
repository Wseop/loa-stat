import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LostarkModule } from './lostark/lostark.module';
import { GoogleSheetModule } from './google-sheet/google-sheet.module';

@Module({
  imports: [ConfigModule.forRoot(), GoogleSheetModule, LostarkModule],
})
export class AppModule {}
