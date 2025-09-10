import { OpenAI } from "openai";
import { OPENAI_KEY } from "../config/bot.js";

const openai = new OpenAI({
  apiKey: OPENAI_KEY,
});

//returns message string
export const sendToOpenAI = async (inputArray) => {
  const params = {
    model: "gpt-4",
    messages: inputArray,
  };

  try {
    const res = await openai.chat.completions.create(params);
    const aiMessage = res.choices[0].message.content;
    // console.log("AI MESSAGE");
    // console.log(aiMessage);

    return aiMessage;
  } catch (e) {
    console.error("OpenAI API Error:", e.message);
    if (e.status === 429) return "SAM ALTMAN WANT HIS MONEY (George didn't pay his API bill)";
    throw new Error("Failed to get response from OpenAI");
  }
};

//returns array
export const defineSystemPrompt = async () => {
  const systemPrompt = [
    // {
    //   role: "system",
    //   content: "Please provide a response to the following message or messages. Please review all of the content provided and respond with a detailed and CONCISE reply.",
    // },

    {
      role: "system",
      content:
        "You are a helpful, friendly, and clever assistant. You are in a heated argument with the user. The user is on Team B, you are on Team A. Please argue from Team A's point of view. Be sure to respond to whatever the user is claiming or arguing, be passionate and convincing, but be very concise and to the point.",
    },
  ];

  return systemPrompt;
};
