import { Module } from '@nestjs/common';
import { CharacterModule } from 'src/apis/character/character.module';
import { CharacterUpdateService } from './character-update.service';
import { LostarkModule } from 'src/commons/lostark/lostark.module';

@Module({
  imports: [LostarkModule, CharacterModule],
  providers: [CharacterUpdateService],
})
export class CharacterUpdateModule {}
