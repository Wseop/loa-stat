import { Module } from '@nestjs/common';
import { PriceUpdaterModule } from './price-updater/price-updater.module';
import { NoticeInformerModule } from './notice-informer/notice-informer.module';
import { CharacterUpdaterModule } from './character-updater/character-updater.module';

@Module({
  imports: [PriceUpdaterModule, NoticeInformerModule, CharacterUpdaterModule],
})
export class WorkersModule {}
