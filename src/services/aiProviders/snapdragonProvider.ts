/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProvider } from './base';
import {
  DetectedPII,
  TranscriptSegment,
  MeetingSummary,
  AttentionState,
  AudioThreatAnalysis,
  HardwareTelemetry
} from '../../types';
import { DemoAIProvider } from './demoProvider';

/**
 * SnapdragonQNNProvider Architecture Stub
 *
 * In a native Windows ARM64 production environment on Snapdragon X Elite/Plus HP PCs:
 * 1. The application links to ONNX Runtime (v1.18+) configured with QNN Execution Provider (QNN EP).
 * 2. Model binaries (.onnx / .bin context files) compiled with QAIRT (Qualcomm AI Engine Direct SDK)
 *    are loaded directly into the Hexagon HTP (Hexagon Tensor Processor).
 * 3. Zero sensitive data leaves device memory (shared unified LPDDR5x RAM).
 *
 * This class inherits from DemoAIProvider as a fallback when running in browser environments,
 * while maintaining the exact production interface contracts and telemetry bridges.
 */
export class SnapdragonQNNProvider extends DemoAIProvider implements AIProvider {
  override readonly id = 'snapdragon-qnn-provider';
  override readonly name = 'Qualcomm Snapdragon QNN Execution Provider (Production Target)';
  override readonly targetPlatform = 'Windows ARM64 / Qualcomm Hexagon NPU (QNN HTP)';
  override readonly isHardwareAccelerated = true;
  override readonly isDemoProvider = false;

  private isNativeBridgeAvailable(): boolean {
    // Check if running inside Windows ARM64 native host with QNN bindings
    return typeof window !== 'undefined' && 'QualcommQNNNative' in window;
  }

  override async getHardwareTelemetry(): Promise<HardwareTelemetry> {
    if (this.isNativeBridgeAvailable()) {
      // In native production, read from Windows.System.Diagnostics or Qualcomm QAIRT Profiler
      return (window as any).QualcommQNNNative.getTelemetry();
    }

    // Return representative telemetry conforming to Qualcomm X Elite specifications
    return {
      npuUtilization: 78,
      cpuUtilization: 14,
      gpuUtilization: 8,
      aiLatencyMs: 23,
      powerWatts: 12.8,
      topsEfficiency: 45.0,
      memoryNpuMb: 512,
      temperatureC: 41,
      isSimulatedTelemetry: true // Explicitly marked as prototype/simulated
    };
  }
}

/**
 * Production Integration Code Example for Qualcomm QNN on Windows ARM64:
 *
 * ```cpp
 * // Native C++ / ONNX Runtime QNN Initialization
 * #include <onnxruntime_cxx_api.h>
 *
 * Ort::Env env(ORT_LOGGING_LEVEL_WARNING, "AegisNodeQNN");
 * Ort::SessionOptions session_options;
 *
 * std::unordered_map<std::string, std::string> qnn_options = {
 *     {"backend_path", "QnnHtp.dll"},                 // Hexagon Tensor Processor
 *     {"htp_performance_mode", "burst"},              // Low-latency burst mode
 *     {"htp_graph_finalization_optimization_mode", "3"},
 *     {"soc_model", "60"}                             // Snapdragon X Elite (SM8650/X1E)
 * };
 *
 * session_options.AppendExecutionProvider("QNN", qnn_options);
 * Ort::Session session(env, L"models/whisper_medium_int8_qnn.onnx", session_options);
 * ```
 */
