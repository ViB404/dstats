export interface BotInfo {
	id: string;
	username: string;
	avatarURL: string | null;
	// Actual guild count of the bot can differ.
	guildCount: number;
}
