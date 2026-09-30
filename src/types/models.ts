/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModelSpec } from './index';

export const AI_MODEL_REGISTRY: ModelSpec[] = [
  {
    id: 'whisper-medium-int8',
    name: 'Whisper-Medium',
    category: 'Speech',
    architecture: 'Encoder-Decoder Transformer (244M params INT8 quantized)',
    purpose: 'Offline high-accuracy audio and meeting transcription without cloud connectivity',
    targetRuntime: 'ONNX Runtime 1.18+ with QNN Execution Provider',
    hardwareTarget: 'Qualcomm Hexagon NPU (Snapdragon X Elite / Plus)',
    quantization: 'INT8 static quantization with QAIRT converter',
    memoryFootprint: '412 MB VRAM / NPU memory allocation',
    status: 'PLANNED PRODUCTION MODEL',
    notes: 'Prototype currently utilizes client-side simulated streaming transcript engine. Production builds bind directly to QNN Context binary (.bin).'
  },
  {
    id: 'yolov8n-screen-pii',
    name: 'YOLOv8n-PII',
    category: 'Vision',
    architecture: 'Nano Convolutional Vision Network (3.2M params) + FastOCR',
    purpose: 'Real-time bounding-box detection of UI elements, text fields, credit cards, and PII on screen',
    targetRuntime: 'Qualcomm AI Engine Direct SDK / QNN v2.20',
    hardwareTarget: 'Qualcomm Hexagon Vector Extensions (HVX)',
    quantization: 'INT8 per-channel quantized via Qualcomm AI Hub',
    memoryFootprint: '24 MB NPU RAM',
    status: 'PLANNED PRODUCTION MODEL',
    notes: 'Prototype executes client-side geometric canvas OCR and regex spatial classification. Architecture maintains identical BoundingBox schema for seamless QNN drop-in.'
  },
  {
    id: 'eyegaze-attention-v2',
    name: 'EyeGaze-NPU',
    category: 'Attention',
    architecture: 'MobileNetV3-based Iris & Head Pose Regressor (4.8M params)',
    purpose: 'Continuous ambient gaze tracking to trigger instant privacy screen blackout when user looks away',
    targetRuntime: 'ONNX Runtime with QNN EP / DirectML Fallback',
    hardwareTarget: 'Snapdragon Hexagon Tensor Processor (HTP)',
    quantization: 'FP16 / INT8 mixed precision',
    memoryFootprint: '38 MB system RAM',
    status: 'PLANNED PRODUCTION MODEL',
    notes: 'Prototype supports live browser mediaStream webcam telemetry with facial heuristic detection and presenter override mode.'
  },
  {
    id: 'phi-3-mini-4k',
    name: 'Phi-3-mini-4K-Instruct',
    category: 'Language',
    architecture: '3.8B Small Language Model (Dense autoregressive Transformer)',
    purpose: 'Air-gapped meeting summarization, decision extraction, and automated action item generation',
    targetRuntime: 'ONNX Runtime GenAI with Qualcomm QNN EP backend',
    hardwareTarget: 'Snapdragon X Elite 45 TOPS Hexagon NPU',
    quantization: 'INT4 AWQ (Activation-aware Weight Quantization)',
    memoryFootprint: '2.1 GB unified system memory',
    status: 'PLANNED PRODUCTION MODEL',
    notes: 'Prototype runs zero-latency client-side deterministic extraction rules mimicking Phi-3 output formatting for rapid hackathon presentation.'
  },
  {
    id: 'deepfake-aasist-audio',
    name: 'Audio-AASIST-V2',
    category: 'Threat Detection',
    architecture: 'Graph Attention Network for Spectro-Temporal Synthetic Voice Artifact Detection',
    purpose: 'Real-time voice cloning and synthetic deepfake detection on incoming microphone and VoIP feeds',
    targetRuntime: 'Qualcomm AI Hub QNN Context Engine',
    hardwareTarget: 'Snapdragon Hexagon NPU',
    quantization: 'FP16 tuned for audio spectral embeddings',
    memoryFootprint: '78 MB NPU RAM',
    status: 'PLANNED PRODUCTION MODEL',
    notes: 'Prototype extracts Web Audio API FFT frequency anomalies and vocal tract discontinuities, ready to swap with Qualcomm model binary.'
  }
];
