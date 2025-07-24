import React, { useState, useRef } from 'react';
import axios from 'axios';

// Watermarking utility object - functionality is unchanged.
const WatermarkUtil = {
  generateWatermarkId: () => {
    return `wm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
  embedWatermark: (imageFile, watermarkId) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const watermarkBinary = watermarkId.split('').map(char => 
          char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join('') + '11111111'; 
        if (watermarkBinary.length > data.length / 4) {
          return reject(new Error("Image is too small to hold the watermark."));
        }
        for (let i = 0; i < watermarkBinary.length; i++) {
          const pixelIndex = i * 4 + 3;
          data[pixelIndex] = (data[pixelIndex] & 0xFE) | parseInt(watermarkBinary[i], 2);
        }
        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob((blob) => {
          resolve({
            watermarkedImage: blob,
            watermarkId: watermarkId,
          });
        }, 'image/png');
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(imageFile);
    });
  },
};

const DigitalWatermarking = () => {
  const [currentView, setCurrentView] = useState('upload');
  const [originalImage, setOriginalImage] = useState(null);
  const [watermarkedImage, setWatermarkedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [alertData, setAlertData] = useState(null);
  const [matchResults, setMatchResults] = useState(null);
  
  const fileInputRef = useRef(null);
  const trackingInputRef = useRef(null);

  // Functionality is unchanged
  const handleImageUpload = async (file) => {
    setOriginalImage(file);
    setWatermarkedImage(null);
    setProcessing(true);
    setAlertData(null);
    try {
      const id = WatermarkUtil.generateWatermarkId();
      const result = await WatermarkUtil.embedWatermark(file, id);
      setWatermarkedImage(result.watermarkedImage);
    } catch (error) {
      console.error('Protection embedding failed:', error);
      setAlertData({
        type: 'error',
        message: 'Failed to add protection to the image. Please try another one.'
      });
    } finally {
        setProcessing(false);
    }
  };

  // Functionality is unchanged
  const handleTrackingUpload = async (file) => {
    setMatchResults(null);
    setProcessing(true);
    setAlertData(null);
    try {
      const formData = new FormData();
      formData.append('file', file, file.name);
      const response = await axios.post('http://localhost:8000/web-detect/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMatchResults(response.data);
    } catch (err) {
      console.error('Tracking failed:', err);
      setAlertData({
        type: 'error',
        message: 'Failed to track the image. Ensure the backend server is running.'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!watermarkedImage) return;
    const url = URL.createObjectURL(watermarkedImage);
    const link = document.createElement('a');
    link.href = url;
    link.download = `protected_${originalImage?.name || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const styles = {
    // Existing styles are preserved
    container: {
      minHeight: '100vh',
      background: '#F3F4F6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '2rem'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#4B5563',
      fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
      fontWeight: '400'
    },
    tabContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '2rem',
      gap: '0.5rem',
      padding: '0.5rem',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '50px',
      maxWidth: '400px',
      margin: '0 auto',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
    },
    tab: {
      padding: '0.75rem 1.5rem',
      borderRadius: '50px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      background: 'transparent',
      color: '#4B5563',
    },
    activeTab: {
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      color: 'white',
      boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)'
    },
    card: {
      background: 'white',
      borderRadius: '24px',
      padding: '2rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px',
      margin: '0 auto',
    },
    uploadArea: {
      border: '3px dashed #E5E7EB',
      borderRadius: '20px',
      padding: '3rem 2rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #F9FAFB 0%, #F5F3FF 100%)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '1.5rem',
    },
    uploadIcon: {
      fontSize: 'clamp(2rem, 6vw, 3rem)',
      marginBottom: '1rem',
      color: '#6366F1'
    },
    uploadText: {
      fontSize: 'clamp(1rem, 3vw, 1.25rem)',
      fontWeight: '600',
      color: '#4338CA',
      marginBottom: '0.5rem'
    },
    uploadSubtext: {
      color: '#6B7280',
      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    },
    button: {
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      color: 'white',
      border: 'none',
      padding: '0.875rem 2rem',
      borderRadius: '50px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
    },
    imagePreview: {
      width: '100%',
      maxHeight: '400px',
      objectFit: 'contain',
      borderRadius: '16px',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
    },
    processing: {
      textAlign: 'center',
      padding: '3rem 2rem',
      color: '#6366F1',
      fontSize: '1.125rem',
    },
    processingIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
      animation: 'spin 1.5s linear infinite'
    },
    modal: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem'
    },
    modalContent: {
      background: 'white', borderRadius: '24px', padding: '2rem',
      maxWidth: '400px', width: '100%', textAlign: 'center',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
    },
    // **NEW STYLES for the improved results view**
    resultsSection: {
        marginBottom: '2rem',
    },
    resultsTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid #E5E7EB',
    },
    resultsList: {
        listStyle: 'none',
        padding: 0,
    },
    listItem: {
        background: '#F9FAFB',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        marginBottom: '0.5rem',
        border: '1px solid #F3F4F6',
    },
    resultsLink: {
        color: '#4F46E5',
        textDecoration: 'none',
        wordBreak: 'break-all',
        transition: 'color 0.2s',
    },
    similarImagesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '1rem',
    },
    imageLink: {
      display: 'block',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease-in-out',
    },
    similarImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    noResultsText: {
      color: '#6B7280',
      fontStyle: 'italic',
      padding: '1rem 0',
    },
  };

  const UploadView = () => (
    <div style={styles.card}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#374151' }}>
        🛡️ Protect Image
      </h2>
      <div style={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
        <div style={styles.uploadIcon}>📸</div>
        <div style={styles.uploadText}>Drop Image Here to Protect</div>
        <div style={styles.uploadSubtext}>or click to browse</div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])} style={{ display: 'none' }}/>
      </div>
      {processing && (
        <div style={styles.processing}>
          <div style={styles.processingIcon}>⚡</div>
          <div>Applying invisible protection...</div>
        </div>
      )}
      {watermarkedImage && !processing && (
        <div style={{ textAlign: 'center' }}>
          <img src={URL.createObjectURL(watermarkedImage)} alt="Watermarked Preview" style={styles.imagePreview}/>
          <button style={styles.button} onClick={handleDownload}>
            📥 Download Protected Image
          </button>
        </div>
      )}
    </div>
  );

  const TrackingView = () => (
    <div style={styles.card}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#374151' }}>
        🔍 Track Image Online
      </h2>
      <div style={styles.uploadArea} onClick={() => trackingInputRef.current?.click()}>
        <div style={styles.uploadIcon}>🌐</div>
        <div style={styles.uploadText}>Drop Image Here to Track</div>
        <div style={styles.uploadSubtext}>or click to browse</div>
        <input ref={trackingInputRef} type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleTrackingUpload(e.target.files[0])} style={{ display: 'none' }}/>
      </div>

      {processing && (
        <div style={styles.processing}>
          <div style={styles.processingIcon}>📡</div>
          <div>Scanning the web for matches...</div>
        </div>
      )}

      {/* **IMPROVED RESULTS DISPLAY** */}
      {matchResults && !processing && (
        <div>
          {/* Full Matches Section */}
          <div style={styles.resultsSection}>
            <h3 style={styles.resultsTitle}>✔️ Full Matches</h3>
            {matchResults.fullMatches?.length > 0 ? (
              <ul style={styles.resultsList}>
                {matchResults.fullMatches.map((url, idx) => (
                  <li key={`full-${idx}`} style={styles.listItem}>
                    <a href={url} target="_blank" rel="noopener noreferrer" style={styles.resultsLink}>{url}</a>
                  </li>
                ))}
              </ul>
            ) : <p style={styles.noResultsText}>No exact matches found.</p>}
          </div>

          {/* Partial Matches Section */}
          <div style={styles.resultsSection}>
            <h3 style={styles.resultsTitle}>✂️ Partial Matches</h3>
            {matchResults.partialMatches?.length > 0 ? (
              <ul style={styles.resultsList}>
                {matchResults.partialMatches.map((url, idx) => (
                  <li key={`partial-${idx}`} style={styles.listItem}>
                    <a href={url} target="_blank" rel="noopener noreferrer" style={styles.resultsLink}>{url}</a>
                  </li>
                ))}
              </ul>
            ) : <p style={styles.noResultsText}>No partial matches found.</p>}
          </div>

          {/* Visually Similar Images Section */}
          <div style={styles.resultsSection}>
            <h3 style={styles.resultsTitle}>🎨 Visually Similar Images</h3>
            {matchResults.visuallySimilarImages?.length > 0 ? (
              <div style={styles.similarImagesGrid}>
                {matchResults.visuallySimilarImages.map((url, idx) => (
                  <a key={`similar-${idx}`} href={url} target="_blank" rel="noopener noreferrer" style={styles.imageLink}>
                    <img src={url} alt={`Similar match ${idx + 1}`} style={styles.similarImage} />
                  </a>
                ))}
              </div>
            ) : <p style={styles.noResultsText}>No visually similar images found.</p>}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <div style={styles.header}>
        <h1 style={styles.title}>Image Protection & Tracker</h1>
        <p style={styles.subtitle}>Apply invisible watermarks and track your images across the web.</p>
      </div>
      <div style={styles.tabContainer}>
        <button style={{ ...styles.tab, ...(currentView === 'upload' ? styles.activeTab : {})}} onClick={() => setCurrentView('upload')}>
          🛡️ Protect
        </button>
        <button style={{ ...styles.tab, ...(currentView === 'track' ? styles.activeTab : {})}} onClick={() => setCurrentView('track')}>
          🔍 Track
        </button>
      </div>
      {currentView === 'upload' ? <UploadView /> : <TrackingView />}
      {alertData && (
        <div style={styles.modal} onClick={() => setAlertData(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>An Error Occurred</h3>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>{alertData.message}</p>
            <button style={styles.button} onClick={() => setAlertData(null)}>Got it</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalWatermarking;