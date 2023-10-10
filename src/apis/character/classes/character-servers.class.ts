import { Servers } from 'src/commons/consts/lostark.const';

export class CharacterServers {
  protected total: number;
  protected server: { [serverName: string]: number };

  constructor(total: number) {
    // 변수 초기화
    this.total = total;
    this.server = {};
    Servers.forEach((server) => {
      this.server[server] = 0;
    });
  }

  addServerCount(server: string) {
    if (this.server.hasOwnProperty(server)) this.server[server]++;
  }

  sort() {
    this.server = Object.entries(this.server)
      .sort(([, a], [, b]) => b - a)
      .reduce((r, [k, v]) => {
        r[k] = v;
        return r;
      }, {});
  }
}
