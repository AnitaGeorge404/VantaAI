import React, { useState, useEffect, useRef } from 'react';

const uploadToFileIO = async (blob, filename, type) => {
  const formData = new FormData();
  formData.append('file', blob, filename);

  try {
    const response = await fetch('https://file.io/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload to file.io: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (data.success) {
      console.log(`✅ ${type} uploaded to file.io: ${data.link}`);
      return data.link; // file.io provides a direct download link
    } else {
      throw new Error(`file.io upload failed: ${data.message || 'Unknown error'}`);
    }
  } catch (err) {
    console.error(`❌ Error uploading ${type} to file.io:`, err);
    alert(`Failed to upload ${type} evidence: ${err.message}`);
    return null;
  }
};

const SilentSOS = () => {
  const [clickCount, setClickCount] = useState(0);
  const [tempClickCount, setTempClickCount] = useState(0);
  const [evidenceLinks, setEvidenceLinks] = useState({ video: null, audio: null, screen: null });
  const clickTimerRef = useRef(null);
  const tempClickTimerRef = useRef(null);

  const weather = {
    location: 'New York, NY',
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8,
    forecast: [
      { day: 'Today', high: 75, low: 62, condition: 'Sunny' },
      { day: 'Tomorrow', high: 78, low: 65, condition: 'Cloudy' },
      { day: 'Wednesday', high: 73, low: 60, condition: 'Rainy' }
    ]
  };

  const handleCloudClick = () => {
    setClickCount((prev) => prev + 1);
    clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => setClickCount(0), 3000);
    if (clickCount + 1 >= 3) {
      triggerSOS();
      setClickCount(0);
    }
  };

  const handleTempClick = () => {
    setTempClickCount((prev) => prev + 1);
    clearTimeout(tempClickTimerRef.current);
    tempClickTimerRef.current = setTimeout(() => setTempClickCount(0), 3000);

    if (tempClickCount + 1 >= 5) {
      console.log('Download triggered by temperature click.');
      handleDownloadAllEvidence();
      setTempClickCount(0);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        triggerSOS();
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        console.log('Download triggered by keyboard shortcut.');
        handleDownloadAllEvidence();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [evidenceLinks]); // Add evidenceLinks to dependency array to ensure latest state is used for download

  const triggerSOS = async () => {
    console.log('🔴 SOS Triggered');
    const recordingPromises = [
      recordMedia({ video: true, audio: true }, 'video', 10000),
      recordMedia({ audio: true }, 'audio', 10000),
    ];

    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      recordingPromises.push(recordScreenRecording(10000));
    } else {
      console.warn('Screen recording not supported on this device/browser.');
      alert('Screen recording not supported on this device.');
    }

    const results = await Promise.all(recordingPromises);

    setEvidenceLinks((prevLinks) => {
      const newLinks = { ...prevLinks };
      results.forEach(result => {
        if (result && result.type && result.link) {
          newLinks[result.type] = result.link;
        }
      });
      return newLinks;
    });

    alert('Evidence recording complete. Files are temporarily available for download.');
  };

  const recordMedia = async (constraints, type, duration = 10000) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (!stream || stream.getTracks().length === 0) {
        console.warn(`🚫 No ${type} stream available.`);
        return null;
      }
      const mimeType = type === 'audio' ? 'audio/webm;codecs=opus' : 'video/webm;codecs=vp8,opus';
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);

      return new Promise((resolve) => {
        recorder.onstop = async () => {
          if (chunks.length === 0) {
            console.warn(`⚠️ No chunks captured for ${type}`);
            resolve(null);
          } else {
            const blob = new Blob(chunks, { type: mimeType });
            const filename = `${type}_evidence_${Date.now()}.webm`;
            const link = await uploadToFileIO(blob, filename, type);
            resolve({ type, link });
          }
          stream.getTracks().forEach((t) => t.stop());
        };
        recorder.start();
        setTimeout(() => recorder.state === 'recording' && recorder.stop(), Math.max(duration, 5000));
      });
    } catch (err) {
      console.error(`❌ Failed to record ${type}:`, err.message);
      alert(`Access denied for ${type}. Please allow camera/microphone permissions in your browser settings.`);
      return null;
    }
  };

  const recordScreenRecording = async (duration = 10000) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: 'screen' }, audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      const chunks = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);

      return new Promise((resolve) => {
        recorder.onstop = async () => {
          if (chunks.length === 0) {
            console.warn(`⚠️ No chunks captured for screen`);
            resolve(null);
          } else {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const filename = `screen_evidence_${Date.now()}.webm`;
            const link = await uploadToFileIO(blob, filename, 'screen');
            resolve({ type: 'screen', link });
          }
          stream.getTracks().forEach((t) => t.stop());
        };
        recorder.start();
        setTimeout(() => recorder.state === 'recording' && recorder.stop(), duration);
      });
    } catch (err) {
      console.error('❌ Screen recording error:', err.message);
      return null;
    }
  };

  const handleDownloadAllEvidence = () => {
    let downloadedCount = 0;
    const types = ['video', 'audio', 'screen'];

    types.forEach(type => {
      if (evidenceLinks[type]) {
        downloadEvidence(type, evidenceLinks[type]);
        downloadedCount++;
      }
    });

    if (downloadedCount === 0) {
      alert('No evidence has been recorded yet. Trigger the SOS first.');
    }
  };

  const downloadEvidence = (type, url) => {
    if (!url) {
      console.error(`No URL available for ${type} evidence.`);
      alert(`No download link available for ${type} evidence.`);
      return;
    }
    try {
      const a = document.createElement('a');
      a.href = url;
      // file.io typically handles the filename, but we can suggest one
      a.download = `${type}_evidence_${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      console.log(`✅ Download initiated for ${type} from ${url}`);
    } catch (err) {
      console.error(`Download error for ${type}:`, err);
      alert(`Could not download ${type} evidence: ${err.message}`);
    }
  };

  const getIcon = (cond) => {
    const c = cond.toLowerCase();
    if (c.includes('sun')) return '☀️';
    if (c.includes('cloud')) return '⛅';
    if (c.includes('rain')) return '🌧️';
    return '☁️';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>WeatherNow</h2>
        <div>{weather.location}</div>
      </div>

      <div style={styles.main}>
        <div style={styles.temperature}>
          <span onClick={handleTempClick} style={styles.tempText} title="Click 5 times to download evidence">
            {weather.temperature}°
          </span>
          <span onClick={handleCloudClick} style={styles.icon} title="Click 3 times for SOS">
            {getIcon(weather.condition)}
          </span>
        </div>
        <div>{weather.condition}</div>
        <div>Humidity: {weather.humidity}% | Wind: {weather.windSpeed} mph</div>
        <h4 style={styles.forecastHeader}>Forecast</h4>
        {weather.forecast.map((f, i) => (
          <div key={i} style={styles.forecastItem}>
            <span>{f.day}:</span>
            <span>{getIcon(f.condition)} {f.high}° / {f.low}°</span>
          </div>
        ))}
        {/* Optional: Display download buttons if links exist */}
        {(evidenceLinks.video || evidenceLinks.audio || evidenceLinks.screen) && (
          <div style={styles.downloadSection}>
            <p>Evidence is ready for download:</p>
            {evidenceLinks.video && (
              <button onClick={() => downloadEvidence('video', evidenceLinks.video)} style={styles.button}>
                Download Video Evidence
              </button>
            )}
            {evidenceLinks.audio && (
              <button onClick={() => downloadEvidence('audio', evidenceLinks.audio)} style={{ ...styles.button, marginLeft: 10 }}>
                Download Audio Evidence
              </button>
            )}
            {evidenceLinks.screen && (
              <button onClick={() => downloadEvidence('screen', evidenceLinks.screen)} style={{ ...styles.button, marginLeft: 10 }}>
                Download Screen Recording
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 400,
    margin: '0 auto',
    padding: 20,
    fontFamily: 'Arial, sans-serif',
    background: 'linear-gradient(to bottom, #74b9ff, #0984e3)',
    color: 'white',
    borderRadius: 15,
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    minHeight: 'calc(100vh - 40px)',
    display: 'flex',
    flexDirection: 'column'
  },
  header: { textAlign: 'center', marginBottom: 20 },
  main: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    flexGrow: 1,
  },
  temperature: {
    fontSize: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  tempText: {
    fontWeight: 300,
    cursor: 'pointer',
    userSelect: 'none',
  },
  icon: {
    fontSize: 40,
    cursor: 'pointer',
    userSelect: 'none',
  },
  forecastHeader: { marginTop: 20, marginBottom: 10 },
  forecastItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px 0',
  },
  downloadSection: { marginTop: 20, textAlign: 'center' },
  button: {
    padding: '12px 20px',
    background: '#fff',
    color: '#0984e3',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    marginTop: 10, // Added margin-top for spacing
  },
};

export default SilentSOS;