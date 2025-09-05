import { Client, GatewayIntentBits, Partials } from "discord.js";
import "dotenv/config";
import config from "./config.ts";
import { setupGuildMemberAdd } from "./func/welcome.ts";
import { createRulesEmbed } from "./func/rules.ts";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.GuildMember],
});

setupGuildMemberAdd(client);

client.on("messageCreate", async (msg) => {
  if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

  const command = msg.content.slice(config.prefix.length).trim().toLowerCase();

  try {
    if (command === "ping") {
      await msg.channel.send("🏓 Pong!");
    } else if (command === "rules") {
      // Pass the bot's avatar URL for the thumbnail
      const embed = createRulesEmbed(client.user?.displayAvatarURL() || "");
      await msg.channel.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error(`Error processing command "${command}":`, error);
  }
});

client.once("ready", () => {
  console.log(`Bot is online! Logged in as ${client.user?.tag}`);
});

client.login(config.botToken);
