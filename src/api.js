import { OpenAI } from "openai";
import bot from "../config/bot.js";

const openai = new OpenAI({
  apiKey: bot.OPENAI_KEY,
});

export const getChatResponse = async (conversation) => {
  const openAIParams = {
    model: "gpt-4",
    messages: conversation,
  };

  try {
    const res = await openai.chat.completions.create(openAIParams);
    return res;
  } catch (e) {
    console.error("OpenAI API Error:", e);
    throw new Error("Failed to get response from OpenAI");
  }
};

//returns array
export const defineSystemPrompt = async () => {
  const systemPrompt = [
    {
      role: "system",
      content: "Please provide a response to the following message or messages. Please review all of the content provided and respond with a detailed reply.",
    },
  ];

  return systemPrompt;
};
