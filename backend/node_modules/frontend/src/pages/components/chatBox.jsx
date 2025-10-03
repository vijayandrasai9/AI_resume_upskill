// src/components/ChatBox.jsx
import React, { useState } from "react";
import { sendChatMessage } from "../../aiServices/chatService";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      const reply = await sendChatMessage(updated);
      setMessages([...updated, reply]);
    } catch (err) {
      console.error("Chat failed:", err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 12, borderRadius: 8 }}>
      <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 8 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.role === "user" ? "right" : "left",
              margin: "4px 0",
            }}
          >
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: 8 }}>Error: {error}</div>
      )}

      <div style={{ display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{ flex: 1, marginRight: 8, padding: 8 }}
          placeholder="Type a message…"
        />
        <button onClick={handleSend} disabled={isLoading}>
          {isLoading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}