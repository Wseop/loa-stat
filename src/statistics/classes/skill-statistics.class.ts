import { Skill } from 'src/character/schemas/character.schema';

export type SkillCount = {
  count: number;
  level: { [key: string]: number };
  tripod: { [key: string]: number };
  rune: { [key: string]: number };
  myul: number;
  hong: number;
};

export class SkillStatistics {
  protected total: number;
  protected skill: { [key: string]: SkillCount };

  constructor(total: number) {
    this.total = total;
    this.skill = {};
  }

  addSkillCount(skill: Skill) {
    let skillCount = this.skill[skill.name];

    if (!skillCount) {
      this.skill[skill.name] = {
        count: 0,
        level: {},
        tripod: {},
        rune: {},
        myul: 0,
        hong: 0,
      };
      skillCount = this.skill[skill.name];
    }

    skillCount.count++;

    // level
    if (!skillCount.level[skill.level]) skillCount.level[skill.level] = 0;
    skillCount.level[skill.level]++;

    // tripod
    skill.tripods.forEach((tripod) => {
      if (!skillCount.tripod[tripod]) skillCount.tripod[tripod] = 0;
      skillCount.tripod[tripod]++;
    });

    // rune
    if (skill.rune) {
      const key = `${skill.rune.name}(${skill.rune.grade})`;

      if (!skillCount.rune[key]) skillCount.rune[key] = 0;
      skillCount.rune[key]++;
    }

    // gem
    skill.gems.forEach((value) => {
      if (value === '멸화') skillCount.myul++;
      else if (value === '홍염') skillCount.hong++;
    });
  }
}
