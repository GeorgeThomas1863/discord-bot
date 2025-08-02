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
    const response = await openai.chat.completions.create(openAIParams);
    return response;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to get response from OpenAI");
  }
};
