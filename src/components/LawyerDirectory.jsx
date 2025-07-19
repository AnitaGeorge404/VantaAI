import React, { useState, useMemo } from "react";
import lawyerNGOData from "../data/lawyerNgoDirectory";

import { 
  Search, 
  MapPin,
  Scale,
  Building,
  Shield,
  ChevronUp, 
  ChevronDown,
  ExternalLink
} from "lucide-react";

const filterOptions = ["All", "Lawyer", "NGO", "Government"];

function LawyerDirectory() {
  // --- CHANGE: The first item (index 0) will now be open by default ---
  const [openIndex, setOpenIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  
  const userLocation = "Kollam";

  const processedData = useMemo(() => {
    let results = lawyerNGOData;

    if (activeFilter !== "All") {
      results = results.filter(entry => entry.type === activeFilter);
    }

    if (searchText) {
      const lowercasedSearch = searchText.toLowerCase();
      results = results.filter(
        (entry) =>
          entry.name.toLowerCase().includes(lowercasedSearch) ||
          entry.location.toLowerCase().includes(lowercasedSearch)
      );
    }

    return results.sort((a, b) => {
      const aIsLocal = a.location.toLowerCase().includes(userLocation.toLowerCase());
      const bIsLocal = b.location.toLowerCase().includes(userLocation.toLowerCase());
      
      if (aIsLocal && !bIsLocal) return -1;
      if (!aIsLocal && bIsLocal) return 1;
      return 0;
    });
  }, [searchText, activeFilter, userLocation]);

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
            placeholder={`Search directory...`}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterContainer}>
          {filterOptions.map(option => (
            <button
              key={option}
              onClick={() => setActiveFilter(option)}
              style={activeFilter === option ? styles.filterButtonActive : styles.filterButton}
            >
              {option}
            </button>
          ))}
        </div>
      </header>

      <main style={styles.directoryList}>
        {processedData.length === 0 ? (
          <p style={styles.noResults}>No matching entries found.</p>
        ) : (
          processedData.map((entry, index) => {
            const isLastItem = index === processedData.length - 1;
            const cardStyle = isLastItem 
              ? { ...styles.card, borderBottom: 'none' } 
              : styles.card;

            const isLocal = entry.location.toLowerCase().includes(userLocation.toLowerCase());
            return (
              <div key={index} style={cardStyle}>
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
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {isLocal && (
                      <span style={styles.localBadge}>
                        <MapPin size={12} />
                        Near You
                      </span>
                    )}
                    {openIndex === index ? <ChevronUp /> : <ChevronDown />}
                  </div>
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
            );
          })
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #E0EFFF 0%, #EAE4FF 100%)',
    fontFamily: "'Inter', sans-serif",
    color: '#333',
    padding: '2rem 1rem',
  },
  header: {
    width: '100%',
    margin: '0 0 2rem 0', 
    boxSizing: 'border-box',
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
  filterContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '1.5rem',
    overflowX: 'auto',
  },
  filterButton: {
    padding: '8px 16px',
    fontSize: '14px',
    background: 'rgba(255, 255, 255, 0.5)',
    color: '#43016E',
    border: '1px solid #E5C8FF',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  filterButtonActive: {
    padding: '8px 16px',
    fontSize: '14px',
    background: '#43016E',
    color: '#ffffff',
    border: '1px solid #43016E',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
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
    backgroundColor: '#ffffff',
    color: '#333333',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6b7280',
  },
  directoryList: {
    width: '100%',
    margin: '0', 
    background: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(67, 1, 110, 0.08)',
    border: '1px solid #E5C8FF',
    overflow: 'hidden',
  },
  noResults: {
    fontSize: '16px',
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#555',
    padding: '2rem',
  },
  card: {
    background: 'transparent',
    borderBottom: '1px solid #E5C8FF',
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
  localBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: '#e0e7ff',
    color: '#3730a3',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    marginRight: '12px',
  },
  cardBody: {
    padding: '0 1.25rem 1.25rem',
    fontSize: 'clamp(14px, 1.7vw, 16px)',
    lineHeight: '1.6',
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