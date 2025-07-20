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

const SUSPICIOUS_FILE_TYPES = [".exe", ".scr", ".bat", ".cmd", ".dll", ".apk", ".zip", ".rar"];

const SPOOF_BRANDS = ["facebook", "instagram", "paypal", "amazon", "google", "microsoft", "bank"];

export async function analyzeContentTrust(content) {
  const lower = content.toLowerCase();
  let baseScore = 100;
  let deductions = 0;
  let reasons = [];

  // --- NSFW ---
  const nsfw = NSFW_KEYWORDS.filter(w => lower.includes(w));
  if (nsfw.length > 0) {
    deductions += nsfw.length * 12;
    reasons.push(`NSFW: ${nsfw.join(", ")}`);
  }

  // --- Toxicity (Rule-Based) ---
  const toxic = TOXIC_KEYWORDS.filter(w => lower.includes(w));
  if (toxic.length > 0) {
    deductions += toxic.length * 15; // each toxic word is a big penalty
    reasons.push(`Toxic: ${toxic.join(", ")}`);
  }

  // --- Suspicious Domains ---
  const domainMatches = SUSPICIOUS_DOMAINS.filter(re => re.test(lower));
  if (domainMatches.length > 0) {
    deductions += domainMatches.length * 12;
    reasons.push(`Suspicious domains/links`);
  }

  // --- File Extension ---
  for (const ext of SUSPICIOUS_FILE_TYPES) {
    if (lower.endsWith(ext)) {
      deductions += ext === ".exe" || ext === ".apk" ? 35 : 20;
      reasons.push(`Suspicious file type: ${ext}`);
    }
  }

  // --- Brand Phishing ---
  const spoof = SPOOF_BRANDS.find(brand =>
    lower.includes(brand) &&
    (lower.includes("login") || lower.includes("secure") || lower.includes("account"))
  );
  if (spoof) {
    deductions += 25;
    reasons.push(`Possible spoofed brand phishing: ${spoof}`);
  }

  // --- ML Toxicity ---
  let mlPenalty = 0;
  try {
    const mlResult = await runToxicityAnalysis(content); // { toxic: true, score: 0.89 }
    if (mlResult?.toxic && mlResult.score > 0.6) {
      mlPenalty = Math.round(mlResult.score * 100); // 0.83 → -83
      deductions += mlPenalty;
      reasons.push(`ML Toxicity: ${mlResult.score.toFixed(2)}`);
    }
  } catch (e) {
    reasons.push("ML analysis skipped (error)");
  }

  // --- Final Score ---
  let trustScore = baseScore - deductions;
  trustScore = Math.max(0, trustScore);

  return {
    score: trustScore,
    isSuspicious: trustScore < 70,
    reason: reasons.join(" + ") || "No red flags"
  };
}
