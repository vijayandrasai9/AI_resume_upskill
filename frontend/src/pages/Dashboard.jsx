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
              position: "relative",
              zIndex: 1
            }}
            onWheel={(e) => {
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
  const [generatingProjects, setGeneratingProjects] = useState({});
  const [projectGenerationStatus, setProjectGenerationStatus] = useState("");

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

  // IMPROVED: Generate AI-powered project recommendations for ANY role
  const generateProjectRecommendations = useCallback(async (role, skills) => {
    if (!role) return;
    
    setGeneratingProjects(prev => ({ ...prev, [role]: true }));
    setProjectGenerationStatus(`🔄 AI is analyzing the ${role} role and generating personalized project ideas...`);
    
    try {
      const response = await fetch("/api/generate-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          role,
          requiredSkills: skills,
          existingSkills: displayPresentSkills,
          missingSkills: displayMissingSkills
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          // Add new projects to the existing list
          setProjectTodos(prev => {
            const existingTitles = new Set(prev.map(p => p.title));
            const newProjects = data.projects.filter(p => !existingTitles.has(p.title));
            return [...prev, ...newProjects];
          });
          
          setProjectGenerationStatus(`✅ AI generated ${data.projects.length} project ideas for ${role}`);
          
          // Record activity
          await recordActivity("project_generated", `AI generated ${data.projects.length} project ideas for ${role} role`);
        } else {
          setProjectGenerationStatus(`❌ No projects generated for ${role}. Using fallback projects.`);
          // Add fallback projects if AI returns empty
          const fallbackProjects = getFallbackProjects(role, skills);
          setProjectTodos(prev => [...prev, ...fallbackProjects]);
        }
      } else {
        throw new Error("API response not OK");
      }
    } catch (error) {
      console.error("Failed to generate project recommendations:", error);
      setProjectGenerationStatus(`❌ AI generation failed for ${role}. Using fallback projects.`);
      
      // Add fallback projects on error
      const fallbackProjects = getFallbackProjects(role, skills);
      setProjectTodos(prev => [...prev, ...fallbackProjects]);
    } finally {
      setGeneratingProjects(prev => ({ ...prev, [role]: false }));
      // Clear status after 5 seconds
      setTimeout(() => setProjectGenerationStatus(""), 5000);
    }
  }, [token, displayPresentSkills, displayMissingSkills]);

  // Fallback project generator for when AI fails
  const getFallbackProjects = (role, skills) => {
    const roleLower = role.toLowerCase();
    
    // Categorize role and generate appropriate projects
    let projectTemplates = [];
    
    if (roleLower.includes('frontend') || roleLower.includes('web') || roleLower.includes('ui')) {
      projectTemplates = [
        {
          title: `Responsive ${role} Portfolio`,
          description: `Build a modern, responsive portfolio website showcasing ${role} skills with interactive elements`,
          requiredSkills: skills.length > 0 ? skills : ["HTML", "CSS", "JavaScript", "Responsive Design"],
          resources: [
            {
              title: "Modern CSS Guide",
              url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
              type: "documentation"
            }
          ],
          role: role,
          difficulty: "intermediate",
          aiGuideLink: `/api/project-guide?title=Responsive Portfolio&role=${encodeURIComponent(role)}`
        }
      ];
    } else if (roleLower.includes('backend') || roleLower.includes('api') || roleLower.includes('server')) {
      projectTemplates = [
        {
          title: `${role} API Service`,
          description: `Develop a robust backend service with RESTful APIs, database integration, and authentication`,
          requiredSkills: skills.length > 0 ? skills : ["API Design", "Database", "Authentication", "Security"],
          resources: [
            {
              title: "REST API Best Practices",
              url: "https://restfulapi.net/",
              type: "documentation"
            }
          ],
          role: role,
          difficulty: "intermediate",
          aiGuideLink: `/api/project-guide?title=API Service&role=${encodeURIComponent(role)}`
        }
      ];
    } else if (roleLower.includes('data') || roleLower.includes('analyst') || roleLower.includes('scientist')) {
      projectTemplates = [
        {
          title: `${role} Data Analysis Project`,
          description: `Analyze real-world datasets to extract insights and create meaningful visualizations`,
          requiredSkills: skills.length > 0 ? skills : ["Data Analysis", "Visualization", "Statistics", "Python/R"],
          resources: [
            {
              title: "Data Science Projects",
              url: "https://www.kaggle.com/",
              type: "platform"
            }
          ],
          role: role,
          difficulty: "intermediate",
          aiGuideLink: `/api/project-guide?title=Data Analysis&role=${encodeURIComponent(role)}`
        }
      ];
    } else if (roleLower.includes('mobile') || roleLower.includes('android') || roleLower.includes('ios')) {
      projectTemplates = [
        {
          title: `Cross-Platform ${role} App`,
          description: `Create a mobile application that works across multiple platforms with native-like performance`,
          requiredSkills: skills.length > 0 ? skills : ["Mobile Development", "UI/UX", "API Integration", "Performance"],
          resources: [
            {
              title: "Mobile Development Guide",
              url: "https://developer.android.com/",
              type: "documentation"
            }
          ],
          role: role,
          difficulty: "intermediate",
          aiGuideLink: `/api/project-guide?title=Mobile App&role=${encodeURIComponent(role)}`
        }
      ];
    } else if (roleLower.includes('devops') || roleLower.includes('cloud') || roleLower.includes('sre')) {
      projectTemplates = [
        {
          title: `${role} Infrastructure Project`,
          description: `Build and automate cloud infrastructure with CI/CD pipelines and monitoring`,
          requiredSkills: skills.length > 0 ? skills : ["Cloud Platforms", "Automation", "CI/CD", "Monitoring"],
          resources: [
            {
              title: "DevOps Resources",
              url: "https://aws.amazon.com/devops/",
              type: "documentation"
            }
          ],
          role: role,
          difficulty: "advanced",
          aiGuideLink: `/api/project-guide?title=Infrastructure&role=${encodeURIComponent(role)}`
        }
      ];
    } else {
      // Generic fallback for any role
      projectTemplates = [
        {
          title: `Portfolio ${role} Project`,
          description: `Build a comprehensive project to demonstrate ${role} skills and create a professional portfolio piece`,
          requiredSkills: skills.length > 0 ? skills : ["Core Skills", "Problem Solving", "Documentation"],
          resources: [
            {
              title: "Project Planning Guide",
              url: "https://example.com/project-planning",
              type: "tutorial"
            }
          ],
          role: role,
          difficulty: "intermediate",
          aiGuideLink: `/api/project-guide?title=Portfolio Project&role=${encodeURIComponent(role)}`
        },
        {
          title: `Real-world ${role} Challenge`,
          description: `Solve a practical problem that mimics real industry challenges for ${role} positions`,
          requiredSkills: skills.length > 0 ? skills : ["Analytical Thinking", "Technical Implementation", "Testing"],
          resources: [
            {
              title: "Industry Best Practices",
              url: "https://example.com/best-practices",
              type: "documentation"
            }
          ],
          role: role,
          difficulty: "advanced",
          aiGuideLink: `/api/project-guide?title=Real-world Challenge&role=${encodeURIComponent(role)}`
        }
      ];
    }
    
    return projectTemplates;
  };

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
// Auto-generate projects when a role is selected in dropdown
useEffect(() => {
  // SIMPLIFIED Filtering - Show projects based on role only, not skills
  const presentProjects = (analysis?.presentProjects || []).map((p) => String(p).toLowerCase());
  
  const result = (projectTodos || [])
    .filter((t) => {
      if (selectedAppliedRole) {
        const tr = String(t.role || "").toLowerCase();
        const selectedRoleLower = String(selectedAppliedRole).toLowerCase();
        return tr.includes(selectedRoleLower) || 
               selectedRoleLower.includes(tr) ||
               tr === selectedRoleLower;
      }
      return true;
    })
    .filter((t) => {
      // Only filter out projects that exactly match existing project titles
      const title = String(t.title || "").toLowerCase();
      return !presentProjects.some((proj) => title.includes(proj) || proj.includes(title));
    });
  
  setFilteredTodos(result);
}, [projectTodos, analysis, selectedAppliedRole]);

useEffect(() => {
  if (selectedAppliedRole && appliedRoles.includes(selectedAppliedRole)) {
    // Check if we already have projects for this role
    const hasProjectsForRole = projectTodos && projectTodos.some(project => 
      project.role && String(project.role).toLowerCase() === selectedAppliedRole.toLowerCase()
    );
    
    // If no projects exist for this role, generate them automatically
    if (!hasProjectsForRole && !generatingProjects[selectedAppliedRole]) {
      console.log(`🚀 Auto-generating projects for: ${selectedAppliedRole}`);
      const roleSkills = roleSkillsMap[selectedAppliedRole] || requiredSkills;
      generateProjectRecommendations(selectedAppliedRole, roleSkills);
    }
  }
}, [selectedAppliedRole, appliedRoles, projectTodos, generatingProjects, roleSkillsMap, requiredSkills, generateProjectRecommendations]);

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

  // IMPROVED: Function to mark role as applied and generate AI projects for ANY role
  function markApplied(role) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const nextApplied = Array.from(new Set([role, ...appliedRoles]));
    setAppliedRoles(nextApplied);
    setSelectedAppliedRole(role);
    
    // Generate AI-powered project recommendations for this role
    const roleSkills = roleSkillsMap[role] || requiredSkills;
    generateProjectRecommendations(role, roleSkills);

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
        overflowX: "hidden",
        minHeight: "100vh",
        maxWidth: "calc(100vw - 260px)",
        boxSizing: "border-box"
      }}>
        {/* Top summary */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: 16, 
          marginBottom: 20,
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
                  <button 
                    onClick={() => { markApplied(r); }} 
                    disabled={generatingProjects[r]}
                    style={{ 
                      fontSize: 12, 
                      cursor: generatingProjects[r] ? "not-allowed" : "pointer", 
                      border: 0, 
                      background: generatingProjects[r] ? "#9ca3af" : "#111827", 
                      color: "#fff", 
                      borderRadius: 8, 
                      padding: "4px 8px" 
                    }}
                  >
                    {generatingProjects[r] ? "..." : "select"}
                  </button>
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
                    {generatingProjects[r] && (
                      <span style={{ fontSize: 12, color: "#059669" }}>🔄 Generating projects...</span>
                    )}
                    <button aria-label="Delete role" title="Delete" onClick={() => removeAppliedRole(i)} style={{ cursor: "pointer", border: 0, background: "transparent", color: "#047857", padding: 0 }}>
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </Section>
        </div>

        {/* Project Generation Status */}
        {projectGenerationStatus && (
          <div style={{ 
            margin: "16px 0", 
            padding: "12px 16px", 
            borderRadius: 8, 
            backgroundColor: projectGenerationStatus.includes("✅") ? "#dcfce7" : 
                           projectGenerationStatus.includes("❌") ? "#fef2f2" : "#f0f9ff",
            color: projectGenerationStatus.includes("✅") ? "#166534" : 
                  projectGenerationStatus.includes("❌") ? "#dc2626" : "#1e40af",
            border: `1px solid ${
              projectGenerationStatus.includes("✅") ? "#bbf7d0" : 
              projectGenerationStatus.includes("❌") ? "#fecaca" : "#bfdbfe"
            }`,
            fontSize: 14,
            fontWeight: 500
          }}>
            {projectGenerationStatus}
          </div>
        )}

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
            {/* Role Filter Dropdown */}
            {appliedRoles.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <select 
                  value={selectedAppliedRole} 
                  onChange={(e) => setSelectedAppliedRole(e.target.value)}
                  style={{ 
                    border: "1px solid #d1d5db", 
                    borderRadius: 8, 
                    padding: "6px 10px",
                    backgroundColor: "white",
                    fontSize: 14
                  }}
                >
                  <option value="">All Applied Roles</option>
                  {appliedRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            )}

            {Array.isArray(filteredTodos) && filteredTodos.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                {filteredTodos.map((t, i) => (
                  <li key={i} style={{ marginBottom: 16, padding: 16, border: "1px solid #e5e7eb", borderRadius: 12, backgroundColor: "#fafafa" }}>
                    <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 16 }}>
                      <button
                        onClick={async () => {
                          try {
                            // Generate detailed project guide using Gemini AI
                            const response = await fetch(`/api/project-guide?title=${encodeURIComponent(t.title)}&role=${encodeURIComponent(t.role)}`, {
                              headers: {
                                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                              },
                            });
                            
                            if (response.ok) {
                              const guideData = await response.json();
                              
                              // Create a modal or new window with the guide
                              const guideWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
                              guideWindow.document.write(`
                                <!DOCTYPE html>
                                <html>
                                <head>
                                  <title>${t.title} - Project Guide</title>
                                  <style>
                                    body { 
                                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                                      margin: 0; 
                                      padding: 20px; 
                                      background: #f5f7fb;
                                      color: #1f2937;
                                    }
                                    .container { 
                                      max-width: 800px; 
                                      margin: 0 auto; 
                                      background: white;
                                      padding: 30px;
                                      border-radius: 12px;
                                      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                                    }
                                    h1 { color: #1f2937; margin-bottom: 8px; }
                                    h2 { color: #374151; margin-top: 24px; margin-bottom: 12px; }
                                    h3 { color: #4b5563; margin-top: 20px; }
                                    .role { color: #059669; font-weight: 600; margin-bottom: 20px; }
                                    .overview { 
                                      background: #f0f9ff; 
                                      padding: 16px; 
                                      border-radius: 8px; 
                                      margin: 16px 0; 
                                      border-left: 4px solid #2563eb;
                                    }
                                    .steps { margin: 20px 0; }
                                    .step { 
                                      background: white; 
                                      margin: 12px 0; 
                                      padding: 16px; 
                                      border-radius: 8px;
                                      border: 1px solid #e5e7eb;
                                    }
                                    .step-title { 
                                      font-weight: 600; 
                                      color: #1f2937; 
                                      margin-bottom: 8px;
                                      display: flex;
                                      align-items: center;
                                      gap: 8px;
                                    }
                                    .step-title:before {
                                      content: "📋";
                                      font-size: 16px;
                                    }
                                    .technologies, .best-practices {
                                      background: #f8fafc;
                                      padding: 12px;
                                      border-radius: 6px;
                                      margin: 12px 0;
                                    }
                                    .resources { margin: 16px 0; }
                                    .resource-item { 
                                      margin: 8px 0; 
                                      padding: 8px 12px;
                                      background: #ecfdf5;
                                      border-radius: 6px;
                                      border-left: 3px solid #059669;
                                    }
                                    .resource-item a { 
                                      color: #059669; 
                                      text-decoration: none;
                                      font-weight: 500;
                                    }
                                    .resource-item a:hover { text-decoration: underline; }
                                    .loading { 
                                      text-align: center; 
                                      padding: 40px; 
                                      color: #6b7280; 
                                    }
                                    .ai-note {
                                      background: #fef3c7;
                                      padding: 12px;
                                      border-radius: 6px;
                                      margin: 16px 0;
                                      border-left: 3px solid #d97706;
                                      font-size: 14px;
                                    }
                                  </style>
                                </head>
                                <body>
                                  <div class="container">
                                    <h1>${guideData.title || t.title}</h1>
                                    <div class="role">🎯 Target Role: ${guideData.role || t.role}</div>
                                    
                                    ${guideData.note ? `<div class="ai-note">${guideData.note}</div>` : ''}
                                    
                                    ${guideData.overview ? `
                                      <div class="overview">
                                        <h2>📖 Project Overview</h2>
                                        <p>${guideData.overview}</p>
                                      </div>
                                    ` : ''}
                                    
                                    ${guideData.steps && guideData.steps.length > 0 ? `
                                      <div class="steps">
                                        <h2>🚀 Step-by-Step Implementation</h2>
                                        ${guideData.steps.map((step, index) => `
                                          <div class="step">
                                            <div class="step-title">${step.phase || `Phase ${index + 1}`}</div>
                                            ${step.estimatedTime ? `<div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">⏱️ Estimated: ${step.estimatedTime}</div>` : ''}
                                            <ul>
                                              ${(step.tasks || []).map(task => `<li>${task}</li>`).join('')}
                                            </ul>
                                          </div>
                                        `).join('')}
                                      </div>
                                    ` : `
                                      <div class="steps">
                                        <h2>🚀 Implementation Steps</h2>
                                        <div class="step">
                                          <div class="step-title">Phase 1: Planning & Setup</div>
                                          <ul>
                                            <li>Define project requirements and scope</li>
                                            <li>Set up development environment</li>
                                            <li>Create project structure and initialize version control</li>
                                          </ul>
                                        </div>
                                        <div class="step">
                                          <div class="step-title">Phase 2: Core Development</div>
                                          <ul>
                                            <li>Implement main features and functionality</li>
                                            <li>Write clean, maintainable code</li>
                                            <li>Add error handling and validation</li>
                                          </ul>
                                        </div>
                                        <div class="step">
                                          <div class="step-title">Phase 3: Testing & Refinement</div>
                                          <ul>
                                            <li>Test all functionality thoroughly</li>
                                            <li>Fix bugs and optimize performance</li>
                                            <li>Get feedback and make improvements</li>
                                          </ul>
                                        </div>
                                        <div class="step">
                                          <div class="step-title">Phase 4: Deployment & Documentation</div>
                                          <ul>
                                            <li>Deploy to production environment</li>
                                            <li>Write comprehensive documentation</li>
                                            <li>Update your portfolio with the completed project</li>
                                          </ul>
                                        </div>
                                      </div>
                                    `}
                                    
                                    ${guideData.technologies && guideData.technologies.length > 0 ? `
                                      <div class="technologies">
                                        <h2>🛠️ Technologies & Tools</h2>
                                        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                                          ${guideData.technologies.map(tech => `
                                            <span style="background: #e0e7ff; color: #3730a3; padding: 4px 8px; border-radius: 999px; font-size: 12px;">
                                              ${tech}
                                            </span>
                                          `).join('')}
                                        </div>
                                      </div>
                                    ` : t.requiredSkills && t.requiredSkills.length > 0 ? `
                                      <div class="technologies">
                                        <h2>🛠️ Required Skills & Technologies</h2>
                                        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                                          ${t.requiredSkills.map(skill => `
                                            <span style="background: #e0e7ff; color: #3730a3; padding: 4px 8px; border-radius: 999px; font-size: 12px;">
                                              ${skill}
                                            </span>
                                          `).join('')}
                                        </div>
                                      </div>
                                    ` : ''}
                                    
                                    ${guideData.bestPractices && guideData.bestPractices.length > 0 ? `
                                      <div class="best-practices">
                                        <h2>✅ Best Practices</h2>
                                        <ul>
                                          ${guideData.bestPractices.map(practice => `<li>${practice}</li>`).join('')}
                                        </ul>
                                      </div>
                                    ` : ''}
                                    
                                    <div class="resources">
                                      <h2>📚 Learning Resources</h2>
                                      ${(guideData.resources && guideData.resources.length > 0 ? guideData.resources : t.resources || []).map(resource => `
                                        <div class="resource-item">
                                          <a href="${resource.url}" target="_blank" rel="noopener noreferrer">
                                            ${resource.title || resource.type} - ${resource.type || 'Resource'}
                                          </a>
                                        </div>
                                      `).join('')}
                                      ${(!guideData.resources || guideData.resources.length === 0) && (!t.resources || t.resources.length === 0) ? `
                                        <div class="resource-item">
                                          <a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">
                                            MDN Web Docs - Documentation
                                          </a>
                                        </div>
                                        <div class="resource-item">
                                          <a href="https://stackoverflow.com" target="_blank" rel="noopener noreferrer">
                                            Stack Overflow - Community Help
                                          </a>
                                        </div>
                                      ` : ''}
                                    </div>
                                    
                                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
                                      <p>🚀 <strong>Pro Tip:</strong> Break down this project into smaller tasks and tackle them one at a time. Don't forget to document your progress!</p>
                                    </div>
                                  </div>
                                </body>
                                </html>
                              `);
                            }
                          } catch (error) {
                            console.error('Error loading project guide:', error);
                            // Fallback: open simple guide
                            window.open(`/api/project-guide?title=${encodeURIComponent(t.title)}&role=${encodeURIComponent(t.role)}`, '_blank');
                          }
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#2563eb",
                          textDecoration: "none",
                          cursor: "pointer",
                          fontSize: "16px",
                          fontWeight: 600,
                          textAlign: "left",
                          padding: 0,
                          fontFamily: "inherit"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.textDecoration = "underline";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.textDecoration = "none";
                        }}
                      >
                        {t.title} 🔗
                      </button>
                    </div>
                    
                    {t.description && (
                      <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 12, lineHeight: 1.5 }}>
                        {t.description}
                      </div>
                    )}
                    
                    {t.role && (
                      <div style={{ fontSize: 13, color: "#059669", marginBottom: 12, fontWeight: 500 }}>
                        <strong>🎯 Role:</strong> {t.role}
                      </div>
                    )}
                    
                    {Array.isArray(t.requiredSkills) && t.requiredSkills.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6, fontWeight: 500 }}>
                          🛠️ Skills needed:
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {t.requiredSkills.map((s) => (
                            <span key={s} style={{ 
                              background: "#eef2ff", 
                              color: "#3730a3", 
                              padding: "4px 8px", 
                              borderRadius: 999, 
                              fontSize: 12,
                              fontWeight: 500
                            }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {Array.isArray(t.resources) && t.resources.length > 0 && (
                      <div>
                        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6, fontWeight: 500 }}>
                          📚 Quick resources:
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {t.resources.slice(0, 2).map((r, ri) => (
                            <a 
                              key={ri} 
                              href={r.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              style={{ 
                                color: "#059669", 
                                fontSize: 12,
                                textDecoration: "none",
                                padding: "4px 8px",
                                borderRadius: 4,
                                backgroundColor: "#f0fdf4",
                                border: "1px solid #dcfce7"
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#dcfce7";
                                e.target.style.textDecoration = "underline";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#f0fdf4";
                                e.target.style.textDecoration = "none";
                              }}
                            >
                              📖 {r.title || r.type}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
           ) : (
            <div style={{ color: "#6b7280", textAlign: "center", padding: "40px 20px" }}>
              {appliedRoles.length === 0 ? (
                "🎯 Select roles to work on to get AI-powered project recommendations."
              ) : Object.values(generatingProjects).some(status => status) ? (
                <div>
                  <div style={{ fontSize: 16, marginBottom: 8 }}>🔄 AI is generating personalized project ideas...</div>
                  <div style={{ fontSize: 12 }}>This may take a few seconds</div>
                </div>
              ) : selectedAppliedRole ? (
                <div>
                  <div style={{ fontSize: 16, marginBottom: 8 }}>
                    📝 Auto-generating projects for "{selectedAppliedRole}"...
                  </div>
                  <div style={{ fontSize: 12 }}>AI is creating personalized project ideas for you</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 16, marginBottom: 8 }}>📝 Select a role to generate projects</div>
                  <div style={{ fontSize: 12 }}>Choose a role from the dropdown above</div>
                </div>
              )}
            </div>
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
        {/* General Career Development Resources */}
<Section title="🎯 Essential Career Development Resources">
  <div style={{ display: "grid", gap: 16 }}>
    {/* Communication Skills */}
    <div style={{ 
      border: "1px solid #e5e7eb", 
      borderRadius: 12, 
      padding: 20, 
      backgroundColor: "#fafafa" 
    }}>
      <h4 style={{ margin: "0 0 16px 0", color: "#1f2937", fontSize: "18px", display: "flex", alignItems: "center", gap: 8 }}>
        🗣️ Communication & Soft Skills
      </h4>
      <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "8px 4px" }}>
        {[
          {
            title: "How to speak so that people want to listen",
            channel: "TED",
            url: "https://www.youtube.com/watch?v=eIho2S0ZahI",
            thumbnail: "https://img.youtube.com/vi/eIho2S0ZahI/mqdefault.jpg"
          },
          {
            title: "The power of listening | William Ury",
            channel: "TED",
            url: "https://www.youtube.com/watch?v=saXfavo1OQo",
            thumbnail: "https://img.youtube.com/vi/saXfavo1OQo/mqdefault.jpg"
          },
          {
            title: "How to have difficult conversations",
            channel: "Harvard Business Review",
            url: "https://www.youtube.com/watch?v=67GYM7dlPrg",
            thumbnail: "https://img.youtube.com/vi/67GYM7dlPrg/mqdefault.jpg"
          }
        ].map((video, index) => (
          <div key={index} style={{ 
            flex: "0 0 auto",
            width: 240,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: "white",
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}>
            <img 
              src={video.thumbnail} 
              alt={video.title}
              style={{ 
                width: "100%", 
                height: 135, 
                objectFit: "cover" 
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
                  fontSize: 13,
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}
              >
                {video.title}
              </a>
              <div style={{ color: "#6b7280", fontSize: 11, marginTop: 6 }}>
                {video.channel}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Career Planning & Growth */}
    <div style={{ 
      border: "1px solid #e5e7eb", 
      borderRadius: 12, 
      padding: 20, 
      backgroundColor: "#fafafa" 
    }}>
      <h4 style={{ margin: "0 0 16px 0", color: "#1f2937", fontSize: "18px", display: "flex", alignItems: "center", gap: 8 }}>
        🚀 Career Planning & Growth
      </h4>
      <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "8px 4px" }}>
        {[
          {
            title: "How to find and do work you love",
            channel: "TED",
            url: "https://www.youtube.com/watch?v=jpe-LKn-4gM",
            thumbnail: "https://img.youtube.com/vi/jpe-LKn-4gM/mqdefault.jpg"
          },
          {
            title: "The career advice you probably didn't get",
            channel: "TED",
            url: "https://www.youtube.com/watch?v=ww1L-aaNxqI",
            thumbnail: "https://img.youtube.com/vi/ww1L-aaNxqI/mqdefault.jpg"
          },
          {
            title: "How to design your career path",
            channel: "Harvard Business Review",
            url: "https://www.youtube.com/watch?v=3z_44pS1p-o",
            thumbnail: "https://img.youtube.com/vi/3z_44pS1p-o/mqdefault.jpg"
          }
        ].map((video, index) => (
          <div key={index} style={{ 
            flex: "0 0 auto",
            width: 240,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: "white",
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}>
            <img 
              src={video.thumbnail} 
              alt={video.title}
              style={{ 
                width: "100%", 
                height: 135, 
                objectFit: "cover" 
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
                  fontSize: 13,
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}
              >
                {video.title}
              </a>
              <div style={{ color: "#6b7280", fontSize: 11, marginTop: 6 }}>
                {video.channel}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Interview & Job Search */}
    <div style={{ 
      border: "1px solid #e5e7eb", 
      borderRadius: 12, 
      padding: 20, 
      backgroundColor: "#fafafa" 
    }}>
      <h4 style={{ margin: "0 0 16px 0", color: "#1f2937", fontSize: "18px", display: "flex", alignItems: "center", gap: 8 }}>
        💼 Interview & Job Search
      </h4>
      <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "8px 4px" }}>
        {[
          {
            title: "How to ace a job interview",
            channel: "TED",
            url: "https://www.youtube.com/watch?v=5v-wyR5kpLc",
            thumbnail: "https://img.youtube.com/vi/5v-wyR5kpLc/mqdefault.jpg"
          },
          {
            title: "The secret to getting a job with no experience",
            channel: "TED",
            url: "https://www.youtube.com/watch?v=woaFnl-srU0",
            thumbnail: "https://img.youtube.com/vi/woaFnl-srU0/mqdefault.jpg"
          },
          {
            title: "How to write a great resume",
            channel: "Harvard Business Review",
            url: "https://www.youtube.com/watch?v=8C5T1fZ32hU",
            thumbnail: "https://img.youtube.com/vi/8C5T1fZ32hU/mqdefault.jpg"
          }
        ].map((video, index) => (
          <div key={index} style={{ 
            flex: "0 0 auto",
            width: 240,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: "white",
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}>
            <img 
              src={video.thumbnail} 
              alt={video.title}
              style={{ 
                width: "100%", 
                height: 135, 
                objectFit: "cover" 
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
                  fontSize: 13,
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}
              >
                {video.title}
              </a>
              <div style={{ color: "#6b7280", fontSize: 11, marginTop: 6 }}>
                {video.channel}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Personal Development */}
    <div style={{ 
      border: "1px solid #e5e7eb", 
      borderRadius: 12, 
      padding: 20, 
      backgroundColor: "#fafafa" 
    }}>
      <h4 style={{ margin: "0 0 16px 0", color: "#1f2937", fontSize: "18px", display: "flex", alignItems: "center", gap: 8 }}>
        🌟 Personal Development
      </h4>
      <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "8px 4px" }}>
        {[
          {
            title: "The power of believing that you can improve",
            channel: "TED",
            url: "https://www.youtube.com/watch?v=_X0mgOOSpLU",
            thumbnail: "https://img.youtube.com/vi/_X0mgOOSpLU/mqdefault.jpg"
          },
          {
            title: "How to manage your time more effectively",
            channel: "TED",
            url: "https://www.youtube.com/watch?v=iONDebHX9qk",
            thumbnail: "https://img.youtube.com/vi/iONDebHX9qk/mqdefault.jpg"
          },
          {
            title: "How to stay calm under pressure",
            channel: "TED",
            url: "https://www.youtube.com/watch?v=ZxUjGCRq_0I",
            thumbnail: "https://img.youtube.com/vi/ZxUjGCRq_0I/mqdefault.jpg"
          }
        ].map((video, index) => (
          <div key={index} style={{ 
            flex: "0 0 auto",
            width: 240,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: "white",
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}>
            <img 
              src={video.thumbnail} 
              alt={video.title}
              style={{ 
                width: "100%", 
                height: 135, 
                objectFit: "cover" 
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
                  fontSize: 13,
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}
              >
                {video.title}
              </a>
              <div style={{ color: "#6b7280", fontSize: 11, marginTop: 6 }}>
                {video.channel}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</Section>
      </div>

      {/* Floating Chat Bubble */}
      <FloatingChatBubble />
    </div>
  );
}

// Floating Chat Bubble Component (keep the same as before)
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