import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { LostarkNotice } from 'src/commons/lostark/interfaces/lostark-notice.interface';
import { LostarkService } from 'src/commons/lostark/lostark.service';

@Injectable()
export class NoticesService {
  private readonly logger: Logger = new Logger(NoticesService.name);
  private readonly cacheKey = 'NOTICE_CACHE';

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly lostarkService: LostarkService,
  ) {
    setTimeout(() => {
      this.updateNoticeCache();
    }, 1000 * 5);
    setInterval(() => {
      this.updateNoticeCache();
    }, 1000 * 60);
  }

  private async updateNoticeCache(): Promise<void> {
    const notices = await this.lostarkService.getNotices();
    if (notices?.length > 0) {
      this.cacheManager.set(this.cacheKey, notices, { ttl: 60 * 60 * 24 });
    }
  }

  async getNotices(): Promise<LostarkNotice[]> {
    return await this.cacheManager.get(this.cacheKey);
  }
}
