import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Copy } from 'lucide-react'; // Modern icons

const LegalComplaints= () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    issueType: "",
    description: "",
    language: "English",
  });
  const [generatedText, setGeneratedText] = useState("");
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  useEffect(() => {
    // Apply global body styles consistent with Dashboard theme
    document.documentElement.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.minHeight = "100vh";
    document.body.style.width = "100%";
    document.body.style.background = inlineStyles.container.background; // Dashboard background
    document.body.style.fontFamily = inlineStyles.container.fontFamily;
    document.body.style.color = inlineStyles.container.color; // Default body text color (dark gray)
    document.body.style.boxSizing = "border-box";
    document.body.style.overflowY = "auto"; // Allow scrolling for long content

    return () => {
      // Clean up body styles when component unmounts
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const generateText = () => {
    const { name, email, phone, issueType, description, language } = form;

    let text = "";
    if (language === "English") {
      text = `To whom it may concern,

I, ${name}, am filing a formal complaint regarding "${issueType}".

Details of the issue:
${description}

Contact details:
Email: ${email}
Phone: ${phone}

Kindly take appropriate action at the earliest.

Sincerely,
${name}`;
    } else {
      text = `जिससे यह संबंधित है,

मैं, ${name}, "${issueType}" के संबंध में एक आधिकारिक शिकायत दर्ज कर रहा/रही हूँ।

समस्या का विवरण:
${description}

संपर्क विवरण:
ईमेल: ${email}
फ़ोन: ${phone}

कृपया यथाशीघ्र उचित कार्रवाई करें।

आपका विश्वासी,
${name}`;
    }

    setGeneratedText(text);
  };

  const copyToClipboard = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(generatedText)
        .then(() => {
          setShowCopiedMessage(true);
          setTimeout(() => setShowCopiedMessage(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text using Clipboard API:', err);
          fallbackCopyToClipboard();
        });
    } else {
      fallbackCopyToClipboard();
    }
  };

  const fallbackCopyToClipboard = () => {
    const textarea = document.createElement('textarea');
    textarea.value = generatedText;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    } catch (err) {
      console.error('Failed to copy text using execCommand:', err);
      // Fallback to a simple alert if both methods fail (though execCommand is very broad)
      alert('Could not copy text. Please select and copy manually.');
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = "legal_complaint.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    if (form.language === "Hindi") {
        doc.setFont("Helvetica"); // Consider embedding a Unicode font for better Hindi support
    }

    const lines = doc.splitTextToSize(generatedText, 180);
    doc.text(lines, 15, 20);
    doc.save("legal_complaint.pdf");
  };

  return (
    <div style={inlineStyles.container}>
      {/* Back button */}
      <div style={{ width: '100%', maxWidth: '800px', marginBottom: '20px' }}>
        <Link to="/report" style={inlineStyles.backButton}>
          <ArrowLeft size={16} style={{ marginRight: '8px' }} />
          Back to Report
        </Link>
      </div>

      <h2 style={inlineStyles.heading}>
        📝 Legal Complaint Generator
      </h2>

      <form onSubmit={(e) => e.preventDefault()} style={inlineStyles.form}>
        <label htmlFor="name" style={inlineStyles.label}>Name:</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          style={inlineStyles.input}
        />

        <label htmlFor="email" style={inlineStyles.label}>Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          style={inlineStyles.input}
        />

        <label htmlFor="phone" style={inlineStyles.label}>Phone Number:</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          style={inlineStyles.input}
        />

        <label htmlFor="issueType" style={inlineStyles.label}>Issue Type:</label>
        <select
          id="issueType"
          name="issueType"
          required
          value={form.issueType}
          onChange={handleChange}
          style={inlineStyles.input}
        >
          <option value="">-- Select an issue --</option>
          <option value="harassment">Harassment</option>
          <option value="privacy violation">Privacy Violation</option>
          <option value="unauthorized content">Unauthorized Content</option>
          <option value="defamation">Defamation</option>
          <option value="impersonation">Impersonation</option>
        </select>

        <label htmlFor="description" style={inlineStyles.label}>Issue Description:</label>
        <textarea
          id="description"
          name="description"
          required
          value={form.description}
          onChange={handleChange}
          placeholder="Explain the issue in detail..."
          rows={5}
          style={{ ...inlineStyles.input, minHeight: '120px', resize: 'vertical' }}
        />

        <label htmlFor="language" style={inlineStyles.label}>Preferred Language:</label>
        <select
          id="language"
          name="language"
          required
          value={form.language}
          onChange={handleChange}
          style={inlineStyles.input}
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
        </select>

        <button
          type="submit"
          onClick={generateText}
          style={inlineStyles.generateButton}
        >
          ✍️ Generate Complaint
        </button>
      </form>

      {generatedText && (
        <>
          <h3 style={inlineStyles.generatedTextHeading}>
            🧾 Generated Complaint Text
          </h3>
          <textarea
            value={generatedText}
            readOnly
            style={inlineStyles.generatedTextArea}
          />

          <div style={inlineStyles.actionButtonContainer}>
            <button onClick={copyToClipboard} style={inlineStyles.actionButton}>
              <Copy size={16} style={{ marginRight: '8px' }} /> Copy
            </button>
            <button onClick={downloadTxt} style={inlineStyles.actionButton}>
              <Download size={16} style={{ marginRight: '8px' }} /> Download TXT
            </button>
            <button onClick={exportPDF} style={inlineStyles.actionButton}>
              <FileText size={16} style={{ marginRight: '8px' }} /> Export PDF
            </button>
          </div>
          {showCopiedMessage && (
            <div style={inlineStyles.copiedMessage}>Copied to clipboard!</div>
          )}
        </>
      )}
    </div>
  );
};

export default LegalComplaints;

const inlineStyles = {
  container: {
    padding: "30px",
    borderRadius: "20px",
    maxWidth: "800px",
    margin: "40px auto",
    background: "rgba(255, 255, 255, 0.9)", // Soft white background for the card
    boxShadow: "0 8px 25px rgba(109, 40, 217, 0.1)", // Themed shadow
    border: "1px solid rgba(255, 255, 255, 0.7)", // Subtle border
    fontFamily: "'Inter', sans-serif", // Consistent body font
    boxSizing: 'border-box',
    display: 'flex', // Use flex for centering content within container
    flexDirection: 'column',
    alignItems: 'center',
    // The main background for the *page* is set in useEffect on document.body
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
    alignSelf: 'flex-start', // Align to start within the flex container
  },
  heading: {
    color: "#6D28D9", // Primary purple for headings
    marginBottom: "25px",
    fontSize: "28px",
    fontWeight: "700",
    fontFamily: "'Lora', serif", // Consistent title font
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px', // Spacing between form groups
    width: '100%', // Ensure form takes full width of its parent
  },
  label: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#4B5563", // Dark gray for labels (better readability than purple on light background)
    marginBottom: '5px', // Space between label and input
    display: 'block', // Ensures label takes full width
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    border: "1px solid #D1D5DB", // Light gray border
    borderRadius: "12px", // Increased border-radius for inputs
    fontSize: "16px",
    color: "#374151", // Dark gray for input text
    backgroundColor: "#F9FAFB", // Light background for inputs
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    boxSizing: 'border-box', // Essential for width: 100% with padding
    // Placeholder color and focus styles would typically require a CSS-in-JS library or global CSS
  },
  generateButton: {
    marginTop: "20px",
    backgroundColor: "#6D28D9", // Primary theme purple
    color: "white", // Keep white for contrast on primary button
    padding: "14px 20px",
    borderRadius: "12px", // Consistent border-radius for buttons
    border: "none",
    cursor: "pointer",
    fontSize: "17px",
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(109, 40, 217, 0.3)", // Themed shadow
    transition: 'background-color 0.3s ease, transform 0.1s ease',
  },
  generatedTextHeading: {
    marginTop: "40px",
    marginBottom: "15px",
    color: "#6D28D9", // Primary purple for this heading
    fontSize: "22px",
    fontWeight: "600",
    fontFamily: "'Lora', serif",
    textAlign: 'center',
  },
  generatedTextArea: {
    width: "100%",
    minHeight: "200px",
    backgroundColor: "#F9FAFB", // Light background for output
    color: "#374151", // Dark gray for output text (readability)
    padding: "15px",
    border: "1px solid #D1D5DB", // Light gray border
    borderRadius: "12px", // Consistent border-radius
    marginBottom: "25px", // Space below textarea
    fontSize: "16px",
    fontFamily: "'Inter', sans-serif",
    lineHeight: '1.6',
    resize: 'vertical', // Allow vertical resize
    boxSizing: 'border-box',
  },
  actionButtonContainer: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: 'center',
    width: '100%',
  },
  actionButton: {
    backgroundColor: "rgba(109, 40, 217, 0.1)", // Light purple background
    border: "1px solid #6D28D9", // Purple border
    color: "#6D28D9", // Purple text
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    display: 'flex', // For icon alignment
    alignItems: 'center',
    justifyContent: 'center',
  },
  copiedMessage: {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#D1FAE5', // Light green for success feedback
    color: '#065F46', // Dark green text
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
    width: 'fit-content',
    alignSelf: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  }
};