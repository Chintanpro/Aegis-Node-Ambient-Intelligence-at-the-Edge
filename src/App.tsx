/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AegisProvider, useAegis } from './context/AegisContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { StatusBar } from './components/layout/StatusBar';
import { OverviewView } from './components/dashboard/OverviewView';
import { ScreenGuardView } from './components/screenGuard/ScreenGuardView';
import { MeetingView } from './components/meeting/MeetingView';
import { AttentionGuardView } from './components/attention/AttentionGuardView';
import { ThreatDetectionView } from './components/threat/ThreatDetectionView';
import { HardwareView } from './components/hardware/HardwareView';
import { AIModelsView } from './components/models/AIModelsView';
import { SecurityCenterView } from './components/security/SecurityCenterView';
import { HackathonDemoView } from './components/demo/HackathonDemoView';
import { ArchitectureView } from './components/architecture/ArchitectureView';
import { SettingsView } from './components/settings/SettingsView';
import { AirgapProofModal } from './components/airgap/AirgapProofModal';
import { AlertOctagon, ScanEye, Unlock } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activePage, privacyLockActive, setPrivacyLockActive, setAttentionState } = useAegis();

  const renderActiveView = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewView />;
      case 'screenguard':
        return <ScreenGuardView />;
      case 'meeting':
        return <MeetingView />;
      case 'attention':
        return <AttentionGuardView />;
      case 'threat':
        return <ThreatDetectionView />;
      case 'hardware':
        return <HardwareView />;
      case 'models':
        return <AIModelsView />;
      case 'security':
        return <SecurityCenterView />;
      case 'demo':
        return <HackathonDemoView />;
      case 'architecture':
        return <ArchitectureView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  const handleUnlockGaze = () => {
    setPrivacyLockActive(false);
    setAttentionState('present');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-neutral-950 overflow-y-auto relative">
      {/* Global Privacy Lock Overlay when Attention Lost */}
      {privacyLockActive && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-700 flex items-center justify-center text-rose-400 mb-4 animate-bounce">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold font-mono tracking-tight text-white uppercase">
            ATTENTION LOST · PRIVACY LOCK ACTIVATED
          </h2>

          <p className="text-sm text-neutral-300 font-sans max-w-md mt-2 leading-relaxed">
            EyeGaze model detected authorized user looking away or stepping out of range. Screen contents are obfuscated to prevent shoulder surfing.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleUnlockGaze}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold shadow-lg shadow-emerald-950/50 cursor-pointer transition-all"
            >
              <Unlock className="w-4 h-4" />
              <span>VERIFY GAZE & UNLOCK SCREEN</span>
            </button>
          </div>

          <div className="mt-8 text-xs font-mono text-neutral-500">
            Qualcomm Hexagon Sensor Hub · Instant &lt; 20ms Hardware Blackout
          </div>
        </div>
      )}

      {renderActiveView()}
    </div>
  );
};

export default function App() {
  return (
    <AegisProvider>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Top Header */}
        <Header />

        {/* Status Bar */}
        <StatusBar />

        {/* Main Work Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Sidebar */}
          <Sidebar />

          {/* Dynamic Viewport */}
          <MainContent />
        </div>

        {/* Global Modals */}
        <AirgapProofModal />
      </div>
    </AegisProvider>
  );
}
