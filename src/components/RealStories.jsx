import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import realStories from "../data/realStories";
import { MapPin, Calendar, BookOpen } from 'lucide-react'; // Modern icons

// This function remains unchanged
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

// Alternating color schemes for the cards
const cardSchemes = [
  {
    bgColor: '#FEF2F2', // Light Pink/Red
    titleColor: '#881337', // Dark Red
    metadataColor: '#F43F5E', // Medium Red
  },
  {
    bgColor: '#EFF6FF', // Light Blue
    titleColor: '#1E3A8A', // Dark Blue
    metadataColor: '#3B82F6', // Medium Blue
  },
];

function RealStories() {
  const navigate = useNavigate();
  const groupedStories = groupStoriesByTag(realStories);
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        {/* Header Section */}
        <div style={styles.header}>
          <h2 style={styles.mainTitle}>Real Stories</h2>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            ← Back
          </button>
        </div>

        {/* Intro */}
        <p style={styles.introText}>
          These real stories reflect the courage of individuals who stood up against
          abuse and harassment. Their experiences empower and inspire.
        </p>

        {/* Grouped stories with new card design */}
        {Object.entries(groupedStories).map(([tag, stories]) => (
          <div key={tag} style={styles.tagSection}>
            <h3 style={styles.tagTitle}>{tag}</h3>
            <div style={styles.cardList}>
              {stories.map((story, index) => {
                 const scheme = cardSchemes[index % cardSchemes.length];
                 const isHovered = hoveredCard === story.id;

                 return (
                  <div
                    key={story.id}
                    style={{
                      ...styles.card,
                      background: `linear-gradient(145deg, rgba(255,255,255,0.9), ${scheme.bgColor})`,
                      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                      boxShadow: isHovered ? '0 10px 25px rgba(109, 40, 217, 0.1)' : '0 4px 15px rgba(109, 40, 217, 0.07)',
                    }}
                    onClick={() => navigate(`/story/${story.id}`)} // Assumes a route like /story/:id exists
                    onMouseEnter={() => setHoveredCard(story.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <h4 style={{ ...styles.cardTitle, color: scheme.titleColor }}>{story.title}</h4>
                    <p style={styles.cardSummary}>{story.summary}</p>
                    <div style={styles.metadataContainer}>
                        <div style={{...styles.metadataItem, color: scheme.metadataColor}}>
                            <MapPin size={14} style={styles.icon}/>{story.location}
                        </div>
                        <div style={{...styles.metadataItem, color: scheme.metadataColor}}>
                            <Calendar size={14} style={styles.icon}/>{story.date}
                        </div>
                    </div>
                    <div style={{...styles.cardAction, color: scheme.titleColor}}>
                        <BookOpen size={16} />
                        <span>Read Full Story</span>
                    </div>
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
    tagSection: {
        marginBottom: '2.5rem',
    },
    tagTitle: {
        fontSize: 'clamp(18px, 3vw, 22px)',
        color: '#6D28D9',
        fontWeight: '600',
        marginBottom: '1rem',
        paddingBottom: '8px',
        borderBottom: '2px solid rgba(109, 40, 217, 0.2)',
    },
    cardList: {
        display: 'grid',
        gap: '16px',
    },
    card: {
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        cursor: 'pointer',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
    },
    cardTitle: {
        margin: '0 0 8px 0',
        fontSize: '18px',
        fontWeight: '600',
    },
    cardSummary: {
        margin: '0 0 16px 0',
        fontSize: '15px',
        lineHeight: '1.6',
        color: '#4A5568',
        flexGrow: 1,
    },
    metadataContainer: {
        display: 'flex',
        gap: '16px',
        marginBottom: '16px',
    },
    metadataItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '13px',
        fontWeight: '500',
    },
    icon: {
        marginRight: '6px',
    },
    cardAction: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '600',
        fontSize: '14px',
    }
};

export default RealStories;