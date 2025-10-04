const fetch = global.fetch || require("node-fetch");

exports.chat = async (req, res) => {
  try {
    const {
      message,
      appliedRole,
      presentSkills = [],
      missingSkills = [],
      presentProjects = [],
      history = [],
    } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message" });
    }
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    if (!apiKey) {
      return res.status(400).json({ error: "GEMINI_API_KEY is not configured" });
    }

    const preferredModel = process.env.GEMINI_MODEL || "gemini-1.5-pro-latest";
    const buildUrl = (version, model) => `https://generativelanguage.googleapis.com/${version}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const listModelsUrl = (version) => `https://generativelanguage.googleapis.com/${version}/models?key=${encodeURIComponent(apiKey)}`;

    const systemPreamble = [
      "You are an expert AI project coach and coding assistant.",
      "- Always answer the user's question directly and contextually.",
      "- Provide clear, structured, and actionable advice.",
      "- Suggest concrete next steps, code tips, and learning paths.",
      "- If asked for projects, propose realistic TODOs with required skills + resources.",
    ].join("\n");

    const context = [
      `Applied role: ${appliedRole || "(none)"}`,
      `Present skills: ${(presentSkills || []).join(", ") || "(none)"}`,
      `Missing skills: ${(missingSkills || []).join(", ") || "(none)"}`,
      `Present projects: ${(presentProjects || []).slice(0, 10).join(" | ") || "(none)"}`,
    ].join("\n");

    const combined = `${systemPreamble}\n\nContext:\n${context}\n\nUser question: ${message}`;

    try {
      async function pickSupportedModel() {
        const nameFromEnv = String(preferredModel || "").replace(/^models\//, "");
        const versions = ["v1", "v1beta"];
        for (const v of versions) {
          try {
            const lm = await fetch(listModelsUrl(v));
            const txt = await lm.text();
            let payload = {};
            try { payload = txt ? JSON.parse(txt) : {}; } catch {}
            if (!lm.ok) continue;
            const models = Array.isArray(payload?.models) ? payload.models : [];
            const supports = (m) => Array.isArray(m?.supportedGenerationMethods) && m.supportedGenerationMethods.includes("generateContent");
            // 1) exact env match
            let found = models.find(m => (m.name || "").endsWith(`/${nameFromEnv}`) && supports(m));
            if (found) return { version: v, model: found.name.split("/").pop() };
            // 2) prefer 1.5 pro/flash latest
            found = models.find(m => /gemini-1\.5-pro(-latest)?$/.test(m.name || "") && supports(m));
            if (found) return { version: v, model: found.name.split("/").pop() };
            found = models.find(m => /gemini-1\.5-flash(-latest)?$/.test(m.name || "") && supports(m));
            if (found) return { version: v, model: found.name.split("/").pop() };
            // 3) any gemini model supporting generateContent
            found = models.find(m => /gemini/i.test(m.name || "") && supports(m));
            if (found) return { version: v, model: found.name.split("/").pop() };
          } catch {}
        }
        return null;
      }

      const picked = await pickSupportedModel();
      if (!picked) {
        return res.status(502).json({ error: "Gemini error: no supported model found for your API key on v1/v1beta" });
      }

      const resp = await fetch(buildUrl(picked.version, picked.model), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: combined }] },
          ],
          generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
        }),
      });
      const text = await resp.text().catch(() => "");
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
      if (!resp.ok) {
        const errMsg = data?.error?.message || text || `HTTP ${resp.status}`;
        return res.status(502).json({ error: `Gemini error: ${errMsg}` });
      }
      const replyText = (data?.candidates?.[0]?.content?.parts || [])
        .map((p) => p?.text)
        .filter(Boolean)
        .join("\n\n");
      if (!replyText) {
        return res.status(502).json({ error: "No response from Gemini" });
      }
      return res.json({ reply: replyText, projects: [] });
    } catch (err) {
      console.error("Gemini fetch error:", err?.message || err);
      return res.status(502).json({ error: "Gemini provider error" });
    }
  } catch (err) {
    console.error(err);
    const friendly = "I hit an internal error contacting the ML service. Please try again in a moment.";
    return res.status(200).json({ reply: friendly, projects: [] });
  }
};
