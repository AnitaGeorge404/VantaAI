// src/components/SilentSOS.jsx

import React, { useState, useEffect, useRef } from 'react';

const SilentSOS = () => {
  // State for the recording trigger
  const [recordClickCount, setRecordClickCount] = useState(0);
  const recordClickTimerRef = useRef(null);
  
  // State for the upload trigger
  const [uploadClickCount, setUploadClickCount] = useState(0);
  const uploadClickTimerRef = useRef(null);

  // State to secretly hold the recorded files (blobs)
  const [recordedBlobs, setRecordedBlobs] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const weather = {
    location: 'Kollam, Kerala',
    temperature: 28,
    condition: 'Heavy Rain & Thunder',
    humidity: 88,
    windSpeed: 18,
    forecast: [
      { day: 'Today', high: 29, low: 25, condition: 'Rainy' },
      { day: 'Tomorrow', high: 29, low: 25, condition: 'Showers' },
      { day: 'Saturday', high: 30, low: 26, condition: 'Cloudy' }
    ]
  };

  // --- HIDDEN TRIGGER 1: START RECORDING ---
  const handleRecordTrigger = () => {
    setRecordClickCount((prev) => prev + 1);
    clearTimeout(recordClickTimerRef.current);
    recordClickTimerRef.current = setTimeout(() => setRecordClickCount(0), 2000); // 2-second window

    if (recordClickCount + 1 >= 3) {
      triggerSOS();
      setRecordClickCount(0); // Reset immediately
    }
  };

  // --- HIDDEN TRIGGER 2: UPLOAD & GET LINKS ---
  const handleUploadTrigger = () => {
    setUploadClickCount((prev) => prev + 1);
    clearTimeout(uploadClickTimerRef.current);
    uploadClickTimerRef.current = setTimeout(() => setUploadClickCount(0), 2000); // 2-second window

    if (uploadClickCount + 1 >= 3) {
      handleUploadAndGetLinks();
      setUploadClickCount(0); // Reset immediately
    }
  };

  const recordAndStoreBlob = async (constraints, type, duration) => {
    try {
      const stream = await (type === 'screen' 
        ? navigator.mediaDevices.getDisplayMedia(constraints) 
        : navigator.mediaDevices.getUserMedia(constraints));

      if (!stream) return false;

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      const chunks = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
      
      const recordPromise = new Promise((resolve) => {
        recorder.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          if (chunks.length > 0) {
            const blob = new Blob(chunks, { type: recorder.mimeType });
            setRecordedBlobs(prev => ({ ...prev, [type]: blob }));
            resolve(true);
          } else {
            resolve(false);
          }
        };
      });
      
      recorder.start();
      setTimeout(() => recorder.state === 'recording' && recorder.stop(), duration);
      return recordPromise;

    } catch (err) {
      console.error(`❌ FAILED TO START RECORDING FOR: ${type}. Reason:`, err.message);
      return false;
    }
  };

  const triggerSOS = async () => {
    if (isRecording) return;
    
    setRecordedBlobs({}); // Clear any previous recordings
    setIsRecording(true);
    console.log('🔴 SOS Triggered: Starting recordings...');
    alert('Starting background recording for 10 seconds...');

    const recordingPromises = [
      recordAndStoreBlob({ video: true, audio: true }, 'video', 10000),
      recordAndStoreBlob({ audio: true }, 'audio', 10000),
      ...(navigator.mediaDevices?.getDisplayMedia ? [recordAndStoreBlob({ video: { mediaSource: 'screen' }, audio: true }, 'screen', 10000)] : [])
    ];

    const results = await Promise.all(recordingPromises);
    setIsRecording(false);
    
    if (results.some(res => res === true)) {
      alert('Recording Complete. Evidence is ready for upload.');
    } else {
      alert('Recording Failed. No devices could be recorded.');
      setRecordedBlobs({}); // Clear failed attempt
    }
  };

  const handleUploadAndGetLinks = async () => {
    if (Object.keys(recordedBlobs).length === 0) {
      return alert('No evidence has been recorded yet. Click the weather icon 3 times to start a recording.');
    }
    if (isUploading) return;
    
    setIsUploading(true);
    alert('Uploading evidence...');
    const uploadPromises = [];

    for (const [type, blob] of Object.entries(recordedBlobs)) {
        const formData = new FormData();
        const fileName = `${type}-${Date.now()}.webm`;
        formData.append('file', blob, fileName);
        
        const uploadPromise = fetch('https://file.io', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(result => result.success ? result.link : null)
            .catch(err => {
                console.error(`Upload error for ${type}:`, err);
                return null;
            });
        uploadPromises.push(uploadPromise);
    }
    
    const links = await Promise.all(uploadPromises);
    const successfulLinks = links.filter(link => link !== null);

    if (successfulLinks.length > 0) {
      alert(
        'Evidence Uploaded!\n\n' + 
        'Copy these temporary links now:\n\n' + 
        successfulLinks.join('\n')
      );
    } else {
      alert('Upload failed. Please check your network connection.');
    }

    setIsUploading(false);
    setRecordedBlobs({}); // Clear recordings after attempting upload
  };

  const getIcon = (cond) => {
    const c = cond.toLowerCase();
    if (c.includes('sun') || c.includes('clear')) return '☀️';
    if (c.includes('cloud')) return '⛅';
    if (c.includes('rain') || c.includes('storm') || c.includes('showers')) return '🌧️';
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
          {/* This is now the UPLOAD trigger */}
          <span onClick={handleUploadTrigger} style={styles.tempText} title="Click 3 times to upload evidence">
            {weather.temperature}°C
          </span>
          {/* This is now the RECORD trigger */}
          <span onClick={handleRecordTrigger} style={styles.icon} title="Click 3 times to record evidence">
            {getIcon(weather.condition)}
          </span>
        </div>
        <div>{weather.condition}</div>
        <div>Humidity: {weather.humidity}% | Wind: {weather.windSpeed} km/h</div>
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
  container: { maxWidth: 400, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif', background: 'linear-gradient(to bottom, #2c3e50, #3498db)', color: 'white', borderRadius: 15, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', minHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column' },
  header: { textAlign: 'center', marginBottom: 20 },
  main: { background: 'rgba(255,255,255,0.1)', borderRadius: 15, padding: 20, flexGrow: 1 },
  temperature: { fontSize: 48, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 },
  tempText: { fontWeight: 300, cursor: 'pointer', userSelect: 'none' },
  icon: { fontSize: 40, cursor: 'pointer', userSelect: 'none' },
  forecastHeader: { marginTop: 20, marginBottom: 10 },
  forecastItem: { display: 'flex', justifyContent: 'space-between', padding: '5px 0' },
};

export default SilentSOS;