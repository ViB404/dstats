import type { Adapter } from "./adapters/Adapter";

export interface StatsOptions {
  apiKey: string;
  adapter: Adapter;
}

export class Stats {
  public constructor(private readonly options: StatsOptions) {
    this.registerEvents();
  }

  private registerEvents() {
    this.options.adapter.onReady(() => {
      console.log("Bot ready gg");
    });
  }
}
