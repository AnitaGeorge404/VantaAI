import { runToxicityAnalysis } from "./mlAnalyser";

const NSFW_KEYWORDS = [
  "nude", "porn", "xxx", "sex", "explicit", "18+", "onlyfans",
  "pussy", "boobs", "nsfw", "camgirl", "strip", "hot video"
];

const TOXIC_KEYWORDS = [
  "hate", "kill", "suicide", "loser", "die", "stupid", "retard",
  "abuse", "bastard", "racist", "dumb", "ugly", "slur"
];

const SUSPICIOUS_DOMAINS = [
  /bit\.ly/, /tinyurl\.com/, /rb\.gy/, /shorturl\.at/, /t\.co/,
  /free.*(download|gift|money|movie|update|iphone)/,
  /win.*(prize|lottery|bonus|cash)/,
  /verify.*account/, /login.*account/, /bank.*alert/,
  /http[s]?:\/\/(\d{1,3}\.){3}\d{1,3}/,
  /[a-z]*[0-9]+[a-z]*\.(com|net|org)/,
  /[a@]mazon|faceb00k|paypa1|goog[l1]e|instagr[a@]m/
];

const SPOOF_BRANDS = [
  "facebook", "instagram", "paypal", "amazon", "google", "microsoft", "bank"
];

const SUSPICIOUS_FILE_TYPES = [
  ".exe", ".scr", ".bat", ".cmd", ".dll", ".apk", ".zip", ".rar"
];

export async function analyzeContentTrust(content) {
  const lower = content.toLowerCase();
  let ruleScore = 100;
  let reasons = [];

  // === NSFW Detection ===
  const nsfwMatches = NSFW_KEYWORDS.filter(w => lower.includes(w));
  if (nsfwMatches.length > 0) {
    ruleScore -= nsfwMatches.length * 10;
    reasons.push("NSFW keywords detected");
  }

  // === Toxic Language Detection ===
  const toxicMatches = TOXIC_KEYWORDS.filter(w => lower.includes(w));
  if (toxicMatches.length > 0) {
    ruleScore -= toxicMatches.length * 8;
    reasons.push("Toxic language detected");
  }

  // === Suspicious Domain Detection ===
  const domainMatches = SUSPICIOUS_DOMAINS.filter(regex => regex.test(lower));
  if (domainMatches.length > 0) {
    ruleScore -= domainMatches.length * 12;
    reasons.push("Suspicious link or domain");
  }

  // === Dangerous File Type Detection ===
  SUSPICIOUS_FILE_TYPES.forEach(ext => {
    if (lower.endsWith(ext)) {
      if (ext === ".exe" || ext === ".apk") {
        ruleScore -= 35;
        reasons.push(`Dangerous file type: ${ext}`);
      } else {
        ruleScore -= 20;
        reasons.push(`Suspicious file type: ${ext}`);
      }
    }
  });

  // === Spoofed Brand Phishing Detection ===
  const spoofMatch = SPOOF_BRANDS.find(brand =>
    lower.includes(brand) &&
    (lower.includes("login") || lower.includes("secure") || lower.includes("account"))
  );
  if (spoofMatch) {
    ruleScore -= 25;
    reasons.push(`Spoofed brand phishing attempt: ${spoofMatch}`);
  }

  // === ML Toxicity Detection ===
  let mlScore = 100;
  try {
    const mlResult = await runToxicityAnalysis(content); // { toxic: true/false, score: 0–1 }

    if (mlResult.toxic) {
      const penalty = Math.round(mlResult.score * 100); // e.g. 0.85 → -85
      mlScore = 100 - penalty;
      if (penalty >= 70) {
        reasons.push(`Highly toxic (ML score: ${mlResult.score.toFixed(2)})`);
      } else {
        reasons.push(`Mild toxicity flagged (ML score: ${mlResult.score.toFixed(2)})`);
      }
    }
  } catch (err) {
    console.error("ML toxicity analysis failed:", err);
    mlScore = 85; // fallback score
    reasons.push("ML model error – fallback trust score used");
  }

  // === Final Blended Score ===
  let finalScore = Math.round((ruleScore + mlScore) / 2);
  finalScore = Math.max(0, Math.min(100, finalScore)); // Clamp between 0–100

  return {
    score: finalScore,
    isSuspicious: finalScore < 70,
    reason: reasons.length ? reasons.join(" + ") : "No obvious red flags"
  };
}
