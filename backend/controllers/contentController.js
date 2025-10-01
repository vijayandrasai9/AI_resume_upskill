exports.getGuides = async (_req, res) => {
  // Static placeholders; replace with real logic later
  return res.json([
    { title: "Build a Portfolio Website", description: "React + Node.js full-stack guide." },
    { title: "REST API Best Practices", description: "Design robust, secure APIs." },
  ]);
};

exports.getRecommendations = async (_req, res) => {
  return res.json([
    { title: "Top React Interview Questions", summary: "Prepare for your next interview.", link: "https://react.dev" },
    { title: "CSS Layout Mastery", summary: "Flexbox and Grid deep dive.", link: "https://developer.mozilla.org" },
  ]);
};

// Project TODO recommendations based on applied roles and detected resume skills
exports.getProjectRecommendations = async (req, res) => {
  try {
    const User = require("../models/User");
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("appliedRoles desiredRoles resumes");
    if (!user) return res.status(404).json({ message: "User not found" });

    const roles = Array.from(new Set([...(user.appliedRoles || []), ...(user.desiredRoles || [])]))
      .map((r) => String(r || "").toLowerCase().trim());

    const baseAiUrl = (process.env.AI_GUIDE_BASE_URL || "https://gemini.google.com/app").replace(/\/$/, "");
    const buildAiLink = (topic) => `${baseAiUrl}?utm_source=resume_upskill&topic=${encodeURIComponent(topic)}`;

    // Lightweight heuristic mapping of roles -> suggested project TODOs with required skills and resources
    const baseByRole = {
      "frontend developer": [
        {
          title: "Build a responsive portfolio with React and Tailwind",
          requiredSkills: ["react", "tailwind", "responsive design"],
          aiGuideLink: buildAiLink("react-portfolio"),
          resources: [
            { type: "video", title: "Tailwind CSS Crash Course", url: "https://www.youtube.com/watch?v=UBOj6rqRUME" },
            { type: "docs", title: "React Docs", url: "https://react.dev/learn" },
          ],
        },
        {
          title: "Implement a reusable component library",
          requiredSkills: ["react", "component design", "storybook"],
          aiGuideLink: buildAiLink("component-library"),
          resources: [
            { type: "docs", title: "Storybook for React", url: "https://storybook.js.org/docs/react/get-started/introduction" },
          ],
        },
        {
          title: "Create a dashboard with charts and authentication",
          requiredSkills: ["react", "chartjs", "auth"],
          aiGuideLink: buildAiLink("react-dashboard-auth"),
          resources: [
            { type: "docs", title: "Chart.js Docs", url: "https://www.chartjs.org/docs/latest/" },
          ],
        },
      ],
      "backend developer": [
        {
          title: "Design a REST API with Node.js and Express",
          requiredSkills: ["node", "express", "rest"],
          aiGuideLink: buildAiLink("node-express-api"),
          resources: [
            { type: "docs", title: "Express Guide", url: "https://expressjs.com/en/starter/installing.html" },
          ],
        },
        {
          title: "Implement authentication and RBAC",
          requiredSkills: ["node", "express", "jwt", "rbac"],
          aiGuideLink: buildAiLink("jwt-rbac"),
          resources: [
            { type: "article", title: "JWT Best Practices", url: "https://auth0.com/learn/json-web-tokens/" },
          ],
        },
        {
          title: "Add integration tests and CI",
          requiredSkills: ["jest", "supertest", "ci"],
          aiGuideLink: buildAiLink("api-testing-ci"),
          resources: [
            { type: "docs", title: "Jest Docs", url: "https://jestjs.io/docs/getting-started" },
          ],
        },
      ],
      "full stack developer": [
        {
          title: "End-to-end app: React + Node/Express",
          requiredSkills: ["react", "node", "express", "mongodb"],
          aiGuideLink: buildAiLink("fullstack-app"),
          resources: [
            { type: "docs", title: "MongoDB Basics", url: "https://www.mongodb.com/docs/manual/crud/" },
          ],
        },
        {
          title: "JWT auth and protected routes",
          requiredSkills: ["jwt", "react-router", "auth"],
          aiGuideLink: buildAiLink("jwt-protected-routes"),
          resources: [
            { type: "video", title: "JWT Auth Tutorial", url: "https://www.youtube.com/watch?v=mbsmsi7l3r4" },
          ],
        },
        {
          title: "Dockerize and add CI",
          requiredSkills: ["docker", "ci"],
          aiGuideLink: buildAiLink("docker-ci"),
          resources: [
            { type: "docs", title: "Docker Docs", url: "https://docs.docker.com/get-started/overview/" },
          ],
        },
      ],
      "data engineer": [
        {
          title: "Build an ETL pipeline",
          requiredSkills: ["python", "etl", "airflow"],
          aiGuideLink: buildAiLink("etl-pipeline"),
          resources: [
            { type: "docs", title: "Airflow Quick Start", url: "https://airflow.apache.org/docs/apache-airflow/stable/start.html" },
          ],
        },
        {
          title: "Expose aggregated metrics via API",
          requiredSkills: ["api", "aggregation", "sql"],
          aiGuideLink: buildAiLink("metrics-api"),
          resources: [
            { type: "article", title: "Designing Data APIs", url: "https://martinfowler.com/articles/richardsonMaturityModel.html" },
          ],
        },
      ],
    };

    // Derive skills via very simple extraction from last resume filename/metadata if present
    // For now, just infer from role names and provide generic tasks if nothing matches
    let todos = [];
    for (const role of roles) {
      const mapped = baseByRole[role];
      if (Array.isArray(mapped)) todos.push(...mapped.map((t) => ({ ...t, role })));
    }
    if (todos.length === 0) {
      todos = [
        {
          title: "Create a small CRUD app with auth",
          requiredSkills: ["crud", "auth"],
          aiGuideLink: buildAiLink("crud-auth"),
          resources: [
            { type: "docs", title: "REST CRUD Concepts", url: "https://restfulapi.net/http-methods/" },
          ],
          role: "general",
        },
        {
          title: "Add unit tests and basic CI",
          requiredSkills: ["jest", "ci"],
          aiGuideLink: buildAiLink("unit-tests-ci"),
          resources: [
            { type: "docs", title: "GitHub Actions", url: "https://docs.github.com/actions" },
          ],
          role: "general",
        },
      ];
    }

    // Ensure uniqueness by title and limit length
    const seen = new Set();
    const unique = [];
    for (const t of todos) {
      const key = (t.title || String(t)).toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(t);
      }
    }
    return res.json(unique.slice(0, 20));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


