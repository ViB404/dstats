import { Client, GatewayIntentBits } from "discord.js";
import { Stats } from "@dstats/sdk";
import { DiscordJSAdapter } from "@dstats/discord.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

new Stats({
	apiKey: process.env.DSTATS_API!,
	adapter: new DiscordJSAdapter(client),
});

client.login(process.env.DISCORD_BOT_TOKEN);
