/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAegis } from '../../context/AegisContext';
import { Shield, Wifi, WifiOff, FileCheck2, Cpu, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activePage,
    isAirGapEnabled,
    toggleAirGap,
    setShowAirGapProof,
    setActivePage,
    sidebarOpen,
    setSidebarOpen
  } = useAegis();

  const getPageTitle = () => {
    switch (activePage) {
      case 'overview':
        return 'System Overview & SOC Monitor';
      case 'screenguard':
        return 'Screen Guard — Real-Time PII Redaction';
      case 'meeting':
        return 'Meeting Intelligence — Offline SLM Summarization';
      case 'attention':
        return 'Attention Guard — Local Privacy Lock';
      case 'threat':
        return 'Threat Detection — Synthetic Voice & Deepfake Alert';
      case 'models':
        return 'Local AI Model Center — QNN Stack';
      case 'hardware':
        return 'Snapdragon Acceleration — Hexagon NPU';
      case 'security':
        return 'Security Architecture — Zero Egress Dataflow';
      case 'demo':
        return 'Hackathon Demo — 3-Minute Guided Walkthrough';
      case 'architecture':
        return 'Technical Architecture & QNN Migration';
      case 'settings':
        return 'System Preferences & Redaction Policies';
      default:
        return 'Control Panel';
    }
  };

  return (
    <header className="h-16 bg-neutral-950 border-b border-neutral-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Zone 1: Wordmark & Brand Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
          title="Toggle Navigation"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div
          onClick={() => setActivePage('overview')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/80 transition-colors shadow-inner">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                Aegis Node
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/90 border border-cyan-800/40 rounded px-1.5 py-0.2 bg-cyan-950/40">
                Snapdragon Edge AI
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-sans tracking-wide">
              Ambient Intelligence at the Edge · HP Enterprise
            </p>
          </div>
        </div>

        <div className="hidden lg:block h-6 w-px bg-neutral-800 mx-2" aria-hidden="true" />

        {/* Current Module Breadcrumb */}
        <div className="hidden lg:flex items-center text-xs text-neutral-300 font-medium">
          <span className="text-neutral-500">Security Suite</span>
          <span className="mx-2 text-neutral-600">/</span>
          <span className="text-neutral-200">{getPageTitle()}</span>
        </div>
      </div>

      {/* Zone 3: Primary Actions (Air-Gap Toggle, Proof Trigger, Hardware Tag) */}
      <div className="flex items-center gap-3">
        {/* Air-Gap Verification Proof Modal Button */}
        <button
          onClick={() => setShowAirGapProof(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md bg-neutral-900 border border-neutral-700/80 text-neutral-300 hover:text-white hover:border-neutral-600 transition-all cursor-pointer shadow-sm"
          title="Audit Zero-Egress Network Isolation"
        >
          <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Air-Gap Proof</span>
        </button>

        {/* Big Air-Gap Mode Control Switch */}
        <div className="flex items-center bg-neutral-900/90 border border-neutral-700/80 rounded-lg p-1">
          <button
            onClick={toggleAirGap}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold font-mono transition-all cursor-pointer ${
              isAirGapEnabled
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {isAirGapEnabled ? (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>AIR-GAP: ON</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span>AIR-GAP: OFF</span>
              </>
            )}
          </button>
        </div>

        {/* Snapdragon Badge */}
        <div
          onClick={() => setActivePage('hardware')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:border-neutral-700 transition-colors cursor-pointer"
          title="Inspect Qualcomm Hexagon NPU status"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-mono font-medium">Hexagon NPU</span>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
        </div>

        {/* Profile Avatar */}
        <div
          onClick={() => setActivePage('settings')}
          className="flex items-center gap-2 pl-1 cursor-pointer"
          title="Account: Alex Morgan (Local Security Admin)"
        >
          <img
            src="/src/assets/images/executive_user_portrait_1790706226482.jpg"
            alt="Security Administrator"
            className="w-8 h-8 rounded-full border border-neutral-700 object-cover"
          />
        </div>
      </div>
    </header>
  );
};
