const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const fetch = require("node-fetch");
const User = require("../models/User");

// Simple role -> required skills map (can be expanded or moved to DB)
const ROLE_SKILL_MAP = {
  "frontend developer": [
    "javascript",
    "react",
    "html",
    "css",
    "typescript",
    "webpack",
    "testing",
  ],
  "backend developer": [
    "node",
    "express",
    "mongodb",
    "postgresql",
    "rest",
    "testing",
    "docker",
  ],
  "full stack developer": [
    "javascript",
    "react",
    "node",
    "express",
    "mongodb",
    "html",
    "css",
  ],
  // Alias: treat generic "software developer" similar to full-stack for broader coverage
  "software developer": [
    "javascript",
    "react",
    "node",
    "express",
    "mongodb",
    "html",
    "css",
    "testing",
    "git"
  ],
  
  "Frontend Developer": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Webpack"
  ],
  "Backend Developer": [
    "Node.js",
    "Express",
    "MongoDB",
    "SQL",
    "JWT"
  ],
  "Full Stack Developer": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB"
  ],
  "Mobile App Developer": [
    "Java",
    "Kotlin",
    "Swift",
    "React Native",
    "Flutter"
  ],
  "DevOps Engineer": [
    "Docker",
    "Kubernetes",
    "Jenkins",
    "AWS",
    "Terraform"
  ],
  "Cloud Engineer": [
    "AWS",
    "Azure",
    "Google Cloud",
    "Kubernetes",
    "CI/CD"
  ],
  "Data Scientist": [
    "Python",
    "R",
    "Pandas",
    "NumPy",
    "Machine Learning",
    "TensorFlow"
  ],
  "Machine Learning Engineer": [
    "Python",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Deep Learning"
  ],
  "AI Engineer": [
    "Python",
    "NLP",
    "Computer Vision",
    "Deep Learning",
    "TensorFlow"
  ],
  "Cybersecurity Engineer": [
    "Network Security",
    "Firewalls",
    "Penetration Testing",
    "SIEM",
    "Ethical Hacking"
  ],
  "Database Administrator": [
    "SQL",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Database Tuning"
  ],
  "UI/UX Designer": [
    "Figma",
    "Adobe XD",
    "Sketch",
    "Wireframing",
    "Prototyping"
  ],
  "Game Developer": [
    "Unity",
    "Unreal Engine",
    "C#",
    "C++",
    "3D Modeling"
  ],
  "Blockchain Developer": [
    "Solidity",
    "Ethereum",
    "Smart Contracts",
    "Web3.js",
    "Cryptography"
  ],
  "Big Data Engineer": [
    "Hadoop",
    "Spark",
    "Kafka",
    "Scala",
    "Hive"
  ],
  "Data Engineer": [
    "Python",
    "ETL",
    "SQL",
    "Airflow",
    "Spark"
  ],
  "AR/VR Developer": [
    "Unity",
    "Unreal Engine",
    "C#",
    "3D Modeling",
    "Oculus SDK"
  ],
  "Embedded Systems Engineer": [
    "C",
    "C++",
    "Microcontrollers",
    "RTOS",
    "IoT"
  ],
  "IoT Developer": [
    "Python",
    "C",
    "Arduino",
    "Raspberry Pi",
    "MQTT"
  ],
  "Software Engineer": [
    "Java",
    "C++",
    "Python",
    "Software Design Patterns",
    "Git"
  ],
  "Web Developer": [
    "HTML",
    "CSS",
    "JavaScript",
    "PHP",
    "SQL"
  ],
  "PHP Developer": [
    "PHP",
    "Laravel",
    "MySQL",
    "JavaScript",
    "jQuery"
  ],
  "Java Developer": [
    "Java",
    "Spring Boot",
    "Hibernate",
    "Maven",
    "REST APIs"
  ],
  "Python Developer": [
    "Python",
    "Flask",
    "Django",
    "Pandas",
    "SQLAlchemy"
  ],
  "C++ Developer": [
    "C++",
    "STL",
    "Multithreading",
    "Design Patterns",
    "Boost"
  ],
  "C# Developer": [
    "C#",
    ".NET Core",
    "ASP.NET",
    "Entity Framework",
    "LINQ"
  ],
  "Go Developer": [
    "Go",
    "gRPC",
    "Docker",
    "Microservices",
    "PostgreSQL"
  ],
  "Rust Developer": [
    "Rust",
    "Concurrency",
    "Memory Management",
    "Cargo",
    "WebAssembly"
  ],
  "Kotlin Developer": [
    "Kotlin",
    "Android Studio",
    "Coroutines",
    "MVVM",
    "Jetpack Compose"
  ],
  "Swift Developer": [
    "Swift",
    "Xcode",
    "iOS SDK",
    "UIKit",
    "Core Data"
  ],
  "RPA Developer": [
    "UiPath",
    "Automation Anywhere",
    "Blue Prism",
    "Python",
    "Excel Macros"
  ],
  "QA Engineer": [
    "Selenium",
    "JUnit",
    "TestNG",
    "Postman",
    "Cucumber"
  ],
  "Automation Test Engineer": [
    "Selenium",
    "Appium",
    "Robot Framework",
    "CI/CD",
    "Python"
  ],
  "Performance Test Engineer": [
    "JMeter",
    "LoadRunner",
    "Gatling",
    "Monitoring Tools",
    "CI/CD"
  ],
  "Penetration Tester": [
    "Kali Linux",
    "Metasploit",
    "Burp Suite",
    "Wireshark",
    "Nmap"
  ],
  "Network Engineer": [
    "Cisco",
    "Switching",
    "Routing",
    "Firewalls",
    "VPN"
  ],
  "Systems Engineer": [
    "Linux",
    "Windows Server",
    "Shell Scripting",
    "Active Directory",
    "Networking"
  ],
  "Site Reliability Engineer": [
    "Python",
    "Kubernetes",
    "Monitoring",
    "Cloud",
    "CI/CD"
  ],
  "Solutions Architect": [
    "AWS",
    "Azure",
    "Microservices",
    "API Design",
    "Cloud Security"
  ],
  "Enterprise Architect": [
    "TOGAF",
    "Cloud Platforms",
    "Integration",
    "DevOps",
    "Business Analysis"
  ],
  "Product Manager": [
    "Agile",
    "Scrum",
    "Roadmapping",
    "Wireframing",
    "Market Research"
  ],
  "Project Manager": [
    "Agile",
    "Scrum",
    "Kanban",
    "MS Project",
    "Risk Management"
  ],
  "Scrum Master": [
    "Agile",
    "Scrum",
    "Kanban",
    "Facilitation",
    "JIRA"
  ],
  "Business Analyst": [
    "Requirement Gathering",
    "SQL",
    "Process Modelling",
    "UML",
    "Agile"
  ],
  "ERP Consultant": [
    "SAP",
    "Oracle ERP",
    "Business Process",
    "SQL",
    "Integration"
  ],
  "CRM Developer": [
    "Salesforce",
    "Apex",
    "Visualforce",
    "JavaScript",
    "SQL"
  ],
  "Salesforce Developer": [
    "Apex",
    "Visualforce",
    "Lightning Web Components",
    "Salesforce APIs",
    "SOQL"
  ],
  "ServiceNow Developer": [
    "JavaScript",
    "Glide API",
    "Workflows",
    "ITSM",
    "Integration"
  ],
  "ETL Developer": [
    "Informatica",
    "Talend",
    "SQL",
    "Python",
    "Data Warehousing"
  ],
  "Data Analyst": [
    "Excel",
    "SQL",
    "Python",
    "Power BI",
    "Tableau"
  ],
  "BI Developer": [
    "Power BI",
    "Tableau",
    "SQL",
    "DAX",
    "ETL"
  ],
  "Data Architect": [
    "SQL",
    "NoSQL",
    "Data Modelling",
    "Cloud Databases",
    "Big Data"
  ],
  "Computer Vision Engineer": [
    "Python",
    "OpenCV",
    "TensorFlow",
    "Deep Learning",
    "PyTorch"
  ],
  "NLP Engineer": [
    "Python",
    "NLTK",
    "SpaCy",
    "Transformers",
    "TensorFlow"
  ],
  "Robotics Engineer": [
    "ROS",
    "Python",
    "C++",
    "Embedded Systems",
    "Computer Vision"
  ],
  "Control Systems Engineer": [
    "MATLAB",
    "Simulink",
    "C",
    "Automation",
    "PLC"
  ],
  "Game Designer": [
    "Game Mechanics",
    "Level Design",
    "Unity",
    "Unreal",
    "Storytelling"
  ],
  "3D Animator": [
    "Blender",
    "Maya",
    "3ds Max",
    "Rigging",
    "Rendering"
  ],
  "Graphic Designer": [
    "Photoshop",
    "Illustrator",
    "InDesign",
    "Figma",
    "Canva"
  ],
  "Content Strategist": [
    "SEO",
    "Content Writing",
    "Analytics",
    "WordPress",
    "Social Media"
  ],
  "SEO Specialist": [
    "SEO",
    "Google Analytics",
    "Keyword Research",
    "On-Page SEO",
    "Backlinks"
  ],
  "Digital Marketing Specialist": [
    "Google Ads",
    "Facebook Ads",
    "SEO",
    "Analytics",
    "Email Marketing"
  ],
  "Cloud Security Engineer": [
    "AWS Security",
    "IAM",
    "Encryption",
    "Firewalls",
    "SIEM"
  ],
  "Information Security Analyst": [
    "Threat Detection",
    "Incident Response",
    "SIEM",
    "Malware Analysis",
    "Risk Assessment"
  ],
  "Compliance Analyst": [
    "GDPR",
    "HIPAA",
    "ISO 27001",
    "Risk Management",
    "Auditing"
  ],
  "IT Support Specialist": [
    "Windows",
    "Linux",
    "Networking",
    "Troubleshooting",
    "Customer Support"
  ],
  "Help Desk Technician": [
    "Windows",
    "Linux",
    "Active Directory",
    "Troubleshooting",
    "Ticketing Systems"
  ],
  "Systems Administrator": [
    "Windows Server",
    "Linux",
    "VMware",
    "Shell Scripting",
    "Networking"
  ],
  "Release Manager": [
    "CI/CD",
    "Jenkins",
    "Git",
    "Version Control",
    "Release Planning"
  ],
  "Build Engineer": [
    "CI/CD",
    "Jenkins",
    "Maven",
    "Gradle",
    "Docker"
  ],
  "Integration Engineer": [
    "API Integration",
    "Microservices",
    "REST",
    "SOAP",
    "Middleware"
  ],
  "Middleware Engineer": [
    "WebLogic",
    "JBoss",
    "Kafka",
    "RabbitMQ",
    "Integration"
  ],
  "Storage Engineer": [
    "SAN",
    "NAS",
    "VMware",
    "Backup Tools",
    "Cloud Storage"
  ],
  "Linux Administrator": [
    "Linux",
    "Bash",
    "Networking",
    "Shell Scripting",
    "Firewall"
  ],
  "Windows Administrator": [
    "Windows Server",
    "PowerShell",
    "Active Directory",
    "IIS",
    "Exchange Server"
  ],
  "SAP Consultant": [
    "SAP ABAP",
    "SAP HANA",
    "SAP FICO",
    "SAP MM",
    "SQL"
  ],
  "Oracle DBA": [
    "Oracle DB",
    "PL/SQL",
    "Backup & Recovery",
    "Performance Tuning",
    "RAC"
  ],
  "Hadoop Developer": [
    "Hadoop",
    "MapReduce",
    "Hive",
    "Pig",
    "HDFS"
  ],
  "Spark Developer": [
    "Apache Spark",
    "Scala",
    "Python",
    "Kafka",
    "HDFS"
  ],
  "Kafka Developer": [
    "Apache Kafka",
    "Java",
    "Zookeeper",
    "Streams API",
    "Microservices"
  ],
  "Power BI Developer": [
    "Power BI",
    "DAX",
    "SQL",
    "Data Modeling",
    "ETL"
  ],
  "Tableau Developer": [
    "Tableau",
    "SQL",
    "Data Visualization",
    "ETL",
    "Analytics"
  ],
  "Mobile Game Developer": [
    "Unity",
    "C#",
    "Java",
    "Android",
    "iOS"
  ],
  "VR Game Developer": [
    "Unity",
    "C#",
    "Oculus SDK",
    "Unreal Engine",
    "3D Modeling"
  ],
  "E-commerce Developer": [
    "Shopify",
    "Magento",
    "WooCommerce",
    "JavaScript",
    "SQL"
  ],
  "WordPress Developer": [
    "PHP",
    "WordPress",
    "MySQL",
    "HTML",
    "CSS"
  ],
  "Drupal Developer": [
    "PHP",
    "Drupal",
    "MySQL",
    "JavaScript",
    "Twig"
  ],
  "Joomla Developer": [
    "PHP",
    "Joomla",
    "MySQL",
    "HTML",
    "CSS"
  ],
  "Automation Engineer": [
    "Python",
    "Selenium",
    "Bash",
    "CI/CD",
    "Docker"
  ],
  "AI Research Scientist": [
    "Deep Learning",
    "NLP",
    "Computer Vision",
    "Reinforcement Learning",
    "Python"
  ],
  "Quantitative Analyst": [
    "Python",
    "R",
    "Mathematics",
    "Statistics",
    "Machine Learning"
  ],
  "Financial Software Developer": [
    "Java",
    "C#",
    "Python",
    "SQL",
    "Financial Modelling"
  ],
  "Health Informatics Specialist": [
    "HL7",
    "FHIR",
    "SQL",
    "Data Analytics",
    "Python"
  ],
  "Bioinformatics Engineer": [
    "Python",
    "R",
    "Biostatistics",
    "Genomics",
    "Data Visualization"
  ]

};

