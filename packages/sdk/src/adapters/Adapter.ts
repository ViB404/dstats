import { CommandUsePayload } from "../types/CommandInfo";
import { BotInfo, GuildJoinPayload, GuildLeavePayload } from "../types/index";

export interface Adapter {
	onReady(callback: (botInfo: BotInfo) => void): void;
	onGuildJoin(callback: (guildInfo: GuildJoinPayload) => void): void;
	onGuildLeave(callback: (guildLeft: GuildLeavePayload) => void): void;
	onCommandUse(callback: (commandInfo: CommandUsePayload) => void): void;
}
