"use client";

import { motion, Variants } from "framer-motion";
import { TrendingDown, TrendingUp, Building2 } from "lucide-react";

import StatCard from "./stat_card";
import { Stats } from "@/types/stats";

const itemVariants: Variants = {
	hidden: {
		opacity: 0,
		scale: 0.95,
		y: 15,
	},
	show: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 24,
		},
	},
};

type StatsCardsProps = {
	stats?: Stats;
};

const cards = (stats?: Stats) => [
	{
		title: "Active Guilds",
		value: stats?.overview.active_guilds?.toLocaleString() ?? "-",
		icon: TrendingUp,
		iconColor: "text-emerald-400",
		valueColor: "text-emerald-400",
	},
	{
		title: "Guilds Left",
		value: stats?.overview.guilds_left?.toLocaleString() ?? "-",
		icon: TrendingDown,
		iconColor: "text-destructive",
		valueColor: "text-destructive",
	},
	{
		title: "Total Guilds",
		value: stats?.overview.guilds_joined?.toLocaleString() ?? "-",
		icon: Building2,
		iconColor: "text-[var(--color-primary)]",
		valueColor: "text-foreground",
	},
];

export default function OverviewStatsCards({ stats }: StatsCardsProps) {
	return (
		<motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{cards(stats).map(card => (
				<StatCard
					key={card.title}
					title={card.title}
					value={card.value}
					icon={card.icon}
					iconColor={card.iconColor}
					valueColor={card.valueColor}
				/>
			))}
		</motion.div>
	);
}
