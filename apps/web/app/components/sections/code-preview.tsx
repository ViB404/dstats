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
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3 shadow-[0_0_80px_-20px_rgba(127,126,255,0.15)]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/40" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/40" />
            <div className="h-3 w-3 rounded-full bg-[#7F7EFF]/40" />

            <span className="ml-4 font-mono text-sm text-neutral-400">
              index.ts
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="text-neutral-400 transition-colors hover:text-white"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>

        <pre className="overflow-x-auto p-8">
          <code className="font-mono text-sm leading-relaxed text-neutral-200">
            <CodeBlock code={code} lang="typescript" theme="github-dark" disableBg={true} addLineNumbers={true} />
          </code>
        </pre>

        <div className="border-t border-white/10 bg-[#121212] p-6 text-sm italic text-neutral-400">
          {
            "That's it. DStats automatically tracks guild joins, guild leaves, and bot activity - no additional code required."
          }
        </div>
      </div>
    </section>
  );
}
