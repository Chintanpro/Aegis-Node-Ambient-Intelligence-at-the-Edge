/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AI_MODEL_REGISTRY } from '../../types/models';
import {
  Boxes,
  Cpu,
  Layers,
  HardDrive,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';

export const AIModelsView: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', 'Vision', 'Speech', 'Attention', 'Language', 'Threat Detection'] as const;

  const filteredModels = AI_MODEL_REGISTRY.filter(
    (m) => filterCategory === 'all' || m.category === filterCategory
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              Model Hub & Edge Weight Registry
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-xs font-mono text-neutral-400">Qualcomm AI Hub Target Models</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans">
            AI Model Center & Optimization Stack
          </h1>
          <p className="text-sm text-neutral-400 font-sans mt-1">
            Overview of the 5 specialized neural models compiled for the Snapdragon Hexagon NPU via Qualcomm AI Engine Direct (QAIRT).
          </p>
        </div>

        {/* Global Model Stats */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
            Total Edge Models: <span className="text-cyan-400 font-bold">5</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
            Target NPU TOPS: <span className="text-emerald-400 font-bold">45</span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-neutral-900/80 border border-neutral-800 p-2 rounded-xl">
        <span className="text-xs font-mono text-neutral-400 px-2 font-medium">FILTER:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              filterCategory === cat
                ? 'bg-neutral-800 text-cyan-300 border border-neutral-700 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 5 Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <div
            key={model.id}
            className="bg-neutral-900/90 border border-neutral-800 hover:border-cyan-600/50 rounded-2xl p-6 shadow-md transition-all flex flex-col justify-between space-y-5"
          >
            {/* Header & Badges */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                    {model.category}
                  </span>
                  <h3 className="text-lg font-bold text-white font-sans mt-0.5">
                    {model.name}
                  </h3>
                </div>

                {/* Model Status Badge (PROTOTYPE vs PLANNED PRODUCTION MODEL from Prompt) */}
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border whitespace-nowrap ${
                  model.status === 'PROTOTYPE'
                    ? 'bg-purple-950/80 border-purple-800 text-purple-300'
                    : 'bg-cyan-950/80 border-cyan-800 text-cyan-300'
                }`}>
                  {model.status}
                </span>
              </div>

              {/* Purpose */}
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                {model.purpose}
              </p>
            </div>

            {/* Technical Specs List */}
            <div className="space-y-2.5 pt-3 border-t border-neutral-800/80 text-xs font-mono">
              <div className="flex items-start justify-between gap-2">
                <span className="text-neutral-500">Target:</span>
                <span className="text-neutral-200 text-right font-medium">{model.hardwareTarget}</span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-neutral-500">Runtime:</span>
                <span className="text-cyan-400 text-right truncate max-w-[200px]">{model.targetRuntime}</span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-neutral-500">Quantization:</span>
                <span className="text-emerald-400 text-right">{model.quantization}</span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-neutral-500">Memory:</span>
                <span className="text-neutral-300 text-right">{model.memoryFootprint}</span>
              </div>
            </div>

            {/* Notes / Architecture Callout */}
            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80 text-[11px] font-sans text-neutral-400 leading-snug">
              {model.notes}
            </div>
          </div>
        ))}
      </div>

      {/* Qualcomm AI Hub Pipeline Integration Explainer */}
      <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-sans">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white font-sans">
            Quantization & Compilation Workflow
          </h4>
          <p className="text-neutral-400 max-w-3xl leading-relaxed">
            All 5 models are compiled through Qualcomm AI Engine Direct (QAIRT) converting PyTorch/ONNX graphs into optimized QNN context binaries (.bin) targeting the Snapdragon Hexagon Tensor Processor (HTP) at INT8 and INT4 precision.
          </p>
        </div>
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs whitespace-nowrap">
          <Cpu className="w-4 h-4" />
          <span>Qualcomm AI Hub Certified</span>
        </div>
      </div>
    </div>
  );
};
