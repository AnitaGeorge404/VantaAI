// src/utils/mlAnalyser.js
import * as toxicity from '@tensorflow-models/toxicity';
import '@tensorflow/tfjs';

let model = null;
const THRESHOLD = 0.85; // Slightly lower for better catch rate

// Preload the model on first import
loadModel(); // ⚠️ This call will kick off background loading

async function loadModel() {
  if (!model) {
    try {
      model = await toxicity.load(THRESHOLD);
      console.log("Toxicity model loaded ✅");
    } catch (err) {
      console.error("Toxicity model failed to load:", err);
    }
  }
  return model;
}

export async function runToxicityAnalysis(text) {
  if (!model) {
    console.warn("Toxicity model not ready yet");
    return { toxic: false, score: 0 };
  }

  try {
    const predictions = await model.classify([text]);
    const toxicLabels = predictions.filter(p => p.results[0].match);

    const toxic = toxicLabels.length > 0;
    let maxScore = 0;
    toxicLabels.forEach(p => {
      const score = p.results[0].probabilities[1];
      if (score > maxScore) maxScore = score;
    });

    return {
      toxic,
      score: toxic ? maxScore : 0
    };
  } catch (error) {
    console.error("Toxicity analysis failed:", error);
    return {
      toxic: false,
      score: 0
    };
  }
}
