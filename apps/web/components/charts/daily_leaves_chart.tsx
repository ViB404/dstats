"use client";

import { TimeSeriesPoint } from "@/types/stats";
import ChartCard from "./chart_card";
import BaseBarChart from "./base_bar";

type DailyLeavesChartProps = {
	data: TimeSeriesPoint[];
};

export default function DailyLeavesChart({ data }: DailyLeavesChartProps) {
	return (
		<ChartCard title="Daily Leaves" description="Guilds removed each day">
			<BaseBarChart data={data} xKey="date" yKey="value" color="#ef4444" />
		</ChartCard>
	);
}
