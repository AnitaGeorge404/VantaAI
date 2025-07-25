import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'; // For back button navigation
import { Phone, Users, Heart, Smartphone, Zap, ArrowLeft, MessageSquare, BookOpen } from 'lucide-react'; // Modern icons

// Placeholder data for demonstration. In a real app, this would come from a file or API.
const mentalSupportData = [
  {
    name: "National Mental Health Helpline",
    type: "Helpline",
    description: "Provides confidential support for individuals facing mental health challenges. Connect with trained professionals 24/7 for immediate assistance and guidance.",
    availability: "24/7",
    contact: "1800-123-4567",
    link: "https://example.com/helpline",
  },
  {
    name: "Youth Empowerment NGO",
    type: "NGO",
    description: "Focuses on empowering youth through mental wellness programs and workshops. Offers mentorship, group therapy, and educational resources to foster resilience.",
    availability: "Mon-Fri, 9 AM - 5 PM",
    contact: "info@youthempower.org",
    link: "https://example.com/ngo",
  },
  {
    name: "Online Peer Support Community",
    type: "Community",
    description: "A safe and anonymous online space for peer support and shared experiences. Connect with others who understand, share stories, and find solidarity.",
    availability: "Always Open",
    contact: "Join via website",
    link: "https://example.com/community",
  },
  {
    name: "Mindful Moments App",
    type: "App",
    description: "Guided meditations and exercises for stress reduction and mental clarity. Features daily mindfulness sessions, sleep stories, and mood tracking tools.",
    availability: "Anytime",
    contact: "support@mindfulapp.com",
    link: "https://example.com/app",
  },
  {
    name: "Deep Breathing Exercises",
    type: "Relaxation Technique",
    description: [
      "**Diaphragmatic Breathing:** Focus on breathing deeply from your diaphragm, not your chest.",
      "**4-7-8 Breathing:** Inhale for 4, hold for 7, exhale for 8. Repeat several times.",
      "**Box Breathing:** Inhale for 4, hold for 4, exhale for 4, hold for 4. Repeat.",
      "These techniques can help calm the nervous system and reduce anxiety."
    ],
    availability: "Self-guided",
    contact: "N/A",
    link: "https://example.com/breathing",
  },
  {
    name: "Progressive Muscle Relaxation",
    type: "Relaxation Technique",
    description: "Systematically tense and relax different muscle groups in your body. This helps you become more aware of physical sensations of tension and relaxation.",
    availability: "Self-guided",
    contact: "N/A",
    link: "https://example.com/pmr",
  },
  {
    name: "Guided Imagery for Stress Relief",
    type: "Relaxation Technique",
    description: "Use your imagination to create calming mental images. Focus on sensory details like sights, sounds, and smells to transport yourself to a peaceful place.",
    availability: "Self-guided",
    contact: "N/A",
    link: "https://example.com/imagery",
  },
];

