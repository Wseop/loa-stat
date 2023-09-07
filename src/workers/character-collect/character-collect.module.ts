import { Module } from '@nestjs/common';
import { LostarkModule } from 'src/lostark/lostark.module';
import { CharacterCollectService } from './character-collect.service';
import { CharacterModule } from 'src/character/character.module';

@Module({
  imports: [LostarkModule, CharacterModule],
  providers: [CharacterCollectService],
})
export class CharacterCollectModule {}
