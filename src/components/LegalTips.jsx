import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import legalTips from "../data/legalTips";
import { ShieldCheck } from 'lucide-react'; // Icon for legal protection

// Alternating color schemes for the cards
const cardSchemes = [
  {
    bgColor: '#EFF6FF', // Light Blue
    borderColor: '#3B82F6',
    iconColor: '#1E3A8A',
  },
  {
    bgColor: '#F1F5F9', // Light Gray
    borderColor: '#64748B',
    iconColor: '#475569',
  },
];

function LegalTips() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        {/* Header Section */}
        <div style={styles.header}>
          <h2 style={styles.mainTitle}>{legalTips.title}</h2>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            ← Back
          </button>
        </div>

        {/* Description */}
        <p style={styles.introText}>{legalTips.description}</p>

        {/* Categories and Tips */}
        {legalTips.categories.map((cat) => (
          <div key={cat.category} style={styles.categorySection}>
            <h3 style={styles.categoryTitle}>{cat.category}</h3>
            <div style={styles.tipsList}>
              {cat.tips.map((tip, idx) => {
                const scheme = cardSchemes[idx % cardSchemes.length];
                const isHovered = hoveredCard === `${cat.category}-${idx}`;

                return (
                  <div
                    key={idx}
                    style={{
                      ...styles.tipCard,
                      background: `linear-gradient(135deg, rgba(255,255,255,0.9), ${scheme.bgColor})`,
                      borderLeft: `5px solid ${scheme.borderColor}`,
                      transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                      boxShadow: isHovered ? '0 8px 20px rgba(109, 40, 217, 0.08)' : '0 2px 10px rgba(109, 40, 217, 0.05)',
                    }}
                    onMouseEnter={() => setHoveredCard(`${cat.category}-${idx}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <ShieldCheck 
                      size={24} 
                      style={{ ...styles.tipIcon, color: scheme.iconColor }}
                    />
                    <p style={styles.tipText}>{tip}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #E0EFFF 0%, #EAE4FF 100%)',
        fontFamily: "'Inter', sans-serif",
        padding: '24px 16px',
    },
    contentWrapper: {
        maxWidth: '800px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    mainTitle: {
        fontSize: 'clamp(28px, 5vw, 36px)',
        fontWeight: '700',
        fontFamily: "'Lora', serif",
        color: '#6D28D9',
        margin: 0,
    },
    backButton: {
        padding: '8px 16px',
        fontSize: '14px',
        background: 'rgba(255, 255, 255, 0.6)',
        color: '#6D28D9',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'background-color 0.2s ease',
    },
    introText: {
        fontSize: 'clamp(15px, 2vw, 17px)',
        lineHeight: '1.6',
        color: '#4A5568',
        marginBottom: '2.5rem',
    },
    categorySection: {
        marginBottom: '2.5rem',
    },
    categoryTitle: {
        fontSize: 'clamp(18px, 3vw, 22px)',
        color: '#6D28D9',
        fontWeight: '600',
        marginBottom: '1rem',
        paddingBottom: '8px',
        borderBottom: '2px solid rgba(109, 40, 217, 0.2)',
    },
    tipsList: {
        display: 'grid',
        gap: '12px',
    },
    tipCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        borderRadius: '12px',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    },
    tipIcon: {
        flexShrink: 0,
    },
    tipText: {
        margin: 0,
        fontSize: '15px',
        lineHeight: '1.6',
        color: '#334155',
    }
};

export default LegalTips;