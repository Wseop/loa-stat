import { Module } from '@nestjs/common';
import { LostarkModule } from 'src/lostark/lostark.module';
import { CharacterCollectService } from './character-collect.service';
import { CharacterModule } from 'src/character/character.module';
import { EngravingModule } from 'src/engraving/engraving.module';

@Module({
  imports: [LostarkModule, CharacterModule, EngravingModule],
  providers: [CharacterCollectService],
  exports: [CharacterCollectService],
})
export class CharacterCollectModule {}
