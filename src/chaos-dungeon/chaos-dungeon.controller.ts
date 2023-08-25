import { Controller, Get } from '@nestjs/common';
import { ChaosDungeonService } from './chaos-dungeon.service';

@Controller('chaos')
export class ChaosDungeonController {
  constructor(private readonly chaosDungeonService: ChaosDungeonService) {}

  @Get('/reward')
  getReward() {
    return this.chaosDungeonService.getAvgReward();
  }
}
