/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PageId,
  AIStatus,
  PrivacyStatus,
  NPUStatus,
  ThreatLevel,
  AttentionState,
  HardwareTelemetry,
  ActivityLogItem
} from '../types';
import { AIProvider } from '../services/aiProviders/base';
import { DemoAIProvider } from '../services/aiProviders/demoProvider';

interface AegisContextType {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  isAirGapEnabled: boolean;
  toggleAirGap: () => void;
  setAirGap: (enabled: boolean) => void;
  aiStatus: AIStatus;
  setAiStatus: (status: AIStatus) => void;
  privacyStatus: PrivacyStatus;
  setPrivacyStatus: (status: PrivacyStatus) => void;
  npuStatus: NPUStatus;
  threatLevel: ThreatLevel;
  setThreatLevel: (level: ThreatLevel) => void;
  attentionState: AttentionState;
  setAttentionState: (state: AttentionState) => void;
  privacyLockActive: boolean;
  setPrivacyLockActive: (active: boolean) => void;
  activityLogs: ActivityLogItem[];
  addActivityLog: (
    module: ActivityLogItem['module'],
    message: string,
    severity?: ActivityLogItem['severity']
  ) => void;
  telemetry: HardwareTelemetry;
  provider: AIProvider;
  activeDemoStep: number | null;
  setActiveDemoStep: (step: number | null) => void;
  showAirGapProof: boolean;
  setShowAirGapProof: (show: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const defaultTelemetry: HardwareTelemetry = {
  npuUtilization: 78,
  cpuUtilization: 14,
  gpuUtilization: 8,
  aiLatencyMs: 23,
  powerWatts: 12.8,
  topsEfficiency: 45.0,
  memoryNpuMb: 512,
  temperatureC: 41,
  isSimulatedTelemetry: true
};

const initialLogs: ActivityLogItem[] = [
  {
    id: 'log-1',
    timestamp: '10:42:01',
    module: 'Screen Guard',
    message: 'Screen analysis active (HVX local pipeline initialized)',
    severity: 'info'
  },
  {
    id: 'log-2',
    timestamp: '10:42:03',
    module: 'Screen Guard',
    message: 'Sensitive information detected (7 CRM entities identified)',
    severity: 'warning'
  },
  {
    id: 'log-3',
    timestamp: '10:42:03',
    module: 'Screen Guard',
    message: 'PII redaction applied — zero unmasked frames exposed',
    severity: 'success'
  },
  {
    id: 'log-4',
    timestamp: '10:42:05',
    module: 'Meeting Intel',
    message: 'Meeting transcription active (Whisper-Medium local INT8 ready)',
    severity: 'info'
  },
  {
    id: 'log-5',
    timestamp: '10:42:08',
    module: 'Attention Guard',
    message: 'Privacy monitoring active — user face verified in primary viewport',
    severity: 'info'
  }
];

const AegisContext = createContext<AegisContextType | undefined>(undefined);

export const AegisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageId>('overview');
  const [isAirGapEnabled, setIsAirGapEnabled] = useState<boolean>(true); // Start air-gapped by default for privacy
  const [aiStatus, setAiStatus] = useState<AIStatus>('active');
  const [privacyStatus, setPrivacyStatus] = useState<PrivacyStatus>('protected');
  const [npuStatus] = useState<NPUStatus>('accelerating');
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('secure');
  const [attentionState, setAttentionState] = useState<AttentionState>('present');
  const [privacyLockActive, setPrivacyLockActive] = useState<boolean>(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(initialLogs);
  const [telemetry, setTelemetry] = useState<HardwareTelemetry>(defaultTelemetry);
  const [activeDemoStep, setActiveDemoStep] = useState<number | null>(null);
  const [showAirGapProof, setShowAirGapProof] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [provider] = useState<AIProvider>(() => new DemoAIProvider());

  const addActivityLog = useCallback(
    (
      module: ActivityLogItem['module'],
      message: string,
      severity: ActivityLogItem['severity'] = 'info'
    ) => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const newEntry: ActivityLogItem = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: timeStr,
        module,
        message,
        severity
      };
      setActivityLogs((prev) => [newEntry, ...prev.slice(0, 49)]); // Keep last 50
    },
    []
  );

  const toggleAirGap = useCallback(() => {
    setIsAirGapEnabled((prev) => {
      const next = !prev;
      addActivityLog(
        'Air-Gap Engine',
        next
          ? 'Air-Gap Mode ENABLED — Outbound socket connections severed. Zero cloud data transmission.'
          : 'Air-Gap Mode relaxed — Local network services unblocked.',
        next ? 'success' : 'warning'
      );
      return next;
    });
  }, [addActivityLog]);

  const setAirGap = useCallback(
    (enabled: boolean) => {
      setIsAirGapEnabled(enabled);
      addActivityLog(
        'Air-Gap Engine',
        enabled
          ? 'Air-Gap Mode confirmed ENABLED — Zero bytes outbound verified.'
          : 'Air-Gap Mode disabled by administrator.',
        enabled ? 'success' : 'warning'
      );
    },
    [addActivityLog]
  );

  // Background telemetry poller to simulate organic slight NPU fluctuations
  useEffect(() => {
    const timer = setInterval(async () => {
      const t = await provider.getHardwareTelemetry();
      setTelemetry(t);
    }, 2500);
    return () => clearInterval(timer);
  }, [provider]);

  return (
    <AegisContext.Provider
      value={{
        activePage,
        setActivePage,
        isAirGapEnabled,
        toggleAirGap,
        setAirGap,
        aiStatus,
        setAiStatus,
        privacyStatus,
        setPrivacyStatus,
        npuStatus,
        threatLevel,
        setThreatLevel,
        attentionState,
        setAttentionState,
        privacyLockActive,
        setPrivacyLockActive,
        activityLogs,
        addActivityLog,
        telemetry,
        provider,
        activeDemoStep,
        setActiveDemoStep,
        showAirGapProof,
        setShowAirGapProof,
        sidebarOpen,
        setSidebarOpen
      }}
    >
      {children}
    </AegisContext.Provider>
  );
};

export const useAegis = () => {
  const ctx = useContext(AegisContext);
  if (!ctx) {
    throw new Error('useAegis must be used within an AegisProvider');
  }
  return ctx;
};
