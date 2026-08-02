"use client";

import { TimeSeriesPoint } from "@/types/stats";
import ChartCard from "./chart_card";
import BaseBarChart from "./base_bar";

type DailyJoinsChartProps = {
	data: TimeSeriesPoint[];
};

export default function DailyJoinsChart({ data }: DailyJoinsChartProps) {
	return (
		<ChartCard title="Daily Joins" description="Guilds added each day">
			<BaseBarChart data={data} xKey="date" yKey="value" color="#22c55e" />
		</ChartCard>
	);
}
