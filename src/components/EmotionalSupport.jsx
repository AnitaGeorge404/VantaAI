import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Shield, Scale, HandHeart, RefreshCcw } from 'lucide-react';

const ChatWindow = ({ messages, isTyping, messagesEndRef }) => (
  <div style={styles.chatWindow}>
    {messages.map((msg, index) => (
      <div key={index} style={msg.role === 'user' ? styles.userMessageContainer : styles.botMessageContainer}>
        <div style={styles.avatar(msg.role)}>
          {msg.role === 'user' ? 'You' : <Sparkles size={16} />}
        </div>
        <div style={msg.role === 'user' ? styles.userMessage : styles.botMessage}>
          {msg.content}
        </div>
      </div>
    ))}
    {isTyping && (
      <div style={styles.botMessageContainer}>
        <div style={styles.avatar('assistant')}>
          <Sparkles size={16} />
        </div>
        <div style={styles.botMessage}>
          <div style={styles.typingIndicator}>
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    )}
    <div ref={messagesEndRef} />
  </div>
);

const Suggestions = ({ suggestionGroups, handleSend }) => (
  <div style={styles.suggestionsContainer}>
    {suggestionGroups.map((group, index) => (
      <div key={index} style={styles.suggestionGroup}>
        <h3 style={styles.suggestionTitle}>{group.icon} {group.title}</h3>
        <div style={styles.suggestionItems}>
          {group.items.map((item, i) => (
            <button key={i} onClick={() => handleSend(item)} style={styles.suggestionButton}>
              {item}
            </button>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const InputBar = ({ input, setInput, handleSend, isSending }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div style={styles.inputBarContainer}>
      <input
        type="text"
        style={styles.inputField}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything... you're safe here."
        disabled={isSending}
      />
      <button onClick={() => handleSend(input)} disabled={isSending || !input.trim()} style={styles.sendButton}>
        <Send size={20} />
      </button>
    </div>
  );
};


// --- Main Component ---

function EmotionalSupport() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  const suggestionGroups = [
    { title: "Safety & Prevention", icon: <Shield size={18}/>, items: [ "How do I know if my personal data is being misused?", "Can someone post my pictures without asking me?", "What should I do if someone threatens me online?", ], },
    { title: "Legal Rights", icon: <Scale size={18}/>, items: [ "Do I have the right to ask for content takedown?", "Can I take action if my pictures are used without consent?", ], },
    { title: "Mental Health & Support", icon: <HandHeart size={18}/>, items: [ "I feel overwhelmed, what can I do right now?", "I’m scared to speak up, what are my options?", ], },
  ];

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({ top: chatWindowRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleNewChat = () => {
    setMessages([]);
    setShowSuggestions(true);
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);
    if (showSuggestions) setShowSuggestions(false);

    try {
      // This fetch logic remains the same
      const res = await fetch("https://backend-gv71.onrender.com/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(msg => ({ role: msg.role, content: msg.content })),
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedResponse = "";
      let botMessageIndex = -1;

      setMessages((prev) => {
        const newMessages = [...prev, { role: "assistant", content: "" }];
        botMessageIndex = newMessages.length - 1;
        return newMessages;
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n").filter((line) => line.startsWith("data:"));

        for (const line of lines) {
          try {
            const jsonData = JSON.parse(line.substring(5));
            const token = jsonData.token || jsonData.message?.content;
            if (token) {
              accumulatedResponse += token;
              setMessages((prev) => {
                const updated = [...prev];
                if (botMessageIndex !== -1 && updated[botMessageIndex]) {
                  updated[botMessageIndex].content = accumulatedResponse;
                }
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Network or internal server error. Please try again later." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.chatContainer}>
        <header style={styles.header}>
          <div style={styles.headerTitle}>
            <Sparkles size={24} style={{ color: '#6A5ACD' }} />
            <h1 style={{ margin: '0', fontSize: '20px' }}>Vanta AI Support</h1>
          </div>
          <button onClick={handleNewChat} style={styles.newChatButton}>
            <RefreshCcw size={16} />
            New Chat
          </button>
        </header>
        
        <div ref={chatWindowRef} style={styles.messagesArea}>
          {showSuggestions ? (
            <Suggestions suggestionGroups={suggestionGroups} handleSend={handleSend} />
          ) : (
            <ChatWindow messages={messages} isTyping={isTyping} messagesEndRef={messagesEndRef} />
          )}
        </div>
        
        <footer style={styles.footer}>
          <InputBar input={input} setInput={setInput} handleSend={handleSend} isSending={isTyping} />
        </footer>
      </div>
    </div>
  );
}


const styles = {
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    background: 'linear-gradient(180deg, #E0EFFF 0%, #EAE4FF 100%)',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
  },
  chatContainer: {
    width: '100%',
    maxWidth: '800px',
    height: 'calc(100vh - 40px)',
    maxHeight: '900px',
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    boxShadow: '0 8px 32px rgba(106, 90, 205, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    flexShrink: 0,
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#43016E',
    fontWeight: '600',
  },
  newChatButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#E5C8FF',
    color: '#43016E',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  messagesArea: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '24px',
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    flexShrink: 0,
  },
  inputBarContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  inputField: {
    flexGrow: 1,
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '16px',
    background: '#fff',
    outline: 'none',
    color: '#43016E',
  },
  sendButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    background: '#6A5ACD',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  suggestionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  suggestionGroup: {
    background: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '16px',
    padding: '20px',
  },
  suggestionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '0 0 16px 0',
    color: '#43016E',
    fontSize: '18px',
    fontWeight: '600',
  },
  suggestionItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  suggestionButton: {
    textAlign: 'left',
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.8)',
    border: '1px solid #E5C8FF',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#43016E',
    transition: 'background-color 0.2s, transform 0.1s',
  },
  chatWindow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  avatar: (role) => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    background: role === 'user' ? '#6A5ACD' : '#A9A9A9',
  }),
  userMessageContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginLeft: 'auto',
    maxWidth: '80%',
  },
  botMessageContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '12px',
    marginRight: 'auto',
    maxWidth: '80%',
  },
  userMessage: {
    background: '#6A5ACD',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '18px 18px 4px 18px',
  },
  botMessage: {
    background: '#FFFFFF',
    color: '#333',
    padding: '12px 16px',
    borderRadius: '18px 18px 18px 4px',
    border: '1px solid #e5e7eb',
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '10px',
    alignItems: 'center',
    '& span': {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#A9A9A9',
      animation: 'typing 1.4s infinite ease-in-out both',
    },
    '& span:nth-of-type(1)': { animationDelay: '-0.32s' },
    '& span:nth-of-type(2)': { animationDelay: '-0.16s' },
  },
};

export default EmotionalSupport;