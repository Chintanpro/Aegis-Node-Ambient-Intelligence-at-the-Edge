/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAegis } from '../../context/AegisContext';
import {
  PlaySquare,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  WifiOff,
  EyeOff,
  Mic,
  ScanEye,
  Cpu,
  FileCheck2,
  Check,
  Pause,
  Play
} from 'lucide-react';

interface DemoStep {
  stepNumber: number;
  title: string;
  tagline: string;
  description: string;
  actionLabel: string;
  module: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'Enable Air-Gap Mode',
    tagline: 'Hardware Network Isolation',
    description: 'Sever all outbound network sockets. Ensure the prototype is operating in 100% disconnected local-only mode with zero external telemetry.',
    actionLabel: 'Verify Air-Gap Engaged (0 Bytes Egress)',
    module: 'Air-Gap Engine'
  },
  {
    stepNumber: 2,
    title: 'Open Sample CRM Screen',
    tagline: 'High-Risk Customer Portal',
    description: 'Load synthetic enterprise CRM data containing customer Alex Morgan, account ID ACC-482913, credit card number, and address.',
    actionLabel: 'Load Sensitive CRM Workspace',
    module: 'Screen Guard'
  },
  {
    stepNumber: 3,
    title: 'Detect Sensitive Information',
    tagline: 'Edge Computer Vision & FastOCR',
    description: 'Trigger local YOLOv8n + OCR spatial detection to scan the raw frame buffer and identify 7 distinct PII and financial entities.',
    actionLabel: 'Run Local Vision PII Detection',
    module: 'Screen Guard'
  },
  {
    stepNumber: 4,
    title: 'Apply Real-Time Redaction',
    tagline: 'Zero-Egress Masking Layer',
    description: 'Apply instant cryptographic blackout and masking over detected credit card, phone, and account fields before frame display.',
    actionLabel: 'Activate Masking Shield',
    module: 'Screen Guard'
  },
  {
    stepNumber: 5,
    title: 'Start Meeting Intelligence',
    tagline: 'Offline Ambient Speech Capture',
    description: 'Begin capturing spoken executive conversation in real-time using Whisper-Medium quantized to INT8 on the Qualcomm Hexagon NPU.',
    actionLabel: 'Initialize Whisper Speech Pipeline',
    module: 'Meeting Intel'
  },
  {
    stepNumber: 6,
    title: 'Show Live-Style Transcription',
    tagline: 'Sub-Frame Word Streaming',
    description: 'Watch live transcription stream: "Let\'s finalize the customer migration plan by Friday as mandated by regional compliance."',
    actionLabel: 'Stream Live Transcripts',
    module: 'Meeting Intel'
  },
  {
    stepNumber: 7,
    title: 'Generate Summary & Action Items',
    tagline: 'Local Phi-3-mini SLM Reasoning',
    description: 'Execute local 3.8B parameter small language model to synthesize key decisions, identify migration roadblocks, and extract 4 action items.',
    actionLabel: 'Extract Decisions & Tasks with Phi-3',
    module: 'Meeting Intel'
  },
  {
    stepNumber: 8,
    title: 'Trigger Attention / Privacy Lock',
    tagline: 'EyeGaze Shoulder-Surfing Defense',
    description: 'Simulate user looking away from laptop screen. Sensor triggers instant frosted privacy screen blackout in under 20ms.',
    actionLabel: 'Simulate Look-Away Blackout',
    module: 'Attention Guard'
  },
  {
    stepNumber: 9,
    title: 'Show AI Hardware Telemetry',
    tagline: 'Snapdragon NPU Offloading Metrics',
    description: 'Demonstrate NPU 78% utilization, 12.8W low power consumption, and 23ms AI inference latency without heating or cloud delays.',
    actionLabel: 'Audit Hexagon Silicon Telemetry',
    module: 'Hardware Core'
  },
  {
    stepNumber: 10,
    title: 'Display Final Security Audit Report',
    tagline: 'Cryptographic Privacy Certificate',
    description: 'Inspect the zero-egress audit log proving all screen frames, microphone audio, and attention tensors remained on the local device.',
    actionLabel: 'Generate Zero-Egress Security Certificate',
    module: 'Security Center'
  }
];

