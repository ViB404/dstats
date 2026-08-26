import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";
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
	debug: true,
	baseUrl: "http://localhost:7878",
});

client.once("clientReady", async () => {
	console.log(`Logged in as ${client.user?.tag}`);

	const testCommand = new SlashCommandBuilder().setName("test").setDescription("Test DStats command tracking");

	const test2Command = new SlashCommandBuilder().setName("test_2").setDescription("Test_2 DStats command tracking");

	const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN!);

	await rest.put(Routes.applicationCommands(client.user!.id), {
		body: [testCommand.toJSON(), test2Command.toJSON()],
	});

	console.log("Registered /test and /test_2");
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === "test") {
		await interaction.reply("DStats test command received.");
	}
	if (interaction.commandName === "test_2") {
		await interaction.reply("DStats test command received.");
	}
});

client.login(process.env.DISCORD_BOT_TOKEN);
