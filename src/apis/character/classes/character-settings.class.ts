import { EngravingCodeMap } from 'src/commons/consts/lostark.const';
import { Engraving } from '../schemas/character.schema';

export class CharacterSettings {
  protected total: number;
  protected stat: { [key: string]: number };
  protected set: { [key: string]: number };
  protected elixir: { [key: string]: number };
  protected engraving: { [key: string]: number };

  constructor(total: number) {
    this.total = total;
    this.stat = {};
    this.set = {};
    this.elixir = {};
    this.engraving = {};
  }

  addStatCount(stat: string) {
    if (!this.stat[stat]) this.stat[stat] = 0;
    this.stat[stat]++;
  }

  addSetCount(set: string) {
    if (!this.set[set]) this.set[set] = 0;
    this.set[set]++;
  }

  addElixirCount(elixir: string) {
    if (!this.elixir[elixir]) this.elixir[elixir] = 0;
    this.elixir[elixir]++;
  }

  setEngraving(engravings: Engraving[]) {
    // 각인 레벨별로 분류
    const engravingLevel1: Engraving[] = [];
    const engravingLevel2: Engraving[] = [];
    const engravingLevel3: Engraving[] = [];
    engravings.forEach((engraving) => {
      if (engraving.level === 1) engravingLevel1.push(engraving);
      else if (engraving.level === 2) engravingLevel2.push(engraving);
      else if (engraving.level === 3) engravingLevel3.push(engraving);
    });

    // 각인코드로 정렬
    engravingLevel1.sort(
      (a, b) => EngravingCodeMap[a.name] - EngravingCodeMap[b.name],
    );
    engravingLevel2.sort(
      (a, b) => EngravingCodeMap[a.name] - EngravingCodeMap[b.name],
    );
    engravingLevel3.sort(
      (a, b) => EngravingCodeMap[a.name] - EngravingCodeMap[b.name],
    );

    // key 생성
    let engravingKey = '';
    let levelKey = '';
    engravingLevel3.forEach((engraving) => {
      engravingKey += engraving.name[0];
      levelKey += '3';
    });
    engravingLevel2.forEach((engraving) => {
      engravingKey += engraving.name[0];
      levelKey += '2';
    });
    engravingLevel1.forEach((engraving) => {
      engravingKey += engraving.name[0];
      levelKey += '1';
    });

    // 추가
    const key = `${engravingKey}[${levelKey}]`;
    if (!this.engraving[key]) this.engraving[key] = 0;
    this.engraving[key]++;
  }

  sort() {
    this.stat = Object.entries(this.stat)
      .sort(([, a], [, b]) => b - a)
      .reduce((r, [k, v]) => {
        r[k] = v;
        return r;
      }, {});
    this.set = Object.entries(this.set)
      .sort(([, a], [, b]) => b - a)
      .reduce((r, [k, v]) => {
        r[k] = v;
        return r;
      }, {});
    this.elixir = Object.entries(this.elixir)
      .sort(([, a], [, b]) => b - a)
      .reduce((r, [k, v]) => {
        r[k] = v;
        return r;
      }, {});
    this.engraving = Object.entries(this.engraving)
      .sort(([, a], [, b]) => b - a)
      .reduce((r, [k, v]) => {
        r[k] = v;
        return r;
      }, {});
  }
}
