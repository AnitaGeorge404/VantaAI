import React, { useState } from "react";
import WarningPopup from "./WarningPopup";

function TakedownForm() {
  const [mode, setMode] = useState("file"); // "file" or "link"
  const [input, setInput] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [proceed, setProceed] = useState(false);

  const handleAnalyze = () => {
    if (!input) return;
    setShowPopup(true); // Always show popup
  };

  const handleProceed = () => {
    setShowPopup(false);
    setProceed(true); // Show takedown form
  };

  return (
    <div style={{
      background: "linear-gradient(to bottom, #cbe8f7, #e6d4fb)",
      padding: "2rem",
      borderRadius: "8px",
      textAlign: "center",
      fontFamily: "Arial",
    }}>
      <h2 style={{ color: "#43016E" }}>🚨 Instant Takedown Tool</h2>

      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => { setMode("file"); setInput(""); setProceed(false); }}
          style={{
            marginRight: "1rem",
            backgroundColor: "#f5e8ff",
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            fontWeight: "bold",
            color: "#43016E",
            border: "none"
          }}
        >
          📂 Upload File
        </button>
        <button
          onClick={() => { setMode("link"); setInput(""); setProceed(false); }}
          style={{
            backgroundColor: "#f5e8ff",
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            fontWeight: "bold",
            color: "#43016E",
            border: "none"
          }}
        >
          🔗 Paste Link
        </button>
      </div>

      {mode === "file" ? (
        <input
          type="file"
          onChange={(e) => setInput(e.target.files[0])}
          style={{
            marginBottom: "1rem",
            padding: "0.6rem",
            borderRadius: "8px",
            backgroundColor: "#fff",
            border: "1px solid #ccc"
          }}
        />
      ) : (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com"
          style={{
            marginBottom: "1rem",
            width: "90%",
            padding: "0.8rem",
            borderRadius: "8px",
            backgroundColor: "#333",
            color: "#fff",
            border: "none"
          }}
        />
      )}

      <br />
      <button
        onClick={handleAnalyze}
        style={{
          backgroundColor: "#f0e3ff",
          color: "#43016E",
          fontWeight: "bold",
          padding: "0.6rem 1.5rem",
          border: "none",
          borderRadius: "8px",
          marginTop: "0.5rem"
        }}
      >
        Analyze
      </button>

      {showPopup && (
        <WarningPopup
          message="Are you sure you want to proceed?"
          onCancel={() => setShowPopup(false)}
          onProceed={handleProceed}
        />
      )}

      {proceed && (
        <div style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#fff4fb",
          borderRadius: "10px",
          border: "1px solid #ddd",
          textAlign: "left",
          color: "#333"
        }}>
          <h3 style={{ color: "#43016E" }}>📄 Takedown Request Form</h3>
          <p><strong>Platform:</strong> {mode === "file" ? "Uploaded File" : "Link"}</p>
          <p><strong>Content:</strong> {mode === "file" ? input?.name : input}</p>
          <p><strong>Report Reason:</strong> Unauthorized usage of personal/private content. Kindly initiate takedown immediately.</p>
        </div>
      )}
    </div>
  );
}

export default TakedownForm;
