/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId =
  | 'overview'
  | 'screenguard'
  | 'meeting'
  | 'attention'
  | 'threat'
  | 'models'
  | 'hardware'
  | 'security'
  | 'demo'
  | 'architecture'
  | 'settings';

export type AIStatus = 'active' | 'standby' | 'processing' | 'error';
export type PrivacyStatus = 'protected' | 'monitoring' | 'at_risk';
export type NetworkMode = 'offline_airgapped' | 'local_only' | 'online_degraded';
export type NPUStatus = 'accelerating' | 'standby' | 'unsupported';
export type ThreatLevel = 'secure' | 'elevated' | 'critical';

export type PIICategory =
  | 'email'
  | 'phone'
  | 'credit_card'
  | 'address'
  | 'customer_id'
  | 'financial'
  | 'auth_secret'
  | 'ssn';

export interface BoundingBox {
  x: number; // percentage 0-100 or pixel
  y: number;
  width: number;
  height: number;
}

export interface DetectedPII {
  id: string;
  category: PIICategory;
  label: string;
  rawText: string;
  maskedText: string;
  confidence: number;
  box: BoundingBox;
  redacted: boolean;
}

export interface TranscriptSegment {
  id: string;
  speaker: string;
  timestamp: string;
  text: string;
  piiMasked?: boolean;
}

export interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface MeetingSummary {
  title: string;
  duration: string;
  summaryText: string;
  keyDecisions: string[];
  topics: string[];
  actionItems: ActionItem[];
}

export type AttentionState = 'present' | 'distracted' | 'away' | 'unknown';
export type PrivacyLockState = 'unlocked' | 'locked' | 'armed';

export interface AudioThreatAnalysis {
  sampleName: string;
  authenticityScore: number; // 0-100
  syntheticArtifactsLevel: 'low' | 'medium' | 'high';
  threatStatus: 'secure' | 'review_required' | 'critical_synthetic';
  spectralAnomalies: number;
  prosodyDiscontinuity: number;
  vocalTractConsistency: number;
  verdictDescription: string;
  modelTarget: string;
  sampleDuration: string;
}

export interface HardwareTelemetry {
  npuUtilization: number;
  cpuUtilization: number;
  gpuUtilization: number;
  aiLatencyMs: number;
  powerWatts: number;
  topsEfficiency: number;
  memoryNpuMb: number;
  temperatureC: number;
  isSimulatedTelemetry: boolean;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  module: 'Screen Guard' | 'Meeting Intel' | 'Attention Guard' | 'Threat Detect' | 'Air-Gap Engine' | 'Hardware Core';
  message: string;
  severity: 'info' | 'success' | 'warning' | 'alert';
}

export interface ModelSpec {
  id: string;
  name: string;
  category: 'Vision' | 'Speech' | 'Attention' | 'Language' | 'Threat Detection';
  architecture: string;
  purpose: string;
  targetRuntime: string;
  hardwareTarget: string;
  quantization: string;
  memoryFootprint: string;
  status: 'PROTOTYPE' | 'PLANNED PRODUCTION MODEL';
  notes: string;
}