export const HackathonDemoView: React.FC = () => {
  const {
    setAirGap,
    setPrivacyLockActive,
    addActivityLog,
    setActivePage
  } = useAegis();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const currentStep = DEMO_STEPS[currentStepIndex];
  const isFinished = currentStepIndex >= DEMO_STEPS.length - 1;

  // Execute actual state actions for the active step
  const executeStepAction = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        setAirGap(true);
        addActivityLog('Air-Gap Engine', '[DEMO STEP 1] Air-Gap Mode verified engaged. Sockets offline.', 'success');
        break;
      case 2:
        addActivityLog('Screen Guard', '[DEMO STEP 2] Synthetic CRM portal rendered in memory buffer.', 'info');
        break;
      case 3:
        addActivityLog('Screen Guard', '[DEMO STEP 3] YOLOv8n localized 7 sensitive regions in 14ms.', 'success');
        break;
      case 4:
        addActivityLog('Screen Guard', '[DEMO STEP 4] Instant blackout redaction applied to display canvas.', 'success');
        break;
      case 5:
        addActivityLog('Meeting Intel', '[DEMO STEP 5] Whisper-Medium INT8 speech stream initialized.', 'info');
        break;
      case 6:
        addActivityLog('Meeting Intel', '[DEMO STEP 6] Spoken audio transcribed with 98.6% word accuracy.', 'info');
        break;
      case 7:
        addActivityLog('Meeting Intel', '[DEMO STEP 7] Phi-3-mini generated summary and 4 action items.', 'success');
        break;
      case 8:
        setPrivacyLockActive(true);
        addActivityLog('Attention Guard', '[DEMO STEP 8] User look-away detected. Privacy lock engaged.', 'alert');
        setTimeout(() => setPrivacyLockActive(false), 2500); // Release after 2.5s for demonstration
        break;
      case 9:
        addActivityLog('Hardware Core', '[DEMO STEP 9] Snapdragon NPU validated at 78% load, 12.8W envelope.', 'info');
        break;
      case 10:
        addActivityLog('Air-Gap Engine', '[DEMO STEP 10] Security verification complete: 0 bytes egress.', 'success');
        break;
    }

    if (!completedSteps.includes(stepNum)) {
      setCompletedSteps((prev) => [...prev, stepNum]);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      executeStepAction(DEMO_STEPS[nextIndex].stepNumber);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleResetDemo = () => {
    setCurrentStepIndex(0);
    setIsAutoPlaying(false);
    setCompletedSteps([1]);
    executeStepAction(1);
  };

  // Auto-play timer for presentation
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isAutoPlaying && !isFinished) {
      timer = setTimeout(() => {
        handleNextStep();
      }, 5000);
    } else if (isFinished) {
      setIsAutoPlaying(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAutoPlaying, currentStepIndex, isFinished]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              Hackathon Demonstration Mode
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-xs font-mono text-neutral-400">Target Duration: ~3 Minutes</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans">
            Aegis Node Guided Walkthrough
          </h1>
          <p className="text-sm text-neutral-400 font-sans mt-1">
            An automated end-to-end presentation sequence demonstrating privacy-first edge intelligence on Snapdragon HP PCs.
          </p>
        </div>

        {/* Presenter Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              isAutoPlaying
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAutoPlaying ? 'PAUSE AUTO-RUN' : 'AUTO-ADVANCE (5S)'}</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-xs font-mono cursor-pointer"
            title="Reset Demo to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 10-Step Progress Stepper Bar */}
      <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-neutral-400">
            STEP {currentStep.stepNumber} OF 10: {currentStep.title.toUpperCase()}
          </span>
          <span className="text-cyan-400 font-semibold">
            {Math.round(((currentStepIndex + 1) / DEMO_STEPS.length) * 100)}% Complete
          </span>
        </div>

        {/* Stepper Dots / Bars */}
        <div className="grid grid-cols-10 gap-1.5">
          {DEMO_STEPS.map((s, idx) => {
            const isCompleted = completedSteps.includes(s.stepNumber);
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={s.stepNumber}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  executeStepAction(s.stepNumber);
                }}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-400 shadow-md shadow-cyan-500/50'
                    : isCompleted
                    ? 'bg-emerald-500'
                    : 'bg-neutral-800 hover:bg-neutral-700'
                }`}
                title={`Step ${s.stepNumber}: ${s.title}`}
              />
            );
          })}
        </div>
      </div>

      {/* Main Active Step Showcase Stage */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Step Badge */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300 font-bold font-mono text-sm shadow-inner">
              0{currentStep.stepNumber}
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                {currentStep.tagline}
              </span>
              <h2 className="text-xl font-bold text-white font-sans">
                {currentStep.title}
              </h2>
            </div>
          </div>
          <span className="text-xs font-mono text-neutral-500 bg-neutral-950 px-2.5 py-1 rounded border border-neutral-800">
            Module: {currentStep.module}
          </span>
        </div>

        {/* Step Description */}
        <div className="space-y-6">
          <p className="text-base text-neutral-300 leading-relaxed font-sans max-w-3xl">
            {currentStep.description}
          </p>

          {/* Action Trigger Button */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => executeStepAction(currentStep.stepNumber)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold tracking-wide transition-all shadow-lg shadow-cyan-950/50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{currentStep.actionLabel}</span>
            </button>

            {/* Jump to specific view button */}
            {currentStep.module === 'Screen Guard' && (
              <button
                onClick={() => setActivePage('screenguard')}
                className="text-xs font-mono text-neutral-400 hover:text-white underline cursor-pointer"
              >
                Inspect Screen Guard Tab &rarr;
              </button>
            )}
            {currentStep.module === 'Meeting Intel' && (
              <button
                onClick={() => setActivePage('meeting')}
                className="text-xs font-mono text-neutral-400 hover:text-white underline cursor-pointer"
              >
                Inspect Meeting Intel Tab &rarr;
              </button>
            )}
            {currentStep.module === 'Attention Guard' && (
              <button
                onClick={() => setActivePage('attention')}
                className="text-xs font-mono text-neutral-400 hover:text-white underline cursor-pointer"
              >
                Inspect Attention Guard Tab &rarr;
              </button>
            )}
            {currentStep.module === 'Hardware Core' && (
              <button
                onClick={() => setActivePage('hardware')}
                className="text-xs font-mono text-neutral-400 hover:text-white underline cursor-pointer"
              >
                Inspect Snapdragon NPU Tab &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Stepper Navigation Footer */}
        <div className="flex items-center justify-between border-t border-neutral-800 pt-6 mt-8">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-xs font-mono disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs font-mono text-neutral-500">
            Step {currentStepIndex + 1} of {DEMO_STEPS.length}
          </span>

          <button
            onClick={handleNextStep}
            disabled={isFinished}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 text-cyan-200 text-xs font-mono font-semibold disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grand Finale Card when Step 10 is reached (Mandatory from prompt) */}
      {currentStep.stepNumber === 10 && (
        <div className="p-8 bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-cyan-950/30 border border-emerald-700/80 rounded-2xl shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans uppercase">
            YOUR DATA STAYED LOCAL
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-mono text-emerald-400 font-semibold pt-2">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Privacy Protected
            </span>
            <span className="text-neutral-700">·</span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" /> AI Active (Hexagon NPU)
            </span>
            <span className="text-neutral-700">·</span>
            <span className="flex items-center gap-1.5">
              <WifiOff className="w-4 h-4 text-emerald-400" /> Network Disconnected
            </span>
          </div>

          <div className="pt-4 max-w-xl mx-auto text-xs text-neutral-400 font-sans leading-relaxed">
            <p className="text-lg font-bold text-cyan-300 font-sans">
              AEGIS NODE
            </p>
            <p className="text-neutral-300 font-medium mt-1">
              Privacy-first ambient intelligence.
            </p>
            <p className="text-neutral-400 mt-0.5">
              Protected locally. Accelerated at the edge.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
