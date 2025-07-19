const instructions = {
  Instagram: {
    platform: "Instagram",
    emoji: "📸",
    bgColor: "#FFE9EC",
    steps: [
      "Go to the profile or post containing the suspicious content.",
      "Tap the three dots (...) on the post or profile.",
      "Select 'Report'.",
      "Choose the appropriate reason (e.g., nudity, harassment, impersonation).",
      "Alternatively, visit the [Instagram Help Center](https://help.instagram.com/) for direct support."
    ]
  },
  Facebook: {
    platform: "Facebook",
    emoji: "📘",
    bgColor: "#E8F0FF",
    steps: [
      "Visit the post, photo, or video you want to report.",
      "Click the three dots (...) in the top-right corner of the post.",
      "Select 'Find Support or Report Post'.",
      "Choose the most relevant issue (e.g., bullying, copyright, fake account).",
      "You can also go to the [Facebook Reporting Center](https://www.facebook.com/help/263149623790594)."
    ]
  },
  Twitter: {
    platform: "Twitter",
    emoji: "🐦",
    bgColor: "#E6F7FF",
    steps: [
      "Go to the tweet or profile in question.",
      "Click the three dots (...) on the tweet or user profile.",
      "Select 'Report Tweet' or 'Report User'.",
      "Follow the prompts to choose the issue and submit the report.",
      "You can also use [Twitter’s Reporting Form](https://help.twitter.com/forms/abusiveuser)."
    ]
  },
  YouTube: {
    platform: "YouTube",
    emoji: "▶️",
    bgColor: "#FFF1F0",
    steps: [
      "Visit the video you'd like to report.",
      "Click the three dots (...) below the video or beside the comment.",
      "Select 'Report'.",
      "Choose the reason (e.g., harmful or dangerous acts, sexual content).",
      "You may also use the [YouTube Reporting Tool](https://support.google.com/youtube/answer/2802027)."
    ]
  }
};

export default function getPlatformInstructions(platform) {
  const data = instructions[platform];
  if (!data) {
    return {
      platform,
      emoji: "⚠️",
      bgColor: "#F9F9F9",
      steps: ["No specific instructions found for this platform."]
    };
  }
  return data;
}
