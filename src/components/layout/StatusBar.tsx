/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAegis } from '../../context/AegisContext';
import { ShieldCheck, Cpu, WifiOff, Activity, AlertTriangle } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const { isAirGapEnabled, npuStatus, threatLevel, setShowAirGapProof } = useAegis();

  return (
    <div className="bg-neutral-900/90 border-b border-neutral-800/80 px-6 py-2.5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-6">
          {/* AI Status */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-medium font-sans">AI STATUS</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Local Intelligence Active</span>
            </div>
          </div>

          <span className="text-neutral-700 hidden sm:inline" aria-hidden="true">|</span>

          {/* Privacy */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-medium font-sans">PRIVACY</span>
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Protected (Zero Egress)</span>
            </div>
          </div>

          <span className="text-neutral-700 hidden sm:inline" aria-hidden="true">|</span>

          {/* Network */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-medium font-sans">NETWORK</span>
            <button
              onClick={() => setShowAirGapProof(true)}
              title="Click to view air-gap cryptographic verification"
              className="flex items-center gap-1.5 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>{isAirGapEnabled ? 'Air-Gap / Offline Mode' : 'Local-Only Subnet'}</span>
              <span className="text-[10px] text-neutral-500 underline font-sans ml-1">Verify</span>
            </button>
          </div>

          <span className="text-neutral-700 hidden md:inline" aria-hidden="true">|</span>

          {/* NPU */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-medium font-sans">NPU</span>
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Snapdragon Hexagon {npuStatus === 'accelerating' ? 'Accelerating (45 TOPS)' : 'Active'}</span>
            </div>
          </div>

          <span className="text-neutral-700 hidden lg:inline" aria-hidden="true">|</span>

          {/* Threat Level */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-medium font-sans">THREAT LEVEL</span>
            <div className={`flex items-center gap-1.5 font-semibold ${
              threatLevel === 'secure' ? 'text-emerald-400' :
              threatLevel === 'elevated' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {threatLevel === 'secure' ? (
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              <span className="uppercase">{threatLevel}</span>
            </div>
          </div>
        </div>

        {/* Local Verification Tag */}
        <div className="hidden xl:flex items-center gap-2 text-neutral-500 text-[11px]">
          <span>HP PC Hardware Security Layer</span>
          <span>·</span>
          <span>ARM64 Architecture</span>
        </div>
      </div>
    </div>
  );
};
