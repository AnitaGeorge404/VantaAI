import React, { useState } from 'react';

const ImageScanning = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('file', image);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/web-detect/', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setResult({ error: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Scan & Detect 🔍</h2>
        <p style={styles.subtitle}>
          Identify if your image is being misused online
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={styles.fileInput}
        />

        <button onClick={handleSubmit} style={styles.button}>
          {loading ? 'Scanning...' : 'Scan Image'}
        </button>

        {result && (
          <div style={styles.resultSection}>
            {result.error && (
              <p style={{ color: 'red', textAlign: 'center' }}>
                {result.error}
              </p>
            )}

            {result.fullMatches?.length > 0 && (
              <>
                <h3 style={styles.sectionTitle}>🔗 Exact Matches</h3>
                <ul style={styles.linkList}>
                  {result.fullMatches.map((url, idx) => (
                    <li key={idx}>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {result.partialMatches?.length > 0 && (
              <>
                <h3 style={styles.sectionTitle}>🧩 Partial Matches</h3>
                <ul style={styles.linkList}>
                  {result.partialMatches.map((url, idx) => (
                    <li key={idx}>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {result.visuallySimilarImages?.length > 0 && (
              <>
                <h3 style={styles.sectionTitle}>🖼️ Visually Similar</h3>
                <div style={styles.imageGrid}>
                  {result.visuallySimilarImages.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={url} alt="similar" style={styles.thumb} />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #E0EFFF 0%, #EAE4FF 100%)',
    fontFamily: "'Inter', sans-serif",
    padding: '32px 16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  card: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 6px 20px rgba(109, 40, 217, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    fontFamily: "'Lora', serif",
    color: '#3949ab',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: '20px',
  },
  fileInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '12px',
    border: '1px solid #ccc',
    marginBottom: '12px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#6D28D9',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '16px',
  },
  resultSection: {
    marginTop: '20px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1E3A8A',
    marginTop: '16px',
    marginBottom: '8px',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    lineHeight: '1.7',
    wordBreak: 'break-word',
  },
  imageGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',
  },
  thumb: {
    width: '90px',
    height: '90px',
    borderRadius: '8px',
    objectFit: 'cover',
    border: '1px solid #ddd',
  },
};

export default ImageScanning;
