/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DetectedPII,
  TranscriptSegment,
  MeetingSummary,
  AttentionState,
  AudioThreatAnalysis,
  HardwareTelemetry
} from '../../types';

export interface AIProvider {
  readonly id: string;
  readonly name: string;
  readonly targetPlatform: string;
  readonly isHardwareAccelerated: boolean;
  readonly isDemoProvider: boolean;

  detectPII(
    imageSource: HTMLImageElement | HTMLCanvasElement | string,
    mode?: 'sensitive_crm' | 'general_screen'
  ): Promise<DetectedPII[]>;

  transcribeMeetingAudio(
    audioSource: Blob | string,
    onSegment?: (segment: TranscriptSegment) => void
  ): Promise<{ segments: TranscriptSegment[]; summary: MeetingSummary }>;

  trackUserAttention(
    videoElement: HTMLVideoElement | null,
    manualOverride?: AttentionState | null
  ): Promise<{ state: AttentionState; confidence: number }>;

  analyzeSyntheticVoice(
    audioSource: Blob | string
  ): Promise<AudioThreatAnalysis>;

  getHardwareTelemetry(): Promise<HardwareTelemetry>;
}
