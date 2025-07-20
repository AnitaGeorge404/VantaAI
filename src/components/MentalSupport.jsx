import React, { useState } from "react";
import mentalSupportData from "../data/mentalSupportData";

function MentalSupport() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getIcon = (type) => {
    switch (type) {
      case "Helpline": return "☎️";
      case "NGO": return "🏥";
      case "Community": return "🤝";
      case "App": return "📱";
      default: return "🔹";
    }
  };

  return (
    <div
  style={{
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box", 
    background: "linear-gradient(to bottom, #C2E8FF, #DEE6FF, #E5C8FF)",
    fontFamily: "Inter, sans-serif",
    color: "#43016E",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden", 
  }}
>

      <h2
        style={{
          fontSize: "clamp(24px, 5vw, 36px)",
          fontWeight: "bold",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        🧠 Mental Health & Community Support
      </h2>

      <div style={{ maxWidth: "850px", width: "100%" }}>
        {mentalSupportData.map((entry, index) => (
          <div
            key={index}
            style={{
              marginBottom: "1rem",
              background: "#f4eaff",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <button
              onClick={() => toggle(index)}
              style={{
                width: "100%",
                padding: "1rem",
                fontSize: "clamp(16px, 2vw, 20px)",
                fontWeight: "600",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#43016E",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                {getIcon(entry.type)} {entry.name}
              </span>
              <span>{openIndex === index ? "▲" : "▼"}</span>
            </button>

            {openIndex === index && (
              <div style={{ padding: "0 1rem 1rem", fontSize: "clamp(14px, 1.7vw, 17px)" }}>
                <p><strong>Type:</strong> {entry.type}</p>
                <p><strong>Description:</strong> {entry.description}</p>
                <p><strong>Availability:</strong> {entry.availability}</p>
                <p><strong>Contact:</strong> {entry.contact}</p>
                <p>
                  <a
                    href={entry.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#5B2EFF", textDecoration: "underline" }}
                  >
                    🔗 Visit
                  </a>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MentalSupport;
