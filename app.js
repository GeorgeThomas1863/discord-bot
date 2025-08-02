import { Client } from "discord.js";
import bot from "./config/bot.js";
import { handleMessage } from "./handlers/messageHandler.js";

const client = new Client({
  intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"],
});

client.on("ready", () => {
  console.log(`${client.user.tag} is now online!`);
});

client.on("messageCreate", (message) => handleMessage(message, client));

client.login(bot.TOKEN);
