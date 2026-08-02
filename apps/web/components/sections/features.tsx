import { Sparkles, Key, Terminal } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Features() {
	return (
		<section className="mx-auto max-w-7xl px-4 py-24 md:px-8 lg:px-12">
			<div className="grid gap-6 md:grid-cols-3 lg:gap-8">
				<Card className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/3 p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/5">
					<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 transition-transform duration-300 group-hover:scale-110">
						<Sparkles aria-hidden="true" className="h-6 w-6 text-primary" />
					</div>

					<h3 className="mb-4 font-heading text-xl font-semibold text-white">Automatic Event Tracking</h3>

					<p className="flex-1 leading-relaxed text-neutral-400">
						Guild joins and guild leaves are detected automatically through the adapter. Zero configuration
						hooks required.
					</p>
				</Card>

				<Card className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/3 p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/5">
					<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-tertiary/20 bg-tertiary/10 transition-transform duration-300 group-hover:scale-110">
						<Key aria-hidden="true" className="h-6 w-6 text-tertiary" />
					</div>

					<h3 className="mb-4 font-heading text-xl font-semibold text-white">API Keys</h3>

					<p className="flex-1 leading-relaxed text-neutral-400">
						Generate an API key from your dashboard and begin tracking Discord bots instantly with a unified
						analytics pipeline.
					</p>
				</Card>

				<Card className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/3 p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/5">
					<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-secondary/20 bg-secondary/10 transition-transform duration-300 group-hover:scale-110">
						<Terminal aria-hidden="true" className="h-6 w-6 text-primary" />
					</div>

					<h3 className="mb-4 font-heading text-xl font-semibold text-white">Developer First</h3>

					<p className="flex-1 leading-relaxed text-neutral-400">
						Minimal setup, a clean SDK, REST API support, excellent documentation, and future-ready webhook
						integrations.
					</p>
				</Card>
			</div>
		</section>
	);
}
