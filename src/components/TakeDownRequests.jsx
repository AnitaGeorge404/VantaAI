import React, { useState } from "react";
import TakedownHelp from "../components/TakedownHelp";

function TakedownRequests() {
  const [mode, setMode] = useState("file");
  const [input, setInput] = useState("");
  const [proceed, setProceed] = useState(false);

  const handleProceed = () => {
    if (!input) return;
    setProceed(true);
  };

  return (
    <div
      style={{
        backgroundColor: "#F9F6FF",
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          maxWidth: "700px",
          margin: "auto",
        }}
      >
        <h2 style={{ color: "#43016E", marginBottom: "16px" }}>
          ⚠️ Instant Takedown Tool
        </h2>
        <p style={{ marginBottom: "20px", fontSize: "15px", color: "#333" }}>
          Upload a file or paste a link that you want to report. We'll guide
          you through sending a takedown request to the platform.
        </p>

        {/* Mode Switcher */}
        <div style={{ marginBottom: "20px" }}>
          <button
            style={{
              marginRight: "8px",
              padding: "10px 16px",
              backgroundColor: mode === "file" ? "#43016E" : "#E0D1F7",
              color: mode === "file" ? "#fff" : "#43016E",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => {
              setMode("file");
              setInput("");
              setProceed(false);
            }}
          >
            📂 Upload File
          </button>
          <button
            style={{
              padding: "10px 16px",
              backgroundColor: mode === "link" ? "#43016E" : "#E0D1F7",
              color: mode === "link" ? "#fff" : "#43016E",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => {
              setMode("link");
              setInput("");
              setProceed(false);
            }}
          >
            🔗 Paste Link
          </button>
        </div>

        {/* Input Area */}
        {mode === "file" ? (
          <input
            type="file"
            onChange={(e) => setInput(e.target.files[0])}
            style={{
              marginBottom: "20px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              width: "100%",
            }}
          />
        ) : (
          <input
            type="text"
            value={typeof input === "string" ? input : ""}
            placeholder="Paste the link here"
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              marginBottom: "20px",
            }}
          />
        )}

        <button
          onClick={handleProceed}
          style={{
            padding: "12px 20px",
            backgroundColor: "#43016E",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Submit
        </button>

        {/* Instructions after Proceed */}
        {proceed && (
          <div
            style={{
              marginTop: "30px",
              backgroundColor: "#F7F0FF",
              padding: "20px",
              borderRadius: "12px",
              border: "2px solid #43016E",
            }}
          >
            <h3 style={{ marginBottom: "12px", color: "#43016E" }}>
              📌 Next Steps
            </h3>
            <p style={{ marginBottom: "10px", fontSize: "15px", color: "#333" }}>
              Follow the platform-specific instructions below to file your takedown request.
            </p>
            <TakedownHelp input={input} />
          </div>
        )}
      </div>
    </div>
  );
}

export default TakedownRequests;