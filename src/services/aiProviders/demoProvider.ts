/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AIProvider
} from './base';
import {
  DetectedPII,
  TranscriptSegment,
  MeetingSummary,
  AttentionState,
  AudioThreatAnalysis,
  HardwareTelemetry
} from '../../types';

export const SAMPLE_CRM_PII_REGIONS: DetectedPII[] = [
  {
    id: 'pii-1',
    category: 'customer_id',
    label: 'Customer ID',
    rawText: 'ACC-482913',
    maskedText: 'ACC-••••••',
    confidence: 0.98,
    box: { x: 18, y: 15, width: 22, height: 5 },
    redacted: true
  },
  {
    id: 'pii-2',
    category: 'email',
    label: 'Email Address',
    rawText: 'alex.morgan@example.com',
    maskedText: 'a•••••••••••@example.com',
    confidence: 0.99,
    box: { x: 18, y: 22, width: 34, height: 5 },
    redacted: true
  },
  {
    id: 'pii-3',
    category: 'phone',
    label: 'Phone Number',
    rawText: '+1 555 018 2934',
    maskedText: '+1 555 ••• ••••',
    confidence: 0.96,
    box: { x: 18, y: 29, width: 24, height: 5 },
    redacted: true
  },
  {
    id: 'pii-4',
    category: 'address',
    label: 'Billing Address',
    rawText: '742 Evergreen Terrace, Springfield, OR',
    maskedText: '•••••••••••••••••••••••••••••••••••••',
    confidence: 0.94,
    box: { x: 18, y: 36, width: 44, height: 6 },
    redacted: true
  },
  {
    id: 'pii-5',
    category: 'credit_card',
    label: 'Payment Card Number',
    rawText: '4111 1111 1111 1111',
    maskedText: '•••• •••• •••• 1111',
    confidence: 0.99,
    box: { x: 62, y: 22, width: 32, height: 5.5 },
    redacted: true
  },
  {
    id: 'pii-6',
    category: 'financial',
    label: 'Account Balance',
    rawText: '$84,250.00 USD',
    maskedText: '$••,•••.•• USD',
    confidence: 0.95,
    box: { x: 62, y: 31, width: 25, height: 6 },
    redacted: true
  },
  {
    id: 'pii-7',
    category: 'ssn',
    label: 'Tax Identification Number',
    rawText: '984-02-XXXX',
    maskedText: '•••-••-••••',
    confidence: 0.97,
    box: { x: 62, y: 39, width: 20, height: 5 },
    redacted: true
  }
];

