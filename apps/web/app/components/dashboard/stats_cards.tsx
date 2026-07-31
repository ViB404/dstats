"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Stats } from "@/types/dashboard";
import { Card } from "@/components/ui/card";

const itemVariants: Variants = {
	hidden: { opacity: 0, scale: 0.95, y: 15 },
	show: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: { type: "spring", stiffness: 300, damping: 24 },
	},
};

type StatsCardsProps = {
	stats?: Stats;
};

export default function StatsCards({ stats }: StatsCardsProps) {
	return (
		<motion.div variants={itemVariants} className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
			<Card className="bg-[#121212]/80 border border-white/10 p-6 rounded-2xl flex flex-col justify-center">
				<p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Active Guilds</p>
				<h3 className="text-4xl font-bold text-emerald-400 flex items-center gap-2">
					{stats?.active_guilds !== undefined ? stats.active_guilds.toLocaleString() : "-"}
					<TrendingUp className="w-6 h-6 opacity-80" />
				</h3>
			</Card>

			<Card className="bg-[#121212]/80 border border-white/10 p-6 rounded-2xl flex flex-col justify-center">
				<p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Guilds Kicked</p>
				<h3 className="text-4xl font-bold text-red-400 flex items-center gap-2">
					{stats?.guilds_left !== undefined ? stats.guilds_left.toLocaleString() : "-"}
					<TrendingDown className="w-6 h-6 opacity-80" />
				</h3>
			</Card>

			<Card className="bg-[#121212]/80 border border-white/10 p-6 rounded-2xl flex flex-col justify-center">
				<p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Total Guilds</p>
				<h3 className="text-4xl font-bold text-white">
					{stats?.guilds_joined !== undefined ? stats.guilds_joined.toLocaleString() : "..."}
				</h3>
			</Card>
		</motion.div>
	);
}
