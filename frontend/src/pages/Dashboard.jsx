import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChatBox from "./components/chatBox";
import MarkdownMessage from "./components/MarkdownMessage";

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

// AI Recommendations Component for YouTube Videos
function AIRecommendations({ skill }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/skill-videos?skill=${encodeURIComponent(skill)}`);
        if (response.ok) {
          const data = await response.json();
          setVideos(data.videos || []);
        } else {
          setError("Failed to load video recommendations");
        }
      } catch (err) {
        setError("Error fetching video recommendations");
        console.error("Video recommendations error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [skill]);

  if (loading) return <div style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>🔍 Searching YouTube for {skill} tutorials...</div>;
  if (error) return <div style={{ color: "#dc2626", textAlign: "center", padding: "20px" }}>❌ {error}</div>;

  return (
    <div style={{ padding: "8px 0" }}>
      {videos.length > 0 ? (
        <>
          <h4 style={{ margin: "0 0 16px 0", color: "#1f2937", fontSize: "16px" }}>🎥 Top YouTube Tutorials</h4>
          <div 
            style={{ 
              display: "flex", 
              gap: 16, 
              overflowX: "auto",
              padding: "8px 4px 16px 4px",
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e1 #f1f5f9",
              // Prevent horizontal scrolling from affecting parent
              position: "relative",
              zIndex: 1
            }}
            onWheel={(e) => {
              // Only handle horizontal wheel events, let vertical scroll pass through
              if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.stopPropagation();
              }
            }}
          >
            {videos.map((video, index) => (
              <div 
                key={index} 
                style={{ 
                  flex: "0 0 auto",
                  width: 280,
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  overflow: "hidden",
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                }}
              >
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  style={{ 
                    width: "100%", 
                    height: 160, 
                    objectFit: "cover",
                    borderBottom: "1px solid #e5e7eb"
                  }}
                />
                <div style={{ padding: 12 }}>
                  <a 
                    href={video.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: "#2563eb", 
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: 14,
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                    title={video.title}
                  >
                    {video.title}
                  </a>
                  <div style={{ color: "#6b7280", fontSize: 12, marginTop: 8, fontWeight: 500 }}>
                    {video.channel}
                  </div>
                  <div style={{ color: "#9ca3af", fontSize: 11, marginTop: 4 }}>
                    {new Date(video.publishedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>No video recommendations found for {skill}.</div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [profile, setProfile] = useState({
    name: "Your Name",
    email: "you@example.com",
    skills: [
      { name: "JavaScript", level: 70 },
      { name: "React", level: 65 },
      { name: "Node.js", level: 60 },
      { name: "CSS", level: 55 },
    ],
    resumeDetectedSkills: [],
  });

  const [desiredRoles, setDesiredRoles] = useState([]);
  const [appliedRoles, setAppliedRoles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [roleSkillsMap, setRoleSkillsMap] = useState({});

  const [resumeFiles, setResumeFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [recommendations, setRecommendations] = useState([]);
  const [projectGuides, setProjectGuides] = useState([]);
  const [projectTodos, setProjectTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [analysis, setAnalysis] = useState({ missingSkills: [], presentSkills: [], desiredRoles: [], noResume: false, presentProjects: [] });
  const [selectedAppliedRole, setSelectedAppliedRole] = useState("");

  const fileInputRef = useRef(null);
  const token = useMemo(() => localStorage.getItem("token") || "", []);
  
  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Fallback computation when server analysis is unavailable
  const resumeDetected = Array.isArray(profile?.resumeDetectedSkills) ? profile.resumeDetectedSkills : [];
  const derivedPresent = Array.isArray(requiredSkills)
    ? requiredSkills.filter((s) => resumeDetected.some((d) => String(d).toLowerCase() === String(s).toLowerCase()))
    : [];
  const derivedMissing = Array.isArray(requiredSkills)
    ? requiredSkills.filter((s) => !derivedPresent.some((p) => String(p).toLowerCase() === String(s).toLowerCase()))
    : [];
  const displayPresentSkills = Array.isArray(analysis?.presentSkills) && analysis.presentSkills.length > 0
    ? analysis.presentSkills
    : derivedPresent;
  const displayMissingSkills = Array.isArray(analysis?.missingSkills) && analysis.missingSkills.length > 0
    ? analysis.missingSkills
    : derivedMissing;

  const fetchRequiredSkills = useCallback(async (roles) => {
    if (!Array.isArray(roles) || roles.length === 0) {
      setRequiredSkills([]);
      setRoleSkillsMap({});
      return;
    }

    try {
      const res = await fetch("/api/roles/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roles })
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.requiredSkills)) setRequiredSkills(data.requiredSkills);
        if (data?.roleSkillsMap) setRoleSkillsMap(data.roleSkillsMap);
      }
    } catch (err) {
      console.error("Failed to fetch required skills:", err);
    }
  }, []);

  const refreshAnalysis = useCallback(async (headers) => {
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
        
        // Refresh profile to get updated resume-detected skills
        try {
          const profileRes = await fetch("/api/profile", { headers });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setProfile((prev) => ({ ...prev, ...profileData }));
          }
        } catch {}
        
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
  }, []);

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
            if (Array.isArray(data?.desiredRoles)) {
              setDesiredRoles(data.desiredRoles);
              // Fetch required skills for the loaded desired roles
              if (data.desiredRoles.length > 0) {
                fetchRequiredSkills(data.desiredRoles);
              }
            }
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

        // Initial AI analysis (if a resume exists) - run after profile is loaded
        try {
          await refreshAnalysis(headers);
        } catch {}

        // Fetch available roles
        try {
          const res = await fetch("/api/roles");
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data?.roles)) setAvailableRoles(data.roles);
          }
        } catch {}

      } catch {}
    };
    fetchAll();
  }, [token, fetchRequiredSkills, refreshAnalysis]);

  useEffect(() => {
    // Filter project TODOs
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

      await refreshAnalysis(token ? { Authorization: `Bearer ${token}` } : {});
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
      await refreshAnalysis(token ? { Authorization: `Bearer ${token}` } : {});
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
      await refreshAnalysis(headers);
    } catch {}
  }

  function addDesiredRole() {
    const role = newRole.trim() || selectedRole;
    if (!role) return;
    
    // Don't add if already exists
    if (desiredRoles.includes(role)) {
      setNewRole("");
      setSelectedRole("");
      return;
    }
    
    const nextRoles = Array.from(new Set([role, ...desiredRoles]));
    setDesiredRoles(nextRoles);
    persistRoles(nextRoles, appliedRoles);
    
    // Fetch required skills for the updated role list
    fetchRequiredSkills(nextRoles);
    
    setNewRole("");
    setSelectedRole("");
  }

  function markApplied(role) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const nextApplied = Array.from(new Set([role, ...appliedRoles]));
    setAppliedRoles(nextApplied);
    setSelectedAppliedRole(role);
    (async () => {
      try {
        await persistRoles(desiredRoles, nextApplied);
        await refreshAnalysis(headers);
      } catch {}
    })();
  }

  function removeDesiredRole(role) {
    const nextRoles = desiredRoles.filter((r) => r !== role);
    setDesiredRoles(nextRoles);
    persistRoles(nextRoles, appliedRoles);
    
    // Fetch required skills for the updated role list
    fetchRequiredSkills(nextRoles);
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

  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh", 
      fontFamily: "Inter, Arial, sans-serif", 
      backgroundColor: "#f5f7fb",
      // Prevent horizontal scroll on the entire page
      overflowX: "hidden"
    }}>
      {/* Sidebar - Fixed */}
      <div style={{ 
        width: 260, 
        backgroundColor: "#1f2937", 
        color: "#e5e7eb", 
        padding: 20, 
        position: "fixed",
        height: "100vh",
        left: 0,
        top: 0,
        overflowY: "auto"
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "#374151", margin: "0 auto" }} />
          <h3 style={{ margin: "12px 0 4px" }}>{profile.name}</h3>
          <p style={{ margin: 0, color: "#9ca3af", fontSize: 13 }}>{profile.email}</p>
          
          {/* Logout Button */}
          <div style={{ marginTop: 16 }}>
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "10px 16px",
                backgroundColor: "#374151",
                color: "#e5e7eb",
                border: "1px solid #4b5563",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
                transition: "background-color 0.2s ease"
              }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = "#4b5563"; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = "#374151"; }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div style={{ 
        flex: 1, 
        padding: 24,
        marginLeft: 300,
        overflowY: "auto",
        overflowX: "hidden", // Prevent horizontal scroll on main content
        minHeight: "100vh",
        // Ensure content doesn't exceed viewport width
        maxWidth: "calc(100vw - 260px)",
        boxSizing: "border-box"
      }}>
        {/* Top summary */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: 16, 
          marginBottom: 20,
          // Ensure grid doesn't cause horizontal overflow
          width: "100%",
          boxSizing: "border-box"
        }}>
          <div style={{ backgroundColor: "#111827", color: "#fff", borderRadius: 12, padding: 16 }}>
            <div style={{ opacity: 0.8, fontSize: 13 }}>Resumes Uploaded</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{resumeFiles.length}</div>
          </div>
          <div style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16 }}>
            <div style={{ opacity: 0.8, fontSize: 13 }}>Desired Roles</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{desiredRoles.length}</div>
          </div>
          <div style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16 }}>
            <div style={{ opacity: 0.8, fontSize: 13 }}>Working On Roles</div>
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
          <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 8 }}>
            Once uploaded from any device, your resume is saved securely and can be viewed anytime from any device after login.
          </div>
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
            </div>
          </Section>
          <Section title="Skills Detected from Resume">
            {Array.isArray(profile?.resumeDetectedSkills) && profile.resumeDetectedSkills.length > 0 ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {profile.resumeDetectedSkills.map((s) => (
                  <span key={s} style={{ background: "#e5f3ff", color: "#1e40af", padding: "6px 10px", borderRadius: 999 }}>{s}</span>
                ))}
              </div>
            ) : (
              <div style={{ color: "#6b7280" }}>Upload a resume to detect your skills.</div>
            )}
          </Section>
        </div>

        {/* Roles */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
          <Section
            title="Desired Roles"
            right={
              <div style={{ display: "flex", gap: 8, flexDirection: "column", alignItems: "flex-end" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <select 
                    value={selectedRole} 
                    onChange={(e) => setSelectedRole(e.target.value)}
                    style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "6px 10px", minWidth: 200 }}
                  >
                    <option value="">Select a role...</option>
                    {availableRoles
                      .filter(role => !desiredRoles.includes(role))
                      .map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                  </select>
                  <button 
                    onClick={addDesiredRole} 
                    disabled={!selectedRole && !newRole.trim()}
                    style={{ 
                      background: (!selectedRole && !newRole.trim()) ? "#9ca3af" : "#111827", 
                      color: "#fff", 
                      border: 0, 
                      borderRadius: 8, 
                      padding: "6px 12px", 
                      cursor: (!selectedRole && !newRole.trim()) ? "not-allowed" : "pointer" 
                    }}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Or add custom:</span>
                  <input 
                    value={newRole} 
                    onChange={(e) => setNewRole(e.target.value)} 
                    placeholder="Custom role" 
                    style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "6px 10px", width: 120 }} 
                    onKeyDown={(e) => e.key === "Enter" && addDesiredRole()}
                  />
                </div>
              </div>
            }
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {desiredRoles.map((r) => (
                <span key={r} style={{ background: "#eef2ff", color: "#3730a3", padding: "6px 10px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 8 }}>
                  {r}
                  <button onClick={() => { markApplied(r); }} style={{ fontSize: 12, cursor: "pointer", border: 0, background: "#111827", color: "#fff", borderRadius: 8, padding: "4px 8px" }}>select</button>
                  <button aria-label="Delete role" title="Delete" onClick={() => removeDesiredRole(r)} style={{ cursor: "pointer", border: 0, background: "transparent", color: "#6b7280", padding: 0 }}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </Section>

          <Section title="Roles Currently Working On">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {appliedRoles.length === 0 ? (
                <div style={{ color: "#6b7280" }}>No Roles are being worked on yet</div>
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
            {requiredSkills.length === 0 ? (
              <div style={{ color: "#6b7280" }}>Add one or more desired roles to see required skills.</div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {/* Required Skills */}
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>
                    Required skills for {desiredRoles.join(", ")}:
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {requiredSkills.map((s) => (
                      <span key={s} style={{ 
                        background: "#e5f3ff", 
                        color: "#1e40af", 
                        padding: "6px 10px", 
                        borderRadius: 999 
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills (when resume is uploaded) */}
                {Array.isArray(displayMissingSkills) && displayMissingSkills.length > 0 && (
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 8, color: "#dc2626" }}>
                      Missing skills (not found in resume):
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {displayMissingSkills.map((s) => (
                        <span key={s} style={{ 
                          background: "#fef3c7", 
                          color: "#92400e", 
                          padding: "6px 10px", 
                          borderRadius: 999 
                        }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Present Skills (when resume is uploaded) */}
                {Array.isArray(displayPresentSkills) && displayPresentSkills.length > 0 && (
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 8, color: "#059669" }}>
                      Skills found in resume:
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {displayPresentSkills.map((s) => (
                        <span key={s} style={{ 
                          background: "#dcfce7", 
                          color: "#166534", 
                          padding: "6px 10px", 
                          borderRadius: 999 
                        }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {analysis?.noResume && (
                  <div style={{ color: "#6b7280", fontSize: 14, fontStyle: "italic" }}>
                    Upload a resume to see which skills you already have and which ones you need to learn.
                  </div>
                )}
              </div>
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
          
        {/* Project Guide */}
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

        {/* AI Recommendations Section */}
        <Section title="🎯 Recommended Learning Videos">
          {displayMissingSkills.length === 0 ? (
            <div style={{ color: "#6b7280", textAlign: "center", padding: "40px 20px" }}>
              {analysis?.noResume 
                ? "Upload a resume to see which skills you need to learn and get video recommendations." 
                : "No missing skills found. Add desired roles and upload resume to get video recommendations."}
            </div>
          ) : (
            <div style={{ display: "grid", gap: 32 }}>
              {displayMissingSkills.map((skill) => (
                <div key={skill} style={{ 
                  border: "1px solid #e5e7eb", 
                  borderRadius: 16, 
                  padding: 24, 
                  backgroundColor: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  // Prevent this container from causing horizontal scroll
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    fontWeight: 700, 
                    marginBottom: 20, 
                    color: "#1f2937", 
                    fontSize: 20,
                    paddingBottom: 12,
                    borderBottom: "2px solid #e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    <span style={{ 
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
                      width: 32, 
                      height: 32, 
                      borderRadius: "50%", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      color: "white",
                      fontSize: 16
                    }}>🎯</span>
                    {skill}
                  </div>
                  <AIRecommendations skill={skill} />
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Recommendations */}
        <Section title="General Recommendations">
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

      {/* Floating Chat Bubble */}
      <FloatingChatBubble />
    </div>
  );
}

// Floating Chat Bubble Component
function FloatingChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI career coach. I can help you with resume analysis, skill gaps, project recommendations, and career guidance. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const [chatSize, setChatSize] = useState({ width: 350, height: 500 });
  const isResizingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0, width: 350, height: 500 });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    function onMouseMove(e) {
      if (!isResizingRef.current) return;
      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;
      const minW = 300;
      const minH = 300;
      const maxW = Math.min(window.innerWidth - 40, 900);
      const maxH = Math.min(window.innerHeight - 140, 900);
      const nextW = Math.max(minW, Math.min(maxW, startPosRef.current.width + dx));
      const nextH = Math.max(minH, Math.min(maxH, startPosRef.current.height + dy));
      setChatSize({ width: Math.round(nextW), height: Math.round(nextH) });
    }
    function onMouseUp() {
      isResizingRef.current = false;
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      const { sendChatMessage } = await import("../aiServices/chatService");
      const reply = await sendChatMessage(updated);
      setMessages([...updated, reply]);
    } catch (err) {
      console.error("Chat failed:", err);
      setError(err.response?.data?.error || err.message);
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
    <>
      {/* Chat Bubble Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          zIndex: 1000,
          transition: "all 0.3s ease",
          transform: isOpen ? "scale(0.9)" : "scale(1)",
        }}
      >
        {isOpen ? (
          <span style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>×</span>
        ) : (
          <span style={{ color: "white", fontSize: 24 }}>💬</span>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: chatSize.width,
            height: chatSize.height,
            backgroundColor: "white",
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            zIndex: 1001,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
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
            flex: 1,
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
              placeholder="Ask me about your career..."
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

          {/* Resize Handle */}
          <div
            onMouseDown={(e) => {
              isResizingRef.current = true;
              startPosRef.current = { x: e.clientX, y: e.clientY, width: chatSize.width, height: chatSize.height };
            }}
            style={{
              position: "absolute",
              right: 4,
              bottom: 4,
              width: 16,
              height: 16,
              cursor: "nwse-resize",
              background: "linear-gradient(135deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.0) 60%)",
              borderRadius: 4,
              userSelect: "none"
            }}
            title="Resize"
          />
        </div>
      )}
    </>
  );
}