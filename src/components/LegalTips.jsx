import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import legalTips from "../data/legalTips";
import { ShieldCheck, ChevronDown } from "lucide-react";

function LegalTips() {
  const navigate = useNavigate();
  const [openCategory, setOpenCategory] = useState(
    legalTips.categories[0]?.category
  );

  const handleToggle = (categoryTitle) => {
    setOpenCategory((prevOpen) =>
      prevOpen === categoryTitle ? null : categoryTitle
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <div style={styles.header}>
          <h1 style={styles.mainTitle}>{legalTips.title}</h1>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            ← Back
          </button>
        </div>

        <p style={styles.introText}>{legalTips.description}</p>

        <div style={styles.accordion}>
          {legalTips.categories.map((cat) => {
            const isOpen = openCategory === cat.category;
            return (
              <div key={cat.category} style={styles.accordionItem}>
                <button
                  style={styles.accordionHeader}
                  onClick={() => handleToggle(cat.category)}
                  aria-expanded={isOpen}
                >
                  <h2 style={styles.accordionTitle}>{cat.category}</h2>
                  <ChevronDown
                    size={24}
                    style={{
                      ...styles.accordionIcon,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                <div
                  style={{
                    ...styles.accordionPanel,
                    maxHeight: isOpen ? "1500px" : "0px",
                  }}
                >
                  <div style={styles.accordionContent}>
                    {cat.tips.map((tip, idx) => (
                      <div key={idx} style={styles.tipItem}>
                        <ShieldCheck size={20} style={styles.tipIcon} />
                        <p style={styles.tipText}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
  accordion: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  accordionItem: {
    background: "rgba(255, 255, 255, 0.7)",
    borderRadius: "16px",
    border: "1px solid rgba(109, 40, 217, 0.1)",
    boxShadow: "0 4px 15px rgba(109, 40, 217, 0.05)",
    overflow: "hidden",
  },
  accordionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "20px",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
  },
  accordionTitle: {
    fontSize: "clamp(18px, 3vw, 20px)",
    color: "#4C1D95",
    fontWeight: "600",
    margin: 0,
  },
  accordionIcon: {
    color: "#6D28D9",
    transition: "transform 0.3s ease",
    flexShrink: 0,
  },
  accordionPanel: {
    maxHeight: "0",
    overflow: "hidden",
    transition: "max-height 0.4s ease-out",
  },
  accordionContent: {
    padding: "0 20px 20px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  tipItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "12px",
    background: "rgba(245, 243, 255, 0.5)",
    borderRadius: "10px",
  },
  tipIcon: {
    flexShrink: 0,
    color: "#6D28D9",
    marginTop: "3px",
  },
  tipText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#334155",
  },
};

export default LegalTips;
