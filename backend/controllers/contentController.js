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


