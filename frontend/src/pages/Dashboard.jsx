import React, { useEffect, useMemo, useRef, useState } from "react";

function Section({ title, right, children }) {
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const [profile, setProfile] = useState({
    name: "Your Name",
    email: "you@example.com",
    theme: "light",
    skills: [
      { name: "JavaScript", level: 70 },
      { name: "React", level: 65 },
      { name: "Node.js", level: 60 },
      { name: "CSS", level: 55 },
    ],
  });

  const [desiredRoles, setDesiredRoles] = useState(["Frontend Developer"]);
  const [appliedRoles, setAppliedRoles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newRole, setNewRole] = useState("");

  const [resumeFiles, setResumeFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [recommendations, setRecommendations] = useState([]);
  const [projectGuides, setProjectGuides] = useState([]);
  const [projectTodos, setProjectTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [analysis, setAnalysis] = useState({ missingSkills: [], presentSkills: [], desiredRoles: [], noResume: false, presentProjects: [] });
  const [selectedAppliedRole, setSelectedAppliedRole] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatTyping, setChatTyping] = useState(false);

  const fileInputRef = useRef(null);
  const token = useMemo(() => localStorage.getItem("token") || "", []);

  async function refreshAnalysis(headers) {
    try {
      const ar = await fetch("/api/analyze-resume", { headers });
      if (ar.ok) {
        const data = await ar.json();
        setAnalysis({
          missingSkills: Array.isArray(data?.missingSkills) ? data.missingSkills : [],
          presentSkills: Array.isArray(data?.presentSkills) ? data.presentSkills : [],
          desiredRoles: Array.isArray(data?.desiredRoles) ? data.desiredRoles : [],
          noResume: Boolean(data?.noResume),
          presentProjects: Array.isArray(data?.presentProjects) ? data.presentProjects : [],
        });
        // Refresh project TODOs whenever analysis updates
        try {
          const pr = await fetch("/api/project-recommendations", { headers });
          if (pr.ok) {
            const list = await pr.json();
            if (Array.isArray(list)) setProjectTodos(list);
          }
        } catch {}
      }
    } catch {}
  }

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const fetchAll = async () => {
      try {
        // Profile
        try {
          const res = await fetch("/api/profile", { headers });
          if (res.ok) {
            const data = await res.json();
            setProfile((prev) => ({ ...prev, ...data }));
            if (Array.isArray(data?.desiredRoles)) setDesiredRoles(data.desiredRoles);
            if (Array.isArray(data?.appliedRoles)) setAppliedRoles(data.appliedRoles);
            if (Array.isArray(data?.activities)) setActivities(data.activities);
          }
        } catch {}

        // Resumes
        try {
          const res = await fetch("/api/resumes", { headers });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) setResumeFiles(data);
          }
        } catch {}

        // Recommendations
        try {
          const res = await fetch("/api/recommendations", { headers });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) setRecommendations(data);
          }
        } catch {}

        // Project Guides
        try {
          const res = await fetch("/api/guides", { headers });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) setProjectGuides(data);
          }
        } catch {}

        // Project TODO recommendations
        try {
          const res = await fetch("/api/project-recommendations", { headers });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) setProjectTodos(data);
          }
        } catch {}

        // Initial AI analysis (if a resume exists)
        try {
          await refreshAnalysis(headers);
        } catch {}
      } catch {}
    };
    fetchAll();
  }, [token]);

  useEffect(() => {
    // Filter project TODOs to those matching the selected role (if any), whose requiredSkills are missing, and exclude ones already present in resume projects
    const present = new Set((analysis?.presentSkills || []).map((s) => String(s).toLowerCase()));
    const presentProjects = (analysis?.presentProjects || []).map((p) => String(p).toLowerCase());
    const result = (projectTodos || [])
      .filter((t) => {
        if (selectedAppliedRole) {
          const tr = String(t.role || "").toLowerCase();
          return tr.includes(String(selectedAppliedRole).toLowerCase());
        }
        return true;
      })
      .filter((t) => {
        if (!Array.isArray(t.requiredSkills) || t.requiredSkills.length === 0) return true;
        return t.requiredSkills.some((s) => !present.has(String(s).toLowerCase()));
      })
      .filter((t) => {
        const title = String(t.title || "").toLowerCase();
        return !presentProjects.some((proj) => title.includes(proj) || proj.includes(title));
      });
    setFilteredTodos(result);
  }, [projectTodos, analysis, selectedAppliedRole]);

  // Replace chart with resume-detected skills in UI

  async function handleUploadResume(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("resume", file);
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Upload failed");
      setResumeFiles((prev) => [
        { name: file.name, uploadedAt: new Date().toISOString(), url: data?.url || "" },
        ...prev,
      ]);
      try {
        const rr = await fetch("/api/resumes", { headers });
        if (rr.ok) {
          const list = await rr.json();
          if (Array.isArray(list)) setResumeFiles(list);
        }
      } catch {}

      // Trigger fresh AI analysis after successful upload
      try {
        await refreshAnalysis(token ? { Authorization: `Bearer ${token}` } : {});
      } catch {}
    } catch (err) {
      setUploadError(err?.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function persistRoles(nextDesired, nextApplied) {
    try {
      await fetch("/api/user/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ desiredRoles: nextDesired, appliedRoles: nextApplied }),
      });
      // Re-run analysis after roles change
      try {
        await refreshAnalysis(token ? { Authorization: `Bearer ${token}` } : {});
      } catch {}
    } catch {}
  }

  async function handleDeleteResume(url) {
    try {
      const filename = String(url || "").split("/uploads/")[1];
      if (!filename) return;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/resumes/${encodeURIComponent(filename)}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Delete failed");
      // Refresh list
      try {
        const rr = await fetch("/api/resumes", { headers });
        if (rr.ok) {
          const list = await rr.json();
          if (Array.isArray(list)) setResumeFiles(list);
        }
      } catch {}
      // Refresh analysis
      await refreshAnalysis(headers);
    } catch (err) {
      // Optionally surface error; keep quiet for now to match current UX
    }
  }

  function addDesiredRole() {
    const role = newRole.trim();
    if (!role) return;
    setDesiredRoles((r) => {
      const next = Array.from(new Set([role, ...r]));
      persistRoles(next, appliedRoles);
      return next;
    });
    setNewRole("");
  }

  function markApplied(role) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const nextApplied = Array.from(new Set([role, ...appliedRoles]));
    setAppliedRoles(nextApplied);
    setSelectedAppliedRole(role);
    // Persist roles first, then refresh analysis (which also refreshes project todos)
    (async () => {
      try {
        await persistRoles(desiredRoles, nextApplied);
        await refreshAnalysis(headers);
      } catch {}
    })();
  }

  function removeDesiredRole(role) {
    setDesiredRoles((roles) => {
      const next = roles.filter((r) => r !== role);
      persistRoles(next, appliedRoles);
      return next;
    });
  }

  function removeAppliedRole(index) {
    setAppliedRoles((roles) => {
      const next = roles.filter((_, i) => i !== index);
      persistRoles(desiredRoles, next);
      return next;
    });
  }

  async function recordActivity(type, detail, progress = 0) {
    try {
      await fetch("/api/user/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ type, detail, progress }),
      });
      try {
        const res = await fetch("/api/profile", { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.activities)) setActivities(data.activities);
        }
      } catch {}
    } catch {}
  }

  function buildAssistantReply(userText) {
    const role = selectedAppliedRole || (Array.isArray(appliedRoles) && appliedRoles[0]) || "(none)";
    const present = Array.isArray(analysis?.presentSkills) ? analysis.presentSkills : [];
    const missing = Array.isArray(analysis?.missingSkills) ? analysis.missingSkills : [];
    const todos = Array.isArray(filteredTodos) ? filteredTodos : [];

    const topTodos = todos.slice(0, 3);
    const todoLines = topTodos.map((t, idx) => {
      const res = Array.isArray(t.resources) && t.resources.length > 0 ? `  - Resource: ${t.resources[0].title || t.resources[0].type} -> ${t.resources[0].url}` : null;
      return [`${idx + 1}. ${t.title}`, res].filter(Boolean).join("\n");
    });

    const plan = missing.slice(0, 5).map((s, i) => `${i + 1}. Study ${s} and practice with a mini-task`).join("\n");

    const reply = [
      `Role: ${role}`,
      present.length ? `Detected skills: ${present.join(", ")}` : `Detected skills: (none)` ,
      missing.length ? `Gaps to focus: ${missing.join(", ")}` : `No critical gaps detected based on your resume.`,
      "",
      "Projects to do next (not covered by your resume):",
      todoLines.length ? todoLines.join("\n") : "No role-specific gaps found. Consider enhancing depth in an existing area.",
      "",
      plan ? `Quick learning plan based on gaps:\n${plan}` : "You're in great shape. Pick a project and start building!",
      "",
      `You asked: ${userText}`,
    ].join("\n");

    return reply;
  }

  async function sendChatToBackend(userText) {
    try {
      setChatTyping(true);
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const body = {
        message: userText,
        appliedRole: selectedAppliedRole || (appliedRoles?.[0] || ""),
        presentSkills: analysis?.presentSkills || [],
        missingSkills: analysis?.missingSkills || [],
        presentProjects: analysis?.presentProjects || [],
        history: (chatMessages || []).slice(-10).map((m) => ({ role: m.role, text: m.text })),
      };
      const resp = await fetch("/api/chat", { method: "POST", headers, body: JSON.stringify(body) });
      let data = null;
      try {
        data = await resp.json();
      } catch {}
      if (!resp.ok) {
        const msg = (data && (data.message || data.error)) || `Chat service error (${resp.status})`;
        setChatMessages((msgs) => [...msgs, { role: "assistant", text: `Sorry, I couldn't process that: ${msg}` }]);
        return;
      }
      const reply = data?.reply || buildAssistantReply(userText);
      setChatMessages((msgs) => [...msgs, { role: "assistant", text: reply }]);
      if (Array.isArray(data?.projects) && data.projects.length > 0) {
        setProjectTodos((prev) => {
          const byTitle = new Map((prev || []).map((p) => [String(p.title).toLowerCase(), p]));
          for (const p of data.projects) {
            const key = String(p.title).toLowerCase();
            if (!byTitle.has(key)) byTitle.set(key, p);
          }
          return Array.from(byTitle.values());
        });
      }
      await refreshAnalysis(headers);
    } catch (e) {
      const fallback = `Sorry, I hit an error: ${e?.message || "Unknown error"}`;
      setChatMessages((msgs) => [...msgs, { role: "assistant", text: fallback }]);
    } finally {
      setChatTyping(false);
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, Arial, sans-serif", backgroundColor: "#f5f7fb" }}>
      {/* Sidebar */}
      <div style={{ width: 260, backgroundColor: "#1f2937", color: "#e5e7eb", padding: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "#374151", margin: "0 auto" }} />
          <h3 style={{ margin: "12px 0 4px" }}>{profile.name}</h3>
          <p style={{ margin: 0, color: "#9ca3af", fontSize: 13 }}>{profile.email}</p>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 24 }}>
        {/* Top summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
          <div style={{ backgroundColor: "#111827", color: "#fff", borderRadius: 12, padding: 16 }}>
            <div style={{ opacity: 0.8, fontSize: 13 }}>Resumes Uploaded</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{resumeFiles.length}</div>
          </div>
          <div style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16 }}>
            <div style={{ opacity: 0.8, fontSize: 13 }}>Desired Roles</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{desiredRoles.length}</div>
          </div>
          <div style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16 }}>
            <div style={{ opacity: 0.8, fontSize: 13 }}>Applied Roles</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{appliedRoles.length}</div>
          </div>
        </div>

        {/* Resume upload and list */}
        <Section
          title="Resumes"
          right={
            <label style={{ cursor: "pointer" }}>
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={handleUploadResume} />
              <span style={{ background: "#2563eb", color: "#fff", padding: "8px 14px", borderRadius: 8 }}>
                {uploading ? "Uploading..." : "Upload Resume"}
              </span>
            </label>
          }
        >
          {uploadError && <div style={{ color: "#b91c1c", marginBottom: 10 }}>{uploadError}</div>}
          {resumeFiles.length === 0 ? (
            <div style={{ color: "#6b7280" }}>No resumes uploaded yet.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {resumeFiles.map((r, idx) => (
              <div key={r._id || idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.name || r.filename || `Resume ${idx + 1}`}</div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>{new Date(r.uploadedAt || Date.now()).toLocaleString()}</div>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {r.url ? (
                      <a href={r.url} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>View</a>
                    ) : null}
                    {r.url ? (
                      <button onClick={() => handleDeleteResume(r.url)} style={{ background: "#b91c1c", color: "#fff", border: 0, borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>Delete</button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Profile + Resume Skills */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
          <Section title="Profile">
            <div style={{ display: "grid", gap: 8 }}>
              <div><strong>Name:</strong> {profile.name}</div>
              <div><strong>Email:</strong> {profile.email}</div>
              <div><strong>Theme:</strong> {profile.theme}</div>
            </div>
          </Section>
          <Section title="Skills Detected from Resume">
            {analysis?.noResume ? (
              <div style={{ color: "#6b7280" }}>Upload a resume to detect your skills.</div>
            ) : Array.isArray(analysis?.presentSkills) && analysis.presentSkills.length > 0 ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {analysis.presentSkills.map((s) => (
                  <span key={s} style={{ background: "#e5f3ff", color: "#1e40af", padding: "6px 10px", borderRadius: 999 }}>{s}</span>
                ))}
              </div>
            ) : (
              <div style={{ color: "#6b7280" }}>No skills detected yet.</div>
            )}
          </Section>
        </div>

        {/* Roles */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
          <Section
            title="Desired Roles"
            right={
              <div style={{ display: "flex", gap: 8 }}>
                <input value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="Add role" style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "6px 10px" }} />
                <button onClick={addDesiredRole} style={{ background: "#111827", color: "#fff", border: 0, borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>Add</button>
              </div>
            }
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {desiredRoles.map((r) => (
                <span key={r} style={{ background: "#eef2ff", color: "#3730a3", padding: "6px 10px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 8 }}>
                  {r}
                  <button onClick={() => { markApplied(r); }} style={{ fontSize: 12, cursor: "pointer", border: 0, background: "#111827", color: "#fff", borderRadius: 8, padding: "4px 8px" }}>Mark Applied</button>
                  <button aria-label="Delete role" title="Delete" onClick={() => removeDesiredRole(r)} style={{ cursor: "pointer", border: 0, background: "transparent", color: "#6b7280", padding: 0 }}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </Section>

          <Section title="Applied Roles">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {appliedRoles.length === 0 ? (
                <div style={{ color: "#6b7280" }}>No applications tracked yet.</div>
              ) : (
                appliedRoles.map((r, i) => (
                  <span key={`${r}-${i}`} style={{ background: "#ecfdf5", color: "#065f46", padding: "6px 10px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 8 }}>
                    {r}
                    <button aria-label="Delete role" title="Delete" onClick={() => removeAppliedRole(i)} style={{ cursor: "pointer", border: 0, background: "transparent", color: "#047857", padding: 0 }}>
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </Section>
        </div>

        {/* AI Skill Gap + Project TODOs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
          <Section title="AI Skill Gap Analysis" right={null}>
            {Array.isArray(analysis?.missingSkills) && analysis.missingSkills.length > 0 ? (
              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ fontWeight: 600 }}>Missing skills for {Array.isArray(analysis?.desiredRoles) && analysis.desiredRoles.length > 0 ? analysis.desiredRoles.join(", ") : "your desired roles"}:</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {analysis.missingSkills.map((s) => (
                    <span key={s} style={{ background: "#fef3c7", color: "#92400e", padding: "6px 10px", borderRadius: 999 }}>{s}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ color: "#6b7280" }}>No missing skills detected for your desired roles.</div>
            )}
          </Section>
          <Section title="Project TODOs">
            {Array.isArray(filteredTodos) && filteredTodos.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {filteredTodos.map((t, i) => (
                  <li key={i}>
                    <div style={{ fontWeight: 600 }}>
                      <a href={t.aiGuideLink || "#"} style={{ color: "#2563eb" }} target="_blank" rel="noreferrer">{t.title}</a>
                    </div>
                    {Array.isArray(t.requiredSkills) && t.requiredSkills.length > 0 && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                        {t.requiredSkills.map((s) => (
                          <span key={s} style={{ background: "#eef2ff", color: "#3730a3", padding: "4px 8px", borderRadius: 999, fontSize: 12 }}>{s}</span>
                        ))}
                      </div>
                    )}
                    {Array.isArray(t.resources) && t.resources.length > 0 && (
                      <ul style={{ margin: "6px 0 0 18px" }}>
                        {t.resources.map((r, ri) => (
                          <li key={ri}>
                            <a href={r.url} target="_blank" rel="noreferrer" style={{ color: "#059669" }}>{r.title || r.type}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ color: "#6b7280" }}>Project ideas will appear here based on your applied roles and resume skills.</div>
            )}
          </Section>
        </div>

        {/* Project Guide (below AI Skill Gap), then Recommendations */}
        <Section title="Project Guide">
          {Array.isArray(projectGuides) && projectGuides.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {projectGuides.map((g, i) => (
                <li key={i}>
                  <div style={{ fontWeight: 600 }}>
                    <a href={g.link || "#"} style={{ color: "#2563eb" }} target="_blank" rel="noreferrer">{g.title}</a>
                  </div>
                  {g.description && (
                    <div style={{ color: "#6b7280", fontSize: 13 }}>{g.description}</div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ color: "#6b7280" }}>Guides will appear here once relevant project TODOs are identified.</div>
          )}
        </Section>

        <Section title="Recommendations">
          {recommendations.length === 0 ? (
            <div style={{ color: "#6b7280" }}>Recommendations will appear here based on your desired roles.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {recommendations.map((rec, i) => (
                <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 }}>
                  <div style={{ fontWeight: 600 }}>{rec.title}</div>
                  <div style={{ color: "#6b7280", fontSize: 13 }}>{rec.summary}</div>
                  {rec.link ? (
                    <a href={rec.link} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>Open</a>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      {/* Chatbot toggle button */}
      <button
        onClick={() => setIsChatOpen((v) => !v)}
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          background: "linear-gradient(135deg, #111827, #1f2937)",
          color: "#fff",
          border: 0,
          borderRadius: 999,
          padding: "14px 18px",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          zIndex: 50,
        }}
        aria-label="Toggle Chatbot"
        title="Chatbot"
      >
        {isChatOpen ? "Close Chat" : "Chat with AI"}
      </button>

      {/* Chatbot panel */}
      {isChatOpen && (
        <div
          style={{
            position: "fixed",
            right: 24,
            bottom: 86,
            width: 460,
            maxHeight: 680,
            display: "flex",
            flexDirection: "column",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
            overflow: "hidden",
            zIndex: 60,
          }}
        >
          <div style={{ padding: 14, background: "linear-gradient(180deg, #111827, #1f2937)", color: "#fff", fontWeight: 600 }}>AI Project Assistant</div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>
            {chatMessages.length === 0 ? (
              <div style={{ color: "#6b7280", fontSize: 13 }}>
                Ask for help scoping a project. Applied role: {selectedAppliedRole || "(none)"}. I'll use your resume analysis to tailor suggestions.
              </div>
            ) : (
              chatMessages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "92%", display: "flex", gap: 8 }}>
                  <div
                    style={{
                      background: m.role === "user" ? "#111827" : "#f3f4f6",
                      color: m.role === "user" ? "#fff" : "#111827",
                      borderRadius: 12,
                      padding: "10px 12px",
                      fontSize: 14,
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.45,
                      boxShadow: m.role === "user" ? "0 4px 12px rgba(17,24,39,0.25)" : "none",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))
            )}
            {chatTyping && (
              <div style={{ alignSelf: "flex-start", opacity: 0.8, fontSize: 12, color: "#6b7280" }}>AI is typing…</div>
            )}
          </div>
          <div style={{ padding: 14, borderTop: "1px solid #e5e7eb", display: "flex", gap: 10, background: "#fafafa" }}>
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about a project..."
              style={{ flex: 1, border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 12px", background: "#fff" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!chatInput.trim()) return;
                  const userText = chatInput.trim();
                  setChatMessages((msgs) => [...msgs, { role: "user", text: userText }]);
                  setChatInput("");
                  // Inline assistant reply via backend
                  sendChatToBackend(userText);
                }
              }}
            />
            <button
              onClick={() => {
                if (!chatInput.trim()) return;
                const userText = chatInput.trim();
                setChatMessages((msgs) => [...msgs, { role: "user", text: userText }]);
                setChatInput("");
                // Try backend; fallback to local reply handled inside
                sendChatToBackend(userText);
              }}
              style={{ background: "#111827", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer", boxShadow: "0 6px 16px rgba(17,24,39,0.3)" }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
