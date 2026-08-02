"use client";

import { Card } from "@/components/ui/card";

type ChartCardProps = {
	title: string;
	description?: string;
	children: React.ReactNode;
};

export default function ChartCard({ title, description, children }: ChartCardProps) {
	return (
		<Card className="bg-[#121212]/80 border border-white/10 rounded-2xl p-6">
			<div className="mb-6">
				<h2 className="text-lg font-semibold text-white">{title}</h2>

				{description && <p className="text-sm text-neutral-400 mt-1">{description}</p>}
			</div>

			<div className="h-80">{children}</div>
		</Card>
	);
}
