import React, { useState } from "react";
import lawyerNGOData from "../data/lawyerNgoDirectory";
import { useNavigate } from "react-router-dom";

function LawyerDirectory() {
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getIcon = (type) => {
    switch (type) {
      case "Lawyer": return "⚖️";
      case "NGO": return "🏢";
      case "Government": return "🛡️";
      default: return "📌";
    }
  };

  const filteredData = lawyerNGOData.filter((entry) =>
    entry.name.toLowerCase().includes(search.toLowerCase()) ||
    entry.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #C2E8FF, #DEE6FF, #E5C8FF)",
        fontFamily: "Inter, sans-serif",
        color: "#43016E",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <div style={{ width: "100%", maxWidth: "850px" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}>
          <h2 style={{
            fontSize: "clamp(24px, 5vw, 36px)",
            fontWeight: "bold",
            margin: 0,
          }}>
            Lawyer & NGO Directory
          </h2>
          <button
            onClick={() => navigate("/rights")}
            style={{
              padding: "6px 12px",
              fontSize: "clamp(12px, 2vw, 14px)",
              background: "#EEE5F6",
              color: "#43016E",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            ← Back to Hub
          </button>
        </div>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search by name or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "1.5rem",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      {/* Directory cards */}
      <div style={{ maxWidth: "850px", width: "100%" }}>
        {filteredData.length === 0 ? (
          <p style={{ fontSize: "16px", fontStyle: "italic", textAlign: "center" }}>
            No matching entries found.
          </p>
        ) : (
          filteredData.map((entry, index) => (
            <div
              key={index}
              style={{
                marginBottom: "1rem",
                background: "#f4eaff",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
            >
              <button
                onClick={() => toggleIndex(index)}
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
                  <p style={{ margin: "0.5rem 0" }}><strong>Type:</strong> {entry.type}</p>
                  <p style={{ margin: "0.5rem 0" }}><strong>Description:</strong> {entry.description}</p>
                  <p style={{ margin: "0.5rem 0" }}><strong>Location:</strong> {entry.location}</p>
                  <p style={{ margin: "0.5rem 0" }}><strong>Contact:</strong> {entry.contact}</p>
                  <p style={{ margin: "0.5rem 0" }}>
                    <a
                      href={entry.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#5B2EFF",
                        textDecoration: "underline",
                      }}
                    >
                      🔗 Visit Website
                    </a>
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LawyerDirectory;
