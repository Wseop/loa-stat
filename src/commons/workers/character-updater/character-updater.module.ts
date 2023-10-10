import { Module } from '@nestjs/common';
import { CharacterModule } from 'src/apis/character/character.module';
import { CharacterUpdaterService } from './character-updater.service';
import { LostarkModule } from 'src/commons/lostark/lostark.module';

@Module({
  imports: [LostarkModule, CharacterModule],
  providers: [CharacterUpdaterService],
})
export class CharacterUpdaterModule {}
