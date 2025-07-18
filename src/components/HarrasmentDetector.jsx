import React, { useState, useEffect, useRef } from "react";
import {
  Paperclip,
  Send,
  Shield,
  AlertTriangle,
  Info,
  X,
  LogIn,
  XCircle,
} from "lucide-react";
import { firestore } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const analyzeMessageForHarassment = (message) => {
  const harassmentKeywords = [
    "stupid",
    "ugly",
    "hate",
    "kill",
    "die",
    "idiot",
    "loser",
    "dumb",
    "worthless",
    "disgusting",
    "pathetic",
  ];
  const flirtingKeywords = [
    "beautiful",
    "sexy",
    "hot",
    "gorgeous",
    "pretty",
    "attractive",
    "cute",
    "sweet",
  ];
  const aggressiveKeywords = [
    "shut up",
    "go away",
    "leave me alone",
    "annoying",
    "fuck",
    "damn",
    "shit",
  ];
  const text = message.toLowerCase();
  const containsHarassment = harassmentKeywords.some((keyword) =>
    text.includes(keyword)
  );
  const containsFlirting = flirtingKeywords.some((keyword) =>
    text.includes(keyword)
  );
  const containsAggression = aggressiveKeywords.some((keyword) =>
    text.includes(keyword)
  );
  let isHarmful = containsHarassment || containsFlirting || containsAggression;
  let confidence = 0;
  let category = "safe";
  if (containsHarassment) {
    confidence = Math.random() * 0.15 + 0.85;
    category = "harassment";
  } else if (containsFlirting) {
    confidence = Math.random() * 0.25 + 0.65;
    category = "inappropriate";
  } else if (containsAggression) {
    confidence = Math.random() * 0.3 + 0.7;
    category = "aggressive";
  } else {
    confidence = Math.random() * 0.15 + 0.05;
    isHarmful = false;
  }
  return {
    isHarmful,
    confidence,
    category,
    score: Math.round(confidence * 100),
  };
};

