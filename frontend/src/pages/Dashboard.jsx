import React from "react";

export default function Dashboard() {
  const user = {
    name: "John Smith",
    profileCompletion: 75,
    desiredRoles: ["Full Stack Developer", "Frontend Developer", "UI/UX Designer"],
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", backgroundColor: "#2c3e50", color: "#fff", padding: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#34495e",
              margin: "0 auto",
            }}
          ></div>
          <h3>{user.name}</h3>
          <p>{user.profileCompletion}% profile complete</p>
        </div>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ margin: "10px 0" }}>Home</li>
          <li style={{ margin: "10px 0" }}>Profile Options</li>
          <li style={{ margin: "10px 0" }}>Project Guide</li>
          <li style={{ margin: "10px 0" }}>YouTube Recommendations</li>
          <li style={{ margin: "10px 0" }}>Messages</li>
          <li style={{ margin: "10px 0" }}>Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: "#ecf0f1", padding: "20px" }}>
        {/* Desired Roles */}
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px" }}>
          <h4>Desired Roles</h4>
          <ul>
            {user.desiredRoles.map((role, index) => (
              <li key={index}>{role}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
