// import CHANNELS from "../config/channels.js";
import CONFIG from "../config/config.js";
import { getChatResponse, defineSystemPrompt } from "./api.js";
import { startTyping, stopTyping } from "./util.js";

export const handleMessage = async (inputParams, client) => {
  const { author, content, channelId, channel, mentions } = inputParams;
  const { CHANNELS, PREFIX } = CONFIG;

  // Early returns for filtering
  if (author.bot) return;
  if (!content.startsWith(PREFIX)) return;
  if (!CHANNELS.includes(channelId) && !mentions.users.has(client.user.id)) return;

  const typingInterval = startTyping(channel);

  try {
    const convoArray = await buildConvoArray(channel, client);
    const chatResponse = await getChatResponse(convoArray);
    await sendMessage(chatResponse, inputParams);
  } catch (error) {
    console.error("Error handling message:", error);
    await message.reply("Sorry, I encountered an error processing your request.");
  } finally {
    stopTyping(typingInterval);
  }
};

export const buildConvoArray = async (channel, client) => {
  const { PREFIX } = CONFIG;

  //set system prompt as first msg in array
  const convoArray = await defineSystemPrompt();

  const prevMessages = await channel.messages.fetch({ limit: 10 });
  const messagesArray = Array.from(prevMessages.values()).reverse();

  for (let i = 0; i < messagesArray.length; i++) {
    const messageObj = messagesArray[i];
    const { author, content } = messageObj;

    if (author.id !== client.user.id && !content.startsWith(PREFIX)) continue;

    const username = sanitizeUsername(author.username);
    const role = author.id === client.user.id ? "assistant" : "user";
    const convoObj = {
      role: role,
      name: username,
      content: content,
    };

    convoArray.push(convoObj);
  }

  return convoArray;
};

export const sendMessage = async (response, message) => {
  const responseMessage = response.choices[0].message.content;

  for (let i = 0; i < responseMessage.length; i += CHUNK_SIZE_LIMIT) {
    const chunk = responseMessage.substring(i, i + CHUNK_SIZE_LIMIT);
    await message.reply(chunk);
  }
};
