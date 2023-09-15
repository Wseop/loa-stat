import { classEngravingMap } from 'src/lostark/consts/lostark.const';

export class CharacterClassEngravings {
  protected total: number;
  protected classEngraving: { [classEngravingName: string]: number };

  constructor(total: number) {
    // 변수 초기화
    this.total = total;
    this.classEngraving = {};
    for (let classEngraving in classEngravingMap) {
      this.classEngraving[classEngraving] = 0;
    }
  }

  addClassEngravingCount(classEngraving: string) {
    if (this.classEngraving.hasOwnProperty(classEngraving))
      this.classEngraving[classEngraving]++;
  }

  sort() {
    this.classEngraving = Object.entries(this.classEngraving)
      .sort(([, a], [, b]) => b - a)
      .reduce((r, [k, v]) => {
        r[k] = v;
        return r;
      }, {});
  }
}
