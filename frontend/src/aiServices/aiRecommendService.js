export async function fetchAIRecommendations(skill) {
  try {
    const res = await fetch(`/api/ai-recommendations?skill=${encodeURIComponent(skill)}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch AI recommendations:", err);
    return { videos: [], courses: [] };
  }
}
