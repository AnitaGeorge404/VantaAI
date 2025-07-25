import React, { useState } from "react";
import mentalSupportData from "../data/mentalSupportData";

function MentalHealth() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getIcon = (type) => {
    switch (type) {
      case "Helpline":
        return "☎️";
      case "NGO":
        return "🏥";
      case "Community":
        return "🤝";
      case "App":
        return "📱";
      case "Relaxation Technique": // New icon for relaxation techniques
        return "🧘";
      default:
        return "🔹";
    }
  };

  // Filter data into two categories
  const communitySupport = mentalSupportData.filter(
    (entry) =>
      entry.type === "Helpline" ||
      entry.type === "NGO" ||
      entry.type === "Community" ||
      entry.type === "App"
  );

  const relaxationTechniques = mentalSupportData.filter(
    (entry) => entry.type === "Relaxation Technique"
  );

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
        overflow: "hidden", // ✅ safety
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
        🤝 Community Support
      </h2>

      <div style={{ maxWidth: "850px", width: "100%" }}>
        {communitySupport.map((entry, index) => (
          <div
            key={`community-${index}`} // Unique key for community items
            style={{
              marginBottom: "1rem",
              background: "#f4eaff",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <button
              onClick={() => toggle(`community-${index}`)} // Use unique index for toggle
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
              <span>
                {openIndex === `community-${index}` ? "▲" : "▼"}
              </span>{" "}
              {/* Check unique index */}
            </button>

            {openIndex === `community-${index}` && ( // Check unique index
              <div
                style={{
                  padding: "0 1rem 1rem",
                  fontSize: "clamp(14px, 1.7vw, 17px)",
                }}
              >
                <p>
                  <strong>Type:</strong> {entry.type}
                </p>
                <p>
                  <strong>Description:</strong> {entry.description}
                </p>
                {entry.availability && (
                  <p>
                    <strong>Availability:</strong> {entry.availability}
                  </p>
                )}
                {entry.contact && (
                  <p>
                    <strong>Contact:</strong> {entry.contact}
                  </p>
                )}
                {entry.link && (
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
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <h2
        style={{
          fontSize: "clamp(24px, 5vw, 36px)",
          fontWeight: "bold",
          marginTop: "3rem", // Add some space above this new section
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        🧠 Mental Health
      </h2>

      <div style={{ maxWidth: "850px", width: "100%" }}>
        {relaxationTechniques.map((entry, index) => (
          <div
            key={`relaxation-${index}`} // Unique key for relaxation items
            style={{
              marginBottom: "1rem",
              background: "#eafff4", // Slightly different background for visual distinction
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <button
              onClick={() => toggle(`relaxation-${index}`)} // Use unique index for toggle
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
              <span>
                {openIndex === `relaxation-${index}` ? "▲" : "▼"}
              </span>{" "}
              {/* Check unique index */}
            </button>

            {openIndex === `relaxation-${index}` && ( // Check unique index
              <div
                style={{
                  padding: "0 1rem 1rem",
                  fontSize: "clamp(14px, 1.7vw, 17px)",
                }}
              >
                <p>
                  <strong>Type:</strong> {entry.type}
                </p>
                {/* Conditional rendering for description: string vs. array */}
                {Array.isArray(entry.description) ? (
                  <>
                    <p>
                      <strong>Description:</strong>
                    </p>
                    <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                      {entry.description.map((item, descIndex) => (
                        <li key={descIndex} style={{ marginBottom: "5px" }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>
                    <strong>Description:</strong> {entry.description}
                  </p>
                )}

                {entry.availability && (
                  <p>
                    <strong>Availability:</strong> {entry.availability}
                  </p>
                )}
                {entry.contact && (
                  <p>
                    <strong>Contact:</strong> {entry.contact}
                  </p>
                )}
                {entry.link && (
                  <p>
                    <a
                      href={entry.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#5B2EFF", textDecoration: "underline" }}
                    >
                      🔗 Learn More
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MentalHealth;