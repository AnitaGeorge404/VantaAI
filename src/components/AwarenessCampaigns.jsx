import React, { useState } from 'react';
// Using your existing data import
import awarenessCampaigns from "../data/awarenessCampaigns";
// Importing modern icons for better UX
import { Calendar, Users, ArrowUpRight } from 'lucide-react';

// Color schemes from the Dashboard component to style the cards
const cardSchemes = [
  {
    bgColor: '#EFF6FF', // Light Blue
    titleColor: '#1E3A8A', // Dark Blue
    metadataColor: '#3B82F6', // Medium Blue
  },
  {
    bgColor: '#FEF2F2', // Light Pink/Red
    titleColor: '#881337', // Dark Red
    metadataColor: '#F43F5E', // Medium Red
  }
];

function AwarenessCampaigns() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={styles.container}>
      {/* The original "Featured" heading */}
      <h2
        style={{
          fontWeight: "bold",
          fontSize: "clamp(22px, 4vw, 28px)",
          marginBottom: "1.5rem",
          textAlign: "center",
          color: "#43016E",
          padding: '0 1rem',
        }}
      >
        Featured:{" "}
        <span style={{ fontWeight: "600" }}>
          Join the movement to stop online harassment and build a safer internet for women.
        </span>
      </h2>

      <main style={styles.list}>
        {awarenessCampaigns.map((campaign, index) => {
          const scheme = cardSchemes[index % cardSchemes.length];
          const isHovered = hoveredCard === campaign.id;

          return (
            <a
              key={campaign.id}
              href={campaign.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...styles.card,
                background: `linear-gradient(135deg, rgba(255,255,255,0.9), ${scheme.bgColor})`,
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHovered ? '0 10px 25px rgba(109, 40, 217, 0.12)' : '0 6px 20px rgba(109, 40, 217, 0.08)',
              }}
              onMouseEnter={() => setHoveredCard(campaign.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img src={campaign.image} alt={campaign.title} style={styles.cardImage} />

              <div style={styles.cardContent}>
                <h3 style={{ ...styles.cardTitle, color: scheme.titleColor }}>
                  {campaign.title}
                </h3>
                <p style={styles.cardDescription}>{campaign.description}</p>
                
                {/* Enhanced Metadata with Icons */}
                <div style={styles.metadataContainer}>
                  <div style={{...styles.metadataItem, color: scheme.metadataColor}}>
                    <Calendar size={14} style={styles.icon}/> 
                    {campaign.date}
                  </div>
                  <div style={{...styles.metadataItem, color: scheme.metadataColor}}>
                    <Users size={14} style={styles.icon}/>
                    {campaign.organizers}
                  </div>
                </div>

                {/* Enhanced Link / Call to Action */}
                <div style={{...styles.cardAction, color: scheme.titleColor}}>
                  <span>Learn More</span>
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </a>
          );
        })}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '24px 16px',
    background: 'linear-gradient(180deg, #E0EFFF 0%, #EAE4FF 100%)',
    fontFamily: "'Inter', sans-serif",
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    alignItems: 'flex-start', // Align items to the top
    borderRadius: '20px',
    padding: '16px',
    textDecoration: 'none',
    color: 'inherit',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  },
  cardImage: {
    width: '90px',
    height: '90px',
    borderRadius: '12px',
    objectFit: 'cover',
    flexShrink: 0,
    marginTop: '4px'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minHeight: '90px', // Match image height to ensure alignment
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    fontFamily: "'Lora', serif",
    margin: '0 0 8px 0',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#64748B',
    lineHeight: '1.5',
    margin: '0 0 12px 0',
    flexGrow: 1, // Pushes content below it to the bottom
  },
  metadataContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '12px',
  },
  metadataItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: '500',
  },
  icon: {
    marginRight: '6px',
    flexShrink: 0,
  },
  cardAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontWeight: '600',
    fontSize: '14px',
    alignSelf: 'flex-start', // Align to the left
  },
};

export default AwarenessCampaigns;