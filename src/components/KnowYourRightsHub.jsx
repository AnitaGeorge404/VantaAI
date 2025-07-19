import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale,
  MessageSquareQuote,
  HelpCircle,
  Megaphone
} from 'lucide-react';

// Data for the rights sections
const rightsData = [
  {
    title: "Laws & Rights",
    description: "Understand Indian laws that safeguard you from online abuse and stalking.",
    icon: Scale,
    path: "/rights/laws-&-rights",
  },
  {
    title: "Real Stories",
    description: "Explore true cases of victims who fought back using legal tools.",
    icon: MessageSquareQuote,
    path: "/know-your-rights/real-stories",
  },
  {
    title: "Legal Tips & FAQs",
    description: "Find actionable advice for reporting cybercrimes and collecting evidence.",
    icon: HelpCircle,
    path: "/know-your-rights/legal-tips",
  },
  {
    title: "Awareness Campaigns",
    description: "Access posters, helplines, and digital safety campaign materials.",
    icon: Megaphone,
    path: "/know-your-rights/awareness-campaigns",
  },
];

// Alternating color schemes
const cardSchemes = [
  { bgColor: '#EFF6FF', iconColor: '#3B82F6', titleColor: '#1E3A8A' },
  { bgColor: '#FEF2F2', iconColor: '#F43F5E', titleColor: '#881337' }
];

function KnowYourRightsHub() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Know Your Rights</h1>
        </header>
        <p style={styles.subtext}>Your comprehensive guide to digital safety and legal empowerment.</p>

        <main style={styles.grid}>
          {rightsData.map((card, index) => {
            const IconComponent = card.icon;
            const scheme = cardSchemes[index % 2];

            return (
              <Link 
                key={index} 
                to={card.path} 
                style={{
                  ...styles.card,
                  background: `linear-gradient(145deg, rgba(255,255,255,0.9), ${scheme.bgColor})`,
                }}
              >
                <div style={{ ...styles.iconContainer, color: scheme.iconColor }}>
                   <IconComponent size={20} />
                </div>
                <h3 style={{ ...styles.cardTitle, color: scheme.titleColor }}>
                  {card.title}
                </h3>
                <p style={styles.cardText}>
                  {card.description}
                </p>
              </Link>
            );
          })}
        </main>
      </div>
    </>
  );
}

const styles = {
  container: {
    height: '100vh',
    maxHeight: '100dvh',
    overflow: 'hidden',
    padding: '16px 16px 0 16px',
    background: 'linear-gradient(180deg, #E0EFFF 0%, #EAE4FF 100%)',
    fontFamily: "'Inter', sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: '10px',
    flexShrink: 0,
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    fontFamily: "'Lora', serif",
    color: '#6D28D9',
    marginBottom: '6px',
  },
  subtext: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '20px',
    // --- THIS LINE IS NOW FIXED ---
    fontFamily: "'Inter', sans-serif", 
    flexShrink: 0,
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    overflowY: 'auto',
    flexGrow: 1,
    paddingBottom: '100px',
  },
  card: {
    flex: '1 1 calc(50% - 8px)',
    minHeight: '180px',
    padding: '16px',
    borderRadius: '16px',
    textDecoration: 'none',
    color: 'inherit',
    boxShadow: '0 4px 12px rgba(109, 40, 217, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    transition: 'transform 0.2s ease',
  },
  iconContainer: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '12px'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: "'Lora', serif",
    margin: '0 0 4px 0',
  },
  cardText: {
    fontSize: '13px',
    color: '#4A5568',
    lineHeight: '1.5',
    margin: 0,
    fontFamily: "'Inter', sans-serif",
  },
};

export default KnowYourRightsHub;