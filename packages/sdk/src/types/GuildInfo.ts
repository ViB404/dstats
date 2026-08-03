export interface GuildJoinPayload {
	discord_guild_id: string;
	name: string;
	icon: string | null;
	member_count: number;
}

export interface GuildLeavePayload {
	guild_id: string;
}
