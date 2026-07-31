"use client";

import { Card } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Avatar } from "@/lib/avatar";
import { BotInfo } from "@/types/api";

const itemVariants: Variants = {
	hidden: { opacity: 0, scale: 0.95, y: 15 },
	show: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: { type: "spring", stiffness: 300, damping: 24 },
	},
};

type BotSummaryCardProps = {
	botData?: BotInfo;
};

export default function BotSummaryCard({ botData }: BotSummaryCardProps) {
	return (
		<motion.div variants={itemVariants} className="lg:col-span-4">
			<Card className="p-6 bg-[#7F7EFF]/5 border-[#7F7EFF]/20 rounded-2xl h-full flex flex-col justify-center relative overflow-hidden">
				<div className="absolute top-0 right-0 p-4 opacity-10">
					<ShieldAlert className="w-24 h-24 text-[#7F7EFF]" />
				</div>
				<div className="flex items-center gap-4 relative z-10">
					<Avatar
						src={botData?.bot_avatar}
						alt={botData?.bot_name || "Bot Avatar"}
						width={64}
						height={64}
						className="w-16 h-16 rounded-xl object-cover"
					/>
					<div>
						<h4 className="text-xl font-bold text-white">
							{botData?.bot_name || <div className="h-6 w-36 rounded bg-white/10 animate-pulse" />}
						</h4>
						<span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
							TRACKING
						</span>
					</div>
				</div>
				<div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2 relative z-10 text-xs">
					<div className="flex justify-between items-center">
						<span className="text-neutral-500">Bot ID:</span>
						<span className="text-neutral-300 font-mono">{botData?.bot_id || "..."}</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-neutral-500">Created:</span>
						<span className="text-neutral-300">
							{botData?.created_at ? new Date(botData.created_at).toLocaleDateString() : "..."}
						</span>
					</div>
				</div>
			</Card>
		</motion.div>
	);
}
