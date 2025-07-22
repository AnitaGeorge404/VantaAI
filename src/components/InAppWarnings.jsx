import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const styles = {
  container: {
    height: '100vh',
    maxHeight: '100dvh',
    overflow: 'hidden',
    padding: '16px 16px 0 16px',
    background: 'linear-gradient(180deg, #E0EFFF 0%, #EAE4FF 100%)',
    fontFamily: "'Inter', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    color: '#501773',
  },
  contentArea: {
    flexGrow: 1,
    overflowY: 'auto',
    paddingBottom: '20px',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  },
  appTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#501773',
    textAlign: 'center',
    marginBottom: '0.5rem',
    fontFamily: "'Lora', serif",
  },
  appDescription: {
    fontSize: '0.9rem',
    color: '#6A5ACD',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#501773',
    marginBottom: '1rem',
    fontFamily: "'Lora', serif",
  },
  inputContainer: {
    position: 'relative',
    marginBottom: '1.5rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '12px',
    border: '1px solid #9370DB',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    color: '#501773',
    fontSize: '1rem',
    resize: 'none',
    overflow: 'hidden',
    minHeight: '6rem',
    boxShadow: '0 4px 10px rgba(109, 40, 217, 0.05)',
  },
  detectButton: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '12px',
    backgroundColor: '#6A5ACD',
    color: 'white',
    fontSize: '1.125rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    boxShadow: '0 4px 10px rgba(106, 90, 205, 0.2)',
  },
  detectButtonDisabled: {
    backgroundColor: '#9370DB',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  errorMessage: {
    color: '#DC143C',
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '0.875rem',
  },
  resultsSection: {
    marginTop: '2rem',
    paddingTop: '1rem',
  },
  resultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '20px',
    padding: '1.5rem',
    boxShadow: '0 6px 20px rgba(109, 40, 217, 0.08)',
    border: '1px solid #9370DB',
  },
  scoreGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  scoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '15px',
    padding: '1rem',
    textAlign: 'center',
    boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
    border: '1px solid #9370DB',
  },
  scoreTitle: {
    fontSize: '1rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
    color: '#501773',
  },
  spamScoreTitle: { color: '#8A2BE2' },
  dangerScoreTitle: { color: '#8B008B' },
  scoreValue: {
    fontSize: '1.875rem',
    fontWeight: '700',
  },
  spamScoreValue: { color: '#8A2BE2' },
  dangerScoreValue: { color: '#8B008B' },
  warningsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '15px',
    padding: '1rem',
    boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
    border: '1px solid #9370DB',
  },
  warningsList: {
    listStyleType: 'disc',
    paddingLeft: '1.25rem',
    fontSize: '0.875rem',
    color: '#501773',
  },
  warningItem: {
    marginBottom: '0.5rem',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

if (typeof window !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        min-height: 100vh;
        width: 100%;
        box-sizing: border-box;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleTag);
}

export default function InAppWarnings() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [parsedResult, setParsedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const analyzeMessage = async () => {
    if (!message.trim()) {
      setError("Please enter a message to analyze.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setParsedResult(null);
      const genAI = new GoogleGenerativeAI("AIzaSyDL1M9tpuXbMVP3c5gl3Olj4IjQHRCYnOc");
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const basicPrompt = `You are a spam detection system. Analyze this SMS message and return ONLY a JSON object with spamScore (0-100), dangerScore (0-100), and warnings array. If no warnings, the array should be empty. Do NOT include any conversational text, explanations, or filler outside the JSON object.

      Example valid output:
      {"spamScore": 20, "dangerScore": 10, "warnings": ["Contains common marketing phrases."]}
      Example valid output for no warnings:
      {"spamScore": 5, "dangerScore": 0, "warnings": []}

      Message to analyze: ${message}`;

      const result = await model.generateContent(basicPrompt);
      const response = await result.response;
      const analysisResult = response.text();

      console.log("Raw analysisResult from direct Gemini call:", analysisResult);
      setResult(analysisResult);

      try {
        const content = analysisResult;
        if (!content) throw new Error("AI response content is empty or undefined, cannot parse.");
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : content;
        const parsed = JSON.parse(jsonStr);
        setParsedResult(parsed);
      } catch (parseError) {
        console.error("Failed to parse AI response JSON:", parseError);
        setError("Failed to parse AI response. The AI might not have returned valid JSON. Check console for raw response and parsing details.");
      }
    } catch (err) {
      setError("Error analyzing message. Please check your API key, model access, network connection, or if the message violates safety policies.");
      console.error("Overall analysis error (direct Gemini call):", err);
      if (err.response?.data?.error) {
        console.error("Gemini API Error details:", err.response.data.error);
        setError(prev => prev + ` Details: ${err.response.data.error.message || err.response.data.error.status}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div style={styles.container}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <div style={{ animation: "spin 1s linear infinite", borderRadius: "9999px", height: "3rem", width: "3rem", borderTop: "2px solid #6A5ACD", borderBottom: "2px solid #6A5ACD" }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.contentArea}>
        <h2 style={styles.appTitle}>In-App Warnings</h2>
        <p style={styles.appDescription}>Analyze messages for potential spam and danger.</p>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={styles.sectionTitle}>Analyze Link</h3>
          <div style={styles.inputContainer}>
            <textarea
              ref={textareaRef}
              style={styles.textarea}
              placeholder="Enter link to analyze..."
              value={message}
              onChange={handleMessageChange}
              rows={2}
            />
          </div>
          <button
            onClick={analyzeMessage}
            disabled={loading}
            style={{
              ...styles.detectButton,
              ...(loading ? styles.detectButtonDisabled : {}),
            }}
          >
            {loading ? "Analyzing..." : "Detect Spam"}
          </button>
          {error && <div style={styles.errorMessage}>{error}</div>}
        </div>
        {parsedResult && (
          <div style={styles.resultsSection}>
            <h3 style={styles.sectionTitle}>Analysis Results</h3>
            <div style={styles.resultContainer}>
              <div style={styles.scoreGrid}>
                <div style={styles.scoreCard}>
                  <h3 style={{ ...styles.scoreTitle, ...styles.spamScoreTitle }}>Spam Score</h3>
                  <div style={{ ...styles.scoreValue, ...styles.spamScoreValue }}>{parsedResult.spamScore}%</div>
                </div>
                <div style={styles.scoreCard}>
                  <h3 style={{ ...styles.scoreTitle, ...styles.dangerScoreTitle }}>Danger Score</h3>
                  <div style={{ ...styles.scoreValue, ...styles.dangerScoreValue }}>{parsedResult.dangerScore}%</div>
                </div>
              </div>
              <div>
                <h3 style={{ ...styles.scoreTitle, color: '#501773', marginBottom: "0.75rem" }}>Warnings</h3>
                <div style={styles.warningsContainer}>
                  <ul style={styles.warningsList}>
                    {parsedResult.warnings?.length > 0 ? (
                      parsedResult.warnings.map((warning, index) => (
                        <li key={index} style={styles.warningItem}>{warning}</li>
                      ))
                    ) : (
                      <li style={styles.warningItem}>No specific warnings detected based on text analysis.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
