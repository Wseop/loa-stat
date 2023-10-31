import { Injectable, Logger } from '@nestjs/common';
import { LostarkService } from 'src/commons/lostark/lostark.service';
import {
  TripodPrice,
  TripodSearchOption,
} from './interfaces/tripods.interface';
import {
  AuctionItem,
  RequestAuctionItem,
} from 'src/commons/lostark/interfaces/lostark-auction.interface';
import { AuctionItemCategory } from 'src/commons/enums/lostark.enum';
import { ClassMap } from 'src/commons/consts/lostark.const';
import { getCurrentDate } from 'src/commons/utils/date';

@Injectable()
export class TripodsService {
  private readonly logger: Logger = new Logger(TripodsService.name);
  private tripodPrices: {
    [className: string]: TripodPrice[];
  } = {};
  private classIndex: number = 0;

  constructor(private readonly lostarkService: LostarkService) {
    const classes = Object.keys(ClassMap);

    classes.forEach((v) => {
      this.tripodPrices[v] = [];
    });

    setInterval(() => {
      if (this.classIndex >= classes.length) this.classIndex = 0;
      this.updateClassTripodsPrice(classes[this.classIndex++]);
    }, 1000 * 30);
  }

  private getClassTripodSearchOptions(className: string): TripodSearchOption[] {
    const auctionOption = this.lostarkService.getAuctionOption();
    const tripodSearchOptions: TripodSearchOption[] = [];

    auctionOption.SkillOptions.forEach((skillOption) => {
      if (skillOption.Class === className) {
        skillOption.Tripods.forEach((tripod) => {
          if (!tripod.IsGem) {
            tripodSearchOptions.push({
              skillId: skillOption.Value,
              skillName: skillOption.Text,
              tripodId: tripod.Value,
              tripodName: tripod.Text,
            });
          }
        });
      }
    });

    return tripodSearchOptions;
  }

  private async searchClassTripods(className: string): Promise<TripodPrice[]> {
    const tripodPrices: TripodPrice[] = [];
    const searchOptions = this.getClassTripodSearchOptions(className);
    const currentDate = getCurrentDate();

    await Promise.all(
      searchOptions.map(async (searchOption) => {
        const requestAuctionItem: RequestAuctionItem = {
          categoryCode: AuctionItemCategory.아뮬렛,
          pageNo: 1,
          itemGrade: '유물',
          characterClass: className,
          skillOptions: [
            {
              FirstOption: searchOption.skillId,
              SecondOption: searchOption.tripodId,
              MaxValue: 5,
              MinValue: 5,
            },
          ],
        };
        const auctionItem: AuctionItem =
          await this.lostarkService.searchAuctionItem(requestAuctionItem);

        if (auctionItem?.buyPrice > 0) {
          tripodPrices.push({
            skillName: searchOption.skillName,
            tripodName: searchOption.tripodName,
            iconPath: auctionItem.iconPath,
            price: auctionItem.buyPrice,
            updated: currentDate,
          });
        }
      }),
    );

    return tripodPrices;
  }

  private async updateClassTripodsPrice(className: string): Promise<void> {
    const tripods = await this.searchClassTripods(className);

    tripods.sort((a, b) => b.price - a.price);
    this.tripodPrices[className] = tripods;
  }

  getTripodsPrice(className: string): TripodPrice[] {
    if (!this.tripodPrices.hasOwnProperty(className)) return null;
    else return this.tripodPrices[className];
  }
}
