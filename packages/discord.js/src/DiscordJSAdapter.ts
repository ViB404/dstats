import type { Client } from "discord.js";
import type {
  Adapter,
  BotInfo,
  GuildJoinPayload,
  GuildLeavePayload,
} from "@dstats/sdk";

export class DiscordJSAdapter implements Adapter {
  public constructor(private readonly client: Client) {}

  public onReady(callback: (bot: BotInfo) => void): void {
    this.client.once("clientReady", () => {
      callback({
        id: this.client.user!.id,
        username: this.client.user!.username,
        avatarURL: this.client.user!.displayAvatarURL(),
        guildCount: this.client.guilds.cache.size,
      });
    });
  }

  public onGuildJoin(callback: (guild: GuildJoinPayload) => void): void {
    this.client.on("guildCreate", (guild) => {
      callback({
        discord_guild_id: guild.id,
        name: guild.name,
        icon: guild.iconURL() ?? null,
        member_count: guild.memberCount,
        owner_id: guild.ownerId,
      });
    });
  }

  public onGuildLeave(callback: (guildLeft: GuildLeavePayload) => void): void {
    this.client.on("guildDelete", (guild) => {
      callback({
        guild_id: guild.id,
      });
    });
  }
}
