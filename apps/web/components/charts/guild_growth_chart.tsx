"use client";

import { TimeSeriesPoint } from "@/types/stats";
import ChartCard from "./chart_card";
import BaseLineChart from "./base_line";

type GuildGrowthChartProps = {
	data: TimeSeriesPoint[];
};

export default function GuildGrowthChart({ data }: GuildGrowthChartProps) {
	return (
		<ChartCard title="Guild Growth" description="Active guilds over the last 30 days">
			<BaseLineChart data={data} xKey="date" yKey="value" color="#10b981" />
		</ChartCard>
	);
}
