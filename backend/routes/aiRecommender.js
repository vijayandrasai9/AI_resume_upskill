const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

// YouTube Data API v3 endpoint
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

router.get("/ai-recommendations", async (req, res) => {
  const { skills } = req.query;
  
  if (!skills) {
    return res.status(400).json({ error: "Missing skills parameter" });
  }

  try {
    const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;

    if (!youtubeApiKey) {
      return res.status(500).json({ error: "YouTube API key not configured" });
    }

    const recommendations = [];

    // Fetch videos for each skill
    for (const skill of skillsArray) {
      const trimmedSkill = skill.trim();
      if (!trimmedSkill) continue;

      try {
        const searchQuery = `${trimmedSkill} programming tutorial learn course`;
        
        const response = await fetch(
          `${YOUTUBE_API_URL}?part=snippet&type=video&q=${encodeURIComponent(searchQuery)}&maxResults=10&order=relevance&key=${youtubeApiKey}`
        );

        if (!response.ok) {
          throw new Error(`YouTube API error: ${response.status}`);
        }

        const data = await response.json();

        const videos = data.items.map(item => ({
          skill: trimmedSkill,
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
          channel: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          description: item.snippet.description
        }));

        recommendations.push({
          skill: trimmedSkill,
          videos: videos
        });

      } catch (error) {
        console.error(`Error fetching videos for skill ${trimmedSkill}:`, error);
        recommendations.push({
          skill: trimmedSkill,
          videos: [],
          error: `Failed to fetch videos for ${trimmedSkill}`
        });
      }
    }

    res.json({
      success: true,
      recommendations: recommendations
    });

  } catch (error) {
    console.error("AI recommendations error:", error);
    res.status(500).json({ 
      error: "Failed to fetch recommendations",
      details: error.message 
    });
  }
});

// Additional endpoint for single skill
router.get("/skill-videos", async (req, res) => {
  const { skill } = req.query;
  
  if (!skill) {
    return res.status(400).json({ error: "Missing skill parameter" });
  }

  try {
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;

    if (!youtubeApiKey) {
      return res.status(500).json({ error: "YouTube API key not configured" });
    }

    const searchQuery = `${skill} programming tutorial learn course`;
    
    const response = await fetch(
      `${YOUTUBE_API_URL}?part=snippet&type=video&q=${encodeURIComponent(searchQuery)}&maxResults=10&order=relevance&key=${youtubeApiKey}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    const videos = data.items.map(item => ({
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      channel: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      description: item.snippet.description
    }));

    res.json({
      skill: skill,
      videos: videos
    });

  } catch (error) {
    console.error("YouTube API error:", error);
    res.status(500).json({ 
      error: "Failed to fetch YouTube videos",
      details: error.message 
    });
  }
});

module.exports = router;