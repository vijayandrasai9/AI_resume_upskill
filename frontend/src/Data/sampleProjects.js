const path = require("path");

// Comprehensive static projects database for ALL roles
const staticRoleProjects = {
  'frontend developer': [
      {
        title: "E-commerce Product Gallery",
        description: "Build a responsive product gallery with filtering, sorting, and cart functionality",
        requiredSkills: ["React", "JavaScript", "CSS", "API Integration"],
        resources: [
          {
            title: "React Shopping Cart Tutorial",
            url: "https://reactjs.org/tutorial/tutorial.html",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("E-commerce Product Gallery")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Weather Dashboard",
        description: "Create a weather application with location-based forecasts and interactive charts",
        requiredSkills: ["JavaScript", "API Integration", "Chart.js", "Async/Await"],
        resources: [
          {
            title: "Fetch API Documentation",
            url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "beginner",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Weather Dashboard")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Task Management App",
        description: "Build a drag-and-drop task management application with local storage",
        requiredSkills: ["React", "JavaScript", "CSS", "Local Storage"],
        resources: [
          {
            title: "React Drag and Drop Tutorial",
            url: "https://react-dnd.github.io/react-dnd/about",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Task Management App")}&role=${encodeURIComponent(role)}`
      }
    ],
    'backend developer': [
      {
        title: "REST API with Authentication",
        description: "Build a secure RESTful API with user authentication and CRUD operations",
        requiredSkills: ["Node.js", "Express", "MongoDB", "JWT", "REST APIs"],
        resources: [
          {
            title: "Express.js Documentation",
            url: "https://expressjs.com/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("REST API with Authentication")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Real-time Chat Application",
        description: "Create a real-time chat application with WebSocket integration",
        requiredSkills: ["Node.js", "Socket.io", "Express", "MongoDB"],
        resources: [
          {
            title: "Socket.io Documentation",
            url: "https://socket.io/docs/v4/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Real-time Chat Application")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Microservices Architecture",
        description: "Build a microservices-based application with API gateway",
        requiredSkills: ["Node.js", "Docker", "API Gateway", "Microservices"],
        resources: [
          {
            title: "Microservices Patterns",
            url: "https://microservices.io/patterns/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Microservices Architecture")}&role=${encodeURIComponent(role)}`
      }
    ],
    'full stack developer': [
      {
        title: "Task Management App",
        description: "Full-stack application with user authentication, CRUD operations, and real-time updates",
        requiredSkills: ["React", "Node.js", "MongoDB", "Express", "JWT"],
        resources: [
          {
            title: "MERN Stack Tutorial",
            url: "https://www.mongodb.com/languages/mern-stack-tutorial",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Task Management App")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "E-commerce Platform",
        description: "Build a complete e-commerce platform with payment integration",
        requiredSkills: ["React", "Node.js", "MongoDB", "Stripe API", "Authentication"],
        resources: [
          {
            title: "Stripe Integration Guide",
            url: "https://stripe.com/docs/payments",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("E-commerce Platform")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Social Media Dashboard",
        description: "Create a dashboard for managing social media accounts and analytics",
        requiredSkills: ["React", "Node.js", "MySQL", "REST APIs", "Chart.js"],
        resources: [
          {
            title: "Chart.js Documentation",
            url: "https://www.chartjs.org/docs/latest/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Social Media Dashboard")}&role=${encodeURIComponent(role)}`
      }
    ],
    'software developer': [
      {
        title: "Portfolio Website with Blog",
        description: "Create a personal portfolio website with integrated blog functionality",
        requiredSkills: ["JavaScript", "React", "Node.js", "MongoDB", "CSS"],
        resources: [
          {
            title: "Full Stack Development Guide",
            url: "https://developer.mozilla.org/en-US/docs/Learn",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Portfolio Website with Blog")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Code Review Tool",
        description: "Build a tool for automated code review and quality assessment",
        requiredSkills: ["Java", "Python", "Git", "Code Analysis", "APIs"],
        resources: [
          {
            title: "GitHub API Documentation",
            url: "https://docs.github.com/en/rest",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Code Review Tool")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Algorithm Visualizer",
        description: "Create a web application to visualize sorting and searching algorithms",
        requiredSkills: ["JavaScript", "HTML5", "CSS", "Algorithms", "Data Structures"],
        resources: [
          {
            title: "JavaScript Algorithms Course",
            url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
            type: "course"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Algorithm Visualizer")}&role=${encodeURIComponent(role)}`
      }
    ],
    'mobile app developer': [
      {
        title: "Weather Mobile App",
        description: "Create a cross-platform mobile app that displays weather information",
        requiredSkills: ["React Native", "JavaScript", "API Integration", "Mobile UI"],
        resources: [
          {
            title: "React Native Documentation",
            url: "https://reactnative.dev/docs/getting-started",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Weather Mobile App")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Fitness Tracking App",
        description: "Build a mobile app for tracking workouts and fitness progress",
        requiredSkills: ["React Native", "Firebase", "Charts", "Local Storage"],
        resources: [
          {
            title: "Firebase Mobile Tutorial",
            url: "https://firebase.google.com/docs/build",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Fitness Tracking App")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "E-commerce Mobile App",
        description: "Create a mobile shopping app with cart and payment features",
        requiredSkills: ["Flutter", "Dart", "Firebase", "Payment Integration"],
        resources: [
          {
            title: "Flutter Documentation",
            url: "https://flutter.dev/docs",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("E-commerce Mobile App")}&role=${encodeURIComponent(role)}`
      }
    ],
    'devops engineer': [
      {
        title: "CI/CD Pipeline Setup",
        description: "Build a complete CI/CD pipeline with automated testing and deployment",
        requiredSkills: ["Docker", "Jenkins", "Kubernetes", "AWS", "Git"],
        resources: [
          {
            title: "Docker Documentation",
            url: "https://docs.docker.com/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("CI/CD Pipeline Setup")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Infrastructure as Code",
        description: "Automate cloud infrastructure deployment using Terraform",
        requiredSkills: ["Terraform", "AWS", "Infrastructure", "Automation"],
        resources: [
          {
            title: "Terraform Documentation",
            url: "https://www.terraform.io/docs",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Infrastructure as Code")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Monitoring and Logging System",
        description: "Set up comprehensive monitoring and logging for applications",
        requiredSkills: ["Prometheus", "Grafana", "ELK Stack", "Monitoring"],
        resources: [
          {
            title: "Prometheus Documentation",
            url: "https://prometheus.io/docs/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Monitoring and Logging System")}&role=${encodeURIComponent(role)}`
      }
    ],
    'cloud engineer': [
      {
        title: "Cloud Infrastructure Deployment",
        description: "Deploy and manage cloud infrastructure using infrastructure as code",
        requiredSkills: ["AWS", "Terraform", "Docker", "Kubernetes", "CI/CD"],
        resources: [
          {
            title: "AWS Documentation",
            url: "https://aws.amazon.com/documentation/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Cloud Infrastructure Deployment")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Multi-cloud Strategy Implementation",
        description: "Design and implement a strategy for using multiple cloud providers",
        requiredSkills: ["AWS", "Azure", "Google Cloud", "Multi-cloud", "Networking"],
        resources: [
          {
            title: "AWS Multi-account Strategy",
            url: "https://aws.amazon.com/organizations/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Multi-cloud Strategy Implementation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Serverless Application Architecture",
        description: "Build a complete serverless application using cloud functions",
        requiredSkills: ["AWS Lambda", "API Gateway", "DynamoDB", "Serverless"],
        resources: [
          {
            title: "AWS Serverless Documentation",
            url: "https://aws.amazon.com/serverless/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Serverless Application Architecture")}&role=${encodeURIComponent(role)}`
      }
    ],
    'data scientist': [
      {
        title: "COVID-19 Data Analysis",
        description: "Analyze COVID-19 datasets to identify trends and build predictive models",
        requiredSkills: ["Python", "Pandas", "Matplotlib", "Scikit-learn"],
        resources: [
          {
            title: "Pandas Documentation",
            url: "https://pandas.pydata.org/docs/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("COVID-19 Data Analysis")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Customer Segmentation Analysis",
        description: "Use clustering algorithms to segment customers for marketing",
        requiredSkills: ["Python", "Scikit-learn", "K-means", "Data Visualization"],
        resources: [
          {
            title: "Scikit-learn Clustering Guide",
            url: "https://scikit-learn.org/stable/modules/clustering.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Customer Segmentation Analysis")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Time Series Forecasting",
        description: "Build forecasting models for sales and demand prediction",
        requiredSkills: ["Python", "ARIMA", "Prophet", "Time Series Analysis"],
        resources: [
          {
            title: "Time Series Analysis Tutorial",
            url: "https://otexts.com/fpp2/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Time Series Forecasting")}&role=${encodeURIComponent(role)}`
      }
    ],
    'machine learning engineer': [
      {
        title: "Image Classification Model",
        description: "Build and train a neural network for image classification using TensorFlow",
        requiredSkills: ["Python", "TensorFlow", "Deep Learning", "Computer Vision"],
        resources: [
          {
            title: "TensorFlow Tutorials",
            url: "https://www.tensorflow.org/tutorials",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Image Classification Model")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Recommendation System",
        description: "Create a recommendation engine for products or content",
        requiredSkills: ["Python", "Collaborative Filtering", "Matrix Factorization", "MLlib"],
        resources: [
          {
            title: "Recommender Systems Guide",
            url: "https://developers.google.com/machine-learning/recommendation",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Recommendation System")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Natural Language Processing Pipeline",
        description: "Build an NLP pipeline for text classification and sentiment analysis",
        requiredSkills: ["Python", "NLTK", "Transformers", "Text Processing"],
        resources: [
          {
            title: "NLTK Book",
            url: "https://www.nltk.org/book/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Natural Language Processing Pipeline")}&role=${encodeURIComponent(role)}`
      }
    ],
    'ai engineer': [
      {
        title: "Chatbot with NLP",
        description: "Build an intelligent chatbot using natural language processing techniques",
        requiredSkills: ["Python", "NLP", "TensorFlow", "Deep Learning"],
        resources: [
          {
            title: "NLP with TensorFlow",
            url: "https://www.tensorflow.org/tutorials/text/nlp_with_keras",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Chatbot with NLP")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Computer Vision Application",
        description: "Develop a computer vision system for object detection and recognition",
        requiredSkills: ["Python", "OpenCV", "TensorFlow", "Computer Vision"],
        resources: [
          {
            title: "OpenCV Tutorials",
            url: "https://docs.opencv.org/master/d9/df8/tutorial_root.html",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Computer Vision Application")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "AI-powered Search Engine",
        description: "Build a semantic search engine using vector embeddings",
        requiredSkills: ["Python", "Word Embeddings", "Semantic Search", "AI Models"],
        resources: [
          {
            title: "Vector Search Tutorial",
            url: "https://www.pinecone.io/learn/vector-search/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("AI-powered Search Engine")}&role=${encodeURIComponent(role)}`
      }
    ],
    'ar/vr developer': [
      {
        title: "Virtual Museum Tour",
        description: "Create an immersive VR experience that allows users to explore a virtual museum",
        requiredSkills: ["Unity", "C#", "3D Modeling", "VR Development", "Oculus SDK"],
        resources: [
          {
            title: "Unity VR Development Guide",
            url: "https://learn.unity.com/tutorial/vr-best-practices",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Virtual Museum Tour")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "AR Furniture Placement App",
        description: "Build an AR application that lets users visualize furniture in their space",
        requiredSkills: ["Unity", "C#", "AR Foundation", "3D Modeling", "Mobile Development"],
        resources: [
          {
            title: "ARCore Documentation",
            url: "https://developers.google.com/ar",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("AR Furniture Placement App")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "VR Training Simulation",
        description: "Develop a VR training simulation for educational or industrial purposes",
        requiredSkills: ["Unity", "C#", "VR Interaction", "Simulation", "3D Assets"],
        resources: [
          {
            title: "Unity XR Interaction Toolkit",
            url: "https://docs.unity3d.com/Packages/com.unity.xr.interaction.toolkit@2.0/manual/index.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("VR Training Simulation")}&role=${encodeURIComponent(role)}`
      }
    ],
    'vr game developer': [
      {
        title: "VR Adventure Game",
        description: "Develop an immersive VR game with interactive environments and gameplay",
        requiredSkills: ["Unity", "C#", "Oculus SDK", "3D Modeling", "Game Design"],
        resources: [
          {
            title: "Oculus Developer Documentation",
            url: "https://developer.oculus.com/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("VR Adventure Game")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "VR Puzzle Game",
        description: "Create a puzzle game specifically designed for VR interaction",
        requiredSkills: ["Unity", "C#", "VR Controls", "Puzzle Design", "3D Physics"],
        resources: [
          {
            title: "Unity VR Tutorials",
            url: "https://learn.unity.com/pathway/creating-in-vr",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("VR Puzzle Game")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Multiplayer VR Experience",
        description: "Build a social VR experience with multiplayer capabilities",
        requiredSkills: ["Unity", "C#", "Networking", "VR Avatars", "Multiplayer"],
        resources: [
          {
            title: "Unity Networking Guide",
            url: "https://docs-multiplayer.unity3d.com/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Multiplayer VR Experience")}&role=${encodeURIComponent(role)}`
      }
    ],
    'game developer': [
      {
        title: "2D Platformer Game",
        description: "Create a complete 2D platformer game with character movement and levels",
        requiredSkills: ["Unity", "C#", "Game Physics", "Level Design", "2D Animation"],
        resources: [
          {
            title: "Unity 2D Game Development",
            url: "https://learn.unity.com/pathway/unity-2d-game-development",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("2D Platformer Game")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "3D First-Person Shooter",
        description: "Develop a 3D FPS game with weapons, enemies, and levels",
        requiredSkills: ["Unity", "C#", "3D Modeling", "AI Behavior", "Game Physics"],
        resources: [
          {
            title: "Unity FPS Tutorial",
            url: "https://learn.unity.com/project/fps-microgame",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("3D First-Person Shooter")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Mobile Casual Game",
        description: "Create a simple but addictive mobile game for iOS and Android",
        requiredSkills: ["Unity", "C#", "Mobile Optimization", "UI/UX", "Game Design"],
        resources: [
          {
            title: "Unity Mobile Development",
            url: "https://unity.com/solutions/mobile",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Mobile Casual Game")}&role=${encodeURIComponent(role)}`
      }
    ],
    'blockchain developer': [
      {
        title: "NFT Marketplace",
        description: "Build a decentralized marketplace for buying and selling NFTs",
        requiredSkills: ["Solidity", "Ethereum", "Smart Contracts", "Web3.js", "React"],
        resources: [
          {
            title: "Solidity Documentation",
            url: "https://docs.soliditylang.org/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("NFT Marketplace")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "DeFi Lending Protocol",
        description: "Create a decentralized lending and borrowing platform",
        requiredSkills: ["Solidity", "DeFi", "Smart Contracts", "Web3", "Cryptography"],
        resources: [
          {
            title: "DeFi Development Guide",
            url: "https://ethereum.org/en/defi/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("DeFi Lending Protocol")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "DAO Governance System",
        description: "Build a decentralized autonomous organization with voting mechanisms",
        requiredSkills: ["Solidity", "DAO", "Governance", "Voting Systems", "Web3"],
        resources: [
          {
            title: "DAO Development Tutorial",
            url: "https://ethereum.org/en/dao/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("DAO Governance System")}&role=${encodeURIComponent(role)}`
      }
    ],
    'iot developer': [
      {
        title: "Smart Home System",
        description: "Create an IoT system for home automation using Raspberry Pi and sensors",
        requiredSkills: ["Python", "Raspberry Pi", "IoT", "MQTT", "Sensors"],
        resources: [
          {
            title: "Raspberry Pi Projects",
            url: "https://projects.raspberrypi.org/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Smart Home System")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Environmental Monitoring System",
        description: "Build a system to monitor temperature, humidity, and air quality",
        requiredSkills: ["Python", "Arduino", "Sensors", "Data Logging", "IoT Protocols"],
        resources: [
          {
            title: "Arduino Getting Started",
            url: "https://www.arduino.cc/en/Guide",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Environmental Monitoring System")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "IoT Asset Tracking",
        description: "Develop a system for tracking assets using GPS and IoT sensors",
        requiredSkills: ["Python", "GPS", "LoRaWAN", "Cloud Integration", "Mobile App"],
        resources: [
          {
            title: "IoT Protocols Guide",
            url: "https://www.postscapes.com/internet-of-things-protocols/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("IoT Asset Tracking")}&role=${encodeURIComponent(role)}`
      }
    ],
    'embedded systems engineer': [
      {
        title: "Real-time Monitoring System",
        description: "Develop an embedded system for real-time environmental monitoring",
        requiredSkills: ["C", "C++", "Microcontrollers", "RTOS", "Sensors"],
        resources: [
          {
            title: "Embedded C Programming Guide",
            url: "https://www.embedded.com/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Real-time Monitoring System")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Automated Control System",
        description: "Build an automated control system for industrial applications",
        requiredSkills: ["C", "PLC", "Automation", "Control Systems", "Embedded Linux"],
        resources: [
          {
            title: "Embedded Systems Design",
            url: "https://www.embedded.com/design/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Automated Control System")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Low-power IoT Device",
        description: "Design and program a battery-efficient IoT device",
        requiredSkills: ["C", "Low-power Design", "Battery Management", "Wireless Protocols"],
        resources: [
          {
            title: "Low-power Embedded Design",
            url: "https://www.embedded.com/low-power-design/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Low-power IoT Device")}&role=${encodeURIComponent(role)}`
      }
    ],
    'robotics engineer': [
      {
        title: "Autonomous Robot Navigation",
        description: "Build a robot that can navigate autonomously using sensors and AI",
        requiredSkills: ["ROS", "Python", "C++", "Robotics", "Computer Vision"],
        resources: [
          {
            title: "ROS Documentation",
            url: "https://docs.ros.org/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Autonomous Robot Navigation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Robotic Arm Control System",
        description: "Develop control software for a multi-axis robotic arm",
        requiredSkills: ["C++", "Kinematics", "Motion Planning", "Control Theory"],
        resources: [
          {
            title: "Robotics Control Systems",
            url: "https://ocw.mit.edu/courses/mechanical-engineering/2-12-introduction-to-robotics-fall-2005/",
            type: "course"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Robotic Arm Control System")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Swarm Robotics Simulation",
        description: "Create a simulation of multiple robots working together",
        requiredSkills: ["Python", "Simulation", "Multi-agent Systems", "ROS"],
        resources: [
          {
            title: "Gazebo Simulator Tutorial",
            url: "http://gazebosim.org/tutorials",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Swarm Robotics Simulation")}&role=${encodeURIComponent(role)}`
      }
    ],
    'computer vision engineer': [
      {
        title: "Object Detection System",
        description: "Create a computer vision system that can detect and classify objects in real-time",
        requiredSkills: ["Python", "OpenCV", "TensorFlow", "Computer Vision", "Deep Learning"],
        resources: [
          {
            title: "OpenCV Tutorials",
            url: "https://docs.opencv.org/master/d9/df8/tutorial_root.html",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Object Detection System")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Facial Recognition Application",
        description: "Build a system that can recognize and verify faces",
        requiredSkills: ["Python", "OpenCV", "Face Recognition", "Deep Learning"],
        resources: [
          {
            title: "Face Recognition Guide",
            url: "https://github.com/ageitgey/face_recognition",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Facial Recognition Application")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Image Segmentation Project",
        description: "Implement semantic segmentation for image analysis",
        requiredSkills: ["Python", "TensorFlow", "Image Processing", "Neural Networks"],
        resources: [
          {
            title: "Image Segmentation Tutorial",
            url: "https://www.tensorflow.org/tutorials/images/segmentation",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Image Segmentation Project")}&role=${encodeURIComponent(role)}`
      }
    ],
    'nlp engineer': [
      {
        title: "Text Classification System",
        description: "Build an NLP system for text classification and sentiment analysis",
        requiredSkills: ["Python", "NLTK", "Transformers", "TensorFlow", "NLP"],
        resources: [
          {
            title: "Hugging Face Transformers",
            url: "https://huggingface.co/docs/transformers/index",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Text Classification System")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Chatbot with Context Awareness",
        description: "Create an intelligent chatbot that maintains conversation context",
        requiredSkills: ["Python", "Dialog Systems", "NLP", "Context Management"],
        resources: [
          {
            title: "Chatbot Development Guide",
            url: "https://www.rasa.com/docs/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Chatbot with Context Awareness")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Text Summarization Tool",
        description: "Build a tool that automatically summarizes long documents",
        requiredSkills: ["Python", "Text Summarization", "NLP", "Transformer Models"],
        resources: [
          {
            title: "Text Summarization Tutorial",
            url: "https://huggingface.co/tasks/summarization",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Text Summarization Tool")}&role=${encodeURIComponent(role)}`
      }
    ],
    'data engineer': [
      {
        title: "ETL Pipeline with Airflow",
        description: "Build a data pipeline for extracting, transforming and loading data",
        requiredSkills: ["Python", "ETL", "Airflow", "SQL", "Data Warehousing"],
        resources: [
          {
            title: "Apache Airflow Guide",
            url: "https://airflow.apache.org/docs/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("ETL Pipeline with Airflow")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Real-time Data Streaming",
        description: "Create a real-time data streaming pipeline with Kafka",
        requiredSkills: ["Kafka", "Python", "Stream Processing", "Real-time Data"],
        resources: [
          {
            title: "Kafka Documentation",
            url: "https://kafka.apache.org/documentation/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Real-time Data Streaming")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Data Lake Architecture",
        description: "Design and implement a data lake for big data storage",
        requiredSkills: ["AWS S3", "Data Lake", "Big Data", "Data Architecture"],
        resources: [
          {
            title: "Data Lake Design Patterns",
            url: "https://aws.amazon.com/big-data/datalakes-and-analytics/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Data Lake Architecture")}&role=${encodeURIComponent(role)}`
      }
    ],
    'data analyst': [
      {
        title: "Business Analytics Dashboard",
        description: "Create interactive dashboards for business intelligence and reporting",
        requiredSkills: ["SQL", "Python", "Power BI", "Tableau", "Data Visualization"],
        resources: [
          {
            title: "Tableau Tutorials",
            url: "https://www.tableau.com/learn/training",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Business Analytics Dashboard")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Customer Behavior Analysis",
        description: "Analyze customer data to identify patterns and trends",
        requiredSkills: ["SQL", "Excel", "Statistical Analysis", "Data Mining"],
        resources: [
          {
            title: "SQL for Data Analysis",
            url: "https://mode.com/sql-tutorial/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Customer Behavior Analysis")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Sales Performance Reporting",
        description: "Build comprehensive sales reports with insights and recommendations",
        requiredSkills: ["Excel", "SQL", "Reporting", "Data Visualization"],
        resources: [
          {
            title: "Advanced Excel for Business",
            url: "https://support.microsoft.com/en-us/excel",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "beginner",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Sales Performance Reporting")}&role=${encodeURIComponent(role)}`
      }
    ],
    'cybersecurity engineer': [
      {
        title: "Network Security Assessment",
        description: "Conduct security assessment and vulnerability testing on networks",
        requiredSkills: ["Network Security", "Penetration Testing", "Firewalls", "SIEM"],
        resources: [
          {
            title: "Cybersecurity Framework",
            url: "https://www.nist.gov/cyberframework",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Network Security Assessment")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Incident Response Plan",
        description: "Develop and implement a comprehensive incident response plan",
        requiredSkills: ["Incident Response", "Security Operations", "Forensics", "Risk Assessment"],
        resources: [
          {
            title: "Incident Response Guide",
            url: "https://www.sans.org/reading-room/whitepapers/incident/incident-handlers-handbook-33901",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Incident Response Plan")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Security Monitoring System",
        description: "Build a system for continuous security monitoring and alerting",
        requiredSkills: ["SIEM", "Log Analysis", "Monitoring", "Alerting Systems"],
        resources: [
          {
            title: "Security Monitoring Best Practices",
            url: "https://www.sans.org/reading-room/whitepapers/analyst/security-monitoring-beginners-36902",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Security Monitoring System")}&role=${encodeURIComponent(role)}`
      }
    ],
    'ui/ux designer': [
      {
        title: "Mobile App Design System",
        description: "Create a complete design system for a mobile application",
        requiredSkills: ["Figma", "User Research", "Wireframing", "Prototyping"],
        resources: [
          {
            title: "Figma Design Tutorials",
            url: "https://help.figma.com/hc/en-us",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Mobile App Design System")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "E-commerce Website Redesign",
        description: "Redesign an existing e-commerce website for better user experience",
        requiredSkills: ["User Research", "Wireframing", "Prototyping", "Usability Testing"],
        resources: [
          {
            title: "UX Design Process Guide",
            url: "https://www.nngroup.com/articles/ux-process/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("E-commerce Website Redesign")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "User Journey Mapping",
        description: "Create comprehensive user journey maps for a digital product",
        requiredSkills: ["User Research", "Journey Mapping", "Persona Development", "UX Strategy"],
        resources: [
          {
            title: "User Journey Mapping Guide",
            url: "https://www.nngroup.com/articles/journey-mapping-101/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "beginner",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("User Journey Mapping")}&role=${encodeURIComponent(role)}`
      }
    ],
    'product manager': [
      {
        title: "Product Strategy Document",
        description: "Create a comprehensive product strategy and roadmap",
        requiredSkills: ["Product Strategy", "Roadmapping", "Market Research", "Agile"],
        resources: [
          {
            title: "Product Management Guide",
            url: "https://www.productplan.com/learn/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Product Strategy Document")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "User Story Mapping",
        description: "Develop user stories and feature prioritization for a product",
        requiredSkills: ["User Stories", "Backlog Management", "Prioritization", "Agile"],
        resources: [
          {
            title: "User Story Mapping Guide",
            url: "https://www.jpattonassociates.com/user-story-mapping/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("User Story Mapping")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Product Launch Plan",
        description: "Create a complete plan for launching a new product or feature",
        requiredSkills: ["Product Launch", "Go-to-Market Strategy", "Marketing", "Metrics"],
        resources: [
          {
            title: "Product Launch Checklist",
            url: "https://www.productplan.com/learn/product-launch-checklist/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Product Launch Plan")}&role=${encodeURIComponent(role)}`
      }
    ],
    'web developer': [
      {
        title: "Responsive Portfolio Website",
        description: "Create a modern, responsive portfolio website showcasing your projects and skills",
        requiredSkills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
        resources: [
          {
            title: "CSS Flexbox Guide",
            url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "beginner",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Responsive Portfolio Website")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Interactive Web Application",
        description: "Build a dynamic web application with JavaScript and modern frameworks",
        requiredSkills: ["JavaScript", "React", "API Integration", "Frontend Development"],
        resources: [
          {
            title: "JavaScript Documentation",
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Interactive Web Application")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "E-commerce Website",
        description: "Develop a complete e-commerce website with shopping cart and payment processing",
        requiredSkills: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
        resources: [
          {
            title: "PHP MySQL Tutorial",
            url: "https://www.w3schools.com/php/php_mysql_intro.asp",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("E-commerce Website")}&role=${encodeURIComponent(role)}`
      }
    ],
    'java developer': [
      {
        title: "Spring Boot REST API",
        description: "Build a RESTful API using Spring Boot with database integration",
        requiredSkills: ["Java", "Spring Boot", "REST APIs", "Hibernate"],
        resources: [
          {
            title: "Spring Boot Guide",
            url: "https://spring.io/guides/gs/rest-service/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Spring Boot REST API")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Microservices Application",
        description: "Create a microservices-based application with Spring Cloud",
        requiredSkills: ["Java", "Spring Cloud", "Microservices", "Docker"],
        resources: [
          {
            title: "Spring Microservices Guide",
            url: "https://spring.io/guides/gs/spring-boot-kubernetes/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Microservices Application")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Enterprise Application",
        description: "Build a comprehensive enterprise application with multiple modules",
        requiredSkills: ["Java", "Spring Framework", "Enterprise Patterns", "Database"],
        resources: [
          {
            title: "Java EE Tutorial",
            url: "https://docs.oracle.com/javaee/7/tutorial/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Enterprise Application")}&role=${encodeURIComponent(role)}`
      }
    ],
    'python developer': [
      {
        title: "Django Web Application",
        description: "Create a full-stack web application using Django framework",
        requiredSkills: ["Python", "Django", "SQL", "HTML/CSS"],
        resources: [
          {
            title: "Django Documentation",
            url: "https://docs.djangoproject.com/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Django Web Application")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Data Analysis Tool",
        description: "Build a tool for analyzing and visualizing datasets",
        requiredSkills: ["Python", "Pandas", "Matplotlib", "Data Analysis"],
        resources: [
          {
            title: "Pandas Tutorial",
            url: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Data Analysis Tool")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Automation Scripts",
        description: "Create Python scripts for automating repetitive tasks",
        requiredSkills: ["Python", "Automation", "Scripting", "File Handling"],
        resources: [
          {
            title: "Python Automation Guide",
            url: "https://automatetheboringstuff.com/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "beginner",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Automation Scripts")}&role=${encodeURIComponent(role)}`
      }
    ],
    'c++ developer': [
      {
        title: "Multi-threaded Application",
        description: "Build a performance-optimized application using C++ multithreading",
        requiredSkills: ["C++", "Multithreading", "STL", "Performance Optimization"],
        resources: [
          {
            title: "C++ Concurrency Guide",
            url: "https://en.cppreference.com/w/cpp/thread",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Multi-threaded Application")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Game Engine Components",
        description: "Develop core components of a game engine using C++",
        requiredSkills: ["C++", "Game Development", "Graphics", "Physics"],
        resources: [
          {
            title: "Game Programming Patterns",
            url: "https://gameprogrammingpatterns.com/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Game Engine Components")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "System Utility Tool",
        description: "Create a system-level utility tool for performance monitoring",
        requiredSkills: ["C++", "System Programming", "Performance", "Utilities"],
        resources: [
          {
            title: "C++ System Programming",
            url: "https://en.cppreference.com/w/cpp",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("System Utility Tool")}&role=${encodeURIComponent(role)}`
      }
    ],
    'c# developer': [
      {
        title: ".NET Core Web API",
        description: "Develop a REST API using .NET Core with Entity Framework",
        requiredSkills: ["C#", ".NET Core", "Entity Framework", "REST APIs"],
        resources: [
          {
            title: ".NET Core Tutorials",
            url: "https://docs.microsoft.com/en-us/dotnet/core/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent(".NET Core Web API")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Desktop Application",
        description: "Build a Windows desktop application using WPF or WinForms",
        requiredSkills: ["C#", "WPF", "Desktop Development", "UI Design"],
        resources: [
          {
            title: "WPF Documentation",
            url: "https://docs.microsoft.com/en-us/dotnet/desktop/wpf/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Desktop Application")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Game Development with Unity",
        description: "Create a game using C# and Unity game engine",
        requiredSkills: ["C#", "Unity", "Game Development", "3D Graphics"],
        resources: [
          {
            title: "Unity C# Scripting",
            url: "https://docs.unity3d.com/Manual/ScriptingSection.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Game Development with Unity")}&role=${encodeURIComponent(role)}`
      }
    ],
    'go developer': [
      {
        title: "Microservices Architecture",
        description: "Build a microservices-based application using Go and gRPC",
        requiredSkills: ["Go", "gRPC", "Microservices", "Docker"],
        resources: [
          {
            title: "Go Documentation",
            url: "https://golang.org/doc/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Microservices Architecture")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "CLI Tool Development",
        description: "Create a command-line interface tool for system administration",
        requiredSkills: ["Go", "CLI", "System Tools", "Command Line"],
        resources: [
          {
            title: "Go CLI Applications",
            url: "https://github.com/spf13/cobra",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("CLI Tool Development")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Web Server Implementation",
        description: "Build a high-performance web server using Go's net/http package",
        requiredSkills: ["Go", "HTTP", "Web Server", "Concurrency"],
        resources: [
          {
            title: "Go Web Programming",
            url: "https://golang.org/doc/articles/wiki/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Web Server Implementation")}&role=${encodeURIComponent(role)}`
      }
    ],
    'rust developer': [
      {
        title: "Systems Programming Project",
        description: "Create a high-performance system utility using Rust's memory safety features",
        requiredSkills: ["Rust", "Systems Programming", "Memory Management", "Cargo"],
        resources: [
          {
            title: "Rust Book",
            url: "https://doc.rust-lang.org/book/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Systems Programming Project")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Web Assembly Application",
        description: "Build a web application using Rust and WebAssembly for high performance",
        requiredSkills: ["Rust", "WebAssembly", "Web Development", "Performance"],
        resources: [
          {
            title: "Rust and WebAssembly",
            url: "https://rustwasm.github.io/docs/book/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Web Assembly Application")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Network Service",
        description: "Create a network service using Rust's async programming capabilities",
        requiredSkills: ["Rust", "Networking", "Async/Await", "TCP/UDP"],
        resources: [
          {
            title: "Rust Async Book",
            url: "https://rust-lang.github.io/async-book/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Network Service")}&role=${encodeURIComponent(role)}`
      }
    ],
    'kotlin developer': [
      {
        title: "Android Mobile App",
        description: "Build a modern Android application using Kotlin and Jetpack Compose",
        requiredSkills: ["Kotlin", "Android Studio", "Jetpack Compose", "MVVM"],
        resources: [
          {
            title: "Android Developer Guide",
            url: "https://developer.android.com/kotlin",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Android Mobile App")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Backend Service with Ktor",
        description: "Create a backend service using Kotlin and Ktor framework",
        requiredSkills: ["Kotlin", "Ktor", "Backend Development", "REST APIs"],
        resources: [
          {
            title: "Ktor Documentation",
            url: "https://ktor.io/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Backend Service with Ktor")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Cross-platform Mobile App",
        description: "Build a mobile app that works on both Android and iOS using Kotlin Multiplatform",
        requiredSkills: ["Kotlin", "Multiplatform", "Mobile Development", "Shared Code"],
        resources: [
          {
            title: "Kotlin Multiplatform Mobile",
            url: "https://kotlinlang.org/lp/mobile/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Cross-platform Mobile App")}&role=${encodeURIComponent(role)}`
      }
    ],
    'swift developer': [
      {
        title: "iOS App with SwiftUI",
        description: "Create a native iOS application using Swift and SwiftUI",
        requiredSkills: ["Swift", "Xcode", "SwiftUI", "iOS SDK"],
        resources: [
          {
            title: "SwiftUI Tutorials",
            url: "https://developer.apple.com/tutorials/swiftui",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("iOS App with SwiftUI")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "macOS Utility Application",
        description: "Build a desktop utility application for macOS using Swift",
        requiredSkills: ["Swift", "macOS Development", "AppKit", "Desktop Apps"],
        resources: [
          {
            title: "macOS Development Guide",
            url: "https://developer.apple.com/documentation/appkit",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("macOS Utility Application")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Augmented Reality App",
        description: "Create an AR application for iOS using ARKit and Swift",
        requiredSkills: ["Swift", "ARKit", "Augmented Reality", "3D Graphics"],
        resources: [
          {
            title: "ARKit Documentation",
            url: "https://developer.apple.com/augmented-reality/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Augmented Reality App")}&role=${encodeURIComponent(role)}`
      }
    ],
    'rpa developer': [
      {
        title: "Business Process Automation",
        description: "Automate a complete business process using RPA tools",
        requiredSkills: ["UiPath", "Automation", "Business Processes", "Workflow"],
        resources: [
          {
            title: "UiPath Academy",
            url: "https://academy.uipath.com/",
            type: "course"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Business Process Automation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Data Extraction Bot",
        description: "Create a bot for extracting and processing data from various sources",
        requiredSkills: ["Automation Anywhere", "Data Extraction", "Web Scraping", "Data Processing"],
        resources: [
          {
            title: "Automation Anywhere Tutorials",
            url: "https://www.automationanywhere.com/resources/learning",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Data Extraction Bot")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Report Generation Automation",
        description: "Automate the generation and distribution of business reports",
        requiredSkills: ["Blue Prism", "Report Automation", "Excel", "Email Automation"],
        resources: [
          {
            title: "Blue Prism Training",
            url: "https://www.blueprism.com/university/",
            type: "course"
          }
        ],
        role: role,
        difficulty: "beginner",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Report Generation Automation")}&role=${encodeURIComponent(role)}`
      }
    ],
    'qa engineer': [
      {
        title: "Test Automation Framework",
        description: "Build a comprehensive test automation framework for web applications",
        requiredSkills: ["Selenium", "TestNG", "Java", "Automation Framework"],
        resources: [
          {
            title: "Selenium Documentation",
            url: "https://www.selenium.dev/documentation/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Test Automation Framework")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "API Testing Suite",
        description: "Create a complete API testing suite with automated test cases",
        requiredSkills: ["Postman", "REST API Testing", "Automation", "Test Cases"],
        resources: [
          {
            title: "Postman Learning Center",
            url: "https://learning.postman.com/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("API Testing Suite")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Performance Testing Strategy",
        description: "Develop and implement a performance testing strategy for applications",
        requiredSkills: ["JMeter", "Performance Testing", "Load Testing", "Test Strategy"],
        resources: [
          {
            title: "JMeter User Manual",
            url: "https://jmeter.apache.org/usermanual/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Performance Testing Strategy")}&role=${encodeURIComponent(role)}`
      }
    ],
    'automation test engineer': [
      {
        title: "End-to-End Test Automation",
        description: "Create complete end-to-end automation for web applications",
        requiredSkills: ["Selenium", "Appium", "Test Automation", "CI/CD"],
        resources: [
          {
            title: "Selenium WebDriver Guide",
            url: "https://www.selenium.dev/documentation/webdriver/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("End-to-End Test Automation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Mobile Test Automation",
        description: "Build automated tests for mobile applications on iOS and Android",
        requiredSkills: ["Appium", "Mobile Testing", "Automation", "Cross-platform"],
        resources: [
          {
            title: "Appium Documentation",
            url: "http://appium.io/docs/en/about-appium/intro/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Mobile Test Automation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Continuous Testing Pipeline",
        description: "Implement a continuous testing pipeline integrated with CI/CD",
        requiredSkills: ["Jenkins", "CI/CD", "Test Automation", "Pipeline"],
        resources: [
          {
            title: "Jenkins Pipeline Tutorial",
            url: "https://www.jenkins.io/doc/book/pipeline/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Continuous Testing Pipeline")}&role=${encodeURIComponent(role)}`
      }
    ],
    'performance test engineer': [
      {
        title: "Load Testing Framework",
        description: "Build a comprehensive load testing framework for web applications",
        requiredSkills: ["JMeter", "Load Testing", "Performance", "Test Scenarios"],
        resources: [
          {
            title: "JMeter Best Practices",
            url: "https://jmeter.apache.org/usermanual/best-practices.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Load Testing Framework")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Stress Testing Suite",
        description: "Create stress tests to determine system breaking points",
        requiredSkills: ["Gatling", "Stress Testing", "Performance", "Scalability"],
        resources: [
          {
            title: "Gatling Documentation",
            url: "https://gatling.io/docs/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Stress Testing Suite")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Performance Monitoring Dashboard",
        description: "Build a dashboard for monitoring application performance metrics",
        requiredSkills: ["Monitoring Tools", "Dashboards", "Metrics", "Performance Analysis"],
        resources: [
          {
            title: "Performance Monitoring Guide",
            url: "https://www.dynatrace.com/news/blog/what-is-performance-monitoring/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Performance Monitoring Dashboard")}&role=${encodeURIComponent(role)}`
      }
    ],
    'penetration tester': [
      {
        title: "Web Application Security Assessment",
        description: "Conduct comprehensive security testing on web applications",
        requiredSkills: ["Kali Linux", "Burp Suite", "Web Security", "Vulnerability Assessment"],
        resources: [
          {
            title: "OWASP Testing Guide",
            url: "https://owasp.org/www-project-web-security-testing-guide/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Web Application Security Assessment")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Network Penetration Testing",
        description: "Perform network penetration testing to identify vulnerabilities",
        requiredSkills: ["Nmap", "Metasploit", "Network Security", "Penetration Testing"],
        resources: [
          {
            title: "Penetration Testing Standards",
            url: "https://www.pentest-standard.org/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Network Penetration Testing")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Social Engineering Assessment",
        description: "Conduct social engineering tests to assess human factor vulnerabilities",
        requiredSkills: ["Social Engineering", "Phishing", "Security Awareness", "Human Factors"],
        resources: [
          {
            title: "Social Engineering Framework",
            url: "https://www.social-engineer.org/framework/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Social Engineering Assessment")}&role=${encodeURIComponent(role)}`
      }
    ],
    'network engineer': [
      {
        title: "Network Infrastructure Design",
        description: "Design and document a complete network infrastructure",
        requiredSkills: ["Cisco", "Routing", "Switching", "Firewalls", "VPN"],
        resources: [
          {
            title: "Cisco Networking Academy",
            url: "https://www.netacad.com/",
            type: "course"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Network Infrastructure Design")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Network Monitoring System",
        description: "Implement a comprehensive network monitoring solution",
        requiredSkills: ["Network Monitoring", "SNMP", "Monitoring Tools", "Alerting"],
        resources: [
          {
            title: "Network Monitoring Guide",
            url: "https://www.paessler.com/network-monitoring",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Network Monitoring System")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Cloud Network Architecture",
        description: "Design and implement cloud-based network architecture",
        requiredSkills: ["AWS VPC", "Azure Networking", "Cloud Security", "Hybrid Cloud"],
        resources: [
          {
            title: "AWS Networking Guide",
            url: "https://aws.amazon.com/networking/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Cloud Network Architecture")}&role=${encodeURIComponent(role)}`
      }
    ],
    'systems engineer': [
      {
        title: "Server Infrastructure Setup",
        description: "Design and implement a complete server infrastructure",
        requiredSkills: ["Windows Server", "Linux", "VMware", "Networking"],
        resources: [
          {
            title: "Microsoft Server Documentation",
            url: "https://docs.microsoft.com/en-us/windows-server/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Server Infrastructure Setup")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Disaster Recovery Plan",
        description: "Develop and implement a comprehensive disaster recovery plan",
        requiredSkills: ["Disaster Recovery", "Backup Systems", "Business Continuity", "High Availability"],
        resources: [
          {
            title: "Disaster Recovery Planning",
            url: "https://www.ready.gov/business/implementation/IT",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Disaster Recovery Plan")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "System Automation Scripts",
        description: "Create automation scripts for system administration tasks",
        requiredSkills: ["PowerShell", "Bash", "Automation", "System Administration"],
        resources: [
          {
            title: "PowerShell Documentation",
            url: "https://docs.microsoft.com/en-us/powershell/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("System Automation Scripts")}&role=${encodeURIComponent(role)}`
      }
    ],
    'site reliability engineer': [
      {
        title: "Service Reliability Monitoring",
        description: "Implement comprehensive monitoring for service reliability",
        requiredSkills: ["Monitoring", "Alerting", "SRE", "Service Level Objectives"],
        resources: [
          {
            title: "Google SRE Book",
            url: "https://sre.google/sre-book/table-of-contents/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Service Reliability Monitoring")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Incident Management System",
        description: "Build and implement an incident management and response system",
        requiredSkills: ["Incident Management", "On-call Rotation", "Post-mortems", "Reliability"],
        resources: [
          {
            title: "Incident Response Documentation",
            url: "https://response.pagerduty.com/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Incident Management System")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Capacity Planning Framework",
        description: "Develop a capacity planning framework for scalable systems",
        requiredSkills: ["Capacity Planning", "Scalability", "Performance", "Resource Management"],
        resources: [
          {
            title: "Capacity Planning Guide",
            url: "https://aws.amazon.com/architecture/well-architected/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Capacity Planning Framework")}&role=${encodeURIComponent(role)}`
      }
    ],
    'solutions architect': [
      {
        title: "Cloud Solution Architecture",
        description: "Design a complete cloud-based solution architecture",
        requiredSkills: ["AWS", "Azure", "Solution Architecture", "Cloud Design"],
        resources: [
          {
            title: "AWS Well-Architected Framework",
            url: "https://aws.amazon.com/architecture/well-architected/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Cloud Solution Architecture")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Enterprise Integration Pattern",
        description: "Design integration patterns for enterprise systems",
        requiredSkills: ["Integration Patterns", "Enterprise Architecture", "API Design", "Microservices"],
        resources: [
          {
            title: "Enterprise Integration Patterns",
            url: "https://www.enterpriseintegrationpatterns.com/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Enterprise Integration Pattern")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Technical Proposal Development",
        description: "Create comprehensive technical proposals for client solutions",
        requiredSkills: ["Technical Writing", "Solution Design", "Client Proposals", "Architecture"],
        resources: [
          {
            title: "Solution Architecture Guide",
            url: "https://www.gartner.com/en/documents/3899265",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Technical Proposal Development")}&role=${encodeURIComponent(role)}`
      }
    ],
    'enterprise architect': [
      {
        title: "Enterprise Architecture Framework",
        description: "Develop an enterprise architecture framework using TOGAF",
        requiredSkills: ["TOGAF", "Enterprise Architecture", "Business Architecture", "IT Strategy"],
        resources: [
          {
            title: "TOGAF Documentation",
            url: "https://www.opengroup.org/togaf",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Enterprise Architecture Framework")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Digital Transformation Strategy",
        description: "Create a digital transformation strategy for an organization",
        requiredSkills: ["Digital Transformation", "Strategy", "Business Process", "Technology Roadmap"],
        resources: [
          {
            title: "Digital Transformation Guide",
            url: "https://www.mckinsey.com/business-functions/mckinsey-digital/our-insights/digital-transformation",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Digital Transformation Strategy")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "IT Governance Framework",
        description: "Develop an IT governance framework for enterprise compliance",
        requiredSkills: ["IT Governance", "Compliance", "Risk Management", "Policies"],
        resources: [
          {
            title: "IT Governance Institute",
            url: "https://www.isaca.org/resources/it-governance-institute",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("IT Governance Framework")}&role=${encodeURIComponent(role)}`
      }
    ],
    'scrum master': [
      {
        title: "Agile Transformation Initiative",
        description: "Lead an agile transformation initiative for a team or organization",
        requiredSkills: ["Agile Transformation", "Scrum", "Change Management", "Team Coaching"],
        resources: [
          {
            title: "Scrum Guide",
            url: "https://scrumguides.org/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Agile Transformation Initiative")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Team Retrospective Framework",
        description: "Develop and implement a framework for effective team retrospectives",
        requiredSkills: ["Retrospectives", "Team Facilitation", "Continuous Improvement", "Agile"],
        resources: [
          {
            title: "Retrospective Techniques",
            url: "https://retromat.org/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "beginner",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Team Retrospective Framework")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Agile Metrics Dashboard",
        description: "Create a dashboard for tracking agile team metrics and performance",
        requiredSkills: ["Agile Metrics", "Dashboards", "Team Performance", "Data Visualization"],
        resources: [
          {
            title: "Agile Metrics Guide",
            url: "https://www.scrum.org/resources/blog/meaningful-metrics-scrum",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Agile Metrics Dashboard")}&role=${encodeURIComponent(role)}`
      }
    ],
    'business analyst': [
      {
        title: "Requirements Documentation",
        description: "Create comprehensive requirements documentation for a software project",
        requiredSkills: ["Requirements Gathering", "Documentation", "Stakeholder Management", "Analysis"],
        resources: [
          {
            title: "Business Analysis Body of Knowledge",
            url: "https://www.iiba.org/standards-and-resources/babok/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Requirements Documentation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Process Improvement Analysis",
        description: "Analyze and improve business processes for efficiency",
        requiredSkills: ["Process Analysis", "Business Process", "Improvement", "Workflow"],
        resources: [
          {
            title: "Business Process Modeling",
            url: "https://www.omg.org/spec/BPMN/2.0/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Process Improvement Analysis")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Stakeholder Management Plan",
        description: "Develop a comprehensive stakeholder management and communication plan",
        requiredSkills: ["Stakeholder Management", "Communication", "Relationship Building", "Analysis"],
        resources: [
          {
            title: "Stakeholder Analysis Guide",
            url: "https://www.pmi.org/learning/library/stakeholder-analysis-project-success-11775",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "beginner",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Stakeholder Management Plan")}&role=${encodeURIComponent(role)}`
      }
    ],
    'erp consultant': [
      {
        title: "ERP Implementation Plan",
        description: "Create a comprehensive plan for ERP system implementation",
        requiredSkills: ["ERP Implementation", "Business Process", "Change Management", "System Integration"],
        resources: [
          {
            title: "ERP Implementation Guide",
            url: "https://www.erp.com/erp-implementation/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("ERP Implementation Plan")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Business Process Mapping",
        description: "Map business processes for ERP system configuration",
        requiredSkills: ["Business Process", "Process Mapping", "ERP Configuration", "Analysis"],
        resources: [
          {
            title: "Business Process Mapping Guide",
            url: "https://www.lucidchart.com/pages/business-process-mapping",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Business Process Mapping")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "ERP Customization Design",
        description: "Design customizations for ERP system to meet business needs",
        requiredSkills: ["ERP Customization", "System Design", "Requirements", "Technical Specifications"],
        resources: [
          {
            title: "ERP Customization Best Practices",
            url: "https://www.selecthub.com/enterprise-resource-planning/erp-customization/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("ERP Customization Design")}&role=${encodeURIComponent(role)}`
      }
    ],
    'crm developer': [
      {
        title: "CRM Customization Project",
        description: "Customize a CRM system to meet specific business requirements",
        requiredSkills: ["CRM Customization", "Business Logic", "Workflow Automation", "Data Migration"],
        resources: [
          {
            title: "CRM Development Guide",
            url: "https://developer.salesforce.com/docs",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("CRM Customization Project")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Integration with External Systems",
        description: "Integrate CRM with external systems and applications",
        requiredSkills: ["System Integration", "APIs", "Data Synchronization", "CRM"],
        resources: [
          {
            title: "CRM Integration Patterns",
            url: "https://www.salesforce.com/products/platform/integration/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Integration with External Systems")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Automated Workflow Design",
        description: "Design and implement automated workflows in CRM system",
        requiredSkills: ["Workflow Automation", "Business Process", "CRM Configuration", "Automation"],
        resources: [
          {
            title: "CRM Workflow Guide",
            url: "https://help.salesforce.com/s/articleView?id=sf.workflow_rules_definition.htm&type=5",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Automated Workflow Design")}&role=${encodeURIComponent(role)}`
      }
    ],
    'salesforce developer': [
      {
        title: "Salesforce App Development",
        description: "Develop a custom application on the Salesforce platform",
        requiredSkills: ["Apex", "Visualforce", "Salesforce Platform", "Lightning Components"],
        resources: [
          {
            title: "Salesforce Developer Guide",
            url: "https://developer.salesforce.com/docs",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Salesforce App Development")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Lightning Web Component",
        description: "Build modern UI components using Lightning Web Components",
        requiredSkills: ["Lightning Web Components", "JavaScript", "Salesforce UI", "Component Development"],
        resources: [
          {
            title: "Lightning Web Components Guide",
            url: "https://developer.salesforce.com/docs/component-library/documentation/en/lwc",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Lightning Web Component")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Salesforce Integration",
        description: "Integrate Salesforce with external systems and data sources",
        requiredSkills: ["Salesforce APIs", "Integration", "Data Migration", "External Systems"],
        resources: [
          {
            title: "Salesforce Integration Guide",
            url: "https://developer.salesforce.com/docs/atlas.en-us.integration.meta/integration/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Salesforce Integration")}&role=${encodeURIComponent(role)}`
      }
    ],
    'servicenow developer': [
      {
        title: "ServiceNow Application Development",
        description: "Develop a custom application on the ServiceNow platform",
        requiredSkills: ["ServiceNow", "JavaScript", "Glide API", "Application Development"],
        resources: [
          {
            title: "ServiceNow Developer Documentation",
            url: "https://developer.servicenow.com/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("ServiceNow Application Development")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "ITSM Process Automation",
        description: "Automate IT service management processes in ServiceNow",
        requiredSkills: ["ITSM", "Process Automation", "Workflows", "ServiceNow Configuration"],
        resources: [
          {
            title: "ServiceNow ITSM Guide",
            url: "https://docs.servicenow.com/bundle/tokyo-it-service-management/page/product/itsm/concept/c_ITSM.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("ITSM Process Automation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Integration Hub Development",
        description: "Develop integrations using ServiceNow Integration Hub",
        requiredSkills: ["Integration Hub", "REST APIs", "Data Integration", "ServiceNow"],
        resources: [
          {
            title: "Integration Hub Documentation",
            url: "https://docs.servicenow.com/bundle/tokyo-integration-hub/page/administer/integration-hub/concept/c_IntegrationHub.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Integration Hub Development")}&role=${encodeURIComponent(role)}`
      }
    ],
    'etl developer': [
      {
        title: "Data Warehouse ETL Pipeline",
        description: "Build a complete ETL pipeline for data warehouse population",
        requiredSkills: ["ETL", "Data Warehousing", "SQL", "Data Transformation"],
        resources: [
          {
            title: "ETL Best Practices",
            url: "https://www.stitchdata.com/etl/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Data Warehouse ETL Pipeline")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Real-time Data Integration",
        description: "Create real-time data integration between systems",
        requiredSkills: ["Real-time ETL", "Data Integration", "Streaming Data", "Change Data Capture"],
        resources: [
          {
            title: "Real-time ETL Guide",
            url: "https://www.informatica.com/resources/articles/real-time-etl.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Real-time Data Integration")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Data Quality Framework",
        description: "Develop a data quality framework for ETL processes",
        requiredSkills: ["Data Quality", "Data Validation", "ETL Framework", "Data Governance"],
        resources: [
          {
            title: "Data Quality Management",
            url: "https://www.talend.com/resources/what-is-data-quality/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Data Quality Framework")}&role=${encodeURIComponent(role)}`
      }
    ],
    'bi developer': [
      {
        title: "Business Intelligence Dashboard",
        description: "Create comprehensive BI dashboards for business analytics",
        requiredSkills: ["Power BI", "Tableau", "Data Visualization", "Business Intelligence"],
        resources: [
          {
            title: "Power BI Documentation",
            url: "https://docs.microsoft.com/en-us/power-bi/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Business Intelligence Dashboard")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Data Modeling for BI",
        description: "Design and implement data models for business intelligence",
        requiredSkills: ["Data Modeling", "Star Schema", "Data Warehousing", "BI Architecture"],
        resources: [
          {
            title: "Data Modeling Guide",
            url: "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Data Modeling for BI")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Advanced Analytics Reports",
        description: "Develop advanced analytical reports with predictive insights",
        requiredSkills: ["Advanced Analytics", "Predictive Modeling", "Statistical Analysis", "Reporting"],
        resources: [
          {
            title: "Advanced Analytics Guide",
            url: "https://www.tableau.com/learn/whitepapers/advanced-analytics",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Advanced Analytics Reports")}&role=${encodeURIComponent(role)}`
      }
    ],
    'data architect': [
      {
        title: "Enterprise Data Architecture",
        description: "Design an enterprise-wide data architecture framework",
        requiredSkills: ["Data Architecture", "Enterprise Data", "Data Strategy", "Data Governance"],
        resources: [
          {
            title: "Data Architecture Guide",
            url: "https://www.dataversity.net/data-architecture-101/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Enterprise Data Architecture")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Data Lake Design",
        description: "Design and implement a data lake architecture",
        requiredSkills: ["Data Lake", "Big Data", "Data Storage", "Data Processing"],
        resources: [
          {
            title: "Data Lake Architecture",
            url: "https://aws.amazon.com/big-data/datalakes-and-analytics/what-is-a-data-lake/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Data Lake Design")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Data Migration Strategy",
        description: "Develop a comprehensive data migration strategy",
        requiredSkills: ["Data Migration", "Data Strategy", "System Integration", "Data Quality"],
        resources: [
          {
            title: "Data Migration Best Practices",
            url: "https://www.gartner.com/en/documents/3899265",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Data Migration Strategy")}&role=${encodeURIComponent(role)}`
      }
    ],
    'control systems engineer': [
      {
        title: "PLC Programming Project",
        description: "Program PLCs for industrial automation control systems",
        requiredSkills: ["PLC Programming", "Industrial Automation", "Control Systems", "Ladder Logic"],
        resources: [
          {
            title: "PLC Programming Guide",
            url: "https://www.plctechnician.com/plc-programming/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("PLC Programming Project")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "SCADA System Design",
        description: "Design and implement a SCADA system for industrial monitoring",
        requiredSkills: ["SCADA", "Industrial Control", "HMI", "System Design"],
        resources: [
          {
            title: "SCADA System Guide",
            url: "https://www.inductiveautomation.com/resources/article/what-is-scada",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("SCADA System Design")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Control System Simulation",
        description: "Create simulations for control system design and testing",
        requiredSkills: ["MATLAB", "Simulink", "Control Theory", "System Simulation"],
        resources: [
          {
            title: "MATLAB Control Systems",
            url: "https://www.mathworks.com/products/control.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Control System Simulation")}&role=${encodeURIComponent(role)}`
      }
    ],
    'game designer': [
      {
        title: "Game Design Document",
        description: "Create a comprehensive game design document",
        requiredSkills: ["Game Design", "Game Mechanics", "Level Design", "Documentation"],
        resources: [
          {
            title: "Game Design Documentation",
            url: "https://www.gamedesigning.org/design/game-design-document/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Game Design Document")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Prototype Development",
        description: "Develop a playable prototype for game concept validation",
        requiredSkills: ["Game Prototyping", "Game Mechanics", "User Testing", "Iteration"],
        resources: [
          {
            title: "Game Prototyping Guide",
            url: "https://www.gamedeveloper.com/design/the-art-of-prototyping",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Prototype Development")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Level Design Portfolio",
        description: "Create a portfolio of level designs for different game genres",
        requiredSkills: ["Level Design", "Game Environments", "Player Experience", "Design Principles"],
        resources: [
          {
            title: "Level Design Tutorials",
            url: "https://www.worldofleveldesign.com/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Level Design Portfolio")}&role=${encodeURIComponent(role)}`
      }
    ],
    '3d animator': [
      {
        title: "Character Animation Project",
        description: "Create a complete character animation with rigging and rendering",
        requiredSkills: ["Blender", "3D Modeling", "Rigging", "Animation"],
        resources: [
          {
            title: "Blender Tutorials",
            url: "https://www.blender.org/support/tutorials/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Character Animation Project")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Environmental Animation",
        description: "Create animated environments and scenes",
        requiredSkills: ["3D Animation", "Environmental Design", "Lighting", "Texturing"],
        resources: [
          {
            title: "3D Animation Principles",
            url: "https://www.animationmentor.com/blog/animation-principles/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Environmental Animation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Motion Graphics Project",
        description: "Create motion graphics for video and digital media",
        requiredSkills: ["Motion Graphics", "After Effects", "Video Editing", "Visual Effects"],
        resources: [
          {
            title: "Motion Graphics Tutorials",
            url: "https://motionarray.com/learn/after-effects/after-effects-tutorials/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Motion Graphics Project")}&role=${encodeURIComponent(role)}`
      }
    ],
    'graphic designer': [
      {
        title: "Brand Identity Package",
        description: "Design a complete brand identity including logo, colors, and typography",
        requiredSkills: ["Photoshop", "Illustrator", "Brand Design", "Typography"],
        resources: [
          {
            title: "Adobe Creative Cloud Tutorials",
            url: "https://helpx.adobe.com/creative-cloud/tutorials-explore.html",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Brand Identity Package")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Marketing Campaign Design",
        description: "Create complete marketing campaign materials",
        requiredSkills: ["Graphic Design", "Marketing Materials", "Print Design", "Digital Assets"],
        resources: [
          {
            title: "Design for Marketing",
            url: "https://www.canva.com/learn/graphic-design/",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Marketing Campaign Design")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "UI Design System",
        description: "Create a comprehensive UI design system for digital products",
        requiredSkills: ["UI Design", "Design Systems", "Figma", "Component Libraries"],
        resources: [
          {
            title: "UI Design Principles",
            url: "https://www.interaction-design.org/literature/topics/ui-design",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("UI Design System")}&role=${encodeURIComponent(role)}`
      }
    ],
    'content strategist': [
      {
        title: "Content Strategy Framework",
        description: "Develop a comprehensive content strategy framework",
        requiredSkills: ["Content Strategy", "Content Planning", "Audience Analysis", "SEO"],
        resources: [
          {
            title: "Content Strategy Guide",
            url: "https://contentmarketinginstitute.com/what-is-content-marketing/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Content Strategy Framework")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Content Audit and Analysis",
        description: "Conduct a comprehensive content audit and analysis",
        requiredSkills: ["Content Audit", "Content Analysis", "SEO", "Analytics"],
        resources: [
          {
            title: "Content Audit Guide",
            url: "https://www.hubspot.com/content-audit",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Content Audit and Analysis")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Editorial Calendar Development",
        description: "Create a comprehensive editorial calendar for content publication",
        requiredSkills: ["Editorial Calendar", "Content Planning", "Publication Schedule", "Content Management"],
        resources: [
          {
            title: "Editorial Calendar Guide",
            url: "https://coschedule.com/blog/how-to-create-an-editorial-calendar/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "beginner",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Editorial Calendar Development")}&role=${encodeURIComponent(role)}`
      }
    ],
    'seo specialist': [
      {
        title: "SEO Audit and Strategy",
        description: "Conduct comprehensive SEO audit and develop optimization strategy",
        requiredSkills: ["SEO Audit", "Keyword Research", "Technical SEO", "Strategy"],
        resources: [
          {
            title: "SEO Starter Guide",
            url: "https://developers.google.com/search/docs/beginner/seo-starter-guide",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("SEO Audit and Strategy")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Content Optimization Project",
        description: "Optimize existing content for search engine visibility",
        requiredSkills: ["Content Optimization", "On-Page SEO", "Keyword Optimization", "Content Strategy"],
        resources: [
          {
            title: "Content SEO Guide",
            url: "https://moz.com/learn/seo/content",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Content Optimization Project")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Local SEO Implementation",
        description: "Implement local SEO strategies for business visibility",
        requiredSkills: ["Local SEO", "Google My Business", "Local Listings", "NAP Consistency"],
        resources: [
          {
            title: "Local SEO Guide",
            url: "https://moz.com/learn/seo/local-seo",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "beginner",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Local SEO Implementation")}&role=${encodeURIComponent(role)}`
      }
    ],
    'digital marketing specialist': [
      {
        title: "Digital Marketing Campaign",
        description: "Plan and execute a complete digital marketing campaign",
        requiredSkills: ["Digital Marketing", "Campaign Management", "Analytics", "ROI Measurement"],
        resources: [
          {
            title: "Digital Marketing Guide",
            url: "https://www.hubspot.com/digital-marketing",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Digital Marketing Campaign")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Social Media Strategy",
        description: "Develop and implement a comprehensive social media strategy",
        requiredSkills: ["Social Media Marketing", "Content Strategy", "Community Management", "Analytics"],
        resources: [
          {
            title: "Social Media Marketing Guide",
            url: "https://blog.hootsuite.com/social-media-marketing/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Social Media Strategy")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "PPC Campaign Management",
        description: "Create and manage pay-per-click advertising campaigns",
        requiredSkills: ["PPC", "Google Ads", "Facebook Ads", "Campaign Optimization"],
        resources: [
          {
            title: "PPC Advertising Guide",
            url: "https://www.wordstream.com/ppc",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("PPC Campaign Management")}&role=${encodeURIComponent(role)}`
      }
    ],
    'cloud security engineer': [
      {
        title: "Cloud Security Architecture",
        description: "Design and implement secure cloud infrastructure following best practices",
        requiredSkills: ["AWS Security", "IAM", "Encryption", "Cloud Compliance"],
        resources: [
          {
            title: "AWS Security Best Practices",
            url: "https://aws.amazon.com/security/security-resources/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Cloud Security Architecture")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Security Compliance Framework",
        description: "Implement security compliance framework for cloud environments",
        requiredSkills: ["Compliance", "Security Framework", "Audit", "Risk Assessment"],
        resources: [
          {
            title: "Cloud Security Compliance",
            url: "https://cloudsecurityalliance.org/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Security Compliance Framework")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Cloud Monitoring and Alerting",
        description: "Implement security monitoring and alerting for cloud infrastructure",
        requiredSkills: ["Cloud Monitoring", "Security Alerts", "Incident Response", "Log Analysis"],
        resources: [
          {
            title: "Cloud Security Monitoring",
            url: "https://aws.amazon.com/security/security-monitoring/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Cloud Monitoring and Alerting")}&role=${encodeURIComponent(role)}`
      }
    ],
    'information security analyst': [
      {
        title: "Threat Intelligence Analysis",
        description: "Conduct threat intelligence analysis and reporting",
        requiredSkills: ["Threat Intelligence", "Security Analysis", "Vulnerability Assessment", "Risk Management"],
        resources: [
          {
            title: "Threat Intelligence Guide",
            url: "https://www.sans.org/reading-room/whitepapers/warfare/applying-intelligence-threat-intelligence-36627",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Threat Intelligence Analysis")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Security Incident Response",
        description: "Develop and implement security incident response procedures",
        requiredSkills: ["Incident Response", "Security Operations", "Forensics", "Crisis Management"],
        resources: [
          {
            title: "Incident Response Guide",
            url: "https://www.sans.org/reading-room/whitepapers/incident/incident-handlers-handbook-33901",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Security Incident Response")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Security Awareness Program",
        description: "Develop and implement a security awareness training program",
        requiredSkills: ["Security Awareness", "Training", "Phishing Simulation", "Education"],
        resources: [
          {
            title: "Security Awareness Guide",
            url: "https://www.sans.org/security-awareness-training",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Security Awareness Program")}&role=${encodeURIComponent(role)}`
      }
    ],
    'compliance analyst': [
      {
        title: "Compliance Framework Implementation",
        description: "Implement a comprehensive compliance framework",
        requiredSkills: ["Compliance", "Regulatory Requirements", "Framework Implementation", "Audit"],
        resources: [
          {
            title: "Compliance Framework Guide",
            url: "https://www.complianceweek.com/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Compliance Framework Implementation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Risk Assessment Project",
        description: "Conduct comprehensive risk assessment and mitigation planning",
        requiredSkills: ["Risk Assessment", "Risk Management", "Compliance", "Audit"],
        resources: [
          {
            title: "Risk Assessment Guide",
            url: "https://www.iso.org/iso-31000-risk-management.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Risk Assessment Project")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Policy Development",
        description: "Develop comprehensive security and compliance policies",
        requiredSkills: ["Policy Development", "Compliance", "Documentation", "Governance"],
        resources: [
          {
            title: "Policy Development Guide",
            url: "https://www.sans.org/security-resources/policies/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Policy Development")}&role=${encodeURIComponent(role)}`
      }
    ],
    'it support specialist': [
      {
        title: "IT Help Desk Documentation",
        description: "Create comprehensive documentation for IT help desk procedures",
        requiredSkills: ["Help Desk", "Documentation", "Troubleshooting", "Customer Service"],
        resources: [
          {
            title: "IT Help Desk Guide",
            url: "https://www.itsm.tools/help-desk/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "beginner",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("IT Help Desk Documentation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Network Troubleshooting Guide",
        description: "Develop a comprehensive network troubleshooting guide",
        requiredSkills: ["Network Troubleshooting", "Diagnostic Tools", "Problem Solving", "Documentation"],
        resources: [
          {
            title: "Network Troubleshooting Guide",
            url: "https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Network Troubleshooting Guide")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Software Deployment Automation",
        description: "Automate software deployment processes for efficiency",
        requiredSkills: ["Software Deployment", "Automation", "Scripting", "System Administration"],
        resources: [
          {
            title: "Software Deployment Guide",
            url: "https://www.pdq.com/blog/software-deployment-best-practices/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Software Deployment Automation")}&role=${encodeURIComponent(role)}`
      }
    ],
    'help desk technician': [
      {
        title: "Knowledge Base Development",
        description: "Create a comprehensive knowledge base for common issues",
        requiredSkills: ["Knowledge Base", "Documentation", "Troubleshooting", "Customer Support"],
        resources: [
          {
            title: "Knowledge Base Guide",
            url: "https://www.zendesk.com/blog/how-to-create-a-knowledge-base/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "beginner",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Knowledge Base Development")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Remote Support Procedures",
        description: "Develop procedures for effective remote technical support",
        requiredSkills: ["Remote Support", "Troubleshooting", "Customer Service", "Technical Support"],
        resources: [
          {
            title: "Remote Support Best Practices",
            url: "https://www.teamviewer.com/en/remote-support/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Remote Support Procedures")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Ticketing System Optimization",
        description: "Optimize ticketing system workflows for efficiency",
        requiredSkills: ["Ticketing Systems", "Workflow Optimization", "Process Improvement", "Support Management"],
        resources: [
          {
            title: "ITSM Best Practices",
            url: "https://www.axelos.com/best-practice-solutions/itsm",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Ticketing System Optimization")}&role=${encodeURIComponent(role)}`
      }
    ],
    'systems administrator': [
      {
        title: "Server Infrastructure Setup",
        description: "Design and implement a complete server infrastructure",
        requiredSkills: ["Windows Server", "Linux", "VMware", "Networking"],
        resources: [
          {
            title: "Microsoft Server Documentation",
            url: "https://docs.microsoft.com/en-us/windows-server/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Server Infrastructure Setup")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Backup and Recovery System",
        description: "Implement comprehensive backup and disaster recovery solutions",
        requiredSkills: ["Backup Systems", "Disaster Recovery", "Data Protection", "System Administration"],
        resources: [
          {
            title: "Backup Best Practices",
            url: "https://www.veeam.com/backup-best-practices.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Backup and Recovery System")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "System Monitoring Implementation",
        description: "Implement comprehensive system monitoring and alerting",
        requiredSkills: ["System Monitoring", "Alerting", "Performance Monitoring", "Infrastructure"],
        resources: [
          {
            title: "System Monitoring Guide",
            url: "https://www.nagios.org/solutions/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("System Monitoring Implementation")}&role=${encodeURIComponent(role)}`
      }
    ],
    'release manager': [
      {
        title: "Release Management Process",
        description: "Develop and implement a comprehensive release management process",
        requiredSkills: ["Release Management", "CI/CD", "Deployment", "Change Management"],
        resources: [
          {
            title: "Release Management Guide",
            url: "https://www.atlassian.com/continuous-delivery/principles/release-management",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Release Management Process")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Deployment Automation",
        description: "Automate deployment processes for consistent releases",
        requiredSkills: ["Deployment Automation", "CI/CD", "Scripting", "Release Engineering"],
        resources: [
          {
            title: "Deployment Automation Guide",
            url: "https://www.jenkins.io/doc/book/pipeline/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Deployment Automation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Release Communication Plan",
        description: "Develop comprehensive release communication and coordination plans",
        requiredSkills: ["Release Communication", "Stakeholder Management", "Coordination", "Documentation"],
        resources: [
          {
            title: "Release Communication Guide",
            url: "https://www.productplan.com/glossary/release-communication-plan/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "beginner",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Release Communication Plan")}&role=${encodeURIComponent(role)}`
      }
    ],
    'build engineer': [
      {
        title: "CI/CD Pipeline Implementation",
        description: "Implement a complete CI/CD pipeline for automated builds",
        requiredSkills: ["CI/CD", "Jenkins", "Build Automation", "Pipeline Development"],
        resources: [
          {
            title: "CI/CD Best Practices",
            url: "https://www.redhat.com/en/topics/devops/what-cicd-pipeline",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("CI/CD Pipeline Implementation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Build System Optimization",
        description: "Optimize build systems for performance and efficiency",
        requiredSkills: ["Build Optimization", "Performance", "Automation", "System Administration"],
        resources: [
          {
            title: "Build System Guide",
            url: "https://gradle.org/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Build System Optimization")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Dependency Management System",
        description: "Implement comprehensive dependency management for builds",
        requiredSkills: ["Dependency Management", "Maven", "Gradle", "Package Management"],
        resources: [
          {
            title: "Dependency Management Guide",
            url: "https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Dependency Management System")}&role=${encodeURIComponent(role)}`
      }
    ],
    'integration engineer': [
      {
        title: "API Integration Framework",
        description: "Develop a framework for API integration between systems",
        requiredSkills: ["API Integration", "REST APIs", "System Integration", "Middleware"],
        resources: [
          {
            title: "API Integration Guide",
            url: "https://www.mulesoft.com/resources/api/what-is-api-integration",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("API Integration Framework")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Data Integration Solution",
        description: "Implement data integration between disparate systems",
        requiredSkills: ["Data Integration", "ETL", "Data Mapping", "System Integration"],
        resources: [
          {
            title: "Data Integration Guide",
            url: "https://www.informatica.com/resources/articles/what-is-data-integration.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Data Integration Solution")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Microservices Integration",
        description: "Implement integration patterns for microservices architecture",
        requiredSkills: ["Microservices", "Integration Patterns", "API Gateway", "Service Mesh"],
        resources: [
          {
            title: "Microservices Integration Guide",
            url: "https://www.nginx.com/blog/building-microservices-inter-process-communication/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Microservices Integration")}&role=${encodeURIComponent(role)}`
      }
    ],
    'middleware engineer': [
      {
        title: "Middleware Platform Implementation",
        description: "Implement and configure middleware platforms for enterprise integration",
        requiredSkills: ["Middleware", "Enterprise Integration", "Platform Configuration", "System Architecture"],
        resources: [
          {
            title: "Middleware Guide",
            url: "https://www.ibm.com/cloud/learn/middleware",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Middleware Platform Implementation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Message Broker Configuration",
        description: "Configure and optimize message brokers for reliable messaging",
        requiredSkills: ["Message Brokers", "Kafka", "RabbitMQ", "Message Queues"],
        resources: [
          {
            title: "Message Broker Guide",
            url: "https://kafka.apache.org/documentation/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Message Broker Configuration")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Integration Pattern Implementation",
        description: "Implement enterprise integration patterns using middleware",
        requiredSkills: ["Integration Patterns", "Enterprise Integration", "Middleware", "System Design"],
        resources: [
          {
            title: "Enterprise Integration Patterns",
            url: "https://www.enterpriseintegrationpatterns.com/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Integration Pattern Implementation")}&role=${encodeURIComponent(role)}`
      }
    ],
    'storage engineer': [
      {
        title: "Storage Architecture Design",
        description: "Design comprehensive storage architecture for enterprise needs",
        requiredSkills: ["Storage Architecture", "SAN", "NAS", "Storage Management"],
        resources: [
          {
            title: "Storage Architecture Guide",
            url: "https://www.delltechnologies.com/en-us/storage/index.htm",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Storage Architecture Design")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Backup System Implementation",
        description: "Implement comprehensive backup and recovery storage systems",
        requiredSkills: ["Backup Systems", "Disaster Recovery", "Storage", "Data Protection"],
        resources: [
          {
            title: "Backup Storage Guide",
            url: "https://www.veeam.com/backup-best-practices.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Backup System Implementation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Cloud Storage Integration",
        description: "Integrate cloud storage with on-premises storage infrastructure",
        requiredSkills: ["Cloud Storage", "Hybrid Storage", "Data Migration", "Storage Integration"],
        resources: [
          {
            title: "Cloud Storage Guide",
            url: "https://aws.amazon.com/storage/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Cloud Storage Integration")}&role=${encodeURIComponent(role)}`
      }
    ],
    'linux administrator': [
      {
        title: "Linux Server Configuration",
        description: "Configure and optimize Linux servers for production environments",
        requiredSkills: ["Linux Administration", "Server Configuration", "Security Hardening", "Performance Tuning"],
        resources: [
          {
            title: "Linux Administration Guide",
            url: "https://www.linux.org/forums/linux-beginner-tutorials.123/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Linux Server Configuration")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Automation Script Development",
        description: "Develop automation scripts for Linux system administration",
        requiredSkills: ["Bash Scripting", "Automation", "System Administration", "Linux"],
        resources: [
          {
            title: "Bash Scripting Guide",
            url: "https://tldp.org/LDP/abs/html/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Automation Script Development")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Linux Security Hardening",
        description: "Implement security hardening measures for Linux systems",
        requiredSkills: ["Linux Security", "Hardening", "Security Configuration", "System Administration"],
        resources: [
          {
            title: "Linux Security Guide",
            url: "https://linuxsecurity.com/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Linux Security Hardening")}&role=${encodeURIComponent(role)}`
      }
    ],
    'windows administrator': [
      {
        title: "Windows Server Deployment",
        description: "Deploy and configure Windows Server infrastructure",
        requiredSkills: ["Windows Server", "Active Directory", "Group Policy", "Server Configuration"],
        resources: [
          {
            title: "Windows Server Documentation",
            url: "https://docs.microsoft.com/en-us/windows-server/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Windows Server Deployment")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Active Directory Management",
        description: "Implement and manage Active Directory services",
        requiredSkills: ["Active Directory", "User Management", "Group Policy", "Windows Administration"],
        resources: [
          {
            title: "Active Directory Guide",
            url: "https://docs.microsoft.com/en-us/windows-server/identity/identity-and-access",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Active Directory Management")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "PowerShell Automation",
        description: "Develop PowerShell scripts for Windows administration automation",
        requiredSkills: ["PowerShell", "Automation", "Windows Administration", "Scripting"],
        resources: [
          {
            title: "PowerShell Documentation",
            url: "https://docs.microsoft.com/en-us/powershell/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("PowerShell Automation")}&role=${encodeURIComponent(role)}`
      }
    ],
    'sap consultant': [
      {
        title: "SAP Module Implementation",
        description: "Implement and configure SAP modules for business processes",
        requiredSkills: ["SAP", "Business Process", "Configuration", "Implementation"],
        resources: [
          {
            title: "SAP Documentation",
            url: "https://help.sap.com/viewer/index",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("SAP Module Implementation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "SAP Customization Project",
        description: "Customize SAP systems to meet specific business requirements",
        requiredSkills: ["SAP Customization", "ABAP", "Business Requirements", "Configuration"],
        resources: [
          {
            title: "SAP Customization Guide",
            url: "https://www.sap.com/products/erp/customization.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("SAP Customization Project")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "SAP Integration Solution",
        description: "Implement integration between SAP and other systems",
        requiredSkills: ["SAP Integration", "System Integration", "Data Exchange", "Business Processes"],
        resources: [
          {
            title: "SAP Integration Guide",
            url: "https://www.sap.com/products/cloud-platform/integration.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("SAP Integration Solution")}&role=${encodeURIComponent(role)}`
      }
    ],
    'oracle dba': [
      {
        title: "Database Performance Tuning",
        description: "Optimize Oracle database performance through tuning and configuration",
        requiredSkills: ["Oracle Database", "Performance Tuning", "SQL Optimization", "Database Administration"],
        resources: [
          {
            title: "Oracle Performance Tuning Guide",
            url: "https://docs.oracle.com/en/database/oracle/oracle-database/19/tgdba/toc.htm",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Database Performance Tuning")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "High Availability Implementation",
        description: "Implement high availability solutions for Oracle databases",
        requiredSkills: ["High Availability", "Oracle RAC", "Data Guard", "Database Clustering"],
        resources: [
          {
            title: "Oracle High Availability Guide",
            url: "https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/toc.htm",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("High Availability Implementation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Backup and Recovery Strategy",
        description: "Develop comprehensive backup and recovery strategies for Oracle databases",
        requiredSkills: ["Backup and Recovery", "Oracle RMAN", "Disaster Recovery", "Data Protection"],
        resources: [
          {
            title: "Oracle Backup and Recovery Guide",
            url: "https://docs.oracle.com/en/database/oracle/oracle-database/19/bradv/toc.htm",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Backup and Recovery Strategy")}&role=${encodeURIComponent(role)}`
      }
    ],
    'hadoop developer': [
      {
        title: "Big Data Processing Pipeline",
        description: "Build data processing pipelines using Hadoop ecosystem",
        requiredSkills: ["Hadoop", "MapReduce", "HDFS", "Big Data Processing"],
        resources: [
          {
            title: "Hadoop Documentation",
            url: "https://hadoop.apache.org/docs/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Big Data Processing Pipeline")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Data Lake Implementation",
        description: "Implement a data lake using Hadoop and related technologies",
        requiredSkills: ["Data Lake", "Hadoop", "HDFS", "Data Storage"],
        resources: [
          {
            title: "Hadoop Data Lake Guide",
            url: "https://hadoop.apache.org/docs/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Data Lake Implementation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Hive Data Warehouse",
        description: "Build a data warehouse using Hive on Hadoop",
        requiredSkills: ["Hive", "Data Warehousing", "Hadoop", "SQL on Hadoop"],
        resources: [
          {
            title: "Hive Documentation",
            url: "https://hive.apache.org/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Hive Data Warehouse")}&role=${encodeURIComponent(role)}`
      }
    ],
    'spark developer': [
      {
        title: "Spark Streaming Application",
        description: "Build real-time streaming applications using Apache Spark",
        requiredSkills: ["Spark Streaming", "Real-time Processing", "Scala", "Big Data"],
        resources: [
          {
            title: "Spark Streaming Guide",
            url: "https://spark.apache.org/docs/latest/streaming-programming-guide.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Spark Streaming Application")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Machine Learning with Spark MLlib",
        description: "Implement machine learning algorithms using Spark MLlib",
        requiredSkills: ["Spark MLlib", "Machine Learning", "Big Data", "Scala/Python"],
        resources: [
          {
            title: "Spark MLlib Guide",
            url: "https://spark.apache.org/docs/latest/ml-guide.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Machine Learning with Spark MLlib")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Spark Performance Optimization",
        description: "Optimize Spark applications for better performance",
        requiredSkills: ["Spark Optimization", "Performance Tuning", "Big Data", "Cluster Computing"],
        resources: [
          {
            title: "Spark Performance Guide",
            url: "https://spark.apache.org/docs/latest/tuning.html",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Spark Performance Optimization")}&role=${encodeURIComponent(role)}`
      }
    ],
    'kafka developer': [
      {
        title: "Real-time Data Streaming Platform",
        description: "Build a real-time data streaming platform using Apache Kafka",
        requiredSkills: ["Kafka", "Real-time Streaming", "Event Processing", "Data Pipelines"],
        resources: [
          {
            title: "Kafka Documentation",
            url: "https://kafka.apache.org/documentation/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Real-time Data Streaming Platform")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Kafka Streams Application",
        description: "Develop stream processing applications using Kafka Streams",
        requiredSkills: ["Kafka Streams", "Stream Processing", "Real-time Analytics", "Java/Scala"],
        resources: [
          {
            title: "Kafka Streams Guide",
            url: "https://kafka.apache.org/documentation/streams/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Kafka Streams Application")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Event-driven Architecture",
        description: "Implement event-driven architecture using Kafka",
        requiredSkills: ["Event-driven Architecture", "Kafka", "Microservices", "Event Sourcing"],
        resources: [
          {
            title: "Event-driven Architecture Guide",
            url: "https://www.confluent.io/learn/event-driven-architecture/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Event-driven Architecture")}&role=${encodeURIComponent(role)}`
      }
    ],
    'power bi developer': [
      {
        title: "Interactive Business Dashboard",
        description: "Create interactive business intelligence dashboards using Power BI",
        requiredSkills: ["Power BI", "Data Visualization", "Dashboard Development", "Business Intelligence"],
        resources: [
          {
            title: "Power BI Documentation",
            url: "https://docs.microsoft.com/en-us/power-bi/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Interactive Business Dashboard")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Data Modeling in Power BI",
        description: "Implement advanced data modeling techniques in Power BI",
        requiredSkills: ["Power BI Data Modeling", "DAX", "Data Relationships", "Star Schema"],
        resources: [
          {
            title: "Power BI Data Modeling Guide",
            url: "https://docs.microsoft.com/en-us/power-bi/transform-model/desktop-data-modeling-overview",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Data Modeling in Power BI")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Power BI Report Development",
        description: "Develop comprehensive reports with advanced Power BI features",
        requiredSkills: ["Power BI Reports", "Visualization", "Report Development", "Data Analysis"],
        resources: [
          {
            title: "Power BI Report Guide",
            url: "https://docs.microsoft.com/en-us/power-bi/create-reports/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Power BI Report Development")}&role=${encodeURIComponent(role)}`
      }
    ],
    'tableau developer': [
      {
        title: "Advanced Tableau Dashboard",
        description: "Create advanced interactive dashboards using Tableau",
        requiredSkills: ["Tableau", "Data Visualization", "Dashboard Development", "Business Intelligence"],
        resources: [
          {
            title: "Tableau Documentation",
            url: "https://help.tableau.com/current/pro/desktop/en-us/default.htm",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Advanced Tableau Dashboard")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Tableau Server Deployment",
        description: "Deploy and configure Tableau Server for enterprise use",
        requiredSkills: ["Tableau Server", "Deployment", "Configuration", "Enterprise BI"],
        resources: [
          {
            title: "Tableau Server Guide",
            url: "https://help.tableau.com/current/server/en-us/default.htm",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Tableau Server Deployment")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Data Storytelling with Tableau",
        description: "Create compelling data stories using Tableau visualization techniques",
        requiredSkills: ["Data Storytelling", "Tableau", "Visualization", "Narrative"],
        resources: [
          {
            title: "Tableau Storytelling Guide",
            url: "https://www.tableau.com/learn/tutorials/on-demand/getting-started-stories",
            type: "tutorial"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Data Storytelling with Tableau")}&role=${encodeURIComponent(role)}`
      }
    ],
    'mobile game developer': [
      {
        title: "Casual Mobile Game",
        description: "Develop a casual mobile game for iOS and Android platforms",
        requiredSkills: ["Unity", "C#", "Mobile Game Development", "Game Design"],
        resources: [
          {
            title: "Unity Mobile Development",
            url: "https://unity.com/solutions/mobile",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Casual Mobile Game")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Multiplayer Mobile Game",
        description: "Create a multiplayer mobile game with real-time interaction",
        requiredSkills: ["Multiplayer", "Networking", "Mobile Game", "Real-time"],
        resources: [
          {
            title: "Unity Networking",
            url: "https://docs-multiplayer.unity3d.com/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Multiplayer Mobile Game")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Mobile Game Monetization",
        description: "Implement monetization strategies in mobile games",
        requiredSkills: ["Monetization", "In-app Purchases", "Ads", "Mobile Games"],
        resources: [
          {
            title: "Mobile Game Monetization Guide",
            url: "https://unity.com/solutions/mobile-game-monetization",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Mobile Game Monetization")}&role=${encodeURIComponent(role)}`
      }
    ],
    'e-commerce developer': [
      {
        title: "E-commerce Website Development",
        description: "Build a complete e-commerce website with shopping cart and payment processing",
        requiredSkills: ["E-commerce", "Web Development", "Payment Integration", "Shopping Cart"],
        resources: [
          {
            title: "E-commerce Development Guide",
            url: "https://developer.paypal.com/docs/checkout/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("E-commerce Website Development")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Shopify Store Customization",
        description: "Customize and extend a Shopify e-commerce store",
        requiredSkills: ["Shopify", "E-commerce", "Liquid", "Theme Development"],
        resources: [
          {
            title: "Shopify Development Guide",
            url: "https://shopify.dev/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Shopify Store Customization")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Magento Extension Development",
        description: "Develop custom extensions for Magento e-commerce platform",
        requiredSkills: ["Magento", "PHP", "E-commerce", "Extension Development"],
        resources: [
          {
            title: "Magento Development Guide",
            url: "https://developer.adobe.com/commerce/php/development/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Magento Extension Development")}&role=${encodeURIComponent(role)}`
      }
    ],
    'wordpress developer': [
      {
        title: "Custom WordPress Theme",
        description: "Develop a custom WordPress theme from scratch",
        requiredSkills: ["WordPress", "PHP", "CSS", "Theme Development"],
        resources: [
          {
            title: "WordPress Theme Development",
            url: "https://developer.wordpress.org/themes/getting-started/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Custom WordPress Theme")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "WordPress Plugin Development",
        description: "Create custom WordPress plugins to extend functionality",
        requiredSkills: ["WordPress", "PHP", "Plugin Development", "WordPress API"],
        resources: [
          {
            title: "WordPress Plugin Development",
            url: "https://developer.wordpress.org/plugins/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("WordPress Plugin Development")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Headless WordPress Setup",
        description: "Implement headless WordPress with modern frontend framework",
        requiredSkills: ["Headless WordPress", "REST API", "React", "Modern Web Development"],
        resources: [
          {
            title: "WordPress REST API Guide",
            url: "https://developer.wordpress.org/rest-api/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Headless WordPress Setup")}&role=${encodeURIComponent(role)}`
      }
    ],
    'drupal developer': [
      {
        title: "Drupal Theme Development",
        description: "Create custom themes for Drupal websites",
        requiredSkills: ["Drupal", "PHP", "Twig", "Theme Development"],
        resources: [
          {
            title: "Drupal Theme Guide",
            url: "https://www.drupal.org/docs/theming",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Drupal Theme Development")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Drupal Module Development",
        description: "Develop custom modules for Drupal functionality extension",
        requiredSkills: ["Drupal", "PHP", "Module Development", "Drupal API"],
        resources: [
          {
            title: "Drupal Module Development",
            url: "https://www.drupal.org/docs/develop/creating-modules",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Drupal Module Development")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Drupal Migration Project",
        description: "Migrate content from other systems to Drupal",
        requiredSkills: ["Drupal Migration", "Content Migration", "Data Import", "Drupal"],
        resources: [
          {
            title: "Drupal Migration Guide",
            url: "https://www.drupal.org/docs/drupal-apis/migrate-api",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Drupal Migration Project")}&role=${encodeURIComponent(role)}`
      }
    ],
    'joomla developer': [
      {
        title: "Joomla Component Development",
        description: "Develop custom components for Joomla CMS",
        requiredSkills: ["Joomla", "PHP", "Component Development", "Joomla Framework"],
        resources: [
          {
            title: "Joomla Development Guide",
            url: "https://docs.joomla.org/Portal:Developers",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Joomla Component Development")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Joomla Template Creation",
        description: "Create custom templates for Joomla websites",
        requiredSkills: ["Joomla", "PHP", "Template Development", "CSS"],
        resources: [
          {
            title: "Joomla Template Guide",
            url: "https://docs.joomla.org/J3.x:Creating_a_basic_Joomla_template",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Joomla Template Creation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Joomla Extension Development",
        description: "Develop extensions to extend Joomla functionality",
        requiredSkills: ["Joomla", "PHP", "Extension Development", "Joomla API"],
        resources: [
          {
            title: "Joomla Extension Development",
            url: "https://docs.joomla.org/J3.x:Creating_a_simple_module",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Joomla Extension Development")}&role=${encodeURIComponent(role)}`
      }
    ],
    'automation engineer': [
      {
        title: "Test Automation Framework",
        description: "Build a comprehensive test automation framework",
        requiredSkills: ["Test Automation", "Selenium", "Framework Development", "Automation"],
        resources: [
          {
            title: "Test Automation Guide",
            url: "https://www.selenium.dev/documentation/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Test Automation Framework")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "CI/CD Pipeline Automation",
        description: "Automate CI/CD pipelines for software delivery",
        requiredSkills: ["CI/CD", "Jenkins", "Automation", "Pipeline Development"],
        resources: [
          {
            title: "CI/CD Automation Guide",
            url: "https://www.jenkins.io/doc/book/pipeline/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("CI/CD Pipeline Automation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Infrastructure Automation",
        description: "Automate infrastructure provisioning and management",
        requiredSkills: ["Infrastructure Automation", "Terraform", "Ansible", "Cloud Automation"],
        resources: [
          {
            title: "Infrastructure Automation Guide",
            url: "https://www.terraform.io/docs/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Infrastructure Automation")}&role=${encodeURIComponent(role)}`
      }
    ],
    'ai research scientist': [
      {
        title: "Research Paper Implementation",
        description: "Implement and reproduce results from AI research papers",
        requiredSkills: ["AI Research", "Deep Learning", "Research Implementation", "Experimentation"],
        resources: [
          {
            title: "AI Research Resources",
            url: "https://paperswithcode.com/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Research Paper Implementation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Novel Algorithm Development",
        description: "Develop and test novel AI algorithms and approaches",
        requiredSkills: ["Algorithm Development", "AI Research", "Innovation", "Experimentation"],
        resources: [
          {
            title: "AI Algorithm Development",
            url: "https://distill.pub/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Novel Algorithm Development")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Research Prototype Development",
        description: "Build research prototypes for AI concepts and theories",
        requiredSkills: ["Research Prototyping", "AI Development", "Proof of Concept", "Innovation"],
        resources: [
          {
            title: "AI Prototyping Guide",
            url: "https://ai.google/research/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Research Prototype Development")}&role=${encodeURIComponent(role)}`
      }
    ],
    'quantitative analyst': [
      {
        title: "Financial Modeling Project",
        description: "Develop quantitative financial models for investment analysis",
        requiredSkills: ["Financial Modeling", "Quantitative Analysis", "Statistics", "Python/R"],
        resources: [
          {
            title: "Quantitative Finance Guide",
            url: "https://www.quantstart.com/articles",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Financial Modeling Project")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Algorithmic Trading Strategy",
        description: "Develop and backtest algorithmic trading strategies",
        requiredSkills: ["Algorithmic Trading", "Backtesting", "Financial Markets", "Quantitative Analysis"],
        resources: [
          {
            title: "Algorithmic Trading Guide",
            url: "https://www.quantconnect.com/docs/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Algorithmic Trading Strategy")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Risk Management Model",
        description: "Build quantitative risk management models",
        requiredSkills: ["Risk Management", "Quantitative Analysis", "Statistical Modeling", "Finance"],
        resources: [
          {
            title: "Risk Management Guide",
            url: "https://www.fea.com/resources/risk-management-resources/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Risk Management Model")}&role=${encodeURIComponent(role)}`
      }
    ],
    'financial software developer': [
      {
        title: "Trading Platform Development",
        description: "Develop software for financial trading platforms",
        requiredSkills: ["Financial Software", "Trading Systems", "Real-time Processing", "Financial Markets"],
        resources: [
          {
            title: "Financial Software Development",
            url: "https://www.investopedia.com/terms/f/fintech.asp",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Trading Platform Development")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Financial Data Processing",
        description: "Build systems for processing financial market data",
        requiredSkills: ["Financial Data", "Data Processing", "Real-time Systems", "Market Data"],
        resources: [
          {
            title: "Financial Data Processing Guide",
            url: "https://www.refinitiv.com/en",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Financial Data Processing")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Risk Analysis Software",
        description: "Develop software for financial risk analysis and reporting",
        requiredSkills: ["Risk Analysis", "Financial Software", "Reporting", "Analysis Tools"],
        resources: [
          {
            title: "Financial Risk Software Guide",
            url: "https://www.risk.net/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Risk Analysis Software")}&role=${encodeURIComponent(role)}`
      }
    ],
    'health informatics specialist': [
      {
        title: "Healthcare Data Analysis",
        description: "Analyze healthcare data for insights and improvements",
        requiredSkills: ["Healthcare Data", "Data Analysis", "Medical Informatics", "Health IT"],
        resources: [
          {
            title: "Health Informatics Guide",
            url: "https://www.healthit.gov/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Healthcare Data Analysis")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Clinical System Implementation",
        description: "Implement and optimize clinical information systems",
        requiredSkills: ["Clinical Systems", "Health IT", "System Implementation", "Healthcare"],
        resources: [
          {
            title: "Clinical Systems Guide",
            url: "https://www.himss.org/resources/clinical-informatics",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Clinical System Implementation")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Healthcare Data Standardization",
        description: "Implement healthcare data standards and interoperability",
        requiredSkills: ["Healthcare Standards", "HL7", "FHIR", "Data Interoperability"],
        resources: [
          {
            title: "Healthcare Data Standards",
            url: "https://www.hl7.org/fhir/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "intermediate",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Healthcare Data Standardization")}&role=${encodeURIComponent(role)}`
      }
    ],
    'bioinformatics engineer': [
      {
        title: "Genomic Data Analysis",
        description: "Analyze genomic data using bioinformatics tools and techniques",
        requiredSkills: ["Genomics", "Bioinformatics", "Data Analysis", "Biological Data"],
        resources: [
          {
            title: "Bioinformatics Guide",
            url: "https://www.ncbi.nlm.nih.gov/guide/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Genomic Data Analysis")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Biological Database Development",
        description: "Develop databases for biological and genomic data",
        requiredSkills: ["Biological Databases", "Bioinformatics", "Database Development", "Genomics"],
        resources: [
          {
            title: "Biological Database Guide",
            url: "https://www.ebi.ac.uk/training/online/courses/bioinformatics-terrified/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Biological Database Development")}&role=${encodeURIComponent(role)}`
      },
      {
        title: "Bioinformatics Pipeline",
        description: "Build computational pipelines for biological data processing",
        requiredSkills: ["Bioinformatics Pipelines", "Computational Biology", "Data Processing", "Workflow"],
        resources: [
          {
            title: "Bioinformatics Pipeline Guide",
            url: "https://galaxyproject.org/learn/",
            type: "documentation"
          }
        ],
        role: role,
        difficulty: "advanced",
        aiGuideLink: `/api/project-guide?title=${encodeURIComponent("Bioinformatics Pipeline")}&role=${encodeURIComponent(role)}`
      }
    ]
  };


// Main function to get sample projects for any role
function getSampleProjects(role) {
  if (!role) {
    role = 'Software Developer';
  }
  
  const roleLower = role.toLowerCase().trim();
  
  // Try exact match first
  if (staticRoleProjects[roleLower]) {
    return staticRoleProjects[roleLower];
  }

  // Try case-insensitive matching
  for (const [sampleRole, sampleProjects] of Object.entries(staticRoleProjects)) {
    if (sampleRole.toLowerCase() === roleLower) {
      return sampleProjects.map(project => ({
        ...project,
        role: role
      }));
    }
  }

  // Try partial matching for similar roles
  for (const [sampleRole, sampleProjects] of Object.entries(staticRoleProjects)) {
    if (roleLower.includes(sampleRole) || sampleRole.includes(roleLower)) {
      return sampleProjects.map(project => ({
        ...project,
        role: role
      }));
    }
  }

  // Ultimate fallback - generic dynamic projects
  return generateDynamicProjects(role, []);
}

// Export functions
exports.getSampleProjects = getSampleProjects;
exports.staticRoleProjects = staticRoleProjects;
exports.generateDynamicProjects = generateDynamicProjects;