import { ApiProperty } from '@nestjs/swagger';
import { LostarkNotice } from 'src/commons/lostark/interfaces/lostark-notice.interface';

export class NoticeDto implements LostarkNotice {
  @ApiProperty({ type: Number })
  noticeId: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  date: string;

  @ApiProperty({ type: String })
  link: string;
}
