import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { CharacterService } from './character.service';
import { CharacterDto } from './dtos/character.dto';
import { CharacterServersDto } from './dtos/character-servers.dto';
import { CharacterQueryDto } from './dtos/character-query.dto';
import { CharacterClassEngravingsDto } from './dtos/character-class-engravings.dto';
import { CharacterSettingsDto } from './dtos/character-settings.dto';
import { CharacterSkillsDto } from './dtos/character-skills.dto';
import { ClassEngravingMap } from 'src/commons/consts/lostark.const';

@ApiTags('[Characters]')
@Controller('characters')
export class CharacterController {
  private readonly logger: Logger = new Logger(CharacterController.name);

  constructor(private readonly characterService: CharacterService) {}

  @Get('/info/:characterName')
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

  @Post('/:characterName')
  @ApiOkResponse()
  @ApiParam({ name: 'characterName', type: String, required: true })
  addRequest(@Param('characterName') characterName: string) {
    this.characterService.addRequest(characterName);
    return HttpStatus.OK;
  }

  @Get('/servers')
  @ApiOkResponse({ type: CharacterServersDto })
  getCharacterServers(@Query() query: CharacterQueryDto) {
    return this.characterService.getCharacterServers(
      query.minItemLevel,
      query.maxItemLevel,
    );
  }

  @Get('/classEngravings')
  @ApiOkResponse({ type: CharacterClassEngravingsDto })
  getCharacterClassEngravings(@Query() query: CharacterQueryDto) {
    return this.characterService.getCharacterClassEngravings(
      query.minItemLevel,
      query.maxItemLevel,
    );
  }

  @Get('/settings/:classEngraving')
  @ApiOkResponse({ type: CharacterSettingsDto })
  @ApiParam({
    name: 'classEngraving',
    required: true,
    enum: Object.keys(ClassEngravingMap),
  })
  getCharacterSettings(
    @Param('classEngraving') classEngraving: string,
    @Query() query: CharacterQueryDto,
  ) {
    return this.characterService.getCharacterSettings(
      query.minItemLevel,
      query.maxItemLevel,
      classEngraving,
    );
  }

  @Get('/skills/:classEngraving')
  @ApiOkResponse({ type: CharacterSkillsDto })
  @ApiParam({
    name: 'classEngraving',
    required: true,
    enum: Object.keys(ClassEngravingMap),
  })
  getCharacterSkills(
    @Param('classEngraving') classEngraving: string,
    @Query() query: CharacterQueryDto,
  ) {
    return this.characterService.getCharacterSkills(
      query.minItemLevel,
      query.maxItemLevel,
      classEngraving,
    );
  }
}
