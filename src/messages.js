import CHANNELS from "../config/channels.js";
import { getConversation } from "../services/conversationService.js";
import { getChatResponse } from "../services/openaiService.js";
import { sendResponse, startTyping, stopTyping } from "../utils/discordUtils.js";

const PREFIX = "!";

export const handleMessage = async (message, client) => {
  const { author, content, channelId, channel, mentions } = message;

  // Early returns for filtering
  if (author.bot) return;
  if (!content.startsWith(PREFIX)) return;
  if (!CHANNELS.includes(channelId) && !mentions.users.has(client.user.id)) return;

  const typingInterval = startTyping(channel);

  try {
    const conversation = await getConversation(channel, client, PREFIX);
    const response = await getChatResponse(conversation);
    await sendResponse(response, message);
  } catch (error) {
    console.error("Error handling message:", error);
    await message.reply("Sorry, I encountered an error processing your request.");
  } finally {
    stopTyping(typingInterval);
  }
};

export const getConversation = async (channel, client, prefix) => {
  const conversationArray = [
    {
      role: "system",
      content: "Please provide a response to the following message",
    },
  ];

  const prevMessages = await channel.messages.fetch({ limit: 10 });
  const messagesArray = Array.from(prevMessages.values()).reverse();

  messagesArray.forEach((msg) => {
    const { author, content } = msg;

    if (author.id === client.user.id || content.startsWith(prefix)) {
      const username = sanitizeUsername(author.username);
      const role = author.id === client.user.id ? "assistant" : "user";

      conversationArray.push({
        role,
        name: username,
        content,
      });
    }
  });

  return conversationArray;
};

export const sendResponse = async (response, message) => {
  const responseMessage = response.choices[0].message.content;

  for (let i = 0; i < responseMessage.length; i += CHUNK_SIZE_LIMIT) {
    const chunk = responseMessage.substring(i, i + CHUNK_SIZE_LIMIT);
    await message.reply(chunk);
  }
};

export const startTyping = (channel) => {
  channel.sendTyping();
  return setInterval(() => {
    channel.sendTyping();
  }, TYPING_INTERVAL);
};

export const stopTyping = (typingInterval) => {
  clearInterval(typingInterval);
};
