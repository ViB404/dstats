"use client";

import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type StatCardProps = {
	title: string;
	value: string | number;
	icon?: LucideIcon;
	iconColor?: string;
	valueColor?: string;
};

export default function StatCard({
	title,
	value,
	icon: Icon,
	iconColor = "text-foreground",
	valueColor = "text-foreground",
}: StatCardProps) {
	return (
		<Card
			className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-border
                bg-card/80
                p-6
                shadow-[0_20px_50px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.1)_inset,0_10px_20px_rgba(110,140,251,0.08)]
                backdrop-blur-xl
                transition-all
                duration-300
                hover:border-primary/40
                hover:bg-card
            "
		>
			<div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent pointer-events-none" />

			<div className="relative flex h-full flex-col justify-between">
				<div className="flex items-center justify-between">
					<p className="font-label text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
						{title}
					</p>

					{Icon && (
						<div className="rounded-xl border border-border bg-muted/50 p-2.5 transition-colors group-hover:bg-muted">
							<Icon className={`h-5 w-5 ${iconColor}`} />
						</div>
					)}
				</div>

				<div className="mt-6">
					<h2 className={`font-heading text-4xl font-bold tracking-tight ${valueColor}`}>{value}</h2>
				</div>
			</div>
		</Card>
	);
}