export const SAMPLE_MEETING_SCRIPTS: {
  id: string;
  title: string;
  segments: TranscriptSegment[];
  summary: MeetingSummary;
}[] = [
  {
    id: 'customer-migration',
    title: 'Executive Customer Migration & Air-Gap Compliance Sync',
    segments: [
      {
        id: 'seg-1',
        speaker: 'Sarah Chen (Security Lead)',
        timestamp: '00:03',
        text: "Good morning team. Let's finalize the customer migration plan by Friday as mandated by regional compliance."
      },
      {
        id: 'seg-2',
        speaker: 'Alex Morgan (Solutions Architect)',
        timestamp: '00:09',
        text: 'Agreed. All CRM records including account ACC-482913 and financial balances must be scrubbed through Aegis Node screen redaction before screen sharing.'
      },
      {
        id: 'seg-3',
        speaker: 'Marcus Vance (VP Infrastructure)',
        timestamp: '00:18',
        text: 'The Snapdragon Hexagon NPU offloading is working flawlessly on our HP EliteBook test fleet. We are seeing zero egress traffic.'
      },
      {
        id: 'seg-4',
        speaker: 'Sarah Chen (Security Lead)',
        timestamp: '00:25',
        text: "Action item for Sarah: Send updated timeline to stakeholders and coordinate penetration testing for local QNN endpoints."
      },
      {
        id: 'seg-5',
        speaker: 'Alex Morgan (Solutions Architect)',
        timestamp: '00:32',
        text: 'I will finalize the migration checklist and verify air-gap enforcement with the IT security board by 3 PM Thursday.'
      }
    ],
    summary: {
      title: 'Executive Customer Migration & Air-Gap Compliance Sync',
      duration: '34s (Demo Session)',
      summaryText: 'Migration plan needs to be finalized by Friday. The team confirmed that Aegis Node local screen redaction and Snapdragon NPU speech recognition operate with verified air-gap isolation.',
      keyDecisions: [
        'Mandate real-time PII redaction on all customer CRM review calls',
        'Deploy Snapdragon Hexagon NPU acceleration across corporate HP fleet',
        'Enforce offline air-gap mode for high-clearance meetings'
      ],
      topics: ['Customer Migration', 'Air-Gap Isolation', 'Snapdragon NPU Offload', 'PII Masking'],
      actionItems: [
        {
          id: 'act-1',
          text: 'Finalize customer migration plan and validation checklist',
          assignee: 'Alex Morgan',
          completed: false,
          priority: 'high'
        },
        {
          id: 'act-2',
          text: 'Review security requirements and verify zero egress ports',
          assignee: 'Sarah Chen',
          completed: true,
          priority: 'high'
        },
        {
          id: 'act-3',
          text: 'Send updated timeline and test results to enterprise stakeholders',
          assignee: 'Sarah Chen',
          completed: false,
          priority: 'medium'
        },
        {
          id: 'act-4',
          text: 'Benchmark local Whisper-Medium latency on Snapdragon X Elite NPU',
          assignee: 'Marcus Vance',
          completed: false,
          priority: 'low'
        }
      ]
    }
  },
  {
    id: 'financial-review',
    title: 'Q4 Budget & Hardware Procurement Review',
    segments: [
      {
        id: 'seg-b1',
        speaker: 'Elena Rostova (CFO)',
        timestamp: '00:02',
        text: 'Starting the procurement review. We have budgeted 500 Snapdragon-powered HP PCs with dedicated NPUs.'
      },
      {
        id: 'seg-b2',
        speaker: 'David Kim (Head of IT)',
        timestamp: '00:10',
        text: 'The power savings on battery are substantial: 12.8 Watts continuous under full multimodal AI inference.'
      },
      {
        id: 'seg-b3',
        speaker: 'Elena Rostova (CFO)',
        timestamp: '00:17',
        text: 'Approve the rollout. David, please finalize the hardware vendor contracts by Monday morning.'
      }
    ],
    summary: {
      title: 'Q4 Budget & Hardware Procurement Review',
      duration: '22s (Demo Session)',
      summaryText: 'Approved fleet rollout of 500 Snapdragon-powered HP PCs utilizing Hexagon NPU acceleration for enterprise ambient privacy.',
      keyDecisions: [
        'Fleet upgrade approved for Q4',
        'Enterprise battery consumption benchmark confirmed at 12.8W'
      ],
      topics: ['Procurement', 'Hardware Rollout', 'NPU Power Efficiency'],
      actionItems: [
        {
          id: 'act-b1',
          text: 'Finalize hardware vendor contracts with HP Enterprise',
          assignee: 'David Kim',
          completed: false,
          priority: 'high'
        },
        {
          id: 'act-b2',
          text: 'Issue purchase order for Snapdragon X Elite units',
          assignee: 'Elena Rostova',
          completed: false,
          priority: 'medium'
        }
      ]
    }
  }
];

export const AUDIO_THREAT_SAMPLES: Record<string, AudioThreatAnalysis> = {
  'legit-executive': {
    sampleName: 'Executive Voice Memo (Authentic Human)',
    sampleDuration: '00:08',
    authenticityScore: 94,
    syntheticArtifactsLevel: 'low',
    threatStatus: 'secure',
    spectralAnomalies: 4.2,
    prosodyDiscontinuity: 3.8,
    vocalTractConsistency: 96.5,
    verdictDescription: 'Natural glottal pulse train observed. Organic breath transitions and pitch jitter within biological human vocal cords parameters.',
    modelTarget: 'Audio-AASIST-V2 (Hexagon NPU INT8)'
  },
  'deepfake-cloned': {
    sampleName: 'Synthetic CEO Voicemail (Cloned AI Voice)',
    sampleDuration: '00:12',
    authenticityScore: 18,
    syntheticArtifactsLevel: 'high',
    threatStatus: 'critical_synthetic',
    spectralAnomalies: 88.4,
    prosodyDiscontinuity: 79.2,
    vocalTractConsistency: 22.1,
    verdictDescription: 'CRITICAL ANOMALY: High-frequency phase mismatch detected above 4.8 kHz typical of vocoder inversion algorithms (DiffSinger/HiFi-GAN). Artificial harmonic alignment.',
    modelTarget: 'Audio-AASIST-V2 (Hexagon NPU INT8)'
  },
  'dubbed-urgent': {
    sampleName: 'Wire Transfer Authorization (Suspicious Dub)',
    sampleDuration: '00:09',
    authenticityScore: 48,
    syntheticArtifactsLevel: 'medium',
    threatStatus: 'review_required',
    spectralAnomalies: 56.1,
    prosodyDiscontinuity: 61.4,
    vocalTractConsistency: 51.0,
    verdictDescription: 'WARNING: Temporal phase discontinuities around phoneme boundaries indicate potential voice conversion stitching or neural splicing.',
    modelTarget: 'Audio-AASIST-V2 (Hexagon NPU INT8)'
  }
};

