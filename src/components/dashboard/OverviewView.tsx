/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAegis } from '../../context/AegisContext';
import {
  ShieldCheck,
  EyeOff,
  Mic,
  ScanEye,
  AudioWaveform,
  PlaySquare,
  Cpu,
  WifiOff,
  Activity,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const {
    isAirGapEnabled,
    activityLogs,
    telemetry,
    setActivePage,
    setShowAirGapProof,
    threatLevel
  } = useAegis();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              Security Operations Center
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-xs font-mono text-neutral-400">Host: HP EliteBook X ARM64</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans">
            Aegis Node Ambient Monitor
          </h1>
          <p className="text-sm text-neutral-400 font-sans mt-1">
            Continuous multimodal edge privacy & zero-egress screen protection powered by Snapdragon NPU.
          </p>
        </div>

        {/* Quick Demo CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('demo')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold font-mono tracking-wide shadow-lg shadow-cyan-950/40 transition-all cursor-pointer group"
          >
            <PlaySquare className="w-4 h-4 text-cyan-200 group-hover:scale-110 transition-transform" />
            <span>START HACKATHON DEMO (3 MIN)</span>
          </button>
        </div>
      </div>

      {/* 5 Core Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: AI Status */}
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>AI STATUS</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Active</span>
          </div>
          <p className="text-xs text-neutral-400">Local intelligence pipeline listening</p>
        </div>

        {/* Card 2: Privacy */}
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>PRIVACY</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-cyan-400">Protected</div>
          <p className="text-xs text-neutral-400">Zero cloud egress enforced</p>
        </div>

        {/* Card 3: Network */}
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>NETWORK</span>
            <WifiOff className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400">
            {isAirGapEnabled ? 'Offline Air-Gap' : 'Local Only'}
          </div>
          <button
            onClick={() => setShowAirGapProof(true)}
            className="text-xs text-neutral-400 hover:text-cyan-400 underline cursor-pointer text-left block"
          >
            Verify 0 B egress &rarr;
          </button>
        </div>

        {/* Card 4: NPU */}
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>NPU ACCELERATOR</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-blue-400">Hexagon NPU</div>
          <p className="text-xs text-neutral-400">45 TOPS / INT8 Hardware EP</p>
        </div>

        {/* Card 5: Threat Level */}
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>THREAT LEVEL</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`text-lg font-bold uppercase ${
            threatLevel === 'secure' ? 'text-emerald-400' :
            threatLevel === 'elevated' ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {threatLevel}
          </div>
          <p className="text-xs text-neutral-400">Ambient voice & gaze nominal</p>
        </div>
      </div>

      {/* Main 2-Column Split: Active Modules on Left, Live Activity Logs & Telemetry on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 4 Core Modules Fast Access (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-300 font-mono uppercase tracking-wider">
              Active Ambient Protection Modules
            </h2>
            <span className="text-xs text-neutral-500 font-mono">Multimodal Edge Pipeline</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Screen Guard Tile */}
            <div
              onClick={() => setActivePage('screenguard')}
              className="p-5 bg-neutral-900/90 border border-neutral-800 hover:border-cyan-600/60 rounded-xl transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <EyeOff className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  ACTIVE
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  Screen Guard & PII Redaction
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Real-time OCR & bounding-box blur for emails, phone numbers, credit cards, and customer IDs.
                </p>
              </div>
              <div className="flex items-center text-xs font-mono text-cyan-400 pt-1">
                <span>Inspect Screen & Redact</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Meeting Intelligence Tile */}
            <div
              onClick={() => setActivePage('meeting')}
              className="p-5 bg-neutral-900/90 border border-neutral-800 hover:border-cyan-600/60 rounded-xl transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <Mic className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  STANDBY
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  Offline Meeting Intelligence
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Whisper-Medium speech transcription paired with Phi-3-mini local SLM for action extraction.
                </p>
              </div>
              <div className="flex items-center text-xs font-mono text-cyan-400 pt-1">
                <span>Start Offline Session</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Attention Guard Tile */}
            <div
              onClick={() => setActivePage('attention')}
              className="p-5 bg-neutral-900/90 border border-neutral-800 hover:border-cyan-600/60 rounded-xl transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <ScanEye className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  ARMED
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  Attention Guard & Privacy Lock
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Gaze monitoring triggers instant frosted privacy screen whenever user attention is averted.
                </p>
              </div>
              <div className="flex items-center text-xs font-mono text-cyan-400 pt-1">
                <span>Test Attention Lock</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Threat Detection Tile */}
            <div
              onClick={() => setActivePage('threat')}
              className="p-5 bg-neutral-900/90 border border-neutral-800 hover:border-cyan-600/60 rounded-xl transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                  <AudioWaveform className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  SCANNING
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  Synthetic Voice & Deepfake Alert
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Spectrogram anomaly detection and vocal tract consistency analysis for synthesized audio.
                </p>
              </div>
              <div className="flex items-center text-xs font-mono text-cyan-400 pt-1">
                <span>Analyze Audio Stream</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Architecture Preview Kicker */}
          <div className="p-4 bg-neutral-900/60 border border-neutral-800/80 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <span className="text-white font-semibold">Snapdragon Heterogeneous Pipeline:</span>
                <span className="text-neutral-400 ml-1">
                  CPU manages application UI · GPU renders displays · Hexagon NPU processes all 5 neural models.
                </span>
              </div>
            </div>
            <button
              onClick={() => setActivePage('architecture')}
              className="text-cyan-400 hover:text-cyan-300 font-mono text-xs whitespace-nowrap ml-4 cursor-pointer"
            >
              View Pipeline &rarr;
            </button>
          </div>
        </div>

        {/* Right Column: Live Activity Feed & Hardware Telemetry (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Live Activity Stream */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <h2 className="text-xs font-semibold text-neutral-200 font-mono uppercase tracking-wider">
                  Live Security Activity
                </h2>
              </div>
              <span className="text-[11px] font-mono text-neutral-500">Real-time Local Logs</span>
            </div>

            <div className="p-4 max-h-[290px] overflow-y-auto space-y-3 font-mono text-xs">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-[11px] leading-relaxed">
                  <span className="text-neutral-500 tabular-nums shrink-0">{log.timestamp}</span>
                  <div className="flex-1">
                    <span className={`font-semibold mr-1.5 ${
                      log.severity === 'success' ? 'text-emerald-400' :
                      log.severity === 'warning' ? 'text-amber-400' :
                      log.severity === 'alert' ? 'text-rose-400' : 'text-cyan-400'
                    }`}>
                      [{log.module}]
                    </span>
                    <span className="text-neutral-300 font-sans">{log.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Snapdragon Hardware Telemetry Box */}
          <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-neutral-200 font-mono uppercase">
                  Snapdragon Telemetry
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-400/90 border border-amber-800/40 px-1.5 py-0.5 rounded bg-amber-950/30">
                DEMO TELEMETRY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg">
                <div className="text-[11px] text-neutral-500">NPU UTILIZATION</div>
                <div className="text-lg font-bold text-cyan-400 tabular-nums">
                  {telemetry.npuUtilization}%
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${telemetry.npuUtilization}%` }}
                  />
                </div>
              </div>

              <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg">
                <div className="text-[11px] text-neutral-500">CPU UTILIZATION</div>
                <div className="text-lg font-bold text-neutral-300 tabular-nums">
                  {telemetry.cpuUtilization}%
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-neutral-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${telemetry.cpuUtilization}%` }}
                  />
                </div>
              </div>

              <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg">
                <div className="text-[11px] text-neutral-500">AI INFERENCE LATENCY</div>
                <div className="text-base font-bold text-emerald-400 tabular-nums">
                  {telemetry.aiLatencyMs} ms
                </div>
                <span className="text-[10px] text-neutral-500 font-sans">Zero cloud RTT</span>
              </div>

              <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg">
                <div className="text-[11px] text-neutral-500">POWER CONSUMPTION</div>
                <div className="text-base font-bold text-emerald-400 tabular-nums">
                  {telemetry.powerWatts} W
                </div>
                <span className="text-[10px] text-neutral-500 font-sans">Low-drain NPU</span>
              </div>
            </div>

            <div className="flex items-start gap-1.5 text-[10px] text-neutral-500 pt-1 font-sans">
              <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <span>
                Prototype telemetry is simulated. Production deployment will connect these metrics to Snapdragon/Windows hardware telemetry.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
