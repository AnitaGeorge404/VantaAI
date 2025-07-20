import React, { useState } from 'react';
import LegalChatbot from "../components/LegalChatbot";
import FIRGenerator from "../components/FIRGenerator";

const LegalChatInterface = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f8fafc, #e0f2fe)',
      padding: '40px 20px',
      fontFamily: 'Segoe UI, sans-serif',
    },
    tabsWrapper: {
      display: 'flex',
      gap: '10px',
      maxWidth: '500px',
      margin: '0 auto 30px auto',
    },
    tabButton: (isActive) => ({
      flex: 1,
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      backgroundColor: isActive ? '#e487b9ff' : '#ffffff',
      color: isActive ? '#ffffff' : '#1e40af',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: isActive ? '0 2px 10px rgba(30, 64, 175, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease-in-out',
    }),
    contentBox: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto',
    },
    footer: {
      marginTop: '60px',
      backgroundColor: '#3d568aff',
      color: '#e5e7eb',
      padding: '20px',
      textAlign: 'center',
      fontSize: '14px',
    },
    footerNote: {
      color: '#eef0f2ff',
      marginTop: '8px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.tabsWrapper}>
        <button
          style={styles.tabButton(activeTab === 'chat')}
          onClick={() => setActiveTab('chat')}
        >
          Legal Q&A Chat
        </button>
        <button
          style={styles.tabButton(activeTab === 'fir')}
          onClick={() => setActiveTab('fir')}
        >
          Generate FIR
        </button>
      </div>

      <div style={styles.contentBox}>
        {activeTab === 'chat' && <LegalChatbot />}
        {activeTab === 'fir' && <FIRGenerator />}
      </div>

      <footer style={styles.footer}>
        <p>© 2025 LegalAI - Powered by AI for Indian Legal Assistance</p>
        <p style={styles.footerNote}>
          Not a substitute for professional legal advice
        </p>
      </footer>
    </div>
  );
};

export default LegalChatInterface;
