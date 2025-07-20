import React from "react";
import VantaSplash from "../../Images/vanta_splash_img.png"; 

const Index = () => {
  const styles = {
    container: {
      height: "100vh",
      width: "100vw",
      backgroundColor: "#fce4ec", 
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain",
    },
  };

  return (
    <div style={styles.container}>
      <img src={VantaSplash} alt="Vanta AI Splash" style={styles.image} />
    </div>
  );
};

export default Index;
