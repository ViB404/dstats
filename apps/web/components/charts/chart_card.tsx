"use client";

import { Card } from "@/components/ui/card";

type ChartCardProps = {
	title: string;
	description?: string;
	children: React.ReactNode;
};

export default function ChartCard({ title, description, children }: ChartCardProps) {
	return (
		<Card className="bg-card/80 border border-border rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.1)_inset,0_10px_20px_rgba(110,140,251,0.08)] backdrop-blur-xl">
			<div className="mb-6">
				<h2 className="text-lg font-heading font-semibold text-card-foreground">{title}</h2>

				{description && <p className="text-sm font-sans text-muted-foreground mt-1">{description}</p>}
			</div>

			<div className="h-80">{children}</div>
		</Card>
	);
}
