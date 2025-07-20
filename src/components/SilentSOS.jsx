import React, { useState, useEffect, useRef } from 'react';

const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (!result) return reject('Empty reader result');
      const base64 = result.split(',')[1];
      base64 ? resolve(base64) : reject('Base64 split failed');
    };
    reader.onerror = (err) => reject('FileReader error: ' + err.message);
    reader.readAsDataURL(blob);
  });

const SilentSOS = () => {
  const [clickCount, setClickCount] = useState(0);
  const [tempClickCount, setTempClickCount] = useState(0);
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
  }, []); 

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

    await Promise.all(recordingPromises);
    alert('Evidence recording complete and saved locally.');
  };

  const recordMedia = async (constraints, type, duration = 10000) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (!stream || stream.getTracks().length === 0) {
        console.warn(`🚫 No ${type} stream available.`);
        return;
      }
      const mimeType = type === 'audio' ? 'audio/webm;codecs=opus' : 'video/webm;codecs=vp8,opus';
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
      recorder.onstop = async () => {
        if (chunks.length === 0) {
          console.warn(`⚠️ No chunks captured for ${type}`);
        } else {
          const blob = new Blob(chunks, { type: mimeType });
          try {
            const base64 = await blobToBase64(blob);
            localStorage.setItem(`evidence_${type}`, JSON.stringify({ base64 }));
            console.log(`✅ ${type} saved successfully`);
          } catch (err) {
            console.error(`❌ Failed to convert ${type} to base64:`, err);
          }
        }
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      setTimeout(() => recorder.state === 'recording' && recorder.stop(), Math.max(duration, 5000));
    } catch (err) {
      console.error(`❌ Failed to record ${type}:`, err.message);
      alert(`Access denied for ${type}. Please allow camera/microphone permissions in your browser settings.`);
    }
  };

  const recordScreenRecording = async (duration = 10000) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: 'screen' }, audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      const chunks = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
      recorder.onstop = async () => {
        if (chunks.length === 0) {
          console.warn(`⚠️ No chunks captured for screen`);
        } else {
          const blob = new Blob(chunks, { type: 'video/webm' });
          try {
            const base64 = await blobToBase64(blob);
            localStorage.setItem(`evidence_screen`, JSON.stringify({ base64 }));
            console.log('✅ Screen recording saved');
          } catch (err) {
            console.error('❌ Screen base64 conversion failed:', err);
          }
        }
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      setTimeout(() => recorder.state === 'recording' && recorder.stop(), duration);
    } catch (err) {
      console.error('❌ Screen recording error:', err.message);
    }
  };

  const handleDownloadAllEvidence = () => {
    let downloadedCount = 0;
    const types = ['video', 'audio', 'screen'];
    
    types.forEach(type => {
      if (localStorage.getItem(`evidence_${type}`)) {
        downloadEvidence(type);
        downloadedCount++;
      }
    });

    if (downloadedCount === 0) {
      alert('No evidence has been recorded yet. Trigger the SOS first.');
    }
  };

  const downloadEvidence = (type) => {
    try {
      const item = localStorage.getItem(`evidence_${type}`);
      if (!item) return;
      const { base64 } = JSON.parse(item);
      if (!base64) throw new Error('Missing base64 data in storage');
      const mimeType = type === 'audio' ? 'audio/webm' : 'video/webm';
      const url = `data:${mimeType};base64,${base64}`;
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_evidence_${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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
  },
};

export default SilentSOS;