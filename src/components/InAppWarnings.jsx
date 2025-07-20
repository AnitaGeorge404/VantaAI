import React, { useState } from "react";
import WarningPopup from "../components/WarningPopup";
import { analyzeContentTrust } from "../data/contentChecks";
import arrowUp from '../Images/arrow-up.png';
import logOut from '../Images/log-out.png';

function InAppWarnings() {
  const [mode, setMode] = useState(null);
  const [fileName, setFileName] = useState("");
  const [linkText, setLinkText] = useState("");
  const [trustScore, setTrustScore] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target.result;
      const result = await analyzeContentTrust(content); 
      setTrustScore(result.score);
      if (result.isSuspicious) setShowPopup(true);
    };
    reader.readAsText(file);
  };

  const handleCheckLink = async () => {
    const normalized = linkText.startsWith("http") ? linkText : `https://${linkText}`;
    const result = await analyzeContentTrust(normalized); 
    console.log("Checking:", normalized, "Result:", result);
    setTrustScore(result.score);
    if (result.isSuspicious) setShowPopup(true);
  };

  const reset = () => {
    setMode(null);
    setFileName("");
    setLinkText("");
    setTrustScore(null);
    setShowPopup(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflowX: "hidden",
        padding: "20px",
        background: "linear-gradient(to bottom, #C2E8FF, #DEE6FF, #E5C8FF)",
        fontFamily: "Inter, sans-serif",
        color: "#43016E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <h2 style={{ fontWeight: "bold", fontSize: "24px" }}>In-App Warnings</h2>

      <div style={{ display: "flex", gap: "16px" }}>
        <button
          onClick={() => reset() || setMode("file")}
          style={{
            backgroundColor: "#F7CFC7",
            color: "#43016E",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <img src={arrowUp} alt="Upload" style={{ width: "20px" }} />
          Upload File
        </button>

        <button
          onClick={() => reset() || setMode("link")}
          style={{
            backgroundColor: "#94D6FF",
            color: "#43016E",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <img src={logOut} alt="Paste" style={{ width: "20px" }} />
          Paste Link
        </button>
      </div>

      {mode === "file" && (
        <div style={{ marginTop: "20px" }}>
          <input
            type="file"
            accept=".txt,.md,.json,.html"
            onChange={handleFileChange}
          />
          {fileName && (
            <p>
              File: <strong>{fileName}</strong>
            </p>
          )}
        </div>
      )}

      {mode === "link" && (
        <div style={{ marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Paste a link here"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              width: "300px",
              background: "#E5C8FF",
              color: "#43016E",
            }}
          />
          <button
            onClick={handleCheckLink}
            style={{
              marginLeft: "10px",
              padding: "8px 16px",
              backgroundColor: "#B5E3FF",
              color: "#43016E",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Check
          </button>
        </div>
      )}

      {trustScore !== null && (
        <div
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            background: "linear-gradient(to right, #E5C8FF, #EEE5F6)",
            color: "#43016E",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "16px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Trust Score: <span>{trustScore}/100</span>{" "}
          {trustScore < 60 ? "⚠️" : ""}
        </div>
      )}

      {showPopup && (
        <WarningPopup
          message="This content appears suspicious. Are you sure you want to proceed?"
          onCancel={reset}
          onProceed={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default InAppWarnings;
