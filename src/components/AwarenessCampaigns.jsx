import React, { useState } from 'react';
import awarenessCampaigns from "../data/awarenessCampaigns";
import { Calendar, Users, ArrowUpRight } from 'lucide-react';

function AwarenessCampaigns() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <h1 style={styles.mainTitle}>
          Join the movement to stop online harassment and build a safer internet for women.
        </h1>

        <main style={styles.list}>
          {awarenessCampaigns.map((campaign) => {
            const isHovered = hoveredCard === campaign.id;
            return (
              <a
                key={campaign.id}
                href={campaign.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...styles.card,
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: isHovered ? '0 8px 25px rgba(109, 40, 217, 0.1)' : '0 4px 15px rgba(109, 40, 217, 0.05)',
                }}
                onMouseEnter={() => setHoveredCard(campaign.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <img src={campaign.image} alt={campaign.title} style={styles.cardImage} />

                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{campaign.title}</h3>
                  <p style={styles.cardDescription}>{campaign.description}</p>
                  
                  <div style={styles.metadataContainer}>
                    <div style={styles.metadataItem}>
                      <Calendar size={14} style={styles.icon}/> 
                      {campaign.date}
                    </div>
                    <div style={styles.metadataItem}>
                      <Users size={14} style={styles.icon}/>
                      {campaign.organizers}
                    </div>
                  </div>

                  <div style={styles.cardAction}>
                    <span>Learn More</span>
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </a>
            );
          })}
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #E0EFFF 0%, #EAE4FF 100%)', 
      fontFamily: "'Inter', sans-serif",
      padding: '32px 16px',
  },
  contentWrapper: {
      maxWidth: '800px',
      margin: '0 auto',
  },
  mainTitle: {
      fontSize: 'clamp(24px, 4vw, 32px)',
      fontWeight: '700',
      fontFamily: "'Lora', serif",
      color: '#4C1D95',
      textAlign: 'center',
      marginBottom: '3rem',
      lineHeight: '1.4',
  },
  list: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '20px',
  },
  card: {
      display: 'flex',
      flexDirection: 'row',
      gap: '20px',
      alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.7)',
      borderRadius: '16px',
      padding: '16px',
      border: '1px solid rgba(109, 40, 217, 0.1)',
      textDecoration: 'none',
      color: 'inherit',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  },
  cardImage: {
      width: '110px',
      height: '110px',
      borderRadius: '12px',
      objectFit: 'cover',
      flexShrink: 0,
  },
  cardContent: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
  },
  cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#4C1D95',
      margin: '0 0 8px 0',
  },
  cardDescription: {
      fontSize: '14px',
      color: '#475569',
      lineHeight: '1.6',
      margin: '0 0 16px 0',
      flexGrow: 1,
  },
  metadataContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginBottom: '16px',
  },
  metadataItem: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '13px',
      fontWeight: '500',
      color: '#6D28D9',
  },
  icon: {
      marginRight: '8px',
      flexShrink: 0,
  },
  cardAction: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontWeight: '600',
      fontSize: '14px',
      color: '#6D28D9',
      alignSelf: 'flex-start',
  },
};

export default AwarenessCampaigns;