// Export the ROLE_SKILL_MAP
exports.ROLE_SKILL_MAP = ROLE_SKILL_MAP;

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+.# ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTokens(text) {
  const base = normalize(text);
  const tokens = new Set();
  base.split(" ").forEach((t) => {
    if (!t) return;
    tokens.add(t);
  });
  return tokens;
}

exports.analyzeLatestResume = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("resumes desiredRoles");
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!Array.isArray(user.resumes) || user.resumes.length === 0) {
      // Clear stored skills when no resume is present
      await User.findByIdAndUpdate(userId, { 
        resumeDetectedSkills: [] 
      });
      return res.status(200).json({ message: "No resumes uploaded", missingSkills: [], presentSkills: [], desiredRoles: user.desiredRoles || [], noResume: true, allDetectedSkills: [] });
    }

    // Use the most recent resume
    const latest = user.resumes[user.resumes.length - 1];
    const url = latest.url || ""; // format: /uploads/<file>
    const filename = url.split("/uploads/")[1];
    if (!filename) return res.status(400).json({ message: "Invalid resume URL" });

    const filePath = path.join(__dirname, "..", "uploads", filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "Resume file not found" });

    const buffer = fs.readFileSync(filePath);
    const parsed = await pdfParse(buffer).catch(() => ({ text: "" }));
    const text = parsed.text || "";
    const normalizedText = normalize(text);

    // Optionally call external AI service (spaCy) if configured
    let externalTokens = [];
    const serviceUrl = process.env.AI_SERVICE_URL;
    if (serviceUrl) {
      try {
        const resp = await fetch(`${serviceUrl.replace(/\/$/, "")}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          timeout: 10000,
        });
        if (resp.ok) {
          const data = await resp.json().catch(() => ({}));
          if (Array.isArray(data?.tokens)) externalTokens = data.tokens.map((t) => String(t).toLowerCase());
        }
      } catch {}
    }

    // Extract present skills from resume text
    const tokens = new Set([...extractTokens(text), ...externalTokens]);

    // Extract present projects (very simple heuristic: lines containing keywords)
    const lines = String(text || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const projectKeywords = ["project", "built", "developed", "implemented", "created", "portfolio", "system", "application", "app"];
    const presentProjects = Array.from(
      new Set(
        lines
          .filter((l) => projectKeywords.some((k) => l.toLowerCase().includes(k)))
          .slice(0, 20)
      )
    );

    // Determine target skills from desired roles
    const desiredRoles = Array.isArray(user.desiredRoles) ? user.desiredRoles : [];

    // If no desired roles are provided, do not compute a gap. Return only detected present skills.
    if (!desiredRoles || desiredRoles.length === 0) {
      // Build a union of all known skills from ROLE_SKILL_MAP to filter tokens
      const knownSkills = new Set();
      Object.values(ROLE_SKILL_MAP).forEach((arr) => {
        (arr || []).forEach((s) => knownSkills.add(String(s).toLowerCase()));
      });

      const present = new Set();
      for (const skill of knownSkills) {
        const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const boundaryRe = new RegExp(`\\b${escaped}\\b`, "i");
        if (tokens.has(skill) || boundaryRe.test(normalizedText)) {
          present.add(skill);
        }
      }

      // Store all detected skills in user profile even when no desired roles
      const allDetectedSkills = Array.from(present).sort();
      await User.findByIdAndUpdate(userId, { 
        resumeDetectedSkills: allDetectedSkills 
      });

      return res.json({
        resume: { name: latest.name, url: latest.url, uploadedAt: latest.uploadedAt },
        desiredRoles,
        presentSkills: Array.from(present).sort(),
        missingSkills: [],
        presentProjects,
        allDetectedSkills, // Include all detected skills in response
      });
    }

    const requiredSkillSet = new Set();
    desiredRoles.forEach((role) => {
      const roleStr = String(role || "").toLowerCase().trim();
      // Try exact match first, then partial matches
      let skills = ROLE_SKILL_MAP[roleStr] || [];
      if (skills.length === 0) {
        // Try partial matching for roles like "Frontend Developer" -> "frontend developer"
        for (const [key, value] of Object.entries(ROLE_SKILL_MAP)) {
          if (key.includes(roleStr) || roleStr.includes(key)) {
            skills = value;
            break;
          }
        }
      }
      skills.forEach((s) => requiredSkillSet.add(s));
    });

    // First, detect ALL skills from resume (not just required ones)
    const allKnownSkills = new Set();
    Object.values(ROLE_SKILL_MAP).forEach((arr) => {
      (arr || []).forEach((s) => allKnownSkills.add(String(s).toLowerCase()));
    });

    const allPresentSkills = new Set();
    for (const skill of allKnownSkills) {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const boundaryRe = new RegExp(`\\b${escaped}\\b`, "i");
      if (tokens.has(skill) || boundaryRe.test(normalizedText)) {
        allPresentSkills.add(skill);
      }
    }

    // Then check which required skills are present
    const present = new Set();
    for (const reqSkill of requiredSkillSet) {
      const lower = reqSkill.toLowerCase();
      if (allPresentSkills.has(lower)) {
        present.add(reqSkill);
      }
    }

    const missing = Array.from(requiredSkillSet).filter((s) => !present.has(s));

    // Store all detected skills in user profile
    const allDetectedSkills = Array.from(allPresentSkills).sort();
    await User.findByIdAndUpdate(userId, { 
      resumeDetectedSkills: allDetectedSkills 
    });

    return res.json({
      resume: { name: latest.name, url: latest.url, uploadedAt: latest.uploadedAt },
      desiredRoles,
      missingSkills: missing.sort(),
      presentSkills: Array.from(present).sort(),
      presentProjects,
      allDetectedSkills, // Include all detected skills in response
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


