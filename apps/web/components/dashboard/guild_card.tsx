"use client";

import { Card } from "@/components/ui/card";
import { LogIn, LogOut, Users, CalendarDays } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Avatar } from "@/lib/avatar";
import { GuildInfo } from "@/types/api";

const itemVariants: Variants = {
	hidden: { opacity: 0, scale: 0.95, y: 15 },
	show: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: { type: "spring", stiffness: 300, damping: 24 },
	},
};

type GuildCardProps = {
	guild: GuildInfo;
};

export default function GuildCard({ guild }: GuildCardProps) {
	const isLeave = guild.left_at !== null && guild.left_at !== undefined;
	const activityDate = new Date((isLeave ? guild.left_at : guild.joined_at) || 0);

	const iconSrc =
		guild.icon ||
		`https://ui-avatars.com/api/?name=${encodeURIComponent(
			guild.name || "Unknown"
		)}&background=random&color=fff&bold=true`;

	return (
		<motion.div variants={itemVariants}>
			<Card className="p-5 bg-[#121212]/60 hover:bg-[#121212] border-white/5 hover:border-white/10 transition-all duration-300 rounded-2xl group flex flex-col gap-4 h-full relative overflow-hidden">
				<div className="flex justify-between items-start">
					<Avatar
						src={iconSrc}
						alt={guild.name || "Guild Icon"}
						width={48}
						height={48}
						className="w-12 h-12 rounded-xl object-cover"
					/>
					<div className="flex flex-col items-end gap-2">
						<span
							className={`text-[10px] flex items-center gap-1 uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border ${
								isLeave
									? "bg-red-500/10 text-red-400 border-red-500/20"
									: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
							}`}
						>
							{isLeave ? <LogOut className="w-3 h-3" /> : <LogIn className="w-3 h-3" />}
							{isLeave ? "Kicked" : "Joined"}
						</span>
					</div>
				</div>

				<div>
					<h3 className="text-white font-semibold text-lg line-clamp-1 group-hover:text-[#7F7EFF] transition-colors">
						{guild.name || "Unknown Guild"}
					</h3>
				</div>

				<div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs">
					<div className="flex items-center gap-1.5 text-neutral-300 font-medium bg-white/5 px-2 py-1 rounded-md border border-white/5">
						<Users className="w-3.5 h-3.5 text-neutral-400" />
						{(guild.last_member_count || 0).toLocaleString()}
					</div>
					<div className="text-neutral-500 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md border border-white/5">
						<CalendarDays className="w-3.5 h-3.5" />
						{activityDate.getTime() !== 0 ? activityDate.toLocaleDateString() : "Unknown"}
					</div>
				</div>
			</Card>
		</motion.div>
	);
}
