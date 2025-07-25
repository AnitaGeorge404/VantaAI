import { useState } from "react";
import ImageUpload from "./DFD_ImageUpload";
import ResultsDisplay from "./DFD_ResultsDisplay";

const DeepfakeDetector = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageUpload = (file) => {
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result);
    };
    reader.readAsDataURL(file);
    setResult(null);
  };

  const analyzeImage = async () => {
    if (!uploadedImage) return alert("Please upload an image first.");
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadedImage);

      const response = await fetch("http://localhost:8001/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult({
        isDeepfake: data.isDeepfake,
        confidence: data.confidence,
        details: data.details,
      });
    } catch (err) {
      alert("Failed to analyze image");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setResult(null);
  };

  const flagForReview = () => {
    if (result) alert("Image has been flagged for manual review.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 dark:bg-gradient-to-b dark:from-blue-200 dark:via-purple-200 dark:to-pink-200 flex items-center justify-center">
      <div
        style={{
          fontFamily: "sans-serif",
          maxWidth: "500px",
          margin: "auto",
          backgroundImage: "linear-gradient(180deg, #E0EFFF 0%, #EAE4FF 100%)",
          padding: "2rem",
          borderRadius: "1rem",
          minHeight: "100vh",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              color: "#6B21A8",
              marginBottom: "0.25rem",
            }}
          >
            Deepfake Detector
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>
            Upload an image to classify whether it's real or fake using a
            deepfake detection model.
          </p>
        </div>

        <ImageUpload
          onImageUpload={handleImageUpload}
          imagePreview={imagePreview}
        />

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "1rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={clearImage}
            disabled={!uploadedImage}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              backgroundColor: "#FECACA",
              color: "#991B1B",
              border: "none",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Clear
          </button>
          <button
            onClick={analyzeImage}
            disabled={!uploadedImage || isAnalyzing}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              backgroundColor: "#BFDBFE",
              color: "#1D4ED8",
              border: "none",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>

        <ResultsDisplay result={result} isAnalyzing={isAnalyzing} />

        {result && (
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <button
              onClick={flagForReview}
              style={{
                backgroundColor: "#2563EB",
                color: "white",
                padding: "0.75rem 1.25rem",
                borderRadius: "0.75rem",
                fontWeight: "500",
                border: "none",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
            >
              🚩 Flag for Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeepfakeDetector;
