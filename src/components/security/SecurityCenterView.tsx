/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAegis } from '../../context/AegisContext';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  WifiOff,
  ArrowRight,
  HardDrive,
  FileCheck2,
  CheckCircle2,
  Eye,
  Mic,
  ServerOff,
  Database
} from 'lucide-react';

export const SecurityCenterView: React.FC = () => {
  const { isAirGapEnabled, setShowAirGapProof } = useAegis();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              Privacy Architecture & Trust Verification
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-xs font-mono text-neutral-400">Security Invariant: Zero Cloud Egress</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans">
            Security Center & Local Data Flow
          </h1>
          <p className="text-sm text-neutral-400 font-sans mt-1">
            Cryptographic proof and architectural guarantees that screen captures, audio buffers, and gaze tensors never leave your device.
          </p>
        </div>

        {/* Air-gap proof audit link */}
        <button
          onClick={() => setShowAirGapProof(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-emerald-600 text-xs font-mono text-emerald-400 cursor-pointer shadow-sm"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Launch Cryptographic Proof Audit</span>
        </button>
      </div>

      {/* Global Data Flow Architecture from Prompt */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Primary Data Flow Pipeline
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-500">Host Memory Boundary</span>
        </div>

        {/* Linear Block Flow from Prompt:
            USER DATA -> LOCAL PROCESSING -> AI INFERENCE -> SECURITY FILTER -> LOCAL OUTPUT */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-center space-y-1">
            <div className="text-neutral-500 uppercase text-[10px]">Step 01</div>
            <div className="text-white font-bold text-sm">USER DATA</div>
            <p className="text-[11px] text-neutral-400 font-sans">Screen / Mic / Cam</p>
          </div>

          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-center space-y-1">
            <div className="text-cyan-400 uppercase text-[10px]">Step 02</div>
            <div className="text-white font-bold text-sm">LOCAL PROCESSING</div>
            <p className="text-[11px] text-neutral-400 font-sans">In-Memory Buffers</p>
          </div>

          <div className="p-4 bg-cyan-950/40 border border-cyan-800 rounded-xl text-center space-y-1">
            <div className="text-cyan-300 uppercase text-[10px]">Step 03</div>
            <div className="text-cyan-300 font-bold text-sm">AI INFERENCE</div>
            <p className="text-[11px] text-neutral-300 font-sans">Snapdragon Hexagon NPU</p>
          </div>

          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-center space-y-1">
            <div className="text-emerald-400 uppercase text-[10px]">Step 04</div>
            <div className="text-white font-bold text-sm">SECURITY FILTER</div>
            <p className="text-[11px] text-neutral-400 font-sans">PII Masking & Blackout</p>
          </div>

          <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-xl text-center space-y-1">
            <div className="text-emerald-300 uppercase text-[10px]">Step 05</div>
            <div className="text-emerald-300 font-bold text-sm">LOCAL OUTPUT</div>
            <p className="text-[11px] text-neutral-300 font-sans">Sanitized Display & UI</p>
          </div>
        </div>

        <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-sans text-neutral-400 leading-relaxed">
          <strong className="text-neutral-200">Non-Negotiable Guarantee:</strong> No raw pixels, audio waveform samples, or camera video frames are ever uploaded to cloud endpoints or persisted to long-term disk storage.
        </div>
      </div>

      {/* Multimodal Granular Data Flows from Prompt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Track 1: Raw Screen Data Flow */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Eye className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-semibold text-neutral-200 font-mono uppercase tracking-wider">
              Screen Data Lifecycle
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="text-neutral-500">1.</span>
              <span className="text-white">Raw Screen Data</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-600 ml-auto" />
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="text-cyan-400">2.</span>
              <span className="text-white">Temporary Processing (RAM Ring Buffer)</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-600 ml-auto" />
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="text-cyan-400">3.</span>
              <span className="text-white">AI Detection (YOLOv8n + FastOCR on NPU)</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-600 ml-auto" />
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="text-emerald-400">4.</span>
              <span className="text-white">Redaction Layer Applied (Blackout/Blur)</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-600 ml-auto" />
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-emerald-950/50 rounded-lg border border-emerald-800/80">
              <span className="text-emerald-400">5.</span>
              <span className="text-emerald-300 font-bold">Secure Output (Zero Unmasked Pixels)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />
            </div>
          </div>
        </div>

        {/* Track 2: Audio Stream Lifecycle */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Mic className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-semibold text-neutral-200 font-mono uppercase tracking-wider">
              Audio Stream Lifecycle
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="text-neutral-500">1.</span>
              <span className="text-white">Microphone Audio</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-600 ml-auto" />
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="text-cyan-400">2.</span>
              <span className="text-white">Temporary Processing (Circular PCM FIFO)</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-600 ml-auto" />
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="text-cyan-400">3.</span>
              <span className="text-white">Whisper-Medium Transcription (INT8)</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-600 ml-auto" />
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="text-blue-400">4.</span>
              <span className="text-white">Phi-3-mini Local Reasoning & Summarization</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-600 ml-auto" />
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-emerald-950/50 rounded-lg border border-emerald-800/80">
              <span className="text-emerald-400">5.</span>
              <span className="text-emerald-300 font-bold">Local Summary & Action Items Saved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Architectural Invariants Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
          <div className="text-cyan-400 font-bold flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>ZERO CLOUD EGRESS</span>
          </div>
          <p className="text-neutral-400 font-sans leading-relaxed">
            Inference executes completely offline. No third-party API keys or remote telemetry servers required.
          </p>
        </div>

        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
          <div className="text-cyan-400 font-bold flex items-center gap-2">
            <ServerOff className="w-4 h-4" />
            <span>EPHEMERAL BUFFERS</span>
          </div>
          <p className="text-neutral-400 font-sans leading-relaxed">
            Screen captures and audio PCM arrays are held in RAM ring buffers and flushed as soon as classification ends.
          </p>
        </div>

        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
          <div className="text-cyan-400 font-bold flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>PHYSICAL AIR-GAP</span>
          </div>
          <p className="text-neutral-400 font-sans leading-relaxed">
            Demonstrable with Wi-Fi disabled or ethernet cable unplugged during live presentation audits.
          </p>
        </div>

        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
          <div className="text-cyan-400 font-bold flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>ISOLATED TENANCY</span>
          </div>
          <p className="text-neutral-400 font-sans leading-relaxed">
            Enterprise CRM data never leaves the local process memory space, complying with PCI-DSS & GDPR regulations.
          </p>
        </div>
      </div>
    </div>
  );
};
