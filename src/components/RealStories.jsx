import React from "react";
import { useNavigate } from "react-router-dom";
import realStories from "../data/realStories";
import { MapPin, Calendar } from "lucide-react";
import { pad } from "@tensorflow/tfjs";

function groupStoriesByTag(stories) {
  const grouped = {};
  stories.forEach((story) => {
    story.tags.forEach((tag) => {
      if (!grouped[tag]) grouped[tag] = [];
      grouped[tag].push(story);
    });
  });
  return grouped;
}

function RealStories() {
  const navigate = useNavigate();
  const groupedStories = groupStoriesByTag(realStories);

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        {/* Header Section */}
        <div style={styles.header}>
          <h1 style={styles.mainTitle}>Real Stories</h1>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            ← Back
          </button>
        </div>

        {/* Intro */}
        <p style={styles.introText}>
          These real stories reflect the courage of individuals who stood up
          against abuse and harassment. Their experiences empower and inspire.
        </p>

        {/* Grouped stories in a simple, scrollable list */}
        <div style={styles.sectionsContainer}>
          {Object.entries(groupedStories).map(([tag, stories]) => (
            <section key={tag} style={styles.tagSection}>
              <h2 style={styles.tagTitle}>{tag}</h2>
              <div style={styles.storyList}>
                {stories.map((story) => (
                  <div key={story.id} style={styles.storyCard}>
                    <h3 style={styles.storyTitle}>{story.title}</h3>
                    <p style={styles.storySummary}>{story.summary}</p>
                    <div style={styles.metadataContainer}>
                      <div style={styles.metadataItem}>
                        <MapPin size={14} style={styles.icon} />
                        {story.location}
                      </div>
                      <div style={styles.metadataItem}>
                        <Calendar size={14} style={styles.icon} />
                        {story.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

// Styles focused on a clean, spacious, non-interactive list
const styles = {
  container: {
    background: "linear-gradient(180deg, #E0EFFF 0%, #EAE4FF 100%)",
    fontFamily: "'Inter', sans-serif",
    padding: "32px 16px",
    height: "100vh",
    overflowY: "auto",
    paddingTop: "70px",
  },
  contentWrapper: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  mainTitle: {
    fontSize: "clamp(32px, 5vw, 40px)",
    fontWeight: "700",
    fontFamily: "'Lora', serif",
    color: "#4C1D95",
    margin: 0,
  },
  backButton: {
    padding: "8px 16px",
    fontSize: "14px",
    background: "transparent",
    color: "#6D28D9",
    border: "1px solid rgba(109, 40, 217, 0.3)",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  introText: {
    fontSize: "clamp(16px, 2vw, 18px)",
    lineHeight: "1.7",
    color: "#475569",
    marginBottom: "3rem",
    maxWidth: "720px",
  },
  sectionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "3rem", // Increased space between tag sections
  },
  tagSection: {
    // Each section for a tag
  },
  tagTitle: {
    fontSize: "clamp(20px, 3vw, 24px)",
    color: "#4C1D95",
    fontWeight: "600",
    margin: "0 0 1.5rem 0",
    paddingBottom: "12px",
    borderBottom: "2px solid rgba(109, 40, 217, 0.2)",
  },
  storyList: {
    display: "grid",
    gridTemplateColumns: "1fr", // Ensures one card per row
    gap: "20px", // Space between cards in a section
  },
  storyCard: {
    background: "rgba(255, 255, 255, 0.7)",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(109, 40, 217, 0.1)",
    boxShadow: "0 4px 15px rgba(109, 40, 217, 0.05)",
  },
  storyTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#4C1D95",
    margin: "0 0 8px 0",
  },
  storySummary: {
    margin: "0 0 16px 0",
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#334155",
  },
  metadataContainer: {
    display: "flex",
    gap: "20px",
    borderTop: "1px solid rgba(109, 40, 217, 0.15)",
    paddingTop: "12px",
  },
  metadataItem: {
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: "500",
    color: "#6D28D9",
  },
  icon: {
    marginRight: "6px",
  },
};

export default RealStories;
