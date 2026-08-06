"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

type BaseBarChartProps<T> = {
	data: T[];
	xKey: keyof T;
	yKey: keyof T;
	color?: string;
	seriesName?: string;
};

export default function BaseBarChart<T extends object>({
	data,
	xKey,
	yKey,
	color = "var(--color-primary)",
	seriesName = "Activity",
}: BaseBarChartProps<T>) {
	const chartData = useMemo(() => {
		return data.map(item => {
			const rawVal = item[xKey];
			const date = new Date(String(rawVal));
			const isValid = !isNaN(date.getTime());

			return {
				...item,
				xLabel: isValid ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : String(rawVal),
				xFullDate: isValid
					? date.toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})
					: String(rawVal),
			};
		});
	}, [data, xKey]);

	return (
		<ResponsiveContainer width="100%" height="100%">
			<BarChart data={chartData}>
				<CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} opacity={0.5} />

				<XAxis
					dataKey="xLabel"
					interval="preserveStartEnd"
					tick={{ fill: "oklch(0.72 0.06 262)", fontSize: 12 }}
					axisLine={false}
					tickLine={false}
				/>

				<YAxis tick={{ fill: "oklch(0.72 0.06 262)", fontSize: 12 }} axisLine={false} tickLine={false} />

				<Tooltip
					contentStyle={{
						backgroundColor: "oklch(0.23 0.05 268)",
						borderColor: "oklch(0.32 0.06 268 / 60%)",
						borderRadius: "12px",
						color: "oklch(0.96 0.01 262)",
						fontFamily: "var(--font-poppins)",
						boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
					}}
					labelStyle={{
						fontWeight: 600,
						marginBottom: "4px",
						color: "oklch(0.96 0.01 262)",
					}}
					labelFormatter={(_, payload) => payload?.[0]?.payload?.xFullDate ?? ""}
					formatter={(value: ValueType | undefined, name: NameType | undefined) => [
						`${(Number(value) || 0).toLocaleString()} Total`,
						String(name ?? seriesName),
					]}
				/>

				<Bar dataKey={yKey as string} name={seriesName} fill={color} radius={[6, 6, 0, 0]} />
			</BarChart>
		</ResponsiveContainer>
	);
}
