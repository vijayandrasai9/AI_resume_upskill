const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

// Get API keys from environment with validation
const YOUTUBE_API_KEYS = (process.env.YOUTUBE_API_KEYS || "")
  .split(",")
  .map(k => k.trim())
  .filter(k => k && k.length > 10); // Basic validation

// Fallback to empty array if no valid keys
if (YOUTUBE_API_KEYS.length === 0) {
  console.warn("⚠️ No valid YouTube API keys found. Please set YOUTUBE_API_KEYS environment variable.");
}

console.log(`🔑 Loaded ${YOUTUBE_API_KEYS.length} YouTube API keys`);

let currentKeyIndex = 0;
let keyStatus = YOUTUBE_API_KEYS.map(() => ({ 
  available: true, 
  lastError: null,
  lastUsed: null,
  requestCount: 0
}));

// -------------------- Improved Key Rotation --------------------
async function fetchWithKeyRotation(url, maxRetries = YOUTUBE_API_KEYS.length * 2) {
  // If no API keys, return mock data or throw error
  if (YOUTUBE_API_KEYS.length === 0) {
    throw new Error("No YouTube API keys configured");
  }

  let attempts = 0;
  const errors = [];

  while (attempts < maxRetries) {
    const keyIndex = currentKeyIndex;
    const key = YOUTUBE_API_KEYS[keyIndex];
    const keyInfo = keyStatus[keyIndex];
    const fullUrl = `${url}${url.includes('?') ? '&' : '?'}key=${key}`;
    
    // Update key usage stats
    keyInfo.lastUsed = new Date();
    keyInfo.requestCount = (keyInfo.requestCount || 0) + 1;

    console.log(`🔑 Attempt ${attempts + 1}: Using key index ${keyIndex}`);

    try {
      const response = await fetch(fullUrl);
      const data = await response.json();

      // Check for API errors
      if (data.error) {
        const errorMsg = data.error.message || "Unknown API error";
        const errorCode = data.error.code;
        
        console.warn(`❌ API Error with key ${keyIndex}: ${errorCode} - ${errorMsg}`);

        // Mark key as unavailable for quota/limit errors
        if (errorCode === 403 || errorCode === 429 || 
            errorMsg.toLowerCase().includes("quota") ||
            errorMsg.toLowerCase().includes("exceeded") ||
            errorMsg.toLowerCase().includes("disabled")) {
          
          keyStatus[keyIndex] = {
            ...keyInfo,
            available: false,
            lastError: `Quota exceeded: ${errorMsg}`
          };
          console.warn(`⛔ Marked key ${keyIndex} as unavailable due to quota`);
        }

        errors.push(`Key ${keyIndex}: ${errorMsg}`);
        
        // Rotate to next key
        currentKeyIndex = (currentKeyIndex + 1) % YOUTUBE_API_KEYS.length;
        attempts++;
        continue;
      }

      // ✅ Success - return data
      console.log(`✅ Success with key ${keyIndex}`);
      keyStatus[keyIndex] = { ...keyInfo, available: true, lastError: null };
      return data;

    } catch (error) {
      console.error(`💥 Network error with key ${keyIndex}:`, error.message);
      
      // Mark key as unavailable for persistent network errors
      keyStatus[keyIndex] = {
        ...keyInfo,
        available: false,
        lastError: `Network error: ${error.message}`
      };
      
      errors.push(`Key ${keyIndex}: ${error.message}`);
      currentKeyIndex = (currentKeyIndex + 1) % YOUTUBE_API_KEYS.length;
      attempts++;
    }
  }

  // All keys exhausted
  const availableCount = keyStatus.filter(k => k.available).length;
  const errorSummary = errors.slice(-3).join("; "); // Last 3 errors
  
  throw new Error(`All YouTube API keys failed. ${availableCount}/${YOUTUBE_API_KEYS.length} keys available. Last errors: ${errorSummary}`);
}

