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
		)}&background=171A2E&color=6E8CFB&bold=true`;

	return (
		<motion.div variants={itemVariants} className="h-full">
			<Card className="relative flex flex-col justify-between h-full p-5 bg-card/60 hover:bg-card border-border hover:border-primary/40 transition-all duration-300 rounded-2xl group overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.35),0_1px_0_rgba(255,255,255,0.05)_inset] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.1)_inset,0_10px_25px_rgba(110,140,251,0.12)]">
				<div
					className={`absolute top-0 left-0 right-0 h-1 transition-opacity duration-300 opacity-60 group-hover:opacity-100 ${
						isLeave
							? "bg-linear-to-r from-destructive/80 to-destructive/20"
							: "bg-linear-to-r from-(--color-primary) to-(--color-secondary)"
					}`}
				/>

				<div className="space-y-4">
					<div className="flex justify-between items-start pt-1">
						<div className="relative">
							<Avatar
								src={iconSrc}
								alt={guild.name || "Guild Icon"}
								width={48}
								height={48}
								className="w-12 h-12 rounded-xl object-cover duration-300"
							/>
						</div>

						<span
							className={`text-[10px] flex items-center gap-1.5 uppercase font-label font-bold tracking-wider px-2.5 py-1 rounded-md border backdrop-blur-sm transition-colors ${
								isLeave
									? "bg-destructive/10 text-destructive border-destructive/20 group-hover:bg-destructive/20"
									: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500/20"
							}`}
						>
							{isLeave ? <LogOut className="w-3 h-3" /> : <LogIn className="w-3 h-3" />}
							{isLeave ? "Kicked" : "Joined"}
						</span>
					</div>

					<div>
						<h3 className="text-foreground font-heading font-semibold text-lg line-clamp-1 group-hover:text-(--color-primary) transition-colors">
							{guild.name || "Unknown Guild"}
						</h3>
					</div>
				</div>

				<div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-label">
					<div className="flex items-center gap-1.5 text-foreground/80 font-medium bg-muted/40 group-hover:bg-muted/80 px-2.5 py-1.5 rounded-lg border border-border/50 transition-colors">
						<Users className="w-3.5 h-3.5 text-muted-foreground" />
						<span>{(guild.last_member_count || 0).toLocaleString()}</span>
					</div>
					<div className="text-muted-foreground flex items-center gap-1.5 bg-background/60 px-2.5 py-1.5 rounded-lg border border-border/50">
						<CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
						<span>{activityDate.getTime() !== 0 ? activityDate.toLocaleDateString() : "Unknown"}</span>
					</div>
				</div>
			</Card>
		</motion.div>
	);
}
