export class SettingStatistics {
  protected total: number;
  protected stat: { [key: string]: number };
  protected set: { [key: string]: number };
  protected elixir: { [key: string]: number };
  protected engraving: { [key: string]: number }[];

  constructor(total: number) {
    this.total = total;
    this.stat = {};
    this.set = {};
    this.elixir = {};
    this.engraving = Array.from({ length: 3 }, () => {
      return {};
    });
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

  addEngravingCount(engraving: string, level: number) {
    if (!this.engraving[level - 1][engraving])
      this.engraving[level - 1][engraving] = 0;
    this.engraving[level - 1][engraving]++;
  }
}
