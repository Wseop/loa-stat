import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { EmbedBuilder } from 'discord.js';
import { LostarkNotice } from 'src/lostark/interfaces/lostark-notice.interface';
import { LostarkService } from 'src/lostark/lostark.service';

@Injectable()
export class NoticeInformService {
  private readonly logger: Logger = new Logger(NoticeInformService.name);
  private lastNoticeId: number = 0;

  constructor(private readonly lostarkService: LostarkService) {
    setTimeout(() => {
      this.refreshLostarkNoticeId();
    }, 1000 * 5);

    setInterval(() => {
      if (this.lastNoticeId !== 0) this.postLostarkNotice();
    }, 1000 * 60);
  }

  // noticeId 갱신
  private async refreshLostarkNoticeId() {
    // 성공할때까지 10초 간격으로 시도
    while (true) {
      const notices: LostarkNotice[] = await this.lostarkService.getNotices();

      if (notices?.length > 0) {
        for (let notice of notices) {
          this.lastNoticeId =
            this.lastNoticeId < notice.noticeId
              ? notice.noticeId
              : this.lastNoticeId;
        }
        break;
      } else {
        await new Promise((_) => setTimeout(_, 1000 * 10));
      }
    }
    this.logger.log(`UPDATE | NoticeId - ${this.lastNoticeId}`);
  }

  // 디스코드 채널로 신규 공지 posting
  private async postLostarkNotice() {
    const notices: LostarkNotice[] = await this.lostarkService.getNotices();
    const embeds: EmbedBuilder[] = [];

    if (notices) {
      let lastNoticeId = this.lastNoticeId;

      notices.forEach((notice: LostarkNotice) => {
        if (notice.noticeId > this.lastNoticeId) {
          embeds.push(
            new EmbedBuilder()
              .setTitle(notice.title)
              .setDescription(notice.link)
              .setFooter({ text: notice.date.toLocaleString() }),
          );
          lastNoticeId =
            lastNoticeId < notice.noticeId ? notice.noticeId : lastNoticeId;
        }
      });

      if (this.lastNoticeId !== lastNoticeId) {
        this.lastNoticeId = lastNoticeId;
        this.logger.log(`UPDATE | NoticeId - ${this.lastNoticeId}`);
      }
    }

    if (embeds.length > 0) {
      try {
        await axios.post(process.env.NOTICE_HOOK_URL, { embeds });
      } catch (error) {
        if (error.response) this.logger.error(error.response.status);
        else if (error.request) this.logger.error(error.request);
        else this.logger.error(error.message);
      }
    }
  }
}
