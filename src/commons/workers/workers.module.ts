import { Module } from '@nestjs/common';
import { NoticeInformerModule } from './notice-informer/notice-informer.module';
import { CharacterUpdaterModule } from './character-updater/character-updater.module';

@Module({
  imports: [NoticeInformerModule, CharacterUpdaterModule],
})
export class WorkersModule {}
