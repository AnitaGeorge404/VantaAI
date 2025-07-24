import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";

const uploadToSupabase = async (blob, filename, type) => {
  try {
    console.log(`📤 Uploading ${type} to storage:`, filename);

    // Upload to a temporary evidence bucket
    const { data: fileData, error: fileError } = await supabase.storage
      .from("evidence-temp")
      .upload(filename, blob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (fileError) {
      console.error("Storage upload error:", fileError);
      throw new Error(`Upload failed: ${fileError.message}`);
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("evidence-temp")
      .getPublicUrl(filename);

    console.log(`✅ ${type} uploaded successfully`);
    return { url: urlData.publicUrl, filename }; // Return both URL and filename for cleanup
  } catch (err) {
    console.error(`❌ Error uploading ${type}:`, err);
    // Silent error handling - don't show alerts to maintain discretion
    return null;
  }
};

const SilentSOS = () => {
  const [clickCount, setClickCount] = useState(0);
  const [tempClickCount, setTempClickCount] = useState(0);
  const [evidenceLinks, setEvidenceLinks] = useState({
    video: null,
    audio: null,
    screen: null,
  });
  const clickTimerRef = useRef(null);
  const tempClickTimerRef = useRef(null);

  const weather = {
    location: "New York, NY",
    temperature: 72,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 8,
    forecast: [
      { day: "Today", high: 75, low: 62, condition: "Sunny" },
      { day: "Tomorrow", high: 78, low: 65, condition: "Cloudy" },
      { day: "Wednesday", high: 73, low: 60, condition: "Rainy" },
    ],
  };

  const handleCloudClick = () => {
    setClickCount((prev) => prev + 1);
    clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => setClickCount(0), 3000);
    if (clickCount + 1 >= 3) {
      triggerSOS();
      setClickCount(0);
    }
  };

  const handleTempClick = () => {
    setTempClickCount((prev) => prev + 1);
    clearTimeout(tempClickTimerRef.current);
    tempClickTimerRef.current = setTimeout(() => setTempClickCount(0), 3000);

    if (tempClickCount + 1 >= 5) {
      console.log("Download triggered by temperature click.");
      handleDownloadAllEvidence();
      setTempClickCount(0);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "S") {
        e.preventDefault();
        triggerSOS();
      }
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        console.log("Download triggered by keyboard shortcut.");
        handleDownloadAllEvidence();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [evidenceLinks]); // Add evidenceLinks to dependency array to ensure latest state is used for download

  const triggerSOS = async () => {
    console.log("🔴 SOS Triggered");
    const recordingPromises = [
      recordMedia({ video: true, audio: true }, "video", 10000),
      recordMedia({ audio: true }, "audio", 10000),
    ];

    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      recordingPromises.push(recordScreenRecording(10000));
    } else {
      console.warn("Screen recording not supported on this device/browser.");
      // Don't show alert to maintain discretion
    }

    const results = await Promise.all(recordingPromises);

    setEvidenceLinks((prevLinks) => {
      const newLinks = { ...prevLinks };
      results.forEach((result) => {
        if (result && result.type && result.url) {
          newLinks[result.type] = {
            url: result.url,
            filename: result.filename,
          };
        }
      });
      return newLinks;
    });

    // Silent completion - no alert to maintain discretion
    console.log(
      "Evidence recording complete. Files are temporarily available for download."
    );
  };

  const recordMedia = async (constraints, type, duration = 10000) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (!stream || stream.getTracks().length === 0) {
        console.warn(`🚫 No ${type} stream available.`);
        return null;
      }
      const mimeType =
        type === "audio"
          ? "audio/webm;codecs=opus"
          : "video/webm;codecs=vp8,opus";
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);

      return new Promise((resolve) => {
        recorder.onstop = async () => {
          if (chunks.length === 0) {
            console.warn(`⚠️ No chunks captured for ${type}`);
            resolve(null);
          } else {
            const blob = new Blob(chunks, { type: mimeType });
            const filename = `${type}_evidence_${Date.now()}_${Math.random()
              .toString(36)
              .substring(2)}.webm`;
            const result = await uploadToSupabase(blob, filename, type);
            resolve(result ? { type, ...result } : null);
          }
          stream.getTracks().forEach((t) => t.stop());
        };
        recorder.start();
        setTimeout(
          () => recorder.state === "recording" && recorder.stop(),
          Math.max(duration, 5000)
        );
      });
    } catch (err) {
      console.error(`❌ Failed to record ${type}:`, err.message);
      // Silent error handling to maintain discretion
      return null;
    }
  };

  const recordScreenRecording = async (duration = 10000) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
        audio: true,
      });
      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
      });
      const chunks = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);

      return new Promise((resolve) => {
        recorder.onstop = async () => {
          if (chunks.length === 0) {
            console.warn(`⚠️ No chunks captured for screen`);
            resolve(null);
          } else {
            const blob = new Blob(chunks, { type: "video/webm" });
            const filename = `screen_evidence_${Date.now()}_${Math.random()
              .toString(36)
              .substring(2)}.webm`;
            const result = await uploadToSupabase(blob, filename, "screen");
            resolve(result ? { type: "screen", ...result } : null);
          }
          stream.getTracks().forEach((t) => t.stop());
        };
        recorder.start();
        setTimeout(
          () => recorder.state === "recording" && recorder.stop(),
          duration
        );
      });
    } catch (err) {
      console.error("❌ Screen recording error:", err.message);
      return null;
    }
  };

  const handleDownloadAllEvidence = () => {
    let downloadedCount = 0;
    const types = ["video", "audio", "screen"];

    types.forEach((type) => {
      if (evidenceLinks[type]) {
        downloadEvidence(type, evidenceLinks[type]);
        downloadedCount++;
      }
    });

    // Silent operation - no alert to maintain discretion
    if (downloadedCount === 0) {
      console.log("No evidence has been recorded yet. Trigger the SOS first.");
    }
  };

  const downloadEvidence = async (type, evidenceData) => {
    if (!evidenceData || !evidenceData.url) {
      console.error(`No URL available for ${type} evidence.`);
      return;
    }

    try {
      // Download the file
      const response = await fetch(evidenceData.url);
      const blob = await response.blob();

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${type}_evidence_${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      console.log(`✅ Download initiated for ${type}`);

      // Delete from Supabase storage after download for cleanup
      if (evidenceData.filename) {
        const { error: deleteError } = await supabase.storage
          .from("evidence-temp")
          .remove([evidenceData.filename]);

        if (deleteError) {
          console.error(`Failed to delete ${type} from storage:`, deleteError);
        } else {
          console.log(`🗑️ ${type} evidence deleted from storage`);

          // Remove from state
          setEvidenceLinks((prev) => ({
            ...prev,
            [type]: null,
          }));
        }
      }
    } catch (err) {
      console.error(`Download error for ${type}:`, err);
    }
  };

  const getIcon = (cond) => {
    const c = cond.toLowerCase();
    if (c.includes("sun")) return "☀️";
    if (c.includes("cloud")) return "⛅";
    if (c.includes("rain")) return "🌧️";
    return "☁️";
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>WeatherNow</h2>
        <div>{weather.location}</div>
      </div>

      <div style={styles.main}>
        <div style={styles.temperature}>
          <span
            onClick={handleTempClick}
            style={styles.tempText}
            title="Click 5 times to download evidence"
          >
            {weather.temperature}°
          </span>
          <span
            onClick={handleCloudClick}
            style={styles.icon}
            title="Click 3 times for SOS"
          >
            {getIcon(weather.condition)}
          </span>
        </div>
        <div>{weather.condition}</div>
        <div>
          Humidity: {weather.humidity}% | Wind: {weather.windSpeed} mph
        </div>
        <h4 style={styles.forecastHeader}>Forecast</h4>
        {weather.forecast.map((f, i) => (
          <div key={i} style={styles.forecastItem}>
            <span>{f.day}:</span>
            <span>
              {getIcon(f.condition)} {f.high}° / {f.low}°
            </span>
          </div>
        ))}
        {/* Optional: Display download buttons if links exist */}
        {(evidenceLinks.video ||
          evidenceLinks.audio ||
          evidenceLinks.screen) && (
          <div style={styles.downloadSection}>
            <p>Evidence is ready for download:</p>
            {evidenceLinks.video && (
              <button
                onClick={() => downloadEvidence("video", evidenceLinks.video)}
                style={styles.button}
              >
                Download Video Evidence
              </button>
            )}
            {evidenceLinks.audio && (
              <button
                onClick={() => downloadEvidence("audio", evidenceLinks.audio)}
                style={{ ...styles.button, marginLeft: 10 }}
              >
                Download Audio Evidence
              </button>
            )}
            {evidenceLinks.screen && (
              <button
                onClick={() => downloadEvidence("screen", evidenceLinks.screen)}
                style={{ ...styles.button, marginLeft: 10 }}
              >
                Download Screen Recording
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 400,
    margin: "0 auto",
    padding: 20,
    fontFamily: "Arial, sans-serif",
    background: "linear-gradient(to bottom, #74b9ff, #0984e3)",
    color: "white",
    borderRadius: 15,
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    minHeight: "calc(100vh - 40px)",
    display: "flex",
    flexDirection: "column",
  },
  header: { textAlign: "center", marginBottom: 20 },
  main: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 20,
    flexGrow: 1,
  },
  temperature: {
    fontSize: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  tempText: {
    fontWeight: 300,
    cursor: "pointer",
    userSelect: "none",
  },
  icon: {
    fontSize: 40,
    cursor: "pointer",
    userSelect: "none",
  },
  forecastHeader: { marginTop: 20, marginBottom: 10 },
  forecastItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 0",
  },
  downloadSection: { marginTop: 20, textAlign: "center" },
  button: {
    padding: "12px 20px",
    background: "#fff",
    color: "#0984e3",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    marginTop: 10, // Added margin-top for spacing
  },
};

export default SilentSOS;
