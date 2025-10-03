// src/aiServices/chatService.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // or "" if using proxy
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * @param {{ role: string, content: string }[]} messages
 * @returns {Promise<{ role: string, content: string }>}
 */
export async function sendChatMessage(messages) {
  try {
    const { data } = await api.post("/api/chat", { messages });
    return data.reply;
  } catch (err) {
    console.error("Chat API error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.error || "Chat request failed");
  }
}