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
        text: "For filing an FIR (First Information Report), you need to visit the nearest police station with relevant documents. An FIR should contain: 1) Details of the incident, 2) Date, time and place, 3) Names of accused if known, 4) Evidence or witnesses. You can also use our FIR Generator tool for assistance. Remember, filing a false FIR is an offense under Section 182 of IPC.",
        category: 'criminal_law'
      };
    }
    
    if (message.includes('dowry') || message.includes('498a')) {
      return {
        text: "Section 498A of IPC deals with cruelty to women by husband or relatives. Dowry harassment is a serious crime. Victims can file complaints under: 1) Section 498A IPC (cruelty), 2) Dowry Prohibition Act, 3) Section 304B IPC (dowry death). Support is available through women helplines (181) and legal aid. Evidence like medical records, witness statements are important.",
        category: 'women_rights'
      };
    }
    
    if (message.includes('property') || message.includes('land') || message.includes('inheritance')) {
      return {
        text: "Property disputes in India are governed by various laws including Transfer of Property Act, Registration Act, and personal laws. Key points: 1) Ensure proper registration of property, 2) Check clear title, 3) For inheritance, succession laws apply, 4) Women have equal rights in ancestral property. Civil courts have jurisdiction over property matters.",
        category: 'property_law'
      };
    }
    
    if (message.includes('divorce') || message.includes('marriage') || message.includes('maintenance')) {
      return {
        text: "Marriage and divorce laws vary by religion in India. Under Hindu Marriage Act: Divorce grounds include cruelty, desertion, adultery, conversion, mental disorder. For maintenance: Both wife and children entitled to support. Section 125 CrPC provides for maintenance. Mutual consent divorce is faster than contested divorce.",
        category: 'family_law'
      };
    }
    
    if (message.includes('cybercrime') || message.includes('online fraud') || message.includes('it act')) {
      return {
        text: "Cybercrime falls under IT Act 2000 and IPC. Common offenses: 1) Section 66 IT Act (computer-related offenses), 2) Section 66C (identity theft), 3) Section 67 (obscene content), 4) Section 420 IPC (online fraud). Report to local cyber cell or cybercrime.gov.in. Preserve evidence like screenshots, transaction details.",
        category: 'cyber_law'
      };
    }
    
    if (message.includes('bail') || message.includes('arrest') || message.includes('custody')) {
      return {
        text: "Bail is governed by CrPC Sections 436-450. Types: 1) Regular bail (before conviction), 2) Anticipatory bail (Section 438), 3) Interim bail. Bail is generally granted for bailable offenses. For non-bailable offenses, court discretion applies. Right to legal aid available. Contact nearest legal aid committee if unable to afford lawyer.",
        category: 'criminal_procedure'
      };
    }
    
    if (message.includes('consumer') || message.includes('product defect') || message.includes('service complaint')) {
      return {
        text: "Consumer disputes are handled under Consumer Protection Act 2019. You can file complaints for: 1) Defective goods, 2) Deficient services, 3) Unfair trade practices, 4) Misleading advertisements. Forums: District Consumer Commission (up to ₹1 crore), State Commission (₹1 crore to ₹10 crore), National Commission (above ₹10 crore). Online filing available.",
        category: 'consumer_law'
      };
    }
    
    return {
      text: "I understand you have a legal query. While I can provide general information about Indian laws, I'd recommend consulting with a qualified lawyer for specific legal advice. You can also try rephrasing your question with more specific legal terms, or use our FIR generator if you need to file a complaint.",
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