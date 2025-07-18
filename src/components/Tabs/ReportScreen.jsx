import React from 'react';
import { Link } from 'react-router-dom';
import BottomNav from './BottomNav';
import { FileSignature, Mail } from 'lucide-react'; 

function ReportScreen() {
  const cardData = [
    {
      title: 'One-Click Legal Complaints',
      description: 'Quickly file abuse reports with prefilled legal forms.',
      icon: FileSignature, 
      path: '/LegalComplaints',
    },
    {
      title: 'Automated Takedown Requests',
      description: 'Instantly send DMCA/complaints to platforms.',
      icon: Mail, 
      path: '/TakeDownRequests',
    },
  ];

  const cardSchemes = [
    {
      bgColor: '#EFF6FF',
      iconColor: '#3B82F6',
      titleColor: '#1E3A8A',
    },
    {
      bgColor: '#FEF2F2',
      iconColor: '#F43F5E',
      titleColor: '#881337',
    }
  ];

  return (
    <>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={{...styles.title, color: '#D97706'}}>Report</h1>
        </header>
        <p style={styles.subtext}>Take action against abuse with quick legal tools.</p>

        <main style={styles.grid}>
          {cardData.map((card, index) => {
            const IconComponent = card.icon;
            const scheme = cardSchemes[index % 2];
            return (
              <Link key={index} to={card.path} style={{
                ...styles.card,
                background: `linear-gradient(145deg, rgba(255,255,255,0.9), ${scheme.bgColor})`,
              }}>
                <div style={{...styles.iconContainer, color: scheme.iconColor }}>
                  <IconComponent size={20} />
                </div>
                <h3 style={{...styles.cardTitle, color: scheme.titleColor}}>{card.title}</h3>
                <p style={styles.cardText}>{card.description}</p>
              </Link>
            );
          })}
        </main>
      </div>
      <BottomNav />
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    maxHeight: '100dvh',
    overflow: 'hidden',
    padding: '16px',
    paddingBottom: '0',
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
    marginBottom: '6px',
  },
  subtext: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '20px',
    fontFamily: "'Inter', sans-serif",
    flexShrink: 0,
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'space-between',
  },
  card: {
    flex: '1 1 calc(50% - 10px)',
    padding: '16px',
    borderRadius: '16px',
    textDecoration: 'none',
    color: 'inherit',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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
    color: '#333',
    lineHeight: '1.4',
    margin: 0,
    fontFamily: "'Inter', sans-serif",
  },
};

export default ReportScreen;