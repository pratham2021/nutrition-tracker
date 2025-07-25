import { https } from "firebase-functions";
import { apps, initializeApp } from "firebase-admin";
import OpenAI from "openai";

if (apps.length === 0) {
    initializeApp();   
}

export const chatCompletion = https.onCall(async (data, content) => {
    try {
      const { prompt } = data;
      const OPEN_AI_API_KEY = import.meta.env.VITE_OPEN_AI_API_KEY;
      const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY });
      const aiModel = "gpt-3.5-turbo";

      const messages = [
        {
          role: "system",
          content: "you are an assistant who helps users make healthier choices."
        },
        {
          role: "user",
          content:prompt
        },
      ]

      const completion = await openai.chat.completions.create({
          model: aiModel,
          messages: messages
      })

      const aiResponse = completion.choices[0].messages.content;

      return {
        aiResponse
      };
    } catch (error) {
      
    }
});