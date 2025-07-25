import { Link } from "react-router-dom";

function Navigation() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw", 
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        background: "linear-gradient(to bottom, #C2E8FF, #DEE6FF, #E5C8FF)",
        fontFamily: "Inter, sans-serif",
        color: "#43016E",
      }}
    >
      <h1>Welcome to Vanta AI</h1>

      <Link to="/chat" style={{ fontSize: "18px", textDecoration: "none", color: "#5B2EFF" }}>
        💬 Chatbot
      </Link>

      <Link to="/warnings" style={{ fontSize: "18px", textDecoration: "none", color: "#5B2EFF" }}>
        ⚠️ In-App Warnings
      </Link>

      <Link to="/rights" style={{ fontSize: "18px", textDecoration: "none", color: "#5B2EFF" }}>
        📚 Know Your Rights
      </Link>

      <Link to="/directory" style={{ fontSize: "18px", textDecoration: "none", color: "#5B2EFF" }}>
        📒 Lawyer & NGO Directory
      </Link>

      <Link to="/mental-support" style={{ fontSize: "18px", textDecoration: "none", color: "#5B2EFF" }}>
  🧠 Mental Health & Community
</Link>

<Link to="/takedown" style={{ fontSize: "18px", textDecoration: "none", color: "#5B2EFF" }}>
  📥 Instant Takedown Tool
</Link>

    </div>
  );
}

export default Navigation;
