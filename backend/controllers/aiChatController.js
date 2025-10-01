const fetch = global.fetch || require("node-fetch");

exports.chat = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const {
      message,
      appliedRole,
      presentSkills = [],
      missingSkills = [],
      presentProjects = [],
      history = [],
    } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Invalid message" });
    }

    const systemPreamble = `
You are an expert AI project coach and coding assistant.
- Always answer the user's question directly and contextually.
- Provide clear, structured, and actionable advice.
- Suggest concrete next steps, code tips, and learning paths.
- If asked for projects, propose realistic TODOs with required skills + resources.
`.trim();

    const context = `
Applied role: ${appliedRole || "(none)"}
Present skills: ${presentSkills.join(", ") || "(none)"}
Missing skills: ${missingSkills.join(", ") || "(none)"}
Present projects: ${presentProjects.slice(0, 10).join(" | ") || "(none)"}
`.trim();

    // Fallback reply if no API key
    if (!apiKey) {
      return res.json({
        reply: `${systemPreamble}\n\n${context}\n\nYour question: ${message}`,
        projects: [],
      });
    }

    // Gemini endpoint (use env override, fallback to flash if 404)
    const primaryModel = process.env.GEMINI_MODEL || "gemini-1.5-pro-latest";
    const buildUrl = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    // Build turns correctly
    const turns = [];

    // System-style instruction (prepend once, not as "user" question)
    turns.push({
      role: "user",
      parts: [{ text: `${systemPreamble}\n\nContext:\n${context}` }],
    });

    // Add past conversation history
    if (Array.isArray(history)) {
      for (const h of history.slice(-10)) {
        const role = h?.role === "assistant" ? "model" : "user";
        const text = typeof h?.text === "string" ? h.text : "";
        if (text) turns.push({ role, parts: [{ text }] });
      }
    }

    // Current user message (ONLY the question)
    turns.push({
      role: "user",
      parts: [
        {
          text: `${message}\n\nIf appropriate, also provide a JSON block describing up to 5 concrete project TODOs as an array with keys: title (string), requiredSkills (array of strings), resources (array of {title, url}). Use this exact JSON shape: {"projects":[{"title":...,"requiredSkills":[...],"resources":[{"title":...,"url":...}]}]}. Wrap the JSON in triple backticks with json language tag.`,
        },
      ],
    });

    const body = {
      contents: turns,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };

    let resp = await fetch(buildUrl(primaryModel), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    let rawText = await resp.text().catch(() => "");
    let data = {};
    try { data = rawText ? JSON.parse(rawText) : {}; } catch {}
    if (!resp.ok && resp.status === 404) {
      // Retry with flash model when pro-latest is unavailable
      const fallbackModel = "gemini-1.5-flash-latest";
      resp = await fetch(buildUrl(fallbackModel), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      rawText = await resp.text().catch(() => "");
      data = {};
      try { data = rawText ? JSON.parse(rawText) : {}; } catch {}
    }
    if (!resp.ok) {
      const detail = rawText || "(no response body)";
      const friendly = `Provider error (${resp.status}). Details: ${detail}`;
      return res.status(200).json({ reply: friendly, projects: [] });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p?.text).join("\n\n") ||
      "I couldn't generate a response right now.";

    // Extract JSON project block if present
    let projects = [];
    try {
      const match =
        reply.match(/```json\s*([\s\S]*?)\s*```/i) ||
        reply.match(/\{\s*\"projects\"[\s\S]*\}\s*$/i);
      if (match) {
        const jsonStr = (match[1] || match[0]).trim();
        const parsed = JSON.parse(jsonStr);
        if (parsed && Array.isArray(parsed.projects)) {
          projects = parsed.projects.map((p) => ({
            title: p.title,
            requiredSkills: p.requiredSkills || [],
            resources: p.resources || [],
            role: (appliedRole || "").toLowerCase(),
          }));
        }
      }
    } catch (err) {
      console.error("Project JSON parse error:", err);
    }

    return res.json({ reply, projects });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
