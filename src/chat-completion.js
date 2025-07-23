const functions = require("firebase-functions");
const cors = require("cors"({ origin: true }));
const OpenAI = require("openai");

const OPEN_AI_API_KEY = functions.config().openai.key;

const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY });

exports.chatCompletion = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Missing prompt" });
      }

      const messages = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
      });

      const aiResponse = completion.choices[0].message.content;

      return res.status(200).json({ aiResponse });
    } catch (err) {
      console.error("OpenAI error:", err.message);
      return res.status(500).json({ error: "Failed to generate response." });
    }
  });
});