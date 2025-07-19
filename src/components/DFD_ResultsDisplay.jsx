const ResultsDisplay = ({ result, isAnalyzing }) => {
  const styles = {
    container: {
      background: "linear-gradient(to bottom right, #e0c3fc, #8ec5fc)",
      borderRadius: "1rem",
      padding: "1.5rem",
      marginTop: "1.5rem",
      boxShadow: "0 8px 12px rgba(0,0,0,0.1)",
      textAlign: "center",
    },
    spinner: {
      width: "2rem",
      height: "2rem",
      border: "4px solid #D8B4FE",
      borderTop: "4px solid #7C3AED",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "1rem auto",
    },
    title: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#6B21A8",
    },
    subtext: {
      fontSize: "0.9rem",
      color: "#374151",
    },
    statusText: (isFake) => ({
      fontSize: "1.2rem",
      fontWeight: "700",
      color: isFake ? "#DC2626" : "#16A34A",
      marginTop: "1rem",
    }),
    labels: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "1rem",
      fontSize: "0.875rem",
      color: "#4B5563",
    },
    barBackground: {
      width: "100%",
      height: "0.75rem",
      backgroundColor: "#E5E7EB",
      borderRadius: "9999px",
      overflow: "hidden",
      marginTop: "0.5rem",
    },
    barFill: (isFake, width) => ({
      height: "100%",
      width: `${width}%`,
      backgroundColor: isFake ? "#F87171" : "#34D399",
      borderRadius: "9999px",
      transition: "width 0.5s ease-in-out",
    }),
    details: {
      marginTop: "1rem",
      fontSize: "0.85rem",
      color: "#374151",
      background: "#ffffffcc",
      padding: "1rem",
      borderRadius: "0.75rem",
    },
  };

  if (isAnalyzing) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner}></div>
        <h3 style={styles.title}>Analyzing Image...</h3>
        <p style={styles.subtext}>Please wait while we process your image</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>Deepfake Classification</h3>
        <p style={styles.subtext}>Results will appear here after analysis</p>
      </div>
    );
  }

  const confidencePercentage = Math.round(result.confidence * 100);
  const isFake = result.isDeepfake;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Deepfake Classification</h3>
      <div style={styles.statusText(isFake)}>
        {isFake ? "⚠️ Potential Deepfake" : "✅ Appears Authentic"}
      </div>
      <div style={styles.labels}>
        <span>Confidence Level</span>
        <span>{confidencePercentage}%</span>
      </div>
      <div style={styles.barBackground}>
        <div style={styles.barFill(isFake, confidencePercentage)}></div>
      </div>
      <div style={styles.details}>
        <p>{result.details}</p>
      </div>
    </div>
  );
};

export default ResultsDisplay;