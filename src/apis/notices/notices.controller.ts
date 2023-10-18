import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NoticesService } from './notices.service';
import { NoticeDto } from './dtos/notice.dto';

@ApiTags('[Notices]')
@Controller('notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Get('/')
  @ApiOkResponse({ type: [NoticeDto] })
  getNotices() {
    return this.noticesService.getNotices();
  }
}
