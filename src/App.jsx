import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './components/Tabs/Dashboard';
import PreventScreen from './components/Tabs/PreventScreen';
import DetectScreen from './components/Tabs/DetectScreen';
import ReportScreen from './components/Tabs/ReportScreen';
import SupportScreen from './components/Tabs/SupportScreen';

import InAppWarnings from './components/InAppWarnings';
import DigitalWatermarking from './components/DigitalWatermarking';
import DeepfakeDetection from './components/DeepfakeDetection';
import ImageScanning from './components/ImageScanning';
import LegalChatbot from './components/LegalChatbot';
import KnowYourRightsHub from './components/KnowYourRightsHub';
import LegalComplaints from './components/LegalComplaints';
import TakeDownRequests from './components/TakeDownRequests';
import HarassmentDetector from './components/HarrasmentDetector';
import EmotionalSupport from './components/EmotionalSupport';
import SilentSOS from './components/SilentSOS';
import LegalSupportScreen from './components/LegalSupportScreen'; 
import MentalHealth from './components/MentalHealth';
import AnonymousReporting from './components/AnonymousReporting';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/prevent" element={<PreventScreen />} />
        <Route path="/detect" element={<DetectScreen />} />
        <Route path="/report" element={<ReportScreen />} />
        <Route path="/support" element={<SupportScreen />} />

        <Route path="/anonymous" element={<AnonymousReporting/>} />
        <Route path="/InAppWarnings" element={<InAppWarnings />} />
        <Route path="/DigitalWatermarking" element={<DigitalWatermarking />} />
        <Route path="/DeepfakeDetection" element={<DeepfakeDetection />} />
        <Route path="/ImageScanning" element={<ImageScanning />} />
        <Route path="/LegalChatbot" element={<LegalChatbot />} />
        <Route path="/KnowYourRightsHub" element={<KnowYourRightsHub />} />
        <Route path="/LegalComplaints" element={<LegalComplaints />} />
        <Route path="/TakeDownRequests" element={<TakeDownRequests />} />
        <Route path="/mentalhealth" element={<MentalHealth/>}/>
        <Route path="/emotionalsupport" element={<EmotionalSupport/>}/>
        <Route path="/harassment" element={<HarassmentDetector/>}/>
        <Route path="/sos" element={<SilentSOS/>}/>
        <Route path="/legal" element={<LegalSupportScreen />} />
      </Routes>
    </Router>
  );
}

export default App;

