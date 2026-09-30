/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import {
  Cpu,
  Zap,
  Activity,
  Gauge,
  Thermometer,
  Layers,
  ArrowDown,
  Monitor,
  Mic,
  Camera,
  AudioWaveform,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  HardDrive
} from 'lucide-react';

export const HardwareView: React.FC = () => {
  const { telemetry } = useAegis();
  const [powerMode, setPowerMode] = useState<'burst' | 'balanced' | 'low_power'>('burst');

  // Compute profile adjustments
  const currentTelemetry = {
    npu: powerMode === 'burst' ? 88 : powerMode === 'balanced' ? 78 : 52,
    cpu: powerMode === 'burst' ? 18 : powerMode === 'balanced' ? 14 : 9,
    latency: powerMode === 'burst' ? 15 : powerMode === 'balanced' ? 23 : 36,
    power: powerMode === 'burst' ? 18.5 : powerMode === 'balanced' ? 12.8 : 7.2,
    tops: powerMode === 'burst' ? 45.0 : powerMode === 'balanced' ? 38.0 : 24.0,
    temp: powerMode === 'burst' ? 44 : powerMode === 'balanced' ? 41 : 36
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              Silicon Orchestration & NPU Engine
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-xs font-mono text-neutral-400">Target: Snapdragon X Elite / Hexagon NPU</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans">
            Snapdragon Acceleration & Heterogeneous Workloads
          </h1>
          <p className="text-sm text-neutral-400 font-sans mt-1">
            Real-time workload offloading across CPU, Adreno GPU, and Hexagon NPU to achieve zero-cloud ambient security at {currentTelemetry.power}W.
          </p>
        </div>

        {/* Demo Telemetry Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3 py-1.5 rounded-lg">
            DEMO TELEMETRY (SIMULATED)
          </span>
        </div>
      </div>

      {/* Hexagon NPU Spotlight Banner */}
      <div className="p-6 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-700/80 flex items-center justify-center text-cyan-400 shadow-inner">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white font-sans">
                    HEXAGON NPU
                  </h2>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                    ACTIVE · {currentTelemetry.tops} TOPS
                  </span>
                </div>
                <p className="text-xs font-mono text-neutral-400">
                  Hexagon Tensor Processor (HTP) & Vector eXtensions (HVX)
                </p>
              </div>
            </div>

            {/* AI Workloads List from prompt */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
              <span className="text-neutral-400">AI WORKLOADS:</span>
              {(['Vision (YOLOv8n)', 'Speech (Whisper)', 'Language (Phi-3)', 'Threat (AASIST)'] as const).map(
                (w) => (
                  <span
                    key={w}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 text-cyan-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{w}</span>
                  </span>
                )
              )}
            </div>
          </div>

          {/* Performance Profile Selector */}
          <div className="flex flex-col items-start lg:items-end gap-2 text-xs font-mono">
            <span className="text-neutral-400">QNN EP PERFORMANCE PROFILE:</span>
            <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-1">
              {(['burst', 'balanced', 'low_power'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPowerMode(mode)}
                  className={`px-3 py-1.5 rounded uppercase transition-all cursor-pointer ${
                    powerMode === mode
                      ? 'bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {mode.replace('_', ' ')}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-neutral-500 font-sans">
              Configured via QNN Execution Provider (HtpPerformanceMode)
            </span>
          </div>
        </div>
      </div>

      {/* 4 Primary Telemetry Meters Required by Prompt */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. NPU Utilization */}
        <div className="p-5 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>NPU UTILIZATION</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
              {currentTelemetry.npu}%
            </div>
            {/* Character Bar: ████████░░ */}
            <div className="text-xs tracking-widest font-mono text-cyan-400 select-none">
              {'█'.repeat(Math.round(currentTelemetry.npu / 10))}
              <span className="text-neutral-800">
                {'░'.repeat(10 - Math.round(currentTelemetry.npu / 10))}
              </span>
            </div>
          </div>

          <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${currentTelemetry.npu}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400 font-sans">Offloading all 5 neural models</p>
        </div>

        {/* 2. CPU Utilization */}
        <div className="p-5 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>CPU UTILIZATION</span>
            <Activity className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-neutral-300 tabular-nums">
              {currentTelemetry.cpu}%
            </div>
            {/* Character Bar: ██░░░░░░░░ */}
            <div className="text-xs tracking-widest font-mono text-neutral-400 select-none">
              {'█'.repeat(Math.max(1, Math.round(currentTelemetry.cpu / 10)))}
              <span className="text-neutral-800">
                {'░'.repeat(10 - Math.max(1, Math.round(currentTelemetry.cpu / 10)))}
              </span>
            </div>
          </div>

          <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
            <div
              className="bg-neutral-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${currentTelemetry.cpu}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400 font-sans">Oryon cores free for desktop apps</p>
        </div>

        {/* 3. AI Latency */}
        <div className="p-5 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>AI LATENCY</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {currentTelemetry.latency} ms
          </div>

          <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (currentTelemetry.latency / 50) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400 font-sans">Sub-frame edge inference</p>
        </div>

        {/* 4. Power Consumption */}
        <div className="p-5 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>POWER CONSUMPTION</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>

          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {currentTelemetry.power} W
          </div>

          <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(currentTelemetry.power / 35) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400 font-sans">All-day enterprise battery envelope</p>
        </div>
      </div>

      {/* Mandatory Disclaimer from Prompt */}
      <div className="p-3.5 bg-neutral-900/60 border border-neutral-800 rounded-xl text-xs text-neutral-400 font-sans leading-relaxed">
        <strong className="text-neutral-200">Hardware Telemetry Disclaimer:</strong> Prototype telemetry is simulated. Production deployment will connect these metrics to Snapdragon/Windows hardware telemetry via Qualcomm QAIRT Profiler and Windows System Diagnostics counters.
      </div>

      {/* 2-Section Grid: AI Pipeline Architecture & Hardware Acceleration Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Pipeline Visual Flowchart from Prompt (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-semibold text-neutral-200 font-mono uppercase tracking-wider">
                  AI Pipeline Workload Flow
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">Zero Cloud Boundary</span>
            </div>

            {/* 4 Pipeline Tracks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              {/* Track 1: Screen */}
              <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Monitor className="w-4 h-4" />
                  <span>SCREEN</span>
                </div>
                <div className="text-neutral-500 flex items-center justify-center">↓</div>
                <div className="text-neutral-300 font-medium text-center">Vision Model (YOLOv8n)</div>
                <div className="text-neutral-500 flex items-center justify-center">↓</div>
                <div className="text-neutral-300 font-medium text-center">PII Detection</div>
                <div className="text-neutral-500 flex items-center justify-center">↓</div>
                <div className="p-1.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-center font-bold">
                  Redaction Output
                </div>
              </div>

              {/* Track 2: Microphone */}
              <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  <Mic className="w-4 h-4" />
                  <span>MICROPHONE</span>
                </div>
                <div className="text-neutral-500 flex items-center justify-center">↓</div>
                <div className="text-neutral-300 font-medium text-center">Speech Recognition (Whisper)</div>
                <div className="text-neutral-500 flex items-center justify-center">↓</div>
                <div className="text-neutral-300 font-medium text-center">Transcript Streaming</div>
                <div className="text-neutral-500 flex items-center justify-center">↓</div>
                <div className="text-neutral-300 font-medium text-center">Language Model (Phi-3-mini)</div>
                <div className="text-neutral-500 flex items-center justify-center">↓</div>
                <div className="p-1.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-center font-bold">
                  Summary & Action Items
                </div>
              </div>

              {/* Track 3: Webcam */}
              <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <Camera className="w-4 h-4" />
                  <span>WEBCAM</span>
                </div>
                <div className="text-neutral-500 flex items-center justify-center">↓</div>
                <div className="text-neutral-300 font-medium text-center">Attention Model (EyeGaze)</div>
                <div className="text-neutral-500 flex items-center justify-center">↓</div>
                <div className="p-1.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-center font-bold">
                  Privacy Lock
                </div>
              </div>

              {/* Track 4: Audio Threat */}
              <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <AudioWaveform className="w-4 h-4" />
                  <span>AUDIO</span>
                </div>
                <div className="text-neutral-500 flex items-center justify-center">↓</div>
                <div className="text-neutral-300 font-medium text-center">Threat Detection (AASIST)</div>
                <div className="text-neutral-500 flex items-center justify-center">↓</div>
                <div className="p-1.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-center font-bold">
                  Security Alert
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Heterogeneous Hardware Acceleration Mapping from Prompt (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-semibold text-neutral-200 font-mono uppercase tracking-wider">
                  Hardware Acceleration Architecture
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">Qualcomm SoC</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* CPU */}
              <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">CPU (Qualcomm Oryon™)</span>
                  <span className="text-neutral-400">12 Cores</span>
                </div>
                <p className="text-neutral-400 font-sans">
                  Application Logic, OS Thread Scheduling, Air-Gap Firewall, and UI Rendering.
                </p>
              </div>

              {/* GPU */}
              <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">GPU (Qualcomm Adreno™)</span>
                  <span className="text-cyan-400">DirectX 12 / WebGPU</span>
                </div>
                <p className="text-neutral-400 font-sans">
                  Graphics, 4K Display Output, Frosted Glass Shader Effects, and Canvas Blurring.
                </p>
              </div>

              {/* NPU */}
              <div className="p-3.5 bg-cyan-950/30 border border-cyan-800/60 rounded-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300">NPU (Qualcomm Hexagon™)</span>
                  <span className="text-emerald-400 font-bold">{currentTelemetry.tops} TOPS</span>
                </div>
                <p className="text-neutral-300 font-sans">
                  Continuous Multimodal AI Inference: YOLOv8n, Whisper-Medium, Phi-3-mini SLM, EyeGaze, and AASIST.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800/80 text-[11px] font-sans text-neutral-400">
              Heterogeneous scheduling ensures maximum power efficiency by confining all neural graph computations to the dedicated Hexagon NPU.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
