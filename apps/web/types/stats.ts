export interface TimeSeriesPoint {
	date: string;
	value: number;
}

export interface NetGrowthPoint {
	date: string;
	joined: number;
	left: number;
	net: number;
}

export interface Overview {
	active_guilds: number;
	guilds_joined: number;
	guilds_left: number;
}

export interface Stats {
	overview: Overview;
	guild_growth: TimeSeriesPoint[];
	daily_joins: TimeSeriesPoint[];
	daily_leaves: TimeSeriesPoint[];
	net_growth: NetGrowthPoint[];
}
