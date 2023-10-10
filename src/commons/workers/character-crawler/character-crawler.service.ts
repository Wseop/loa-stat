import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { load } from 'cheerio';
import puppeteer, { Browser, Page } from 'puppeteer';
import { CharacterService } from 'src/apis/character/character.service';

@Injectable()
export class CharacterCrawlerService {
  private readonly logger: Logger = new Logger(CharacterCrawlerService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly characterService: CharacterService,
  ) {
    setTimeout(() => {
      this.run();
    }, 1000 * 5);
  }

  private async launchBrowser(): Promise<Browser> {
    return await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: 'google-chrome-stable',
    });
  }

  private async openCrawlPage(browser: Browser): Promise<Page> {
    const page = await browser.newPage();

    // 리소스 차단
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (
        req.resourceType() === 'image' ||
        req.resourceType() === 'font' ||
        req.resourceType() === 'stylesheet' ||
        req.resourceType() === 'media'
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    try {
      await page.goto(this.configService.get<string>('worker.crawlUrl'));
      return page;
    } catch (error) {
      this.logger.error('page open fail');
      return null;
    }
  }

  private async applySearchFilter(
    page: Page,
    serverIndex: number,
    classIndex0: number,
    classIndex1: number,
  ): Promise<boolean> {
    // 최소 아이템 레벨 입력
    const minItemLevelSelector =
      '#contents > article > div.row.rounded > div.p-0.m-0.row > div.col-lg-7.order-2.order-lg-1 > form > div > div:nth-child(8) > div > div:nth-child(2) > div > input.form-control.form-control-sm.ms-4.text-center';
    try {
      await page.waitForSelector(minItemLevelSelector);
      await page.$eval(minItemLevelSelector, (el) => (el.value = '1620'));
    } catch (error) {
      this.logger.error('input item level fail');
      return false;
    }

    // 서버 선택
    const serverSelector = `#contents > article > div.row.rounded > div.p-0.m-0.row > div.col-lg-7.order-2.order-lg-1 > form > div > div:nth-child(1) > div > div:nth-child(2) > div > label:nth-child(${serverIndex}) > span`;
    try {
      await page.waitForSelector(serverSelector);
      await page.click(serverSelector);
    } catch (error) {
      this.logger.error('select server fail');
      return false;
    }

    // 직업 선택
    const classSelector = `#contents > article > div.row.rounded > div.p-0.m-0.row > div.col-lg-7.order-2.order-lg-1 > form > div > div:nth-child(${classIndex0}) > div > div:nth-child(2) > div > label:nth-child(${classIndex1}) > span`;
    try {
      await page.waitForSelector(classSelector);
      await page.click(classSelector);
    } catch (error) {
      this.logger.error('select class fail');
      return false;
    }

    await new Promise((_) => setTimeout(_, 1000 * 5));

    // 필터 적용
    const applySelector =
      '#contents > article > div.row.rounded > div.p-0.m-0.row > div.col-lg-7.order-2.order-lg-1 > form > div > div:nth-child(8) > div > div:nth-child(2) > div > button';
    try {
      await page.waitForSelector(applySelector);
      await page.click(applySelector);
      this.logger.debug('Search filter applied');
      return true;
    } catch (error) {
      this.logger.error('apply filter fail');
      return false;
    }
  }

  private async searchCharacterNames(page: Page): Promise<void> {
    const searchMoreSelector =
      '#contents > article > div.row.rounded > div.box.p-2 > div > button';
    let characterCount = 0;

    while (true) {
      // 더보기 버튼 위치까지 페이지 스크롤
      await page.mouse.wheel({ deltaY: Number.MAX_SAFE_INTEGER });
      await new Promise((_) => setTimeout(_, 1000 * 3));

      // 더보기
      try {
        await page.waitForSelector(searchMoreSelector);
        await page.click(searchMoreSelector);
      } catch (error) {
        this.logger.error('search more fail');
        break;
      }

      await new Promise((_) => setTimeout(_, 1000 * 3));

      // 조회된 캐릭터 수 갱신
      const $ = load(await page.content());
      const count = $(
        '#contents > article > div.row.rounded > table > tbody',
      ).children().length;

      // 더 이상 갱신할 캐릭터가 없으면 break
      if (characterCount === count) break;
      characterCount = count;
    }

    // 검색된 캐릭터명 추출 및 db에 추가 요청
    const $ = load(await page.content());
    for (let i = 1; i <= characterCount; i++) {
      const characterName = $(
        `#contents > article > div.row.rounded > table > tbody > tr:nth-child(${i}) > td:nth-child(2) > a`,
      ).text();
      this.characterService.addRequest(characterName);
    }

    this.logger.debug(`Searched character count : ${characterCount}`);
  }

  private async run(): Promise<void> {
    const classCounts = [6, 6, 6, 5, 5, 3];

    while (true) {
      for (let serverIndex = 2; serverIndex <= 9; serverIndex++) {
        for (let classIndex0 = 2; classIndex0 <= 7; classIndex0++) {
          for (
            let classIndex1 = 2;
            classIndex1 <= classCounts[classIndex0 - 2];
            classIndex1++
          ) {
            const browser = await this.launchBrowser();
            const page = await this.openCrawlPage(browser);

            // prettier-ignore
            this.logger.debug(
              `${serverIndex - 1}/8 | ${classIndex0 - 1}/6 | ${classIndex1 - 1}/${classCounts[classIndex0 - 2] - 1}`,
            );

            if (!page) continue;
            // prettier-ignore
            if (!(await this.applySearchFilter(page, serverIndex, classIndex0, classIndex1))) continue;

            await this.searchCharacterNames(page);
            await page.close();
            await browser.close();
          }
        }
      }

      await new Promise((_) => setTimeout(_, 1000 * 60 * 60 * 24 * 7));
    }
  }
}
