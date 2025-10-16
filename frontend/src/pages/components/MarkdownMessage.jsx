import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css"; // Import dark theme for code highlighting

export default function MarkdownMessage({ text, isUser }) {
  return (
    <div style={{
      width: isUser ? "auto" : "100%",
      maxWidth: isUser ? "85%" : "100%",
      padding: "12px 16px",
      borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
      backgroundColor: isUser ? "#3b82f6" : "#e5e7eb",
      color: isUser ? "white" : "#111827",
      fontSize: 14,
      lineHeight: 1.5,
      wordWrap: "break-word",
      overflow: "hidden",
      boxSizing: "border-box"
    }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            
            if (!inline) {
              // Dark theme for code blocks
              return (
                <div style={{
                  margin: "12px 0",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}>
                  {/* Code block header */}
                  <div style={{
                    backgroundColor: "#1a1a1a",
                    color: "#e5e7eb",
                    padding: "8px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    borderBottom: "1px solid #333",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span>{match ? match[1] : "code"}</span>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ff5f56" }}></div>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ffbd2e" }}></div>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#27ca3f" }}></div>
                    </div>
                  </div>
                  
                  {/* Code content */}
                  <pre style={{
                    background: "#1e1e1e",
                    color: "#e5e7eb",
                    padding: "16px",
                    margin: 0,
                    overflowX: "auto",
                    fontSize: "13px",
                    fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                    lineHeight: 1.4,
                    border: "none",
                    maxWidth: "100%",
                    boxSizing: "border-box"
                  }}>
                    <code 
                      className={className}
                      style={{
                        background: "transparent",
                        padding: 0,
                        border: "none",
                        color: "inherit"
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  </pre>
                </div>
              );
            }
            
            // Inline code - light theme
            return (
              <code style={{
                background: isUser ? "rgba(255,255,255,0.15)" : "#f3f4f6",
                border: isUser ? "1px solid rgba(255,255,255,0.2)" : "1px solid #e5e7eb",
                borderRadius: "4px",
                padding: "2px 6px",
                fontSize: "13px",
                fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
                color: isUser ? "white" : "#111827"
              }} {...props}>
                {children}
              </code>
            );
          },
          a({ children, ...props }) {
            return (
              <a
                style={{ 
                  color: isUser ? "#fff" : "#2563eb",
                  textDecoration: "underline"
                }}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
          p({ children }) {
            return <p style={{ margin: "8px 0", width: "100%" }}>{children}</p>;
          },
          ul({ children }) {
            return <ul style={{ margin: "8px 0 8px 18px", width: "100%" }}>{children}</ul>;
          },
          ol({ children }) {
            return <ol style={{ margin: "8px 0 8px 18px", width: "100%" }}>{children}</ol>;
          },
          h1({ children }) { 
            return <h1 style={{ margin: "12px 0", fontSize: 18, width: "100%" }}>{children}</h1>; 
          },
          h2({ children }) { 
            return <h2 style={{ margin: "10px 0", fontSize: 16, width: "100%" }}>{children}</h2>; 
          },
          h3({ children }) { 
            return <h3 style={{ margin: "8px 0", fontSize: 15, width: "100%" }}>{children}</h3>; 
          },
          table({ children }) { 
            return (
              <div style={{ overflowX: "auto", width: "100%", margin: "12px 0" }}>
                <table style={{ 
                  borderCollapse: "collapse", 
                  width: "100%",
                  minWidth: "100%",
                  backgroundColor: isUser ? "rgba(255,255,255,0.05)" : "white"
                }}>
                  {children}
                </table>
              </div>
            ); 
          },
          th({ children }) { 
            return (
              <th style={{ 
                border: "1px solid #e5e7eb", 
                padding: "8px", 
                textAlign: "left",
                backgroundColor: isUser ? "rgba(255,255,255,0.1)" : "#f9fafb",
                fontWeight: "600"
              }}>
                {children}
              </th>
            ); 
          },
          td({ children }) { 
            return (
              <td style={{ 
                border: "1px solid #e5e7eb", 
                padding: "8px",
                backgroundColor: isUser ? "rgba(255,255,255,0.05)" : "white"
              }}>
                {children}
              </td>
            ); 
          },
          blockquote({ children }) {
            return (
              <blockquote style={{
                borderLeft: `4px solid ${isUser ? "rgba(255,255,255,0.3)" : "#d1d5db"}`,
                margin: "12px 0",
                padding: "8px 0 8px 16px",
                backgroundColor: isUser ? "rgba(255,255,255,0.05)" : "#f9fafb",
                fontStyle: "italic"
              }}>
                {children}
              </blockquote>
            );
          }
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}