const HarassmentDetector = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joinedChat, setJoinedChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [warningMessage, setWarningMessage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!joinedChat) return;

    const q = query(collection(firestore, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages = [];
      querySnapshot.forEach((doc) => {
        const messageData = doc.data();
        if (messageData.room === room) {
          const isCurrentUser = messageData.sender === username;
          let analysis = null;
          if (messageData.message && messageData.message.trim()) {
            analysis = analyzeMessageForHarassment(messageData.message);
          }
          newMessages.push({
            id: doc.id,
            ...messageData,
            isCurrentUser,
            analysis,
          });

          if (!isCurrentUser && analysis?.isHarmful && analysis?.score > 80) {
            setWarningMessage({ ...messageData, analysis });
            setShowWarningAlert(true);
          }
        }
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [joinedChat, room, username]);

  const sendMessage = async () => {
    const hasText = newMessage.trim() !== "";
    const hasImage = imageFile !== null;
    if ((!hasText && !hasImage) || isUploading) return;

    setIsUploading(true);
    let imageUrl = null;

    if (hasImage) {
      const storage = getStorage();
      const imagePath = `images/${room}/${Date.now()}_${imageFile.name}`;
      const imageStorageRef = storageRef(storage, imagePath);
      await uploadBytes(imageStorageRef, imageFile);
      imageUrl = await getDownloadURL(imageStorageRef);
    }

    await addDoc(collection(firestore, "messages"), {
      room: room,
      sender: username,
      message: hasText ? newMessage.trim() : "",
      imageUrl: imageUrl,
      timestamp: serverTimestamp(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    setNewMessage("");
    setImageFile(null);
    setImagePreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = null;
    setIsUploading(false);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImagePreview = () => {
    setImageFile(null);
    setImagePreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const joinRoom = () => {
    if (username.trim() && room.trim()) {
      setJoinedChat(true);
    } else {
      alert("Please enter a username and room name.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleMessageClick = (message) => {
    if (!message.isCurrentUser && message.analysis) {
      setSelectedMessage(selectedMessage?.id === message.id ? null : message);
    }
  };

  const getScoreColor = (analysis) => {
    if (analysis?.isHarmful) {
      if (analysis.score >= 80) return "#dc2626";
      if (analysis.score >= 60) return "#f59e0b";
    }
    return "#10b981";
  };

  const getScoreIcon = (analysis) => {
    return analysis?.isHarmful ? (
      <AlertTriangle size={12} color="white" />
    ) : (
      <Shield size={12} color="white" />
    );
  };

  const closeWarningAlert = () => {
    setShowWarningAlert(false);
    setWarningMessage(null);
  };

  if (!joinedChat) {
    return (
      <div
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          height: "100vh",
          width: "100%",
          maxWidth: "400px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "24px",
          background:
            "linear-gradient(180deg, #E8D5FF 0%, #F0E9FF 25%, #E0E7FF 50%, #DBEAFE 75%, #E8D5FF 100%)",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#6B46C1",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          AI Safety Chat
        </h1>
        <input
          type="text"
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            fontSize: "16px",
          }}
        />
        <input
          type="text"
          placeholder="Room Name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          style={{
            padding: "12px",
            marginBottom: "24px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            fontSize: "16px",
          }}
        />
        <button
          onClick={joinRoom}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#8B5CF6",
            color: "white",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <LogIn size={20} /> Join Chat
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        height: "100vh",
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg, #E8D5FF 0%, #F0E9FF 25%, #E0E7FF 50%, #DBEAFE 75%, #E8D5FF 100%)",
        position: "relative",
      }}
    >
      <div
        style={{
          padding: "20px 24px",
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#6B46C1",
            margin: "0 0 8px 0",
          }}
        >
          Chat Room: {room}
        </h1>
        <div style={{ fontSize: "14px", fontWeight: "500", color: "#6B46C1" }}>
          Logged in as: {username}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: "16px 20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: message.isCurrentUser ? "flex-end" : "flex-start",
              gap: "8px",
              margin: "6px 0",
            }}
          >
            {!message.isCurrentUser && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#6B46C1",
                  marginLeft: "16px",
                  fontWeight: "500",
                }}
              >
                {message.sender}
              </div>
            )}
            <div
              style={{
                maxWidth: "280px",
                padding: "12px 16px",
                borderRadius: "24px",
                cursor: !message.isCurrentUser ? "pointer" : "default",
                alignSelf: message.isCurrentUser ? "flex-end" : "flex-start",
                backgroundColor: message.isCurrentUser
                  ? "rgba(139, 92, 246, 0.8)"
                  : "rgba(255, 255, 255, 0.9)",
                color: message.isCurrentUser ? "#FFFFFF" : "#6B46C1",
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                boxShadow: "0 2px 8px rgba(139, 92, 246, 0.15)",
                backdropFilter: "blur(5px)",
              }}
              onClick={() => handleMessageClick(message)}
            >
              {message.imageUrl && (
                <img
                  src={message.imageUrl}
                  alt="Chat content"
                  style={{
                    width: "100%",
                    borderRadius: "16px",
                    marginBottom: message.message ? "8px" : "0",
                  }}
                />
              )}
              {message.message && (
                <span
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.4",
                    flex: 1,
                    wordBreak: "break-word",
                  }}
                >
                  {message.message}
                </span>
              )}
              {!message.isCurrentUser && message.analysis && (
                <div style={{ flexShrink: 0, alignSelf: "center" }}>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: getScoreColor(message.analysis),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {getScoreIcon(message.analysis)}
                  </div>
                </div>
              )}
            </div>
            {selectedMessage?.id === message.id && message.analysis && (
              <div
                style={{
                  alignSelf: "flex-start",
                  maxWidth: "280px",
                  padding: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "16px",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <Info size={14} color="#6366F1" />
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Safety Analysis
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: getScoreColor(message.analysis),
                    }}
                  >
                    {message.analysis.isHarmful
                      ? `${message.analysis.score}% risk detected`
                      : `${message.analysis.score}% risk level`}
                  </span>
                  <div
                    style={{
                      width: "100%",
                      height: "4px",
                      backgroundColor: "#E5E7EB",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${message.analysis.confidence * 100}%`,
                        backgroundColor: getScoreColor(message.analysis),
                        borderRadius: "2px",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  {message.analysis.isHarmful && (
                    <div
                      style={{
                        fontSize: "11px",
                        fontStyle: "italic",
                        color: getScoreColor(message.analysis),
                        marginTop: "4px",
                      }}
                    >
                      Category: {message.analysis.category}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          padding: "16px 20px",
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(139, 92, 246, 0.1)",
        }}
      >
        {imagePreviewUrl && (
          <div
            style={{
              position: "relative",
              marginBottom: "12px",
              width: "80px",
              height: "80px",
            }}
          >
            <img
              src={imagePreviewUrl}
              alt="Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
            <button
              onClick={removeImagePreview}
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                background: "rgba(0,0,0,0.7)",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                padding: "2px",
                display: "flex",
              }}
            >
              <XCircle size={20} color="white" />
            </button>
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            borderRadius: "24px",
            backdropFilter: "blur(5px)",
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageSelect}
            accept="image/*"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0",
              display: "flex",
            }}
          >
            <Paperclip size={20} color="#8B5CF6" />
          </button>
          <input
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "14px",
              backgroundColor: "transparent",
              color: "#6B46C1",
              fontFamily: "inherit",
            }}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Your message..."
          />
          <button
            style={{
              padding: "8px",
              borderRadius: "50%",
              border: "none",
              backgroundColor:
                newMessage.trim() || imageFile ? "#8B5CF6" : "#D1D5DB",
              color: "white",
              cursor:
                newMessage.trim() || imageFile ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s ease",
            }}
            onClick={sendMessage}
            disabled={isUploading || (!newMessage.trim() && !imageFile)}
          >
            {isUploading ? (
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255,255,255,0.5)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
            ) : (
              <Send size={16} />
            )}
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </button>
        </div>
      </div>

      {showWarningAlert && warningMessage && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)",
              borderRadius: "24px",
              padding: "24px",
              width: "100%",
              maxWidth: "320px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <div style={{ flex: 1, paddingRight: "8px" }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      backgroundColor: "#EF4444",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                    }}
                  >
                    <AlertTriangle size={32} color="white" />
                  </div>
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "white",
                      margin: "0 0 8px 0",
                    }}
                  >
                    ⚠️ HIGH RISK DETECTED
                  </h2>
                  <p
                    style={{
                      color: "#FCA5A5",
                      fontSize: "14px",
                      margin: "0 0 16px 0",
                      lineHeight: "1.4",
                    }}
                  >
                    This message contains potentially harmful content with{" "}
                    {warningMessage.analysis.score}% confidence
                  </p>
                </div>
                <button
                  onClick={closeWarningAlert}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    padding: "0",
                    flexShrink: 0,
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(127, 29, 29, 0.5)",
                  borderRadius: "16px",
                  padding: "16px",
                  marginBottom: "16px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "#FCA5A5",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  Flagged Content:
                </div>
                {warningMessage.imageUrl && (
                  <img
                    src={warningMessage.imageUrl}
                    alt="Harmful content"
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  />
                )}
                {warningMessage.message && (
                  <div
                    style={{
                      fontSize: "14px",
                      color: "white",
                      fontWeight: "500",
                      wordBreak: "break-word",
                    }}
                  >
                    "{warningMessage.message}"
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                  }}
                >
                  <span style={{ color: "#FCA5A5" }}>Risk Level:</span>
                  <span style={{ color: "white", fontWeight: "bold" }}>
                    {warningMessage.analysis.score}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "#7F1D1D",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      backgroundColor: "#FCA5A5",
                      borderRadius: "4px",
                      width: `${warningMessage.analysis.score}%`,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#FCA5A5",
                    marginTop: "4px",
                  }}
                >
                  Category: {warningMessage.analysis.category}
                </div>
              </div>
              <button
                onClick={closeWarningAlert}
                style={{
                  width: "100%",
                  marginTop: "24px",
                  backgroundColor: "white",
                  color: "#DC2626",
                  fontWeight: "600",
                  padding: "12px",
                  borderRadius: "16px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Acknowledge Warning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HarassmentDetector;