import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

export default function MarkdownMessage({ text, isUser }) {
  return (
    <div style={{
      maxWidth: "80%",
      padding: "8px 12px",
      borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
      backgroundColor: isUser ? "#3b82f6" : "#e5e7eb",
      color: isUser ? "white" : "#111827",
      fontSize: 14,
      lineHeight: 1.5,
      wordWrap: "break-word"
    }}>
      <div style={{
        // Ensure markdown elements look like ChatGPT
      }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline ? (
                <pre style={{
                  background: isUser ? "rgba(255,255,255,0.15)" : "#f3f4f6",
                  border: isUser ? "1px solid rgba(255,255,255,0.2)" : "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: 12,
                  overflowX: "auto"
                }}>
                  <code className={className || (match ? `language-${match[1]}` : undefined)} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code style={{
                  background: isUser ? "rgba(255,255,255,0.15)" : "#f3f4f6",
                  border: isUser ? "1px solid rgba(255,255,255,0.2)" : "1px solid #e5e7eb",
                  borderRadius: 4,
                  padding: "1px 4px"
                }} {...props}>
                  {children}
                </code>
              );
            },
            a({ children, ...props }) {
              return (
                <a
                  style={{ color: isUser ? "#fff" : "#2563eb" }}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                </a>
              );
            },
            p({ children }) {
              return <p style={{ margin: "6px 0" }}>{children}</p>;
            },
            ul({ children }) {
              return <ul style={{ margin: "6px 0 6px 18px" }}>{children}</ul>;
            },
            ol({ children }) {
              return <ol style={{ margin: "6px 0 6px 18px" }}>{children}</ol>;
            },
            h1({ children }) { return <h1 style={{ margin: "6px 0", fontSize: 18 }}>{children}</h1>; },
            h2({ children }) { return <h2 style={{ margin: "6px 0", fontSize: 16 }}>{children}</h2>; },
            h3({ children }) { return <h3 style={{ margin: "6px 0", fontSize: 15 }}>{children}</h3>; },
            table({ children }) { return <div style={{ overflowX: "auto" }}><table style={{ borderCollapse: "collapse", width: "100%" }}>{children}</table></div>; },
            th({ children }) { return <th style={{ border: "1px solid #e5e7eb", padding: 6, textAlign: "left" }}>{children}</th>; },
            td({ children }) { return <td style={{ border: "1px solid #e5e7eb", padding: 6 }}>{children}</td>; },
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}


