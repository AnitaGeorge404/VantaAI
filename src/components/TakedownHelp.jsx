import React from "react";
import getPlatformInstructions from "../data/platformInstructions";
import ReactMarkdown from "react-markdown";

const TakedownHelp = ({ input }) => {
  const platform = detectPlatform(input);
  const template = getTemplate(platform);
  const { emoji, bgColor, steps } = getPlatformInstructions(platform);

  return (
    <div
      style={{
        marginTop: "16px",
        backgroundColor: bgColor,
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
      }}
    >
      <h2 style={{ marginBottom: "10px", color: "#43016E" }}>
        {emoji} {platform} Takedown Instructions
      </h2>

      <ol style={{ paddingLeft: "20px", marginBottom: "20px", color: "#333" }}>
        {steps.map((step, index) => (
          <li key={index} style={{ marginBottom: "8px" }}>
            <ReactMarkdown children={step} />
          </li>
        ))}
      </ol>

      <p style={{ color: "#43016E", fontWeight: "bold", marginBottom: "8px" }}>
        ✍️ Auto-Generated Report Text:
      </p>
      <textarea
        defaultValue={template}
        style={{
          width: "100%",
          minHeight: "140px",
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          fontSize: "15px",
          backgroundColor: "#FFFBEF",
          resize: "vertical",
          color: "purple",
        }}
      />
    </div>
  );
};

function detectPlatform(link) {
  if (!link) return "Unknown";
  if (link.includes("instagram.com")) return "Instagram";
  if (link.includes("facebook.com")) return "Facebook";
  if (link.includes("youtube.com")) return "YouTube";
  if (link.includes("twitter.com") || link.includes("x.com")) return "Twitter";
  return "Other";
}

function getTemplate(platform) {
  switch (platform) {
    case "Instagram":
      return `Dear Instagram Support,\n\nI am writing to report unauthorized use of my image on Instagram. The content at the following link violates my privacy:\n\n[Insert Link Here]\n\nPlease review and take immediate action.\n\nThank you.`;
    case "Facebook":
      return `To Facebook Moderation Team,\n\nI request immediate takedown of a post misusing my content:\n\n[Insert Link Here]\n\nThis violates privacy and consent guidelines.\n\nSincerely.`;
    case "YouTube":
      return `Dear YouTube Team,\n\nA video hosted at the following URL uses my content without permission:\n\n[Insert Link Here]\n\nPlease remove it as per your copyright and abuse policies.`;
    case "Twitter":
      return `Hi Twitter,\n\nThis tweet contains harmful misuse of my personal content:\n\n[Insert Link Here]\n\nPlease consider it for urgent removal.\n\nThanks.`;
    default:
      return `Dear Platform Support,\n\nI request immediate removal of unauthorized content found here:\n\n[Insert Link Here]\n\nThis violates my privacy. Kindly take prompt action.\n\nThank you.`;
  }
}

export default TakedownHelp;