export class DemoAIProvider implements AIProvider {
  readonly id: string = 'demo-browser-provider';
  readonly name: string = 'Aegis Local Prototype Engine';
  readonly targetPlatform: string = 'Browser WebAssembly / Heuristics';
  readonly isHardwareAccelerated: boolean = false;
  readonly isDemoProvider: boolean = true;

  async detectPII(
    _imageSource: HTMLImageElement | HTMLCanvasElement | string,
    mode: 'sensitive_crm' | 'general_screen' = 'sensitive_crm'
  ): Promise<DetectedPII[]> {
    // Simulate real-time inference latency (approx 45ms)
    await new Promise((r) => setTimeout(r, 60));

    if (mode === 'sensitive_crm') {
      return JSON.parse(JSON.stringify(SAMPLE_CRM_PII_REGIONS));
    }

    // Dynamic heuristic detection for uploaded images
    return [
      {
        id: 'dyn-1',
        category: 'email',
        label: 'Email Pattern',
        rawText: 'confidential.contact@domain.com',
        maskedText: 'c••••••••••••••••@domain.com',
        confidence: 0.92,
        box: { x: 12, y: 18, width: 36, height: 6 },
        redacted: true
      },
      {
        id: 'dyn-2',
        category: 'financial',
        label: 'Sensitive Monetary Figure',
        rawText: '$1,450,000 USD',
        maskedText: '$•,•••,••• USD',
        confidence: 0.95,
        box: { x: 55, y: 35, width: 28, height: 6 },
        redacted: true
      },
      {
        id: 'dyn-3',
        category: 'auth_secret',
        label: 'API Token / Secret Key',
        rawText: 'sk_live_948271049281',
        maskedText: 'sk_live_••••••••••••',
        confidence: 0.98,
        box: { x: 12, y: 55, width: 42, height: 6 },
        redacted: true
      }
    ];
  }

  async transcribeMeetingAudio(
    audioSource: Blob | string,
    onSegment?: (segment: TranscriptSegment) => void
  ): Promise<{ segments: TranscriptSegment[]; summary: MeetingSummary }> {
    const selected = typeof audioSource === 'string' && audioSource.includes('financial')
      ? SAMPLE_MEETING_SCRIPTS[1]
      : SAMPLE_MEETING_SCRIPTS[0];

    // If onSegment callback provided, simulate live stream
    if (onSegment) {
      for (const seg of selected.segments) {
        await new Promise((r) => setTimeout(r, 350));
        onSegment(seg);
      }
    }

    return {
      segments: selected.segments,
      summary: selected.summary
    };
  }

  async trackUserAttention(
    _videoElement: HTMLVideoElement | null,
    manualOverride?: AttentionState | null
  ): Promise<{ state: AttentionState; confidence: number }> {
    if (manualOverride) {
      return {
        state: manualOverride,
        confidence: manualOverride === 'present' ? 0.98 : 0.95
      };
    }
    // Default present with high confidence
    return { state: 'present', confidence: 0.96 };
  }

  async analyzeSyntheticVoice(
    audioSource: Blob | string
  ): Promise<AudioThreatAnalysis> {
    await new Promise((r) => setTimeout(r, 120));

    if (typeof audioSource === 'string' && AUDIO_THREAT_SAMPLES[audioSource]) {
      return AUDIO_THREAT_SAMPLES[audioSource];
    }

    // Default to the synthetic deepfake sample for demonstration
    return AUDIO_THREAT_SAMPLES['deepfake-cloned'];
  }

  async getHardwareTelemetry(): Promise<HardwareTelemetry> {
    // Realistic simulated telemetry for Snapdragon Hexagon NPU on HP EliteBook
    // Slight organic jitter around nominal numbers
    const jitter = (Math.random() - 0.5) * 2;
    return {
      npuUtilization: Math.min(100, Math.max(0, Math.round(78 + jitter * 2))),
      cpuUtilization: Math.min(100, Math.max(0, Math.round(14 + jitter))),
      gpuUtilization: Math.min(100, Math.max(0, Math.round(8 + jitter * 0.5))),
      aiLatencyMs: Math.round(23 + jitter),
      powerWatts: parseFloat((12.8 + jitter * 0.2).toFixed(1)),
      topsEfficiency: 45.0, // Snapdragon X Elite NPU capability
      memoryNpuMb: 512,
      temperatureC: Math.round(41 + jitter * 0.5),
      isSimulatedTelemetry: true
    };
  }
}
