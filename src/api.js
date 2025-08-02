import { OpenAI } from "openai";
import { OPENAI_KEY } from "../config/bot.js";

const openai = new OpenAI({
  apiKey: OPENAI_KEY,
});

export const sendToOpenAI = async (inputArray) => {
  const params = {
    model: "gpt-4",
    messages: inputArray,
  };

  try {
    const res = await openai.chat.completions.create(params);
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
