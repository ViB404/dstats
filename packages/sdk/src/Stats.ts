import type { Adapter } from "./adapters/Adapter";
import { ApiClient } from "./client/api_client";
import { GuildJoinPayload, GuildLeavePayload } from "./types/index";

export interface StatsOptions {
  apiKey: string;
  adapter: Adapter;
  baseUrl?: string;
}

export class Stats {
  private readonly apiClient: ApiClient;
  public constructor(private readonly options: StatsOptions) {
    this.apiClient = new ApiClient(
      options.baseUrl ?? "http://localhost:7878",
      options.apiKey,
    );
    this.registerEvents();
  }

  private registerEvents() {
    this.options.adapter.onReady((botInfo) => {
      // TODO: Send bot info to the API
    });

    this.options.adapter.onGuildJoin((guildInfo) => {
      let payload: GuildJoinPayload = {
        discord_guild_id: guildInfo.discord_guild_id,
        name: guildInfo.name,
        icon: guildInfo.icon,
        member_count: guildInfo.member_count,
        owner_id: guildInfo.owner_id,
      };

      this.apiClient.guildJoin(payload).catch((e) => console.error(e));
    });

    this.options.adapter.onGuildLeave((guildLeft) => {
      let payload: GuildLeavePayload = {
        guild_id: guildLeft.guild_id,
      };
      this.apiClient.guildLeave(payload).catch((e) => console.error(e));
    });
  }
}
