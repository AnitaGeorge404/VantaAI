import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale,          // For Laws & Rights
  MessageSquareQuote, // For Real Stories
  HelpCircle,     // For Legal Tips & FAQs
  Megaphone       // For Awareness Campaigns
} from 'lucide-react';

// Data for the rights sections, combining original content with new icons
const rightsData = [
  {
    title: "Laws & Rights",
    description: "Understand your legal protections. Learn about Indian laws that safeguard you from online abuse, stalking, and privacy violations.",
    icon: Scale,
    path: "/rights/laws-&-rights",
    bgColor: "#F7CFC7", // Original color
    textColor: "#581C0E", // A darker, accessible text color for this background
  },
  {
    title: "Real Stories",
    description: "Real people. Real action. Explore true cases of digital abuse victims who fought back using legal tools — and how you can too.",
    icon: MessageSquareQuote,
    path: "/know-your-rights/real-stories",
    bgColor: "#C2F0F5", // Original color
    textColor: "#084C55", // A darker, accessible text color
  },
  {
    title: "Legal Tips & FAQs",
    description: "What to do when things go wrong. Find actionable advice for reporting cybercrimes, collecting evidence, and protecting yourself legally.",
    icon: HelpCircle,
    path: "/know-your-rights/legal-tips",
    bgColor: "#E5C8FF", // Original color
    textColor: "#43016E", // Original color, still works well
  },
  {
    title: "Awareness Campaigns",
    description: "Stay informed. Stay safe. Access posters, helplines, and digital safety campaigns that promote responsible tech use and legal awareness.",
    icon: Megaphone,
    path: "/know-your-rights/awareness-campaigns",
    bgColor: "#F7C7F0", // Original color
    textColor: "#63105B", // A darker, accessible text color
  },
];

function KnowYourRightsHub() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Know Your Rights Hub</h1>
      </header>

      <main style={styles.grid}>
        {rightsData.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Link 
              key={index} 
              to={card.path} 
              style={{
                ...styles.card,
                // Use the specific background color for a nice gradient effect
                background: `linear-gradient(145deg, rgba(255,255,255,0.8), ${card.bgColor})`,
              }}
            >
              <div style={{ ...styles.iconContainer, color: card.textColor }}>
                 <IconComponent size={24} />
              </div>
              <h3 style={{ ...styles.cardTitle, color: card.textColor }}>
                {card.title}
              </h3>
              <p style={{ ...styles.cardDescription, color: card.textColor, opacity: 0.8 }}>
                {card.description}
              </p>
            </Link>
          );
        })}
      </main>
      
      {/* If you have a BottomNav component, you can place it here */}
      {/* <BottomNav /> */}
    </div>
  );
}

// Styles inspired by the Dashboard component
const styles = {
  container: {
    minHeight: '100vh',
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
    paddingBottom: '20px',
    flexShrink: 0,
  },
  title: {
    fontSize: 'clamp(24px, 5vw, 28px)',
    fontWeight: '700',
    fontFamily: "'Lora', serif",
    color: '#6D28D9',
    textAlign: 'center',
    width: '100%',
  },
  grid: {
    flexGrow: 1, 
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsive grid
    gap: '20px', 
    overflowY: 'auto', 
    minHeight: 0,
    paddingBottom: '100px', // Space for bottom nav or just padding
    // Hide scrollbar for a cleaner look
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': { 
        display: 'none',
    }
  },
  card: {
    borderRadius: '20px',
    padding: '24px',
    textDecoration: 'none',
    boxShadow: '0 8px 25px rgba(109, 40, 217, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.7)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  iconContainer: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '16px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    fontFamily: "'Lora', serif",
    margin: '0 0 8px 0',
  },
  cardDescription: {
    fontSize: '14px',
    lineHeight: '1.6',
    margin: 0,
  },
};

export default KnowYourRightsHub;