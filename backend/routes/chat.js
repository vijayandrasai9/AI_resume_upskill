const express = require("express");
const router = express.Router();

// Dynamically import Gemini client from ES module
let genAI;

(async () => {
  const imported = await import("../geminiClient.mjs");
  genAI = imported.default;
})();

router.post("/chat", async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "messages must be an array" });
  }

  const userMessage = messages.filter(m => m.role === "user").pop()?.content || "";

  try {
    if (!genAI) {
      return res.status(503).json({ error: "Gemini SDK not initialized yet" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Use gemini-pro for compatibility
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const replyText = response.text().trim();

    if (!replyText) {
      return res.status(500).json({ error: "Gemini returned no reply" });
    }

    return res.json({
      reply: {
        role: "assistant",
        content: replyText
      }
    });
  } catch (err) {
    console.error("Gemini SDK error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;