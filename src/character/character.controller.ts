import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { CharacterService } from './character.service';
import { CharacterDto } from './dtos/character.dto';

@ApiTags('[Characters]')
@Controller('characters')
export class CharacterController {
  private readonly logger: Logger = new Logger(CharacterController.name);

  constructor(private readonly characterService: CharacterService) {}

  @Get('/:characterName')
  @ApiOkResponse({ type: CharacterDto })
  @ApiParam({
    name: 'characterName',
    type: String,
    required: true,
    example: '쿠키바닐라쉐이크',
  })
  getCharacter(@Param('characterName') characterName: string) {
    return this.characterService.findOneByCharacterName(characterName);
  }

  @Post('/add/:characterName')
  @ApiOkResponse()
  @ApiParam({ name: 'characterName', type: String, required: true })
  addRequest(@Param('characterName') characterName: string) {
    this.characterService.addRequest(characterName);
    return HttpStatus.OK;
  }
}
