import React, { useState, useRef, useEffect } from 'react';

const LegalChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Indian Legal Assistant. I can help you with legal questions related to IPC, CrPC, civil matters, and more. What legal question can I help you with today?",
      sender: 'bot',
      timestamp: new Date(),
      category: 'welcome'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

 const generateLegalResponse = (userMessage) => {
  const message = userMessage.toLowerCase();

  if (message.includes('fir') || message.includes('police complaint')) {
    return {
      text: "Filing an FIR is governed by the Criminal Procedure Code (CrPC). Visit the nearest police station with details of the incident, names of accused if known, and evidence. An FIR must contain: incident details, date/time/location, witnesses. False FIRs are penalized under Section 182 IPC. After filing, get an acknowledgment and track the progress at the police station.",
      category: 'criminal_law'
    };
  }

  if (message.includes('dowry') || message.includes('498a')) {
    return {
      text: "Dowry harassment and cruelty fall under Section 498A IPC, Dowry Prohibition Act, and Section 304B IPC (dowry death). Victims should file complaints at police or women’s help centers (181). Collect evidence like medical reports and witness statements. Police will register FIR and investigate under IPC and relevant laws.",
      category: 'women_rights'
    };
  }

  if (message.includes('property') || message.includes('land') || message.includes('inheritance')) {
    return {
      text: "Property disputes are governed by Transfer of Property Act, Registration Act, and personal laws. For inheritance, succession laws apply. Women have equal rights in ancestral property under Hindu Succession Act. File civil suit in district or family courts with documents proving ownership or inheritance claims.",
      category: 'property_law'
    };
  }

  if (message.includes('divorce') || message.includes('marriage') || message.includes('maintenance')) {
    return {
      text: "Marriage and divorce laws vary by religion (Hindu Marriage Act, Special Marriage Act, etc.). Grounds for divorce include cruelty, desertion, adultery. Maintenance is covered under Section 125 CrPC. Victims can file petitions in family courts. Mutual consent divorce is faster; legal counsel is advised.",
      category: 'family_law'
    };
  }

  if (message.includes('deepfake')) {
    return {
      text: "Deepfakes relate to multiple offenses: identity theft (Sections 66C & 66D IT Act), privacy violation (Section 66E IT Act), transmitting obscene material (Sections 67, 67A, 67B IT Act), defamation (Sections 499 & 500 IPC), and forgery (Section 463 IPC). Victims should preserve evidence (videos, screenshots), file complaints at cyber cells or via the National Cyber Crime Reporting Portal (cybercrime.gov.in), and inform authorities promptly for investigation and content removal.",
      category: 'deepfake'
    };
  }

  if (message.includes('cybercrime') || message.includes('online fraud') || message.includes('it act')) {
    return {
      text: "Cybercrime is addressed under IT Act 2000 (Sections 43, 66, 66C, 66D, 66E, 67, 67A) and Indian Penal Code (e.g., Section 420 for online fraud). Common offenses include hacking, identity theft, transmitting obscene content, fraud. Victims should preserve all evidence (screenshots, transaction details), file complaints at the nearest cyber cell or via National Cyber Crime Reporting Portal (cybercrime.gov.in), and track complaint status online.",
      category: 'cyber_law'
    };
  }

  if (message.includes('identity theft') || message.includes('password hacking') || message.includes('digital signature')) {
    return {
      text: "Identity theft and cheating by impersonation fall under Sections 66C and 66D of the IT Act, punishable by imprisonment up to 3 years and fines. Victims should immediately report to local cybercrime authorities or file complaints online, change passwords, freeze financial accounts if necessary, preserve evidence like screenshots and communication logs, and inform contacts to avoid misuse.",
      category: 'identity_theft'
    };
  }

  if (message.includes('obscene content') || message.includes('pornography') || message.includes('section 67')) {
    return {
      text: "Publishing or transmitting obscene material is punishable under Section 67 of the IT Act, with imprisonment up to 5 years and fines up to ₹10 lakh. Child pornography falls under Section 67B with stricter penalties. Victims should file complaints at cybercrime cells or via online portals, provide URLs, screenshots, or videos as evidence, and cooperate with investigations.",
      category: 'obscenity'
    };
  }

  if (message.includes('cyber terrorism') || message.includes('section 66f')) {
    return {
      text: "Cyber terrorism (Section 66F IT Act) involves threatening India’s sovereignty or security using computers, punishable with life imprisonment. Victims or witnesses must immediately report to police or cyber cells. Collect evidence carefully and cooperate with authorities for swift prosecution.",
      category: 'cyber_terrorism'
    };
  }

  if (message.includes('hacking') || message.includes('unauthorized access') || message.includes('section 66')) {
    return {
      text: "Hacking and unauthorized access fall under Section 66 IT Act, punishable by imprisonment up to 3 years and fines. Victims should file formal complaints at cybercrime cells or online portals, secure their devices, document incidents with logs and screenshots, and cooperate with investigating officers.",
      category: 'hacking'
    };
  }

  if (message.includes('defamation') || message.includes('social media defamation')) {
    return {
      text: "Online defamation is covered under IPC Sections 499 and 500 and IT Act provisions. Victims should collect evidence such as screenshots and URLs, file complaints at police stations or cyber cells, and may seek legal remedies including injunctions or damages through courts.",
      category: 'defamation'
    };
  }

  if (message.includes('phishing') || message.includes('section 66c')) {
    return {
      text: "Phishing is covered under Section 66C IT Act. Victims should report immediately to cybercrime authorities, freeze compromised accounts, change passwords, preserve phishing emails/messages as evidence, and file complaints online or at cyber cells.",
      category: 'phishing'
    };
  }

  if (message.includes('privacy violation') || message.includes('section 66e')) {
    return {
      text: "Violation of privacy, including unauthorized capture or sharing of images/videos, falls under Section 66E IT Act. Victims should file complaints with cybercrime cells or courts, preserve evidence, and can seek protection orders or restraining orders as applicable.",
      category: 'privacy'
    };
  }

  if (message.includes('spam') || message.includes('scam')) {
    return {
      text: "Spam and scam detection is vital. Victims should report suspicious messages or emails to local cyber cells, avoid clicking unknown links, preserve evidence like screenshots or message details, and file complaints online if scammed.",
      category: 'spam_scam'
    };
  }

  if (message.includes('consumer') || message.includes('product defect') || message.includes('service complaint')) {
    return {
      text: "Consumer disputes are governed by Consumer Protection Act 2019. Complaints can be filed for defective goods, deficient services, unfair trade practices, or misleading advertisements at District, State, or National Consumer Commissions depending on value. Online complaint filing is available.",
      category: 'consumer_law'
    };
  }

  return {
    text: "I understand you have a legal query. While I provide general information about Indian laws, consulting a qualified lawyer is recommended for specific advice. Try using more specific legal terms or use our FIR generator for complaint assistance.",
    category: 'general'
  };
};


  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateLegalResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        category: response.category
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "How to file an FIR?",
    "Cybercrime complaint process",
  ];

  return (
    <div style={{
      height: '600px',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '500px',
      margin: '20px auto',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        backgroundColor: '#2563eb', 
        color: 'white',
        padding: '16px 20px',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
          Legal Q&A Assistant
        </h2>
        <span style={{
          backgroundColor: '#3b82f6', 
          color: 'white',
          padding: '4px 10px',
          borderRadius: '9999px', 
          fontSize: '0.75rem',
          fontWeight: '600'
        }}>
          Online
        </span>
      </div>
      
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: message.sender === 'user' ? '#2563eb' : '#f3f4f6', 
                color: message.sender === 'user' ? 'white' : '#374151', 
              }}
            >
              <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>{message.text}</p>
              {message.category && message.sender === 'bot' && (
                <span style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0', 
                  color: '#4b5563', 
                  backgroundColor: 'white'
                }}>
                  {message.category.replace('_', ' ')}
                </span>
              )}
              <p style={{ fontSize: '0.75rem', opacity: '0.7', marginTop: '4px' }}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ backgroundColor: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 0.6s infinite alternate' }}></div>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 0.6s infinite alternate', animationDelay: '0.1s' }}></div>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 0.6s infinite alternate', animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <style>
        {`
          @keyframes bounce {
            0% { transform: translateY(0); }
            100% { transform: translateY(-4px); }
          }
        `}
      </style>

      <div style={{
        padding: '16px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#f9fafb' 
      }}>
        <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '8px' }}>Quick Questions:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(question)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db', 
                backgroundColor: 'white',
                color: '#374151', 
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                ':hover': {
                  backgroundColor: '#f3f4f6' 
                }
              }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        padding: '16px',
        borderTop: '1px solid #e0e0e0'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your legal question..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              outline: 'none',
              fontSize: '1rem',
              color: '#374151',
              backgroundColor: isTyping ? '#f3f4f6' : 'white', 
              cursor: isTyping ? 'not-allowed' : 'text'
            }}
            disabled={isTyping}
          />
          <button 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isTyping}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              backgroundColor: (!inputMessage.trim() || isTyping) ? '#93c5fd' : '#2563eb', 
              color: 'white',
              border: 'none',
              cursor: (!inputMessage.trim() || isTyping) ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease',
              ':hover': {
                backgroundColor: (!inputMessage.trim() || isTyping) ? '' : '#1d4ed8' 
              }
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalChatbot;