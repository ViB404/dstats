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
	iconColor = "text-white",
	valueColor = "text-white",
}: StatCardProps) {
	return (
		<Card
			className="
				group
				relative
				overflow-hidden
				rounded-2xl
				border
				border-white/10
				bg-[#121212]/80
				p-6
				transition-all
				duration-300
				hover:border-white/20
				hover:bg-[#181818]
			"
		>
			<div className="absolute inset-0 bg-linear-to-br from-white/[0.02] to-transparent pointer-events-none" />

			<div className="relative flex h-full flex-col justify-between">
				<div className="flex items-center justify-between">
					<p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">{title}</p>

					{Icon && (
						<div className="rounded-xl border border-white/10 bg-white/5 p-2">
							<Icon className={`h-5 w-5 ${iconColor}`} />
						</div>
					)}
				</div>

				<div className="mt-6">
					<h2 className={`text-4xl font-bold tracking-tight ${valueColor}`}>{value}</h2>
				</div>
			</div>
		</Card>
	);
}
