/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Network,
  Cpu,
  Layers,
  Code2,
  Terminal,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  FileCode,
  Laptop
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const cppCode = `// Native Windows ARM64 / C++ Implementation using ONNX Runtime with QNN EP
#include <onnxruntime_cxx_api.h>
#include <iostream>
#include <unordered_map>

void InitializeSnapdragonNPU() {
    Ort::Env env(ORT_LOGGING_LEVEL_WARNING, "AegisNodeSnapdragon");
    Ort::SessionOptions session_options;

    // Configure Qualcomm QNN Execution Provider for Hexagon Tensor Processor (HTP)
    std::unordered_map<std::string, std::string> qnn_options = {
        {"backend_path", "QnnHtp.dll"},                            // Hexagon HTP Backend
        {"htp_performance_mode", "burst"},                         // Max throughput burst mode
        {"htp_graph_finalization_optimization_mode", "3"},         // Highest graph optimization level
        {"soc_model", "60"},                                       // Snapdragon X Elite (X1E-84-100)
        {"enable_htp_fp16_precision", "1"}                         // Mixed FP16/INT8 precision
    };

    // Append QNN Execution Provider
    session_options.AppendExecutionProvider("QNN", qnn_options);

    // Load compiled QNN Context Binary (Zero-copy unified LPDDR5x RAM)
    Ort::Session session(env, L"models/yolov8n_pii_int8.bin", session_options);
    std::cout << "[Aegis Node] Hexagon NPU pipeline initialized (45 TOPS active)." << std::endl;
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cppCode);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              System Engineering & Runtime Blueprint
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-xs font-mono text-neutral-400">Windows ARM64 · ONNX Runtime QNN EP</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans">
            Technical Architecture & Snapdragon Migration
          </h1>
          <p className="text-sm text-neutral-400 font-sans mt-1">
            Modular software architecture showing how prototype providers swap cleanly into native Windows ARM64 Snapdragon NPU binaries.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Laptop className="w-4 h-4 text-cyan-400" />
          <span>HP PC Reference Fleet (Snapdragon X Elite)</span>
        </div>
      </div>

      {/* 2-Stack Layered Architecture: Prototype Stack vs Future Snapdragon Deployment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Prototype Stack */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-purple-400" />
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Current Prototype Architecture
              </h2>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-950/80 border border-purple-800 px-2 py-0.5 rounded">
              BROWSER PROTOTYPE
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-center font-bold text-white">
              WINDOWS APP / BROWSER SHELL
            </div>
            <div className="text-center text-neutral-500">↓</div>
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-center font-bold text-cyan-300">
              Aegis Node UI (React 19 + TypeScript + Tailwind)
            </div>
            <div className="text-center text-neutral-500">↓</div>
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-center font-bold text-neutral-300">
              Local Orchestration Layer (`AegisContext.tsx`)
            </div>
            <div className="text-center text-neutral-500">↓</div>
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-center font-bold text-purple-300">
              AI Provider Abstraction (`AIProvider` &rarr; `DemoAIProvider`)
            </div>
            <div className="text-center text-neutral-500">↓</div>
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-center font-bold text-emerald-400">
              Model Execution (Client-side Canvas OCR, Web Audio FFT, Ring Buffers)
            </div>
            <div className="text-center text-neutral-500">↓</div>
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-center font-bold text-neutral-400">
              Host Hardware (Browser Sandbox CPU / GPU / Simulated Telemetry)
            </div>
          </div>
        </div>

        {/* Future Snapdragon Native Production Stack */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Production Snapdragon Deployment
              </h2>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded">
              WINDOWS ARM64 NATIVE
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-center font-bold text-white">
              Windows 11 ARM64 Native App (C++ / WinUI 3)
            </div>
            <div className="text-center text-neutral-500">↓</div>
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-center font-bold text-cyan-300">
              Aegis Node Native Orchestration Layer
            </div>
            <div className="text-center text-neutral-500">↓</div>
            <div className="p-3 bg-cyan-950/40 border border-cyan-800 rounded-lg text-center font-bold text-cyan-300">
              ONNX Runtime v1.18+ (Unified Execution Graph)
            </div>
            <div className="text-center text-neutral-500">↓</div>
            <div className="p-3 bg-cyan-950/40 border border-cyan-800 rounded-lg text-center font-bold text-cyan-200">
              QNN Execution Provider (Qualcomm QNN EP DLL)
            </div>
            <div className="text-center text-neutral-500">↓</div>
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-center font-bold text-emerald-400">
              Qualcomm AI Engine Direct SDK / QAIRT
            </div>
            <div className="text-center text-neutral-500">↓</div>
            <div className="p-3 bg-emerald-950/50 border border-emerald-800 rounded-lg text-center font-bold text-emerald-300">
              Snapdragon Hexagon NPU (HTP + HVX Hardware · 45 TOPS)
            </div>
          </div>
        </div>
      </div>

      {/* Concrete Native Integration Code Snippet */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-md space-y-0">
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-semibold text-neutral-200 font-mono uppercase tracking-wider">
              Native QNN Execution Provider Binding (C++ / ONNX Runtime)
            </h3>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono border border-neutral-800 transition-colors cursor-pointer"
          >
            {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSnippet ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        <div className="p-4 bg-neutral-950 overflow-x-auto text-xs font-mono text-neutral-300">
          <pre className="leading-relaxed">
            <code>{cppCode}</code>
          </pre>
        </div>
      </div>

      {/* Migration Steps Blueprint from Prompt (Exact steps to replace demo provider) */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
          Migration Blueprint: Replacing Demo Providers with Snapdragon QNN
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
            <div className="text-cyan-400 font-bold">1. QUANTIZE MODELS</div>
            <p className="text-neutral-400 font-sans leading-relaxed">
              Use Qualcomm AI Hub to convert PyTorch weights (YOLOv8n, Whisper, Phi-3, EyeGaze) to INT8 and INT4 AWQ.
            </p>
          </div>

          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
            <div className="text-cyan-400 font-bold">2. COMPILE QNN BINARIES</div>
            <p className="text-neutral-400 font-sans leading-relaxed">
              Run `qnn-context-binary-generator` from QAIRT SDK to generate `.bin` context graphs targeted at HTP v73.
            </p>
          </div>

          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
            <div className="text-cyan-400 font-bold">3. BIND ONNX RUNTIME</div>
            <p className="text-neutral-400 font-sans leading-relaxed">
              Configure `session_options.AppendExecutionProvider(&quot;QNN&quot;, qnn_options)` in the Windows ARM64 host application.
            </p>
          </div>

          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
            <div className="text-emerald-400 font-bold">4. SWAP PROVIDER</div>
            <p className="text-neutral-400 font-sans leading-relaxed">
              In `src/context/AegisContext.tsx`, switch `provider` instantiation from `DemoAIProvider` to `SnapdragonQNNProvider`.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
