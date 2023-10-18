import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { LostarkNotice } from 'src/commons/lostark/interfaces/lostark-notice.interface';
import { LostarkService } from 'src/commons/lostark/lostark.service';
import { wait } from 'src/commons/utils/time';

@Injectable()
export class NoticesService {
  private readonly logger: Logger = new Logger(NoticesService.name);
  private readonly cacheKey = 'NOTICE_CACHE';
  private isStart: boolean = false;

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly lostarkService: LostarkService,
  ) {
    setTimeout(() => {
      this.startService();
    }, 1000 * 10);
  }

  private async startService(): Promise<void> {
    if (this.isStart) return;

    this.isStart = true;
    this.logger.log('START | Updating notice cache');
    while (true) {
      // 주기적으로 Notice cache 업데이트
      const notices = await this.lostarkService.getNotices();
      if (notices?.length > 0) {
        this.cacheManager.set(this.cacheKey, notices, { ttl: 60 * 60 * 24 });
      }
      await wait(1000 * 60);
    }
  }

  async getNotices(): Promise<LostarkNotice[]> {
    return await this.cacheManager.get(this.cacheKey);
  }
}
