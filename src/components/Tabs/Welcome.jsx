import React from "react";
import { Link } from "react-router-dom";
import welcomeImage from "../../Images/girl.png";

const Welcome = () => {
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(to bottom right, #cfe8ff, #f3cfff)",
      padding: "20px",
    },
    content: {
      textAlign: "center",
      maxWidth: "400px",
      width: "100%",
    },
    heading: {
      fontFamily: "Outfit, sans-serif",
      fontWeight: 400,
      fontStyle: "normal",
      fontSize: "48px",
      lineHeight: "100%",
      letterSpacing: "0%",
      color: "#1f2937",
      marginBottom: "30px",
    },
    image: {
      width: "363px",
      height: "344px",
      borderRadius: "87px",
      objectFit: "cover",
      marginBottom: "20px",
    },
    subheading: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#111827",
      marginBottom: "30px",
    },
    button: {
      width: "100%",
      padding: "12px",
      borderRadius: "9999px",
      border: "none",
      cursor: "pointer",
      marginBottom: "16px",
    },
    anonBtn: {
      backgroundColor: "#d8b4fe",
      color: "#4b0082",
    },
    signInBtn: {
      backgroundColor: "#93c5fd",
      color: "#1e3a8a",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <p style={styles.heading}>
          You’re safe here, <br />
          and you’re not alone
        </p>
        <img src={welcomeImage} alt="Welcome" style={styles.image} />
        <h1 style={styles.subheading}>Welcome to Vanta AI</h1>
        <Link to="/dashboard">
          <button style={{ ...styles.button, ...styles.anonBtn }}>
            Continue Anonymously
          </button>
        </Link>
        <Link to="/signin">
          <button style={{ ...styles.button, ...styles.signInBtn }}>
            Sign In Securely
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