function MentalHealth() {
  const [openIndex, setOpenIndex] = useState(null);

  // Effect to apply global body styles on mount and clean up on unmount
  useEffect(() => {
    document.documentElement.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.minHeight = "100vh";
    document.body.style.width = "100%";
    document.body.style.background = inlineStyles.pageWrapper.background; // Dashboard background
    document.body.style.fontFamily = inlineStyles.pageWrapper.fontFamily;
    document.body.style.color = inlineStyles.pageWrapper.color;
    document.body.style.boxSizing = "border-box";
    document.body.style.overflowY = "auto";

    return () => {
      document.documentElement.style.height = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.minHeight = "";
      document.body.style.width = "";
      document.body.style.background = "";
      document.body.style.fontFamily = "";
      document.body.style.color = "";
      document.body.style.boxSizing = "";
      document.body.style.overflowY = "";
    };
  }, []);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getIconComponent = (type) => {
    switch (type) {
      case "Helpline": return Phone;
      case "NGO": return Users;
      case "Community": return Heart;
      case "App": return Smartphone;
      case "Relaxation Technique": return Zap;
      default: return BookOpen;
    }
  };

  // Filter data into two categories
  const communitySupport = mentalSupportData.filter(
    (entry) =>
      entry.type === "Helpline" ||
      entry.type === "NGO" ||
      entry.type === "Community" ||
      entry.type === "App"
  );

  const relaxationTechniques = mentalSupportData.filter(
    (entry) => entry.type === "Relaxation Technique"
  );

  // NEW cardSchemes provided by the user
  const cardSchemes = [
    {
      bgColor: '#EFF6FF', // Tailwind blue-50
      iconColor: '#3B82F6', // Tailwind blue-500
      titleColor: '#1E3A8A', // Tailwind blue-900
    },
    {
      bgColor: '#FEF2F2', // Tailwind red-50 (looks pink)
      iconColor: '#F43F5E', // Tailwind rose-500
      titleColor: '#881337', // Tailwind rose-900
    }
  ];

  return (
    <div style={inlineStyles.pageWrapper}>
      {/* Back button */}
      <div style={inlineStyles.backButtonContainer}>
        <Link to="/support" style={inlineStyles.backButton}>
          <ArrowLeft size={16} style={{ marginRight: '8px' }} />
          Back to Support
        </Link>
      </div>

      <h2 style={inlineStyles.heading}>
        🤝 Community Support
      </h2>

      <div style={inlineStyles.grid}>
        {communitySupport.map((entry, index) => {
          const IconComponent = getIconComponent(entry.type);
          const scheme = cardSchemes[index % 2]; // Alternate schemes

          return (
            <div
              key={`community-${index}`} // Unique key for community items
              style={{
                ...inlineStyles.accordionItem,
                background: `linear-gradient(145deg, rgba(255,255,255,0.9), ${scheme.bgColor})`,
              }}
            >
              <button
                onClick={() => toggle(`community-${index}`)} // Use unique index for toggle
                style={inlineStyles.accordionButton}
              >
                <div style={inlineStyles.accordionButtonContent}>
                  <div style={{...inlineStyles.iconContainer, color: scheme.iconColor }}>
                    <IconComponent size={20} />
                  </div>
                  <span style={{...inlineStyles.accordionTitle, color: scheme.titleColor}}>
                    {entry.name}
                  </span>
                </div>
                <span style={inlineStyles.toggleIcon}>{openIndex === `community-${index}` ? "▲" : "▼"}</span>
              </button>

              {openIndex === `community-${index}` && (
                <div style={inlineStyles.accordionContent}>
                  <p style={inlineStyles.contentParagraph}>
                    <strong style={inlineStyles.contentStrong}>Type:</strong> {entry.type}
                  </p>
                  <p style={inlineStyles.contentParagraph}>
                    <strong style={inlineStyles.contentStrong}>Description:</strong> {entry.description}
                  </p>
                  {entry.availability && (
                    <p style={inlineStyles.contentParagraph}>
                      <strong style={inlineStyles.contentStrong}>Availability:</strong> {entry.availability}
                    </p>
                  )}
                  {entry.contact && (
                    <p style={inlineStyles.contentParagraph}>
                      <strong style={inlineStyles.contentStrong}>Contact:</strong> {entry.contact}
                    </p>
                  )}
                  {entry.link && (
                    <p style={inlineStyles.contentParagraph}>
                      <a
                        href={entry.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={inlineStyles.contentLink}
                      >
                        🔗 Visit
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <h2 style={inlineStyles.heading}>
        🧠 Mental Health Resources
      </h2>

      <div style={inlineStyles.grid}>
        {relaxationTechniques.map((entry, index) => {
          const IconComponent = getIconComponent(entry.type);
          const scheme = cardSchemes[(index + 1) % 2]; // Alternate schemes, shifted by 1 for variety

          return (
            <div
              key={`relaxation-${index}`} // Unique key for relaxation items
              style={{
                ...inlineStyles.accordionItem,
                background: `linear-gradient(145deg, rgba(255,255,255,0.9), ${scheme.bgColor})`,
              }}
            >
              <button
                onClick={() => toggle(`relaxation-${index}`)} // Use unique index for toggle
                style={inlineStyles.accordionButton}
              >
                <div style={inlineStyles.accordionButtonContent}>
                  <div style={{...inlineStyles.iconContainer, color: scheme.iconColor }}>
                    <IconComponent size={20} />
                  </div>
                  <span style={{...inlineStyles.accordionTitle, color: scheme.titleColor}}>
                    {entry.name}
                  </span>
                </div>
                <span style={inlineStyles.toggleIcon}>{openIndex === `relaxation-${index}` ? "▲" : "▼"}</span>
              </button>

              {openIndex === `relaxation-${index}` && (
                <div style={inlineStyles.accordionContent}>
                  <p style={inlineStyles.contentParagraph}>
                    <strong style={inlineStyles.contentStrong}>Type:</strong> {entry.type}
                  </p>
                  {/* Conditional rendering for description: string vs. array */}
                  {Array.isArray(entry.description) ? (
                    <>
                      <p style={inlineStyles.contentParagraph}>
                        <strong style={inlineStyles.contentStrong}>Description:</strong>
                      </p>
                      <ul style={inlineStyles.contentList}>
                        {entry.description.map((item, descIndex) => (
                          <li key={descIndex} style={inlineStyles.contentListItem}>
                            <MessageSquare size={12} style={{ marginRight: '5px', color: '#6D28D9' }} /> {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p style={inlineStyles.contentParagraph}>
                      <strong style={inlineStyles.contentStrong}>Description:</strong> {entry.description}
                    </p>
                  )}

                  {entry.availability && (
                    <p style={inlineStyles.contentParagraph}>
                      <strong style={inlineStyles.contentStrong}>Availability:</strong> {entry.availability}
                    </p>
                  )}
                  {entry.contact && (
                    <p style={inlineStyles.contentParagraph}>
                      <strong style={inlineStyles.contentStrong}>Contact:</strong> {entry.contact}
                    </p>
                  )}
                  {entry.link && (
                    <p style={inlineStyles.contentParagraph}>
                      <a
                        href={entry.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={inlineStyles.contentLink}
                      >
                        🔗 Learn More
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const inlineStyles = {
  // --- Global Page Background and Base Text ---
  pageWrapper: {
    minHeight: '100vh',
    padding: '20px',
    background: 'linear-gradient(180deg, #E0EFFF 0%, #EAE4FF 100%)', // Dashboard background
    fontFamily: "'Inter', sans-serif",
    color: '#1F2937', // Dark gray for general text
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  // --- Back Button ---
  backButtonContainer: {
    width: '100%',
    maxWidth: '800px',
    marginBottom: '20px',
    alignSelf: 'flex-start', // Align back button to the left
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '12px',
    textDecoration: 'none',
    color: '#6D28D9', // Purple text
    fontWeight: '600',
    fontSize: '14px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: 'background-color 0.2s ease-in-out',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    width: 'fit-content',
  },

  // --- Section Heading (for "Community Support" and "Mental Health") ---
  heading: {
    color: "#6D28D9", // Primary purple for headings
    marginBottom: "30px",
    marginTop: "30px", // Add top margin for separation between sections
    fontSize: "28px",
    fontWeight: "700",
    fontFamily: "'Lora', serif",
    textAlign: 'center',
    width: '100%',
    maxWidth: '800px', // Constrain heading width
  },

  // --- Grid for Accordion Items ---
  grid: {
    width: '100%',
    maxWidth: '800px', // Max width for the accordion grid
    display: 'grid',
    gridTemplateColumns: '1fr', // Single column for accordion items
    gap: '16px', // Gap between accordion items
    marginBottom: '30px', // Space below each grid section
  },

  // --- Accordion Item Styling (Card-like) ---
  accordionItem: {
    borderRadius: '20px', // Dashboard card border-radius
    boxShadow: '0 6px 20px rgba(109, 40, 217, 0.08)', // Dashboard card shadow
    border: '1px solid rgba(255, 255, 255, 0.6)', // Dashboard card border
    overflow: 'hidden', // Ensures rounded corners are respected for content
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out',
    // Hover effect (requires CSS-in-JS or global CSS)
    // ':hover': { transform: 'translateY(-2px)' }
  },
  accordionButton: {
    width: '100%',
    padding: '16px', // Consistent padding with Dashboard cards
    fontSize: '18px', // Slightly larger font for button
    fontWeight: '600',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'left',
    fontFamily: "'Lora', serif", // Title font for button text
    color: '#4B5563', // Default text color for button (will be overridden by scheme)
  },
  accordionButtonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px', // Space between icon and text
  },
  iconContainer: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    flexShrink: 0, // Prevent icon from shrinking
  },
  accordionTitle: {
    fontSize: '18px', // Consistent with Dashboard card title
    fontWeight: '600',
    fontFamily: "'Lora', serif",
    margin: 0,
    flexGrow: 1, // Allows title to take available space
  },
  toggleIcon: {
    fontSize: '20px', // Larger caret icon
    color: '#6D28D9', // Primary purple for the toggle icon
    transition: 'transform 0.2s ease-in-out',
  },
  accordionContent: {
    padding: '0 20px 20px', // Padding for the expanded content
    fontSize: '15px', // Consistent with Dashboard card description
    color: '#4B5563', // Dark gray for content text
    fontFamily: "'Inter', sans-serif", // Consistent font
    lineHeight: '1.6',
  },
  contentParagraph: {
    marginBottom: '10px', // Spacing between paragraphs
  },
  contentStrong: {
    fontWeight: '700', // Bolder for labels
    color: '#374151', // Slightly darker for labels
  },
  contentLink: {
    color: '#6D28D9', // Purple for links
    textDecoration: 'underline',
    fontWeight: '600',
  },
  contentList: {
    listStyle: 'none', // Remove default list style
    padding: 0,
    margin: '10px 0 0 0', // Adjust margin
  },
  contentListItem: {
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'flex-start',
    color: '#4B5563', // Dark gray for list items
  }
};

export default MentalHealth;