import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './components/Tabs/Dashboard';
import PreventScreen from './components/Tabs/PreventScreen';
import DetectScreen from './components/Tabs/DetectScreen';
import ReportScreen from './components/Tabs/ReportScreen';
import SupportScreen from './components/Tabs/SupportScreen';
import Index from './components/Tabs/Index';
import Welcome from './components/Tabs/Welcome';
import SignIn from './components/Tabs/SignIn';

import InAppWarnings from './components/InAppWarnings';
import DigitalWatermarking from './components/DigitalWatermarking';
import DeepfakeDetector from './components/DeepfakeDetector';
import ImageScanning from './components/ImageScanning';
import LegalChatInterface from './components/LegalChatInterface';
import KnowYourRightsHub from './components/KnowYourRightsHub';
import LegalComplaints from './components/LegalComplaints';
import TakeDownRequests from './components/TakeDownRequests';
import HarassmentDetector from './components/HarrasmentDetector';
import EmotionalSupport from './components/EmotionalSupport';
import SilentSOS from './components/SilentSOS';
import LegalSupportScreen from './components/LegalSupportScreen'; 
import MentalHealth from './components/MentalHealth';
import AnonymousReporting from './components/AnonymousReporting';

import RightsDetail from "./components/RightsDetail";
import RealStories from "./components/RealStories";
import LegalTips from "./components/LegalTips";
import AwarenessCampaigns from "./components/AwarenessCampaigns";
import LawyerDirectory from "./components/LawyerDirectory";
import NotFound from './components/Tabs/NotFound';

function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/prevent" element={<PreventScreen />} />
        <Route path="/detect" element={<DetectScreen />} />
        <Route path="/report" element={<ReportScreen />} />
        <Route path="/support" element={<SupportScreen />} />

        <Route path="/InAppWarnings" element={<InAppWarnings />} />
        <Route path="/DigitalWatermarking" element={<DigitalWatermarking />} />
        <Route path="/DeepfakeDetector" element={<DeepfakeDetector />} />
        <Route path="/ImageScanning" element={<ImageScanning />} />
        <Route path="/LegalChatInterface" element={<LegalChatInterface />} />
        <Route path="/LegalComplaints" element={<LegalComplaints />} />
        <Route path="/TakeDownRequests" element={<TakeDownRequests />} />
        <Route path="/mentalhealth" element={<MentalHealth />} />
        <Route path="/emotionalsupport" element={<EmotionalSupport />} />
        <Route path="/harassment" element={<HarassmentDetector />} />
        <Route path="/sos" element={<SilentSOS />} />
        <Route path="/anonymous" element={<AnonymousReporting />} />
        <Route path="/legal" element={<LegalSupportScreen />} />

        <Route path="/KnowYourRightsHub" element={<KnowYourRightsHub />} />
        <Route path="/rights" element={<KnowYourRightsHub />} /> 
        <Route path="/rights/:section" element={<RightsDetail />} />
        <Route path="/know-your-rights/real-stories" element={<RealStories />} />
        <Route path="/know-your-rights/legal-tips" element={<LegalTips />} />
        <Route path="/know-your-rights/awareness-campaigns" element={<AwarenessCampaigns />} />
        <Route path="/directory" element={<LawyerDirectory />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