// -------------------- Fallback Mock Data --------------------
function getMockVideos(skill) {
  const mockVideos = [
    {
      title: `${skill} - Complete Tutorial for Beginners`,
      url: `https://www.youtube.com/watch?v=mock_${skill.toLowerCase().replace(/\s+/g, '_')}_1`,
      thumbnail: "https://via.placeholder.com/320x180.png?text=Video+Thumbnail",
      channel: "Programming Tutorials",
      publishedAt: new Date().toISOString(),
      description: `Learn ${skill} with this comprehensive tutorial`
    },
    {
      title: `Advanced ${skill} Techniques`,
      url: `https://www.youtube.com/watch?v=mock_${skill.toLowerCase().replace(/\s+/g, '_')}_2`,
      thumbnail: "https://via.placeholder.com/320x180.png?text=Video+Thumbnail",
      channel: "Code Masters",
      publishedAt: new Date().toISOString(),
      description: `Advanced concepts and techniques for ${skill}`
    }
  ];
  
  return mockVideos;
}

// -------------------- Single Skill Videos (with fallback) --------------------
router.get("/skill-videos", async (req, res) => {
  const { skill } = req.query;

  if (!skill) {
    return res.status(400).json({ 
      error: "Missing skill parameter",
      example: "/api/skill-videos?skill=javascript"
    });
  }

  // Sanitize skill name for URL
  const sanitizedSkill = skill.trim().substring(0, 50); // Limit length

  try {
    console.log(`🎯 Fetching videos for skill: "${sanitizedSkill}"`);
    
    const searchQuery = `${sanitizedSkill} programming tutorial`;
    const url = `${YOUTUBE_API_URL}?part=snippet&type=video&q=${encodeURIComponent(searchQuery)}&maxResults=6&order=relevance`;

    const data = await fetchWithKeyRotation(url);

    const videos = data.items?.map(item => ({
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      channel: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      description: item.snippet.description
    })) || [];

    console.log(`✅ Found ${videos.length} videos for "${sanitizedSkill}"`);

    res.json({
      success: true,
      skill: sanitizedSkill,
      videos,
      totalResults: videos.length,
      keyStatus: {
        currentKeyIndex,
        availableKeys: keyStatus.filter(s => s.available).length,
        totalKeys: YOUTUBE_API_KEYS.length
      }
    });

  } catch (error) {
    console.error(`❌ Error fetching videos for "${skill}":`, error.message);
    
    // Provide fallback mock data if API fails
    const mockVideos = getMockVideos(skill);
    
    res.status(200).json({ // Still return 200 but indicate it's fallback data
      success: false,
      skill: skill,
      videos: mockVideos,
      totalResults: mockVideos.length,
      warning: "Using fallback data - YouTube API unavailable",
      error: error.message,
      keyStatus: {
        currentKeyIndex,
        availableKeys: keyStatus.filter(s => s.available).length,
        totalKeys: YOUTUBE_API_KEYS.length
      }
    });
  }
});

// -------------------- Key Management Endpoints --------------------
router.get("/key-status", (req, res) => {
  const status = YOUTUBE_API_KEYS.map((key, index) => ({
    index,
    keyPreview: key.substring(0, 8) + '...' + key.substring(key.length - 4),
    available: keyStatus[index].available,
    lastError: keyStatus[index].lastError,
    requestCount: keyStatus[index].requestCount || 0,
    lastUsed: keyStatus[index].lastUsed,
    isCurrent: index === currentKeyIndex
  }));
  
  res.json({
    totalKeys: YOUTUBE_API_KEYS.length,
    availableKeys: keyStatus.filter(s => s.available).length,
    currentKeyIndex,
    keys: status
  });
});

router.post("/reset-keys", (req, res) => {
  keyStatus = YOUTUBE_API_KEYS.map(() => ({ 
    available: true, 
    lastError: null,
    lastUsed: null,
    requestCount: 0
  }));
  currentKeyIndex = 0;
  res.json({ 
    message: "All keys reset to available status", 
    currentKeyIndex,
    availableKeys: YOUTUBE_API_KEYS.length
  });
});

// -------------------- Test Endpoint --------------------
router.get("/test", async (req, res) => {
  try {
    const testUrl = `${YOUTUBE_API_URL}?part=snippet&type=video&q=javascript&maxResults=1`;
    const data = await fetchWithKeyRotation(testUrl);
    
    res.json({
      success: true,
      message: "YouTube API is working!",
      currentKeyIndex,
      availableKeys: keyStatus.filter(s => s.available).length,
      testResult: data.items ? `Found ${data.items.length} videos` : 'No videos found'
    });
  } catch (error) {
    res.json({
      success: false,
      message: "YouTube API test failed",
      error: error.message,
      currentKeyIndex,
      availableKeys: keyStatus.filter(s => s.available).length
    });
  }
});

module.exports = router;