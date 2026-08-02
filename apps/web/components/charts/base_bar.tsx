"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type BaseBarChartProps<T> = {
	data: T[];
	xKey: keyof T;
	yKey: keyof T;
	color?: string;
};

export default function BaseBarChart<T extends object>({ data, xKey, yKey, color = "#3b82f6" }: BaseBarChartProps<T>) {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<BarChart data={data}>
				<CartesianGrid stroke="#27272a" vertical={false} />

				<XAxis
					dataKey={xKey as string}
					tick={{ fill: "#a1a1aa", fontSize: 12 }}
					axisLine={false}
					tickLine={false}
				/>

				<YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />

				<Tooltip
					contentStyle={{
						background: "#18181b",
						border: "1px solid #27272a",
						borderRadius: 12,
					}}
				/>

				<Bar dataKey={yKey as string} fill={color} radius={[6, 6, 0, 0]} />
			</BarChart>
		</ResponsiveContainer>
	);
}
