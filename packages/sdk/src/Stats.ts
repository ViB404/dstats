export interface StatsOptions {
  apiKey: string;
}

export class Stats {
  constructor(private readonly options: StatsOptions) {}

  guildJoin() {
    console.log("Guild joined");
  }

  guildLeave() {
    console.log("Guild left");
  }
}
