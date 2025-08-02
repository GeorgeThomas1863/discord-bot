//TODO:

//KEEP GOIING THROUGH THE FILE AND REDEFINING THINGS
//FIGURE OUT OPENAI API ACCOUNT

import { Client } from "discord.js";
import { DISCORD_TOKEN } from "./config/bot.js";
import { handleMessage } from "./src/discord-msg.js";

const client = new Client({
  intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"],
});

client.on("ready", () => {
  console.log(`${client.user.tag} is now online!`);
});

client.on("messageCreate", (message) => handleMessage(message, client));

client.login(DISCORD_TOKEN);
