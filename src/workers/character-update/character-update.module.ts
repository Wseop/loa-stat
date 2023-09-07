import { Module } from '@nestjs/common';
import { CharacterModule } from 'src/character/character.module';
import { LostarkModule } from 'src/lostark/lostark.module';
import { CharacterUpdateService } from './character-update.service';

@Module({
  imports: [LostarkModule, CharacterModule],
  providers: [CharacterUpdateService],
})
export class CharacterUpdateModule {}
