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
      "- Format all responses using GitHub Flavored Markdown (GFM).",
      "- Use headings, bullet lists, and tables when appropriate.",
      "- Render any code in fenced code blocks with language tags, e.g., ```js ...```.",
      "- Prefer official documentation, standards, and primary sources over blogs.",
      "- Do not include outdated or expired links. If unsure, omit the link.",
      "- When citing sources, include the site name and a brief title.",
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

      async function generate(contents) {
        const resp = await fetch(buildUrl(picked.version, picked.model), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: { temperature: 0.6, maxOutputTokens: 2048 },
          }),
        });
        const text = await resp.text().catch(() => "");
        let data = {};
        try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
        if (!resp.ok) {
          const errMsg = data?.error?.message || text || `HTTP ${resp.status}`;
          return { error: `Gemini error: ${errMsg}` };
        }
        const candidate = (data?.candidates || [])[0] || {};
        const chunk = (candidate?.content?.parts || [])
          .map((p) => p?.text)
          .filter(Boolean)
          .join("\n\n");
        const finishReason = candidate?.finishReason || ""; // may be absent
        return { chunk, finishReason };
      }

      // First response
      const first = await generate([
        { role: "user", parts: [{ text: combined }] },
      ]);
      if (first?.error) {
        return res.status(502).json({ error: first.error });
      }
      let accumulated = String(first?.chunk || "").trim();
      if (!accumulated) {
        return res.status(502).json({ error: "No response from Gemini" });
      }

      // Heuristic: if cut mid-thought or likely due to token limit, request continuation up to 2 times
      const looksCutOff = (text) => {
        if (!text) return false;
        const openFences = (text.match(/```/g) || []).length % 2 === 1;
        const endsWeird = /\b(and|or|to|with|for|the|a|an|in|on|of)$/i.test(text.trim());
        const noClosingPunct = !/[.!?`]>\)]\s*$/.test(text.trim());
        return openFences || (endsWeird && noClosingPunct);
      };

      let tries = 0;
      let lastFinish = String(first?.finishReason || "");
      while (tries < 2 && (looksCutOff(accumulated) || /MAX_TOKENS|LENGTH/i.test(lastFinish))) {
        tries += 1;
        const cont = await generate([
          { role: "user", parts: [{ text: combined }] },
          { role: "model", parts: [{ text: accumulated }] },
          { role: "user", parts: [{ text: "Continue the previous answer without repeating. Keep Markdown formatting." }] },
        ]);
        if (cont?.error) break;
        const addition = String(cont?.chunk || "").trim();
        if (addition) {
          accumulated += (accumulated.endsWith("\n") ? "\n\n" : "\n\n") + addition;
        }
        lastFinish = String(cont?.finishReason || "");
        if (!looksCutOff(addition) && !/MAX_TOKENS|LENGTH/i.test(lastFinish)) break;
      }

      let replyText = accumulated;

      // Validate and annotate links to avoid expired URLs
      async function validateUrlOnce(url) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        try {
          // Try HEAD first
          let r = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal });
          if (r.ok || (r.status >= 200 && r.status < 400)) return true;
          // Fallback to GET for servers that don't handle HEAD well
          r = await fetch(url, { method: "GET", redirect: "follow", signal: controller.signal });
          return r.ok || (r.status >= 200 && r.status < 400);
        } catch {
          return false;
        } finally {
          clearTimeout(timeout);
        }
      }

      function collectUrls(md) {
        const urls = new Set();
        const linkRe = /\[[^\]]+\]\((https?:[^)\s]+)\)/g; // markdown links
        const bareRe = /(?<!\]\()(https?:\/\/[^\s)]+)(?!\))/g; // bare urls not already in () of markdown
        let m;
        while ((m = linkRe.exec(md))) urls.add(m[1]);
        while ((m = bareRe.exec(md))) urls.add(m[1]);
        return Array.from(urls);
      }

      const urls = collectUrls(replyText).slice(0, 10); // limit checks to avoid latency
      const results = {};
      await Promise.all(urls.map(async (u) => { results[u] = await validateUrlOnce(u); }));

      // Annotate broken links in both markdown links and bare URLs
      if (urls.length > 0) {
        // Replace markdown links
        replyText = replyText.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, (full, text, url) => {
          if (results[url] === false) return `[${text}](${url}) (broken link)`;
          return full;
        });
        // Replace bare urls not inside markdown link
        replyText = replyText.replace(/(?<!\]\()(https?:\/\/[^\s)]+)(?!\))/g, (url) => {
          if (results[url] === false) return `${url} (broken link)`;
          return url;
        });
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
