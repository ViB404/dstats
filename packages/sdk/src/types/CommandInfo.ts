export interface CommandUsePayload {
	command_name: string;
	guild_id: string;
}

export interface CommandUsagePayload {
	guild_id: string;
	commands: Record<string, number>;
}
