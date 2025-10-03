import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chat = async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ message: "Invalid message" });

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
    });

    const reply = response.choices?.[0]?.message?.content || "No response";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
