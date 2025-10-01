import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  const [analysis, setAnalysis] = useState({ missingSkills: [], presentSkills: [], desiredRoles: [] });

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
          noResume: Boolean(data?.noResume)
        });
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

        // Initial AI analysis (if a resume exists)
        try {
          await refreshAnalysis(headers);
        } catch {}
      } catch {}
    };
    fetchAll();
  }, [token]);

  const skillChartData = useMemo(() => ({
    labels: profile.skills.map((s) => s.name),
    datasets: [
      {
        label: "Skill Level (%)",
        data: profile.skills.map((s) => s.level),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  }), [profile.skills]);

  const skillChartOptions = useMemo(() => ({
    responsive: true,
    plugins: { legend: { display: false }, title: { display: true, text: "Skills Overview" } },
    scales: { y: { beginAtZero: true, max: 100 } },
  }), []);

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
    setAppliedRoles((a) => {
      const next = Array.from(new Set([role, ...a]));
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

        {/* Profile + Skills */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
          <Section title="Profile">
            <div style={{ display: "grid", gap: 8 }}>
              <div><strong>Name:</strong> {profile.name}</div>
              <div><strong>Email:</strong> {profile.email}</div>
              <div><strong>Theme:</strong> {profile.theme}</div>
            </div>
          </Section>
          <Section title="Skills">
            <Bar data={skillChartData} options={skillChartOptions} />
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
                <span key={r} style={{ background: "#eef2ff", color: "#3730a3", padding: "6px 10px", borderRadius: 999 }}>
                  {r}
                  <button onClick={() => { markApplied(r); recordActivity("role_applied", `Applied for ${r}`); }} style={{ marginLeft: 10, fontSize: 12, cursor: "pointer", border: 0, background: "#111827", color: "#fff", borderRadius: 8, padding: "4px 8px" }}>Mark Applied</button>
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
                  <span key={`${r}-${i}`} style={{ background: "#ecfdf5", color: "#065f46", padding: "6px 10px", borderRadius: 999 }}>{r}</span>
                ))
              )}
            </div>
          </Section>
        </div>

        {/* Guides & Recommendations */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
          <Section title="AI Skill Gap Analysis"
            right={null}
          >
            {analysis.missingSkills.length === 0 ? (
              <div style={{ color: "#6b7280" }}>No missing skills detected for your desired roles.</div>
            ) : (
              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ fontWeight: 600 }}>Missing skills for {analysis.desiredRoles.join(", ") || "your desired roles"}:</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {analysis.missingSkills.map((s) => (
                    <span key={s} style={{ background: "#fef3c7", color: "#92400e", padding: "6px 10px", borderRadius: 999 }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </Section>
          <Section title="Project Guide">
            {projectGuides.length === 0 ? (
              <div style={{ color: "#6b7280" }}>Guides will appear here based on your skills and resumes.</div>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {projectGuides.map((g, i) => (
                  <li key={i}>
                    <div style={{ fontWeight: 600 }}>{g.title}</div>
                    <div style={{ color: "#6b7280", fontSize: 13 }}>{g.description}</div>
                  </li>
                ))}
              </ul>
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

        {/* Activities */}
        <Section title="Recent Activity">
          {activities.length === 0 ? (
            <div style={{ color: "#6b7280" }}>No activity yet.</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {activities.slice().reverse().slice(0, 10).map((a, i) => (
                <li key={i}>
                  <div style={{ fontWeight: 600 }}>{a.type}</div>
                  <div style={{ color: "#6b7280", fontSize: 13 }}>{a.detail}</div>
                  {typeof a.progress === "number" && (
                    <div style={{ fontSize: 12 }}>Progress: {a.progress}%</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}
