export interface BotInfo {
	bot_id: string;
	bot_name: string;
	bot_avatar: string | null;
	owner_id: string | null;
	guild_count: number;
	created_at: string;
}

export interface GuildInfo {
	discord_guild_id: string;
	name: string;
	icon: string | null;
	owner_id: string | null;
	last_member_count: number | null;
	joined_at: string;
	left_at: string | null;
}
