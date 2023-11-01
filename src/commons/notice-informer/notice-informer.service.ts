import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { EmbedBuilder } from 'discord.js';
import { LostarkNotice } from 'src/commons/lostark/interfaces/lostark-notice.interface';
import { LostarkService } from 'src/commons/lostark/lostark.service';
import { wait } from 'src/commons/utils/time';

@Injectable()
export class NoticeInformerService {
  private readonly logger: Logger = new Logger(NoticeInformerService.name);
  private noticeIds: number[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly lostarkService: LostarkService,
  ) {
    setTimeout(() => {
      this.refreshLostarkNoticeId();
    }, 1000 * 5);

    setInterval(() => {
      if (this.noticeIds.length > 0) this.postLostarkNotice();
    }, 1000 * 60);
  }

  // noticeId 갱신
  private async refreshLostarkNoticeId() {
    // 성공할때까지 10초 간격으로 시도
    while (true) {
      const notices: LostarkNotice[] = await this.lostarkService.scrapNotices();

      if (notices?.length > 0) {
        this.noticeIds = notices.map((v) => v.noticeId);
        break;
      } else {
        await wait(1000 * 10);
      }
    }
  }

  // 디스코드 채널로 신규 공지 posting
  private async postLostarkNotice() {
    const notices: LostarkNotice[] = await this.lostarkService.scrapNotices();
    const embeds: EmbedBuilder[] = [];

    if (notices) {
      const newNoticeIds: number[] = [];
      const oldNoticeIds: number[] = [];

      notices.forEach((v) => {
        // 공지 id 추출
        // 신규 공지면 메세지 embed까지 생성
        if (!this.noticeIds.includes(v.noticeId)) {
          newNoticeIds.push(v.noticeId);
          embeds.push(
            new EmbedBuilder()
              .setTitle(v.title)
              .setDescription(v.link)
              .setFooter({ text: v.date.toLocaleString() }),
          );
        } else {
          oldNoticeIds.push(v.noticeId);
        }
      });

      // 공지 id 갱신
      this.noticeIds = [...newNoticeIds, ...oldNoticeIds];
    }

    // 신규 공지가 있으면 전송
    if (embeds.length > 0) {
      try {
        await axios.post(this.configService.get<string>('discord.noticeURL'), {
          embeds,
        });
      } catch (error) {
        if (error.response) this.logger.error(error.response.status);
        else if (error.request) this.logger.error(error.request);
        else this.logger.error(error.message);
      }
    }
  }
}
