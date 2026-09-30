/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import {
  Sliders,
  ShieldCheck,
  Cpu,
  WifiOff,
  Bell,
  HardDrive,
  Save,
  Check,
  Laptop
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { isAirGapEnabled, toggleAirGap, addActivityLog } = useAegis();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [defaultRedactionStyle, setDefaultRedactionStyle] = useState<'blackout' | 'blur' | 'tokenize'>('blackout');
  const [enableGazeAutoLock, setEnableGazeAutoLock] = useState<boolean>(true);
  const [acceleratorBackend, setAcceleratorBackend] = useState<'htp' | 'hvx' | 'gpu_directml'>('htp');
  const [retentionPolicy, setRetentionPolicy] = useState<'ram_ephemeral' | 'isolated_session'>('ram_ephemeral');

  const handleSave = () => {
    addActivityLog('Hardware Core', 'System preferences and security thresholds updated successfully.', 'success');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              Control Panel & System Policies
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-xs font-mono text-neutral-400">Security Profile: Enterprise Hardened</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans">
            System Preferences & Security Policies
          </h1>
          <p className="text-sm text-neutral-400 font-sans mt-1">
            Configure ambient sensitivity, redaction masking defaults, hardware acceleration backends, and zero-egress firewall rules.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold tracking-wide shadow-md transition-all cursor-pointer"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'PREFERENCES SAVED' : 'SAVE PREFERENCES'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: PII Masking & Redaction Policies */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 space-y-5 shadow-md">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Screen Guard Masking Rules
            </h2>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-neutral-400">DEFAULT REDACTION STYLE</label>
              <div className="grid grid-cols-3 gap-2">
                {(['blackout', 'blur', 'tokenize'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDefaultRedactionStyle(mode)}
                    className={`py-2 px-3 rounded-lg border capitalize transition-all cursor-pointer ${
                      defaultRedactionStyle === mode
                        ? 'bg-cyan-950 border-cyan-700 text-cyan-300 font-semibold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800/80 space-y-2">
              <label className="text-neutral-400">MANDATORY REDACTED CATEGORIES</label>
              <div className="space-y-2 text-neutral-300 font-sans text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-cyan-500 rounded" />
                  <span>Payment Card Numbers (PCI-DSS Regulation)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-cyan-500 rounded" />
                  <span>Customer Personally Identifiable Info (GDPR/CCPA)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-cyan-500 rounded" />
                  <span>Bank Account Numbers & Financial Balances</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-cyan-500 rounded" />
                  <span>API Tokens, Private Keys, and Passwords</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Hardware Silicon & Accelerator */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 space-y-5 shadow-md">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Silicon Acceleration Backend
            </h2>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-neutral-400">NEURAL EXECUTION TARGET</label>
              <div className="space-y-2">
                <div
                  onClick={() => setAcceleratorBackend('htp')}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    acceleratorBackend === 'htp'
                      ? 'bg-cyan-950/40 border-cyan-700 text-cyan-300'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <div>
                    <div className="font-bold text-white">Hexagon Tensor Processor (HTP)</div>
                    <div className="text-[11px] text-neutral-400 font-sans">Primary NPU Engine · 45 TOPS INT8 execution</div>
                  </div>
                  <span className="text-[10px] bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded font-mono">
                    RECOMMENDED
                  </span>
                </div>

                <div
                  onClick={() => setAcceleratorBackend('hvx')}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    acceleratorBackend === 'hvx'
                      ? 'bg-cyan-950/40 border-cyan-700 text-cyan-300'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <div>
                    <div className="font-bold text-white">Hexagon Vector Extensions (HVX)</div>
                    <div className="text-[11px] text-neutral-400 font-sans">Optimized for spatial vision & 2D convolution filters</div>
                  </div>
                </div>

                <div
                  onClick={() => setAcceleratorBackend('gpu_directml')}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    acceleratorBackend === 'gpu_directml'
                      ? 'bg-cyan-950/40 border-cyan-700 text-cyan-300'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <div>
                    <div className="font-bold text-white">Adreno GPU (DirectML Fallback)</div>
                    <div className="text-[11px] text-neutral-400 font-sans">FP32 fallback when NPU queues are congested</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Network Air-Gap & Firewall */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 space-y-5 shadow-md">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <WifiOff className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Network Egress & Isolation
            </h2>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-lg border border-neutral-800">
              <div>
                <div className="text-white font-bold">STRICT AIR-GAP MODE</div>
                <div className="text-[11px] text-neutral-400 font-sans">Sever all TCP/UDP egress sockets</div>
              </div>
              <button
                onClick={toggleAirGap}
                className={`px-3 py-1.5 rounded text-xs font-mono font-semibold cursor-pointer ${
                  isAirGapEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {isAirGapEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="space-y-2 text-neutral-400 font-sans text-xs">
              <p>
                When Strict Air-Gap is active, Aegis Node registers a kernel-level WFP (Windows Filtering Platform) block rule preventing any process child threads from creating outbound internet connections.
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Device & Host Specifications */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 space-y-5 shadow-md">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Laptop className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Hardware Platform Profile
            </h2>
          </div>

          <div className="space-y-2.5 text-xs font-mono text-neutral-300">
            <div className="flex justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-500">Device Platform:</span>
              <span className="text-white font-medium">HP EliteBook X ARM64</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-500">Processor:</span>
              <span className="text-cyan-400">Snapdragon X Elite (X1E-84-100)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-500">NPU Architecture:</span>
              <span className="text-emerald-400">Qualcomm Hexagon (45 TOPS)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-800/60">
              <span className="text-neutral-500">Unified Memory:</span>
              <span>32 GB LPDDR5x-8448</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Operating System:</span>
              <span>Windows 11 Enterprise (Build 26100 ARM64)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
