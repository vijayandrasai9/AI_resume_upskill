// src/aiServices/chatService.js
import axios from "axios";

const api = axios.create({
  baseURL: "", // let devServer proxy /api
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
    const userMessage = (messages || []).filter(m => m.role === "user").pop()?.content || "";
    const token = localStorage.getItem("token") || "";
    const { data } = await api.post("/api/chat", { message: userMessage }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const replyText = data?.reply || "No response";
    return { role: "assistant", content: replyText };
  } catch (err) {
    console.error("Chat API error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.error || "Chat request failed");
  }
}