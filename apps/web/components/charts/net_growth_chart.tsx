"use client";

import { NetGrowthPoint } from "@/types/stats";
import ChartCard from "./chart_card";
import BaseLineChart from "./base_line";

type NetGrowthChartProps = {
	data: NetGrowthPoint[];
};

export default function NetGrowthChart({ data }: NetGrowthChartProps) {
	return (
		<ChartCard title="Net Growth" description="Daily guild growth after leaves">
			<BaseLineChart data={data} xKey="date" yKey="net" color="#8b5cf6" />
		</ChartCard>
	);
}
