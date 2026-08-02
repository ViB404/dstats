"use client";

import { Stats } from "@/types/stats";
import DailyJoinsChart from "../charts/daily_join_chart";
import DailyLeavesChart from "../charts/daily_leaves_chart";
import GuildGrowthChart from "../charts/guild_growth_chart";
import NetGrowthChart from "../charts/net_growth_chart";

type ChartsContainerProps = {
	stats?: Stats;
};

export default function ChartsContainer({ stats }: ChartsContainerProps) {
	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<div className="lg:col-span-2">
				<GuildGrowthChart data={stats?.guild_growth ?? []} />
			</div>

			<DailyJoinsChart data={stats?.daily_joins ?? []} />

			<DailyLeavesChart data={stats?.daily_leaves ?? []} />

			<div className="lg:col-span-2">
				<NetGrowthChart data={stats?.net_growth ?? []} />
			</div>
		</div>
	);
}
