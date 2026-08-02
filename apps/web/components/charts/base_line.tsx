"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type BaseLineChartProps<T> = {
	data: T[];
	xKey: keyof T;
	yKey: keyof T;
	color?: string;
};

export default function BaseLineChart<T extends object>({
	data,
	xKey,
	yKey,
	color = "#10b981",
}: BaseLineChartProps<T>) {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<AreaChart data={data}>
				<defs>
					<linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor={color} stopOpacity={0.35} />
						<stop offset="100%" stopColor={color} stopOpacity={0} />
					</linearGradient>
				</defs>

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

				<Area type="monotone" dataKey={yKey as string} stroke={color} strokeWidth={3} fill="url(#gradient)" />
			</AreaChart>
		</ResponsiveContainer>
	);
}
