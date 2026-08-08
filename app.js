//keep testing

import 'dotenv/config';
import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import { handleMessage } from "./src/discord-msg.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  // DM channels never emit CHANNEL_CREATE, so DM messageCreate events are
  // dropped unless the channel can arrive as a partial
  partials: [Partials.Channel],
});

client.once(Events.ClientReady, () => {
  console.log(`${client.user.tag} is now online!`);
});

client.on(Events.MessageCreate, (message) => handleMessage(message, client));

client.login(process.env.DISCORD_TOKEN).catch((err) => {
  console.error("Failed to login:", err.message);
  process.exit(1);
});
