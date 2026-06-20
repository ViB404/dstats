import { BotInfo, GuildInfo, GuildLeft } from "../types/index";

export interface Adapter {
  onReady(callback: (botInfo: BotInfo) => void): void;
  onGuildJoin(callback: (guildInfo: GuildInfo) => void): void;
  onGuildLeave(callback: (guildLeft: GuildLeft) => void): void;
}
