import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChatBox from "./components/chatBox";
import MarkdownMessage from "./components/MarkdownMessage";

// Enhanced Section Component with Interactive Elements
function Section({ title, right, children, gradient, className = "" }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`dashboard-section ${className}`}
      style={{ 
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        border: "1px solid #e2e8f0",
        boxShadow: isHovered 
          ? "0 10px 40px rgba(0,0,0,0.08), 0 2px 10px rgba(0,0,0,0.03)" 
          : "0 4px 20px rgba(0,0,0,0.05)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      {gradient && (
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "60%",
          height: "100%",
          background: gradient,
          opacity: isHovered ? 0.03 : 0.01,
          transition: "opacity 0.3s ease",
          zIndex: 0
        }} />
      )}
      
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        marginBottom: 20,
        position: "relative",
        zIndex: 1
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 4,
            height: 24,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 10
          }} />
          <h3 style={{ 
            margin: 0, 
            fontSize: 20, 
            fontWeight: 700,
            background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            {title}
          </h3>
        </div>
        {right}
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

// Enhanced AI Recommendations Component
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

  if (loading) return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "40px 20px",
      color: "#64748b",
      gap: 12
    }}>
      <div className="loading-spinner" style={{
        width: 20,
        height: 20,
        border: "2px solid #e2e8f0",
        borderTop: "2px solid #667eea",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />
      <span>Searching YouTube for {skill} tutorials...</span>
    </div>
  );
  
  if (error) return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "40px 20px",
      color: "#dc2626",
      gap: 8
    }}>
      <span style={{ fontSize: 20 }}>⚠️</span>
      <span>{error}</span>
    </div>
  );

  return (
    <div style={{ padding: "8px 0" }}>
      {videos.length > 0 ? (
        <>
          <h4 style={{ 
            margin: "0 0 20px 0", 
            color: "#1e293b", 
            fontSize: 18, 
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            <span style={{ 
              background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)", 
              width: 32, 
              height: 32, 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "white",
              fontSize: 16
            }}>🎥</span>
            Top YouTube Tutorials
          </h4>
          <div 
            style={{ 
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
              padding: "8px 4px"
            }}
          >
            {videos.map((video, index) => (
              <div 
                key={index} 
                className="video-card"
                style={{ 
                  border: "1px solid #e2e8f0",
                  borderRadius: 16,
                  overflow: "hidden",
                  backgroundColor: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                }}
                onClick={() => window.open(video.url, '_blank')}
              >
                <div style={{ position: "relative" }}>
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    style={{ 
                      width: "100%", 
                      height: 180, 
                      objectFit: "cover",
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: "rgba(0,0,0,0.7)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    ▶️ Play
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <h5 style={{ 
                    margin: "0 0 8px 0", 
                    fontSize: 14,
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    fontWeight: 600,
                    color: "#1e293b"
                  }}>
                    {video.title}
                  </h5>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    marginTop: 12
                  }}>
                    <span style={{ color: "#64748b", fontSize: 12, fontWeight: 500 }}>
                      {video.channel}
                    </span>
                    <span style={{ color: "#94a3b8", fontSize: 11 }}>
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ 
          textAlign: "center", 
          padding: "40px 20px", 
          color: "#64748b",
          background: "#f8fafc",
          borderRadius: 12,
          border: "2px dashed #e2e8f0"
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div>No video recommendations found for {skill}.</div>
        </div>
      )}
    </div>
  );
}

// Enhanced Skill Tag Component
function SkillTag({ skill, type = "default", onRemove, onMarkApplied, generating }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getTagStyles = () => {
    const baseStyle = {
      padding: "8px 16px",
      borderRadius: 20,
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontSize: 14,
      fontWeight: 600,
      transition: "all 0.2s ease",
      cursor: "pointer",
      border: "1px solid transparent"
    };
    
    const types = {
      default: {
        background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
        color: "#475569",
        borderColor: "#cbd5e1"
      },
      present: {
        background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
        color: "#166534",
        borderColor: "#86efac"
      },
      missing: {
        background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
        color: "#92400e",
        borderColor: "#fcd34d"
      },
      applied: {
        background: "linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)",
        color: "#1e40af",
        borderColor: "#60a5fa"
      }
    };
    
    return { ...baseStyle, ...types[type] };
  };

  return (
    <div
      style={getTagStyles()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>{skill}</span>
      {onMarkApplied && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkApplied(skill);
          }}
          disabled={generating}
          style={{
            background: generating ? "#94a3b8" : "#1e293b",
            color: "white",
            border: "none",
            borderRadius: 12,
            padding: "4px 8px",
            fontSize: 11,
            fontWeight: 600,
            cursor: generating ? "not-allowed" : "pointer",
            opacity: isHovered ? 1 : 0.7,
            transition: "all 0.2s ease"
          }}
        >
          {generating ? "..." : "Select"}
        </button>
      )}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(skill);
          }}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            opacity: 0.6,
            fontSize: 16,
            fontWeight: "bold",
            padding: 0,
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

// Enhanced Stats Card Component
function StatsCard({ title, value, icon, color, trend }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        borderRadius: 16,
        padding: 24,
        border: "1px solid #e2e8f0",
        boxShadow: isHovered 
          ? "0 8px 30px rgba(0,0,0,0.08)" 
          : "0 2px 10px rgba(0,0,0,0.04)",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ 
            color: "#64748b", 
            fontSize: 14, 
            fontWeight: 600,
            marginBottom: 8
          }}>
            {title}
          </div>
          <div style={{ 
            fontSize: 32, 
            fontWeight: 800,
            background: color,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            {value}
          </div>
          {trend && (
            <div style={{ 
              fontSize: 12, 
              color: trend > 0 ? "#10b981" : "#ef4444",
              marginTop: 4
            }}>
              {trend > 0 ? "↗" : "↘"} {Math.abs(trend)}% from last month
            </div>
          )}
        </div>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Enhanced File Upload Component
function FileUploadArea({ onUpload, uploading, error }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      style={{
        border: `2px dashed ${isDragOver ? "#667eea" : "#cbd5e1"}`,
        borderRadius: 16,
        padding: 40,
        textAlign: "center",
        background: isDragOver ? "#f0f4ff" : "#f8fafc",
        transition: "all 0.3s ease",
        cursor: "pointer"
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
        }}
      />
      
      <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>
        {uploading ? "Uploading Resume..." : "Drag & Drop Your Resume"}
      </div>
      <div style={{ color: "#64748b", marginBottom: 16 }}>
        or click to browse files (PDF, DOC, DOCX)
      </div>
      <div style={{ 
        display: "inline-flex", 
        alignItems: "center", 
        gap: 8,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "12px 24px",
        borderRadius: 12,
        fontWeight: 600,
        fontSize: 14
      }}>
        <span>Choose File</span>
      </div>
      
      {error && (
        <div style={{ 
          color: "#dc2626", 
          marginTop: 16,
          padding: "12px 16px",
          background: "#fef2f2",
          borderRadius: 8,
          border: "1px solid #fecaca"
        }}>
          ⚠️ {error}
        </div>
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

  async function handleUploadResume(file) {
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
        const rr = await fetch("/api/resumes", { headers: token ? { Authorization: `Bearer ${token}` } : {} });
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
        const res = await fetch("/api/profile", { headers: token ? { Authorization: `Bearer ${token}` } : {} });
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
      {/* Enhanced Sidebar */}
      <div style={{ 
        width: 200, 
        background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)", 
        color: "#e2e8f0", 
        padding: 24, 
        position: "fixed",
        height: "100vh",
        left: 0,
        top: 0,
        overflowY: "auto",
        boxShadow: "4px 0 20px rgba(0,0,0,0.1)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            borderRadius: "50%", 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
            margin: "0 auto 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: "bold",
            color: "white"
          }}>
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>{profile.name}</h3>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: 14 }}>{profile.email}</p>
          
          {/* Enhanced Logout Button */}
          <div style={{ marginTop: 24 }}>
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "linear-gradient(135deg, #374151 0%, #4b5563 100%)",
                color: "#e5e7eb",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8
              }}
              onMouseEnter={(e) => { 
                e.target.style.background = "linear-gradient(135deg, #4b5563 0%, #6b7280 100%)";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => { 
                e.target.style.background = "linear-gradient(135deg, #374151 0%, #4b5563 100%)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              <span></span>
              Log Out
            </button>
          </div>
        </div>

        
      </div>

      {/* Enhanced Main Content */}
      <div style={{ 
        flex: 1, 
        padding: 32,
        marginLeft: 250,
        overflowY: "auto",
        overflowX: "hidden",
        minHeight: "100vh",
        maxWidth: "calc(100vw - 280px)",
        boxSizing: "border-box"
      }}>
        {/* Welcome Header */}
        <div style={{ 
          marginBottom: 32,
          padding: "24px 0"
        }}>
          <h1 style={{ 
            margin: "0 0 8px", 
            fontSize: 32, 
            fontWeight: 800,
            background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Welcome back, {profile.name.split(' ')[0]}! 👋
          </h1>
          <p style={{ 
            margin: 0, 
            color: "#64748b", 
            fontSize: 16,
            fontWeight: 500
          }}>
            Ready to continue your career growth journey?
          </p>
        </div>

        {/* Enhanced Stats Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
          gap: 20, 
          marginBottom: 32
        }}>
          <StatsCard 
            title="Resumes Uploaded" 
            value={resumeFiles.length} 
            icon="📄"
            color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
          <StatsCard 
            title="Desired Roles" 
            value={desiredRoles.length} 
            icon="🎯"
            color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    
          />
          <StatsCard 
            title="Roles in Progress" 
            value={appliedRoles.length} 
            icon="🚀"
            color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  
          />
          <StatsCard 
            title="Skills Learned" 
            value={profile.resumeDetectedSkills.length} 
            icon="⭐"
            color="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          />
        </div>

        {/* Resume Upload Section */}
        <Section 
          title="Resume Management" 
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        >
          <FileUploadArea 
            onUpload={handleUploadResume}
            uploading={uploading}
            error={uploadError}
          />
          
          {resumeFiles.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h4 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#1e293b" }}>
                Uploaded Resumes ({resumeFiles.length})
              </h4>
              <div style={{ display: "grid", gap: 12 }}>
                {resumeFiles.map((r, idx) => (
                  <div 
                    key={r._id || idx} 
                    className="resume-item"
                    style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      border: "1px solid #e2e8f0", 
                      borderRadius: 12, 
                      padding: 16,
                      background: "white",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#667eea";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: 14,
                        fontWeight: "bold"
                      }}>
                        PDF
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#1e293b" }}>
                          {r.name || r.filename || `Resume ${idx + 1}`}
                        </div>
                        <div style={{ color: "#64748b", fontSize: 12 }}>
                          Uploaded {new Date(r.uploadedAt || Date.now()).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {r.url && (
                        <a 
                          href={r.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{ 
                            color: "#667eea", 
                            textDecoration: "none",
                            padding: "8px 12px",
                            borderRadius: 8,
                            background: "#f0f4ff",
                            fontSize: 14,
                            fontWeight: 600,
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = "#667eea";
                            e.target.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "#f0f4ff";
                            e.target.style.color = "#667eea";
                          }}
                        >
                          View
                        </a>
                      )}
                      {r.url && (
                        <button 
                          onClick={() => handleDeleteResume(r.url)} 
                          style={{ 
                            background: "#fee2e2", 
                            color: "#dc2626", 
                            border: 0, 
                            borderRadius: 8, 
                            padding: "8px 12px", 
                            cursor: "pointer",
                            fontSize: 14,
                            fontWeight: 600,
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = "#dc2626";
                            e.target.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "#fee2e2";
                            e.target.style.color = "#dc2626";
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Profile & Skills Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
        <Section 
            title="Detected Skills" 
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          >
            {Array.isArray(profile?.resumeDetectedSkills) && profile.resumeDetectedSkills.length > 0 ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {profile.resumeDetectedSkills.map((s) => (
                  <SkillTag key={s} skill={s} type="present" />
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: "center", 
                padding: "32px 20px", 
                color: "#64748b",
                background: "#f8fafc",
                borderRadius: 12,
                border: "2px dashed #e2e8f0"
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <div>Upload a resume to detect your skills</div>
              </div>
            )}
          </Section>
        </div>

        {/* Roles Management */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
          <Section 
            title="Career Goals" 
            right={
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <select 
                  value={selectedRole} 
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{ 
                    border: "1px solid #cbd5e1", 
                    borderRadius: 12, 
                    padding: "10px 16px", 
                    minWidth: 200,
                    background: "white",
                    fontSize: 14,
                    fontWeight: 500
                  }}
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
                    background: (!selectedRole && !newRole.trim()) ? "#cbd5e1" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
                    color: "white", 
                    border: 0, 
                    borderRadius: 12, 
                    padding: "10px 20px", 
                    cursor: (!selectedRole && !newRole.trim()) ? "not-allowed" : "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedRole && !newRole.trim()) return;
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedRole && !newRole.trim()) return;
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Add Role
                </button>
              </div>
            }
            gradient="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
          >
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {desiredRoles.map((r) => (
                <SkillTag 
                  key={r} 
                  skill={r} 
                  type="default"
                  onMarkApplied={() => markApplied(r)}
                  onRemove={() => removeDesiredRole(r)}
                  generating={generatingProjects[r]}
                />
              ))}
              {desiredRoles.length === 0 && (
                <div style={{ 
                  textAlign: "center", 
                  padding: "32px 20px", 
                  color: "#64748b",
                  background: "#f8fafc",
                  borderRadius: 12,
                  border: "2px dashed #e2e8f0",
                  width: "100%"
                }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
                  <div>Add your desired roles to get started</div>
                </div>
              )}
            </div>
          </Section>

          <Section 
  title="Roles in Progress" 
  gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
>
  <div style={{ 
    maxHeight: "280px", 
    overflowY: "auto",
    padding: "12px 8px",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    backgroundColor: "#f8fafc"
  }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {appliedRoles.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px 20px", 
          color: "#64748b",
          background: "white",
          borderRadius: 8,
          border: "2px dashed #e2e8f0"
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>No Active Projects</div>
          <div style={{ fontSize: 14, color: "#94a3b8" }}>Select roles from the left panel to start working on projects</div>
        </div>
      ) : (
        appliedRoles.map((r, i) => (
          <div
            key={`${r}-${i}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              backgroundColor: "white",
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: generatingProjects[r] ? "#f59e0b" : "#10b981",
                animation: generatingProjects[r] ? "pulse 1.5s infinite" : "none"
              }} />
              <span style={{ 
                fontWeight: 600, 
                color: "#1e293b",
                fontSize: 14
              }}>
                {r}
              </span>
              {generatingProjects[r] && (
                <span style={{ 
                  fontSize: 12, 
                  color: "#f59e0b",
                  fontWeight: 500
                }}>
                  Generating...
                </span>
              )}
            </div>
            
            <button 
              onClick={() => removeAppliedRole(i)}
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#dc2626";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#fef2f2";
                e.target.style.color = "#dc2626";
              }}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  </div>
  
  <style jsx>{`
    div::-webkit-scrollbar {
      width: 6px;
    }
    div::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    div::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }
    div::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `}</style>
</Section>
        </div>

        {/* Project Generation Status */}
        {projectGenerationStatus && (
          <div style={{ 
            margin: "16px 0", 
            padding: "16px 20px", 
            borderRadius: 12, 
            backgroundColor: projectGenerationStatus.includes("✅") ? "#dcfce7" : 
                           projectGenerationStatus.includes("❌") ? "#fef2f2" : "#f0f9ff",
            color: projectGenerationStatus.includes("✅") ? "#166534" : 
                  projectGenerationStatus.includes("❌") ? "#dc2626" : "#1e40af",
            border: `1px solid ${
              projectGenerationStatus.includes("✅") ? "#bbf7d0" : 
              projectGenerationStatus.includes("❌") ? "#fecaca" : "#bfdbfe"
            }`,
            fontSize: 14,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}>
            <span style={{ fontSize: 18 }}>
              {projectGenerationStatus.includes("✅") ? "✅" : 
               projectGenerationStatus.includes("❌") ? "❌" : "🔄"}
            </span>
            {projectGenerationStatus}
          </div>
        )}

        {/* AI Analysis & Projects */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
          <Section 
            title="AI Skill Analysis" 
            gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
          >
            {requiredSkills.length === 0 ? (
              <div style={{ 
                textAlign: "center", 
                padding: "40px 20px", 
                color: "#64748b",
                background: "#f8fafc",
                borderRadius: 12,
                border: "2px dashed #e2e8f0"
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
                <div>Add desired roles to see AI skill analysis</div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 20 }}>
                {/* Required Skills */}
                <div>
                  <div style={{ 
                    fontWeight: 600, 
                    marginBottom: 12,
                    fontSize: 16,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    <span style={{ 
                      background: "#dbeafe", 
                      width: 24, 
                      height: 24, 
                      borderRadius: "50%", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontSize: 12
                    }}>📚</span>
                    Required Skills
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {requiredSkills.map((s) => (
                      <SkillTag key={s} skill={s} type="default" />
                    ))}
                  </div>
                </div>

                {/* Present Skills */}
                {Array.isArray(displayPresentSkills) && displayPresentSkills.length > 0 && (
                  <div>
                    <div style={{ 
                      fontWeight: 600, 
                      marginBottom: 12,
                      fontSize: 16,
                      color: "#166534",
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    }}>
                      <span style={{ 
                        background: "#dcfce7", 
                        width: 24, 
                        height: 24, 
                        borderRadius: "50%", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        fontSize: 12
                      }}>✅</span>
                      Skills You Have
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {displayPresentSkills.map((s) => (
                        <SkillTag key={s} skill={s} type="present" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {Array.isArray(displayMissingSkills) && displayMissingSkills.length > 0 && (
                  <div>
                    <div style={{ 
                      fontWeight: 600, 
                      marginBottom: 12,
                      fontSize: 16,
                      color: "#92400e",
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    }}>
                      <span style={{ 
                        background: "#fef3c7", 
                        width: 24, 
                        height: 24, 
                        borderRadius: "50%", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        fontSize: 12
                      }}>🎯</span>
                      Skills to Learn
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {displayMissingSkills.map((s) => (
                        <SkillTag key={s} skill={s} type="missing" />
                      ))}
                    </div>
                  </div>
                )}

                {analysis?.noResume && (
                  <div style={{ 
                    color: "#64748b", 
                    fontSize: 14, 
                    fontStyle: "italic",
                    textAlign: "center",
                    padding: "16px",
                    background: "#f8fafc",
                    borderRadius: 8,
                    border: "1px dashed #e2e8f0"
                  }}>
                    Upload a resume to see which skills you already have and which ones you need to learn.
                  </div>
                )}
              </div>
            )}
          </Section>
          
          <Section 
  title="Project Recommendations" 
  gradient="linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)"
>
  {/* Role Filter */}
  {appliedRoles.length > 0 && (
    <div style={{ marginBottom: 20 }}>
      <select 
        value={selectedAppliedRole} 
        onChange={(e) => setSelectedAppliedRole(e.target.value)}
        style={{ 
          border: "1px solid #cbd5e1", 
          borderRadius: 12, 
          padding: "10px 16px",
          backgroundColor: "white",
          fontSize: 14,
          fontWeight: 500,
          width: "100%",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
        }}
      >
        <option value="">All Active Projects</option>
        {appliedRoles.map(role => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
    </div>
  )}

  <div style={{ 
    maxHeight: "500px", 
    overflowY: "auto",
    padding: "8px 4px",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    backgroundColor: "#f8fafc"
  }}>
    {Array.isArray(filteredTodos) && filteredTodos.length > 0 ? (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 4px" }}>
        {filteredTodos.map((t, i) => (
          <div 
            key={i} 
            className="project-card"
            style={{ 
              padding: 20, 
              border: "1px solid #e2e8f0", 
              borderRadius: 16, 
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              minHeight: "140px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
            }}
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
          >
            <div>
              <div style={{ 
                fontWeight: 600, 
                marginBottom: 12, 
                fontSize: 16, 
                color: "#1e293b",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <span style={{ 
                  background: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)", 
                  width: 24, 
                  height: 24, 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontSize: 12,
                  color: "white"
                }}>📋</span>
                {t.title} 
                <span style={{ 
                  fontSize: 14, 
                  color: "#64748b",
                  marginLeft: "auto"
                }}>🔗</span>
              </div>
              
              {t.description && (
                <div style={{ 
                  color: "#64748b", 
                  fontSize: 14, 
                  marginBottom: 12, 
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {t.description}
                </div>
              )}
              
              {t.role && (
                <div style={{ 
                  fontSize: 13, 
                  color: "#059669", 
                  marginBottom: 12, 
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}>
                  <span>🎯</span>
                  <strong>Role:</strong> {t.role}
                </div>
              )}
            </div>

            <div>
              {Array.isArray(t.requiredSkills) && t.requiredSkills.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ 
                    fontSize: 13, 
                    color: "#6b7280", 
                    marginBottom: 6, 
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}>
                    <span>🛠️</span>
                    Skills needed:
                  </div>
                  <div style={{ 
                    display: "flex", 
                    gap: 6, 
                    flexWrap: "wrap",
                    maxHeight: "60px",
                    overflow: "hidden"
                  }}>
                    {t.requiredSkills.slice(0, 4).map((s) => (
                      <span key={s} style={{ 
                        background: "#eef2ff", 
                        color: "#3730a3", 
                        padding: "4px 8px", 
                        borderRadius: 999, 
                        fontSize: 11,
                        fontWeight: 500
                      }}>
                        {s}
                      </span>
                    ))}
                    {t.requiredSkills.length > 4 && (
                      <span style={{ 
                        background: "#f1f5f9", 
                        color: "#64748b", 
                        padding: "4px 8px", 
                        borderRadius: 999, 
                        fontSize: 11,
                        fontWeight: 500
                      }}>
                        +{t.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {Array.isArray(t.resources) && t.resources.length > 0 && (
                <div>
                  <div style={{ 
                    fontSize: 13, 
                    color: "#6b7280", 
                    marginBottom: 6, 
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}>
                    <span>📚</span>
                    Quick resources:
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
                          border: "1px solid #dcfce7",
                          display: "flex",
                          alignItems: "center",
                          gap: 6
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
                        <span>📖</span>
                        {r.title || r.type}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div style={{ 
        textAlign: "center", 
        padding: "60px 20px", 
        color: "#64748b",
        background: "white",
        borderRadius: 8,
        border: "2px dashed #e2e8f0",
        margin: "8px"
      }}>
        {appliedRoles.length === 0 ? (
          <>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🎯</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#1e293b" }}>
              No Active Roles
            </div>
            <div style={{ fontSize: 14, color: "#64748b" }}>
              Select roles to work on to get AI-powered project recommendations
            </div>
          </>
        ) : Object.values(generatingProjects).some(status => status) ? (
          <>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🔄</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#1e293b" }}>
              AI is Generating Projects
            </div>
            <div style={{ fontSize: 14, color: "#64748b" }}>
              This may take a few seconds...
            </div>
          </>
        ) : selectedAppliedRole ? (
          <>
            <div style={{ fontSize: 64, marginBottom: 20 }}>📝</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#1e293b" }}>
              Generating Projects for "{selectedAppliedRole}"
            </div>
            <div style={{ fontSize: 14, color: "#64748b" }}>
              AI is creating personalized project ideas for you
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 64, marginBottom: 20 }}>📝</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#1e293b" }}>
              Select a Role to Generate Projects
            </div>
            <div style={{ fontSize: 14, color: "#64748b" }}>
              Choose a role from the dropdown above to see project recommendations
            </div>
          </>
        )}
      </div>
    )}
  </div>

  {/* Scrollbar styling */}
  <style jsx>{`
    div::-webkit-scrollbar {
      width: 6px;
    }
    div::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    div::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }
    div::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `}</style>
</Section>
        </div>

        {/* Enhanced Learning Resources Section */}
              <Section 
        title="Personalized Learning Path" 
        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      >
        {displayMissingSkills.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "40px 20px", 
            color: "#64748b",
            background: "#f8fafc",
            borderRadius: 12,
            border: "2px dashed #e2e8f0"
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
            <div>{analysis?.noResume 
              ? "Upload a resume to discover skills to learn" 
              : "Add desired roles to see learning recommendations"}</div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 24 }}>
            {displayMissingSkills.map((skill) => (
              <div key={skill} style={{ 
                border: "1px solid #e2e8f0", 
                borderRadius: 16, 
                padding: 24, 
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                overflow: "hidden"
              }}>
                <div style={{ 
                  fontWeight: 700, 
                  marginBottom: 20, 
                  color: "#1e293b", 
                  fontSize: 20,
                  paddingBottom: 16,
                  borderBottom: "2px solid #f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  gap: 12
                }}>
                  <span style={{ 
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
                    width: 10, 
                    height: 10, 
                    borderRadius: "50%", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    color: "white",
                    fontSize: 14
                  }}>🎯</span>
                  Master {skill}
                </div>
                
                {/* Horizontally scrollable video recommendations */}
                <div style={{
                  position: "relative"
                }}>
                  <AIRecommendations skill={skill} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
        {/* Enhanced Career Development Resources */}
        <Section 
          title="Career Growth Resources" 
          gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        >
          <div style={{ display: "grid", gap: 24 }}>
            {/* Communication Skills */}
            <div style={{ 
              border: "1px solid #e2e8f0", 
              borderRadius: 16, 
              padding: 24, 
              backgroundColor: "white" 
            }}>
              <h4 style={{ 
                margin: "0 0 20px 0", 
                color: "#1e293b", 
                fontSize: 18, 
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                🗣️ Communication & Soft Skills
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                {[
                  {
                    title: "What Are Soft Skills? Top 8",
                    channel: "Communication Coach Alexander Lyon",
                    url: "https://www.youtube.com/watch?v=hZSARM4VaVs",
                    thumbnail: "https://img.youtube.com/vi/hZSARM4VaVs/hqdefault.jpg"
                  },
                  {
                    title: "Top 5 Communication Skills",
                    channel: "Communication Coach Alexander Lyon",
                    url: "https://www.youtube.com/watch?v=Ftt2q2n5uvY",
                    thumbnail: "https://img.youtube.com/vi/Ftt2q2n5uvY/hqdefault.jpg"
                  },
                  {
                    title: "5 Simple Habits to Instantly Improve Your Conversations",
                    channel: "FOCUS inspired",
                    url: "https://www.youtube.com/watch?v=qelD5Je8k8g",
                    thumbnail: "https://img.youtube.com/vi/qelD5Je8k8g/mqdefault.jpg"
                  },
                  {
                    title: "The Power of Soft Skills: Communication and Emotional Intelligence in Team Success",
                    channel: "NobelBiz",
                    url: "https://www.youtube.com/watch?v=IHXdiTo3kJ0",
                    thumbnail: "https://img.youtube.com/vi/IHXdiTo3kJ0/hqdefault.jpg"
                  },
                  {
                    title: "How to Communicate Clearly and Concisely (Free Mini-Training)",
                    channel: "Communication Coach Alexander Lyon",
                    url: "https://www.youtube.com/watch?v=YJXUOJKtn8o",
                    thumbnail: "https://img.youtube.com/vi/YJXUOJKtn8o/hqdefault.jpg"
                  }
                ].map((video, index) => (
                  <div 
                    key={index}
                    className="resource-card"
                    style={{ 
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      overflow: "hidden",
                      backgroundColor: "white",
                      transition: "all 0.3s ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    onClick={() => window.open(video.url, '_blank')}
                  >
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      style={{ 
                        width: "100%", 
                        height: 160, 
                        objectFit: "cover" 
                      }}
                    />
                    <div style={{ padding: 16 }}>
                      <h5 style={{ 
                        margin: "0 0 8px 0", 
                        fontSize: 14,
                        lineHeight: 1.4,
                        fontWeight: 600,
                        color: "#1e293b"
                      }}>
                        {video.title}
                      </h5>
                      <div style={{ color: "#64748b", fontSize: 12, fontWeight: 500 }}>
                        {video.channel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Planning & Growth */}
            <div style={{ 
              border: "1px solid #e2e8f0", 
              borderRadius: 16, 
              padding: 24, 
              backgroundColor: "white" 
            }}>
              <h4 style={{ 
                margin: "0 0 20px 0", 
                color: "#1e293b", 
                fontSize: 18, 
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                🚀 Career Planning & Growth
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                {[
                  {
                    title: "Career Growth Strategies",
                    channel: "Coach Samuel Ibanda",
                    url: "https://www.youtube.com/watch?v=WdlkRY1YSro",
                    thumbnail: "https://img.youtube.com/vi/WdlkRY1YSro/hqdefault.jpg"
                  },
                  {
                    title: "How to Build Your Career Development Plan Step by Step",
                    channel: "Andrew LaCivita",
                    url: "https://www.youtube.com/watch?v=qToX7i06pjk",
                    thumbnail: "https://img.youtube.com/vi/qToX7i06pjk/mqdefault.jpg"
                  },
                  {
                    title: "The Road Ahead: Strategic Career Planning and Progression",
                    channel: "MRA org",
                    url: "https://www.youtube.com/watch?v=jgXK_B3VBz4",
                    thumbnail: "https://img.youtube.com/vi/jgXK_B3VBz4/hqdefault.jpg"
                  },
                  {
                    title: "The Truth About Career Progression",
                    channel: "Richard Edge (TEDxPCL)",
                    url: "https://www.youtube.com/watch?v=NX6qIbflNyY",
                    thumbnail: "https://img.youtube.com/vi/NX6qIbflNyY/hqdefault.jpg"
                  },
                  {
                    title: "Work Ready: Career Planning 101",
                    channel: "LA County Library / with Allan Brown",
                    url: "https://www.youtube.com/watch?v=dzQyphjVb1k",
                    thumbnail: "https://img.youtube.com/vi/M9QHTOayFnU/hqdefault.jpg"
                  }
                ].map((video, index) => (
                  <div 
                    key={index}
                    className="resource-card"
                    style={{ 
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      overflow: "hidden",
                      backgroundColor: "white",
                      transition: "all 0.3s ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    onClick={() => window.open(video.url, '_blank')}
                  >
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      style={{ 
                        width: "100%", 
                        height: 160, 
                        objectFit: "cover" 
                      }}
                    />
                    <div style={{ padding: 16 }}>
                      <h5 style={{ 
                        margin: "0 0 8px 0", 
                        fontSize: 14,
                        lineHeight: 1.4,
                        fontWeight: 600,
                        color: "#1e293b"
                      }}>
                        {video.title}
                      </h5>
                      <div style={{ color: "#64748b", fontSize: 12, fontWeight: 500 }}>
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

      {/* Enhanced Floating Chat Bubble */}
      <FloatingChatBubble />
    </div>
  );
}

// Enhanced Floating Chat Bubble Component
function FloatingChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI career coach. I can help you with resume analysis, skill gaps, project recommendations, and career guidance. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const [chatSize, setChatSize] = useState({ width: 380, height: 600 });

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
      {/* Enhanced Chat Bubble Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="floating-chat-button"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
          zIndex: 1000,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          border: "2px solid white"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 12px 40px rgba(102, 126, 234, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(102, 126, 234, 0.4)";
        }}
      >
        {isOpen ? (
          <span style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>×</span>
        ) : (
          <span style={{ color: "white", fontSize: 28 }}>💬</span>
        )}
      </div>

      {/* Enhanced Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 24,
            width: chatSize.width,
            height: chatSize.height,
            backgroundColor: "white",
            borderRadius: 20,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            zIndex: 1001,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
          }}
        >
          {/* Enhanced Header */}
          <div style={{ 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
            color: "white", 
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ 
                width: 12, 
                height: 12, 
                borderRadius: "50%", 
                backgroundColor: isLoading ? "#ffd700" : "#4ade80",
                boxShadow: "0 0 10px rgba(74, 222, 128, 0.5)"
              }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>AI Career Coach</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button 
                onClick={clearChat}
                style={{ 
                  background: "rgba(255,255,255,0.2)", 
                  border: "none", 
                  color: "white", 
                  padding: "8px 12px", 
                  borderRadius: 10, 
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.2)";
                }}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Enhanced Messages */}
          <div style={{ 
            flex: 1,
            overflowY: "auto", 
            padding: 24,
            backgroundColor: "#f8fafc",
            backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "16px 20px",
                    borderRadius: m.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                    background: m.role === "user" 
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                      : "white",
                    color: m.role === "user" ? "white" : "#1e293b",
                    boxShadow: m.role === "user" 
                      ? "0 4px 12px rgba(102, 126, 234, 0.3)" 
                      : "0 2px 8px rgba(0,0,0,0.08)",
                    fontSize: 14,
                    lineHeight: 1.5
                  }}
                >
                  <MarkdownMessage text={m.content} isUser={m.role === "user"} />
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "16px 20px",
                  borderRadius: "20px 20px 20px 4px",
                  backgroundColor: "white",
                  color: "#64748b",
                  fontSize: 14,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input */}
          <div style={{ 
            padding: 20, 
            backgroundColor: "#fff", 
            borderTop: "1px solid #e2e8f0"
          }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  style={{ 
                    width: "100%",
                    padding: "16px 48px 16px 16px",
                    border: "1px solid #e2e8f0",
                    borderRadius: 20,
                    fontSize: 14,
                    outline: "none",
                    backgroundColor: "#f8fafc",
                    resize: "none",
                    minHeight: 56,
                    maxHeight: 120,
                    fontFamily: "inherit",
                    lineHeight: 1.5
                  }}
                  placeholder="Ask me about your career path, skills, or projects..."
                  disabled={isLoading}
                  rows={1}
                />
                <div style={{
                  position: "absolute",
                  right: 16,
                  bottom: 16,
                  color: "#94a3b8",
                  fontSize: 12
                }}>
                  ⏎ Enter
                </div>
              </div>
              <button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()}
                style={{ 
                  width: 56,
                  height: 56,
                  background: isLoading || !input.trim() 
                    ? "#cbd5e1" 
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                  fontSize: 20,
                  fontWeight: "bold",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && input.trim()) {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && input.trim()) {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "none";
                  }
                }}
              >
                {isLoading ? (
                  <div className="loading-spinner" style={{
                    width: 20,
                    height: 20,
                    border: "2px solid transparent",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }} />
                ) : (
                  "↑"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loading-dots {
          display: flex;
          gap: 4px;
        }
        
        .loading-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #64748b;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        
        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          } 40% { 
            transform: scale(1.0);
          }
        }
      `}</style>
    </>
  );
}