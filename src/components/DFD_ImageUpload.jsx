import { useCallback } from "react";

const ImageUpload = ({ onImageUpload, imagePreview }) => {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));
    if (imageFile) onImageUpload(imageFile);
  }, [onImageUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) onImageUpload(file);
  }, [onImageUpload]);

  const styles = {
    wrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "1.5rem",
    },
    dropzone: {
      position: "relative",
      width: "100%",
      maxWidth: "500px",
      padding: "2rem",
      border: "2px dashed #D8B4FE",
      borderRadius: "1rem",
      background: "linear-gradient(to bottom right, #e0c3fc, #8ec5fc)",
      textAlign: "center",
      boxShadow: "0 8px 10px rgba(0,0,0,0.1)",
      cursor: "pointer",
    },
    input: {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      opacity: 0,
      cursor: "pointer",
    },
    preview: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    img: {
      maxWidth: "100%",
      maxHeight: "250px",
      borderRadius: "0.5rem",
      marginBottom: "1rem",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
    textSuccess: {
      color: "#010d09ff",
      fontWeight: "600",
    },
    placeholder: {
      color: "#4B5563",
      fontSize: "0.875rem",
    },
    icon: {
      fontSize: "1.5rem",
      marginBottom: "0.25rem",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div
        style={styles.dropzone}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          style={styles.input}
        />
        {imagePreview ? (
          <div style={styles.preview}>
            <img src={imagePreview} alt="Uploaded preview" style={styles.img} />
            <p style={styles.textSuccess}>Image uploaded successfully</p>
          </div>
        ) : (
          <div style={styles.placeholder}>
            <div style={styles.icon}>⬆️</div>
            <p>Drop Image Here</p>
            <p>—or—</p>
            <p>Click to Browse</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;