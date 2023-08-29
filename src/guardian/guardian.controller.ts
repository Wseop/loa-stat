import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GuardianService } from './guardian.service';
import { GuardianRewardDto } from './dtos/guardian-reward.dto';

@ApiTags('[Guardian]')
@Controller('guardian')
export class GuardianController {
  constructor(private readonly guardianService: GuardianService) {}

  @Get('/reward')
  @ApiOkResponse({ type: [GuardianRewardDto] })
  getReward() {
    return this.guardianService.getAvgReward();
  }
}
