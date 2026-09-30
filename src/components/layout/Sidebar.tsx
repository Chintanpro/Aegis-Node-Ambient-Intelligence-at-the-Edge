/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAegis } from '../../context/AegisContext';
import { PageId } from '../../types';
import {
  LayoutDashboard,
  EyeOff,
  Mic,
  ScanEye,
  AudioWaveform,
  Boxes,
  Cpu,
  ShieldAlert,
  PlaySquare,
  Network,
  Sliders
} from 'lucide-react';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'screenguard', label: 'Screen Guard', icon: EyeOff, tag: 'PII' },
  { id: 'meeting', label: 'Meeting Intel', icon: Mic, tag: 'SLM' },
  { id: 'attention', label: 'Attention Guard', icon: ScanEye },
  { id: 'threat', label: 'Threat Detection', icon: AudioWaveform, tag: 'Voice' },
  { id: 'models', label: 'AI Models', icon: Boxes },
  { id: 'hardware', label: 'Snapdragon NPU', icon: Cpu, tag: '45T' },
  { id: 'security', label: 'Security Center', icon: ShieldAlert },
  { id: 'demo', label: 'Hackathon Demo', icon: PlaySquare, tag: '3 Min' },
  { id: 'architecture', label: 'Architecture & QNN', icon: Network },
  { id: 'settings', label: 'Settings', icon: Sliders }
];

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, isAirGapEnabled, sidebarOpen, setSidebarOpen } = useAegis();

  const handleSelectPage = (page: PageId) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-neutral-950/95 border-r border-neutral-800/80 flex flex-col justify-between select-none transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 pt-16 md:pt-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="py-4 flex flex-col gap-1 px-3 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-mono tracking-wider text-neutral-500 uppercase">
            Ambient AI Defense
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectPage(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left cursor-pointer group ${
                    isActive
                      ? 'bg-neutral-800/90 text-white border border-neutral-700/80 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-cyan-400'
                          : 'text-neutral-500 group-hover:text-neutral-300'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.tag && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        isActive
                          ? 'bg-cyan-950/70 border-cyan-800/60 text-cyan-300'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom System Health Box */}
        <div className="p-3 m-3 bg-neutral-900/70 border border-neutral-800 rounded-lg text-xs font-mono">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400 font-sans text-[11px]">ARM64 Edge Isolation</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-[11px] text-neutral-400 leading-relaxed font-sans">
            {isAirGapEnabled ? (
              <span className="text-emerald-400 font-mono">✓ Air-Gap Verified (0 B egress)</span>
            ) : (
              <span className="text-amber-400 font-mono">⚠ Local Subnet Only</span>
            )}
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-800/80 text-[10px] text-neutral-400 flex items-center justify-between">
            <span>HP PC / Snapdragon X</span>
            <span className="text-cyan-400 font-semibold">HTP v73</span>
          </div>
        </div>
      </aside>
    </>
  );
};
