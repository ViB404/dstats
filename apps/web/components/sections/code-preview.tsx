"use client";

import CodeBlock from "@/app/utils/code-block";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

const code = `import { Client, GatewayIntentBits } from "discord.js";
import { Stats } from "@dstats/sdk";
import { DiscordJSAdapter } from "@dstats/discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

new Stats({
  apiKey: process.env.DSTATS_API_KEY!,
  adapter: new DiscordJSAdapter(client),
});

client.login(process.env.DISCORD_BOT_TOKEN);`;

export default function CodePreview() {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);

		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	return (
		<section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-12">
			<div className="relative overflow-hidden rounded-2xl border border-(--color-primary)/20 bg-card shadow-[0_20px_50px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.1)_inset,0_10px_20px_rgba(110,140,251,0.08)]">
				<div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4 backdrop-blur-md">
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-full bg-destructive/60" />
						<div className="h-3 w-3 rounded-full bg-amber-500/60" />
						<div className="h-3 w-3 rounded-full bg-primary/60" />

						<span className="ml-4 font-label text-sm text-muted-foreground">index.ts</span>
					</div>

					<button
						type="button"
						onClick={handleCopy}
						className="text-muted-foreground transition-colors hover:text-foreground"
						aria-label="Copy code"
					>
						{copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
					</button>
				</div>

				<pre className="overflow-x-auto bg-card p-8">
					<code className="font-label text-sm leading-relaxed text-card-foreground">
						<CodeBlock
							code={code}
							lang="typescript"
							theme="github-dark"
							disableBg={true}
							addLineNumbers={true}
						/>
					</code>
				</pre>

				<div className="border-t border-border bg-sidebar/80 p-6 font-sans text-sm italic text-muted-foreground">
					{
						"That's it. DStats automatically tracks guild joins, guild leaves, and bot activity - no additional code required."
					}
				</div>
			</div>
		</section>
	);
}
