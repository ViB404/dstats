import type { Client } from "discord.js";
import type { Adapter, BotInfo, GuildInfo, GuildLeft } from "@dstats/sdk";

export class DiscordJSAdapter implements Adapter {
  public constructor(private readonly client: Client) {}

  public onReady(callback: (bot: BotInfo) => void): void {
    this.client.once("ready", () => {
      callback({
        id: this.client.user!.id,
        username: this.client.user!.username,
        avatarURL: this.client.user!.displayAvatarURL(),
        guildCount: this.client.guilds.cache.size,
      });
    });
  }

  public onGuildJoin(callback: (guild: GuildInfo) => void): void {
    this.client.on("guildCreate", (guild) => {
      callback({
        id: guild.id,
        name: guild.name,
        iconURL: guild.iconURL() ?? null,
        memberCount: this.client.guilds.cache.size,
        createdAt: guild.createdAt.toISOString(),
      });
    });
  }

  public onGuildLeave(callback: (guildLeft: GuildLeft) => void): void {
    this.client.on("guildDelete", (guild) => {
      callback({
        guildId: guild.id,
        leftAt: new Date().toISOString(),
      });
    });
  }
}
