import { Events, type Client } from "discord.js";
import type { Adapter, BotInfo, CommandUsePayload, GuildJoinPayload, GuildLeavePayload } from "@dstats/sdk";

export class DiscordJSAdapter implements Adapter {
	public constructor(private readonly client: Client) {}

	public onReady(callback: (bot: BotInfo) => void): void {
		this.client.once(Events.ClientReady, () => {
			callback({
				id: this.client.user!.id,
				username: this.client.user!.username,
				avatarURL: this.client.user!.displayAvatarURL(),
				guildCount: this.client.guilds.cache.size,
			});
		});
	}

	public onGuildJoin(callback: (guild: GuildJoinPayload) => void): void {
		this.client.on(Events.GuildCreate, guild => {
			callback({
				discord_guild_id: guild.id,
				name: guild.name,
				icon: guild.iconURL() ?? null,
				member_count: guild.memberCount,
			});
		});
	}

	public onGuildLeave(callback: (guildLeft: GuildLeavePayload) => void): void {
		this.client.on(Events.GuildDelete, guild => {
			callback({
				guild_id: guild.id,
			});
		});
	}

	public onCommandUse(callback: (commandUse: CommandUsePayload) => void): void {
		this.client.on(Events.InteractionCreate, interaction => {
			if (!interaction.isChatInputCommand()) return;
			if (!interaction.guildId) return;

			callback({
				command_name: interaction.commandName,
				guild_id: interaction.guildId,
			});
		});
	}
}
