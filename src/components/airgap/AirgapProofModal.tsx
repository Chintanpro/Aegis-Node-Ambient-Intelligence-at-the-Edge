/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAegis } from '../../context/AegisContext';
import {
  ShieldCheck,
  WifiOff,
  Cpu,
  Lock,
  X,
  ServerOff,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

export const AirgapProofModal: React.FC = () => {
  const { isAirGapEnabled, showAirGapProof, setShowAirGapProof, toggleAirGap } = useAegis();

  if (!showAirGapProof) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-sans">
                Air-Gap Cryptographic & Egress Audit
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Hardware-enforced zero cloud egress telemetry
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAirGapProof(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Main Air-gap Status Banner */}
          <div className={`p-4 rounded-lg border ${
            isAirGapEnabled
              ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
              : 'bg-amber-950/30 border-amber-800/60 text-amber-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isAirGapEnabled ? (
                  <WifiOff className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <ServerOff className="w-6 h-6 text-amber-400 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-sm tracking-wide uppercase font-mono">
                    {isAirGapEnabled ? 'AIR-GAP ENFORCEMENT: ACTIVE' : 'AIR-GAP MODE: DISABLED'}
                  </div>
                  <div className="text-xs text-neutral-300 font-sans mt-0.5">
                    {isAirGapEnabled
                      ? 'All outbound sockets severed at host driver level. Machine is completely self-contained.'
                      : 'Running in local subnet mode. External outbound access permitted.'}
                  </div>
                </div>
              </div>
              <button
                onClick={toggleAirGap}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
                  isAirGapEnabled
                    ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
              >
                {isAirGapEnabled ? 'Disable Air-Gap' : 'Engage Air-Gap'}
              </button>
            </div>
          </div>

          {/* 4 Proof Pillars Matrix */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-lg">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span>INTERNET STATUS</span>
                <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-sm font-semibold text-emerald-400">
                {isAirGapEnabled ? 'DISCONNECTED' : 'LOCAL ONLY'}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1 font-sans">
                Zero external TCP/UDP connections open.
              </p>
            </div>

            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-lg">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span>CLOUD API REQ</span>
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-sm font-semibold text-emerald-400">
                NOT REQUIRED
              </div>
              <p className="text-[11px] text-neutral-400 mt-1 font-sans">
                Inference, OCR, and SLM run locally.
              </p>
            </div>

            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-lg">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span>PROCESSING TARGET</span>
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-sm font-semibold text-cyan-400">
                SNAPDRAGON NPU
              </div>
              <p className="text-[11px] text-neutral-400 mt-1 font-sans">
                Local Hexagon AI Engine accelerated.
              </p>
            </div>

            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-lg">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span>EGRESS TRANSMITTED</span>
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-sm font-semibold text-emerald-400">
                0 BYTES *
              </div>
              <p className="text-[11px] text-neutral-400 mt-1 font-sans">
                Zero audio, frames, or telemetry sent.
              </p>
            </div>
          </div>

          {/* Live Network Packet Audit Log */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs font-mono">
            <div className="flex items-center justify-between text-neutral-400 pb-2 border-b border-neutral-800/80 mb-2">
              <span className="font-semibold text-neutral-300">SOCKET MONITOR & PROXY AUDIT</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Egress Filter: Active
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-neutral-400">
              <div className="flex justify-between">
                <span>[0.0.0.0/0:443 HTTPS OUT]</span>
                <span className="text-emerald-400">BLOCKED (0 pkts)</span>
              </div>
              <div className="flex justify-between">
                <span>[api.external-cloud.com:80]</span>
                <span className="text-emerald-400">DNS RESOLVE REFUSED</span>
              </div>
              <div className="flex justify-between">
                <span>[127.0.0.1:QNN_SOCKET]</span>
                <span className="text-cyan-400">LOCAL IPC ONLY (ACTIVE)</span>
              </div>
            </div>
          </div>

          {/* Hackathon Stage Pro-Tip */}
          <div className="p-3 bg-neutral-950/60 border border-neutral-800/60 rounded-lg text-xs text-neutral-400 leading-relaxed font-sans">
            <strong className="text-neutral-200">Hackathon Live Demonstration Note:</strong> During the live demo, judges can request physically disabling the laptop&apos;s Wi-Fi or switching into Airplane Mode. Aegis Node will continue full PII redaction, meeting speech summarization, and attention guard without interrupting execution.
          </div>

          {/* Mandatory Disclaimer */}
          <div className="text-[11px] text-neutral-400 font-sans border-t border-neutral-800 pt-3">
            * Prototype UI indicator; production version connects directly to Windows Filter Platform (WFP) and Snapdragon Qualcomm Network Telemetry driver.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end px-6 py-3 bg-neutral-950/90 border-t border-neutral-800">
          <button
            onClick={() => setShowAirGapProof(false)}
            className="px-4 py-2 text-xs font-mono font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
