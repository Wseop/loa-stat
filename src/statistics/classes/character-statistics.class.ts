import { classEngravingMap, servers } from 'src/lostark/resources/const';

export class CharacterStatistics {
  protected total: number;
  protected server: { [key: string]: number };
  protected classEngraving: { [key: string]: number };

  constructor(total: number) {
    this.total = total;

    // server 초기화
    this.server = {};
    servers.forEach((server) => {
      this.server[server] = 0;
    });

    // classEngraving 초기화
    this.classEngraving = {};
    for (let classEngraving in classEngravingMap) {
      this.classEngraving[classEngraving] = 0;
    }
  }

  addServerCount(server: string) {
    this.server[server]++;
  }

  addClassEngravingCount(classEngraving: string) {
    this.classEngraving[classEngraving]++;
  }
}
