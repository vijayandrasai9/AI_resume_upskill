// src/components/ChatBox.jsx
import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../../aiServices/chatService";
import MarkdownMessage from "./MarkdownMessage";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI career coach. I can help you with resume analysis, skill gaps, project recommendations, and career guidance. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = { role: "user", content: input.trim() };
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
      // Add error message to chat
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again or check your connection." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: "Chat cleared. How can I help you today?" }]);
    setError("");
  };

  return (
    <div style={{ 
      border: "1px solid #e5e7eb", 
      borderRadius: 12, 
      overflow: "hidden",
      backgroundColor: "#fff",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
    }}>
      {/* Header */}
      <div style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
        color: "white", 
        padding: "12px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ 
            width: 8, 
            height: 8, 
            borderRadius: "50%", 
            backgroundColor: isLoading ? "#ffd700" : "#4ade80" 
          }} />
          <span style={{ fontWeight: 600 }}>AI Career Coach</span>
        </div>
        <button 
          onClick={clearChat}
          style={{ 
            background: "rgba(255,255,255,0.2)", 
            border: "none", 
            color: "white", 
            padding: "4px 8px", 
            borderRadius: 6, 
            cursor: "pointer",
            fontSize: 12
          }}
        >
          Clear
        </button>
      </div>

      {/* Messages */}
      <div style={{ 
        height: 300, 
        overflowY: "auto", 
        padding: 16,
        backgroundColor: "#f9fafb"
      }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 12,
            }}
          >
            <MarkdownMessage text={m.content} isUser={m.role === "user"} />
          </div>
        ))}
        {isLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "8px 12px",
              borderRadius: "18px 18px 18px 4px",
              backgroundColor: "#e5e7eb",
              color: "#6b7280",
              fontSize: 14
            }}>
              <span>Thinking</span>
              <span style={{ animation: "pulse 1.5s infinite" }}>...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ 
          padding: "8px 16px", 
          backgroundColor: "#fef2f2", 
          color: "#dc2626", 
          fontSize: 12,
          borderTop: "1px solid #fecaca"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Input */}
      <div style={{ 
        padding: 12, 
        backgroundColor: "#fff", 
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        gap: 8
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          style={{ 
            flex: 1, 
            padding: "8px 12px", 
            border: "1px solid #d1d5db", 
            borderRadius: 20,
            fontSize: 14,
            outline: "none",
            backgroundColor: "#f9fafb"
          }}
          placeholder="Ask me about your career, skills, or projects..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          disabled={isLoading || !input.trim()}
          style={{ 
            background: isLoading || !input.trim() ? "#9ca3af" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: 20,
            padding: "8px 16px",
            cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
            fontSize: 14,
            fontWeight: 500,
            transition: "all 0.2s"
          }}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}