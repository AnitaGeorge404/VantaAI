import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import lawyerNGOData from "../data/lawyerNgoDirectory";

import { 
  Search, 
  ArrowLeft,
  Scale,
  Building,
  Shield,
  ChevronUp, 
  ChevronDown,
  ExternalLink
} from "lucide-react";

function LawyerDirectory() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const filteredData = useMemo(() => {
    if (!searchText) {
      return lawyerNGOData;
    }
    const lowercasedSearch = searchText.toLowerCase();
    return lawyerNGOData.filter(
      (entry) =>
        entry.name.toLowerCase().includes(lowercasedSearch) ||
        entry.location.toLowerCase().includes(lowercasedSearch)
    );
  }, [searchText]);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Lawyer": return <Scale size={20} style={{ marginRight: '8px' }} />;
      case "NGO": return <Building size={20} style={{ marginRight: '8px' }} />;
      case "Government": return <Shield size={20} style={{ marginRight: '8px' }} />;
      default: return null;
    }
  };
  
  const formatContact = (contact) => {
    if (contact.includes('@')) {
      return <a href={`mailto:${contact}`} style={styles.contactLink}>{contact}</a>;
    }
    if (contact.match(/^[0-9\s+-]+$/)) {
      return <a href={`tel:${contact.replace(/\s/g, '')}`} style={styles.contactLink}>{contact}</a>;
    }
    return contact;
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Lawyer & NGO Directory</h1>
        </div>
        
        <div style={styles.searchContainer}>
          <Search size={20} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name or location (e.g., 'Anjali Kumar' or 'Kollam')"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </header>

      <main style={styles.directoryList}>
        {filteredData.length === 0 ? (
          <p style={styles.noResults}>No matching entries found.</p>
        ) : (
          filteredData.map((entry, index) => (
            <div key={index} style={styles.card}>
              <button
                onClick={() => toggleIndex(index)}
                style={styles.cardHeader}
                aria-expanded={openIndex === index}
                aria-controls={`details-${index}`}
              >
                <span style={styles.cardTitle}>
                  {getTypeIcon(entry.type)}
                  {entry.name}
                </span>
                {openIndex === index ? <ChevronUp /> : <ChevronDown />}
              </button>

              {openIndex === index && (
                <div id={`details-${index}`} style={styles.cardBody}>
                  <p><strong>Type:</strong> {entry.type}</p>
                  <p><strong>Description:</strong> {entry.description}</p>
                  <p><strong>Location:</strong> {entry.location}</p>
                  <p><strong>Contact:</strong> {formatContact(entry.contact)}</p>
                  <a
                    href={entry.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.websiteLink}
                  >
                    Visit Website <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    // --- THIS LINE IS NOW UPDATED ---
    background: 'linear-gradient(180deg, #E0EFFF 0%, #EAE4FF 100%)',
    fontFamily: "'Inter', sans-serif",
    color: '#333',
    padding: '2rem 1rem',
  },
  header: {
    width: '100%',
    maxWidth: '850px',
    margin: '0 auto 2rem auto',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: "clamp(24px, 5vw, 32px)",
    fontWeight: '700',
    fontFamily: "'Lora', serif",
    color: '#43016E',
    margin: 0,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 14px',
    fontSize: "clamp(12px, 2vw, 14px)",
    background: '#E5C8FF',
    color: '#43016E',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    padding: '1rem 1rem 1rem 2.75rem',
    fontSize: '16px',
    borderRadius: '12px',
    border: '1px solid #d1d5db',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    boxSizing: 'border-box',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6b7280',
  },
  directoryList: {
    maxWidth: '850px',
    width: '100%',
    margin: '0 auto',
  },
  noResults: {
    fontSize: '16px',
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#555',
  },
  card: {
    marginBottom: '1rem',
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(67, 1, 110, 0.07)',
    border: '1px solid #E5C8FF',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s ease',
  },
  cardHeader: {
    width: '100%',
    padding: '1rem 1.25rem',
    fontSize: 'clamp(16px, 2vw, 18px)',
    fontWeight: '600',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#43016E',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'left',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  cardBody: {
    padding: '0 1.25rem 1.25rem',
    fontSize: 'clamp(14px, 1.7vw, 16px)',
    lineHeight: '1.6',
    borderTop: '1px solid #eee',
  },
  contactLink: {
    color: '#5B2EFF',
    textDecoration: 'none',
    fontWeight: '500',
  },
  websiteLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '0.5rem',
    color: '#5B2EFF',
    textDecoration: 'none',
    fontWeight: '500',
  }
};

export default LawyerDirectory;