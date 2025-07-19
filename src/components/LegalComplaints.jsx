import React, { useState } from "react";
import { jsPDF } from "jspdf";

const LegalComplaintGenerator = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    issueType: "",
    description: "",
    language: "English",
  });
  const [generatedText, setGeneratedText] = useState("");

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
    navigator.clipboard.writeText(generatedText);
    alert("Copied to clipboard!");
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "legal_complaint.txt";
    document.body.appendChild(element);
    element.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(generatedText, 180);
    doc.text(lines, 15, 20);
    doc.save("legal_complaint.pdf");
  };

  return (
    <div
      style={{
        padding: "30px",
        borderRadius: "16px",
        maxWidth: "800px",
        margin: "40px auto",
        background: "linear-gradient(to bottom right, #FDEFF9, #ECF2FF)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        color: "#43016E",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ color: "#43016E", marginBottom: "20px" }}>
        📝 Legal Complaint Generator
      </h2>

      <form onSubmit={(e) => e.preventDefault()}>
        <label>Name:</label>
        <input
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          style={inputStyle}
        />

        <label>Email:</label>
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          style={inputStyle}
        />

        <label>Phone Number:</label>
        <input
          name="phone"
          type="tel"
          required
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          style={inputStyle}
        />

        <label>Issue Type:</label>
        <select
          name="issueType"
          required
          value={form.issueType}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">-- Select an issue --</option>
          <option value="harassment">Harassment</option>
          <option value="privacy violation">Privacy Violation</option>
          <option value="unauthorized content">Unauthorized Content</option>
          <option value="defamation">Defamation</option>
          <option value="impersonation">Impersonation</option>
        </select>

        <label>Issue Description:</label>
        <textarea
          name="description"
          required
          value={form.description}
          onChange={handleChange}
          placeholder="Explain the issue in detail..."
          rows={5}
          style={inputStyle}
        />

        <label>Preferred Language:</label>
        <select
          name="language"
          required
          value={form.language}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
        </select>

        <button
          onClick={generateText}
          style={{
            marginTop: "20px",
            backgroundColor: "#43016E",
            color: "white",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✍️ Generate Complaint
        </button>
      </form>

      {generatedText && (
        <>
          <h3 style={{ marginTop: "30px", color: "#43016E" }}>
            🧾 Generated Complaint Text
          </h3>
          <textarea
            value={generatedText}
            readOnly
            style={{
              width: "100%",
              minHeight: "200px",
              backgroundColor: "#FFFBEF",
              color: "#43016E",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "15px",
            }}
          />

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={copyToClipboard} style={actionBtnStyle}>
              📋 Copy
            </button>
            <button onClick={downloadTxt} style={actionBtnStyle}>
              📥 Download TXT
            </button>
            <button onClick={exportPDF} style={actionBtnStyle}>
              📄 Export PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0 16px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "15px",
  color: "#43016E",
  backgroundColor: "#ffffff",
  '::placeholder': {
    color: "#ffffff",
  },
};

const actionBtnStyle = {
  backgroundColor: "#ECE4FF",
  border: "1px solid #43016E",
  color: "#43016E",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default LegalComplaintGenerator;
