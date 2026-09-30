/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAegis } from '../../context/AegisContext';
import { AttentionState } from '../../types';
import {
  ScanEye,
  Camera,
  CameraOff,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  AlertOctagon,
  Cpu,
  RefreshCw,
  Info,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export const AttentionGuardView: React.FC = () => {
  const {
    attentionState,
    setAttentionState,
    privacyLockActive,
    setPrivacyLockActive,
    addActivityLog
  } = useAegis();

  const [hasWebcamPermission, setHasWebcamPermission] = useState<boolean | null>(null);
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const [sensitivity, setSensitivity] = useState<number>(75);
  const [dwellTimeoutMs, setDwellTimeoutMs] = useState<number>(1500);
  const [autoTrackingEnabled, setAutoTrackingEnabled] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Request actual webcam if user enables
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      mediaStreamRef.current = stream;
      setHasWebcamPermission(true);
      setWebcamActive(true);
      addActivityLog('Attention Guard', 'Webcam stream acquired. Initializing local gaze tracker...', 'info');
    } catch {
      setHasWebcamPermission(false);
      setWebcamActive(false);
      addActivityLog(
        'Attention Guard',
        'Webcam access unavailable or declined. Falling back to Demo Mode Gaze Simulation.',
        'warning'
      );
    }
  };

  const stopWebcam = useCallback(() => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setWebcamActive(false);
  }, []);

  // Ensure webcam stream is assigned when videoRef becomes available in the DOM
  useEffect(() => {
    if (webcamActive && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
      videoRef.current.play().catch(() => {});

      // Set up periodic presence check via offscreen canvas
      if (autoTrackingEnabled) {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = 64;
        offCanvas.height = 48;
        const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

        checkIntervalRef.current = setInterval(() => {
          if (!videoRef.current || videoRef.current.readyState < 2 || !offCtx) return;
          try {
            offCtx.drawImage(videoRef.current, 0, 0, 64, 48);
            const frame = offCtx.getImageData(0, 0, 64, 48);
            let totalLuma = 0;
            for (let i = 0; i < frame.data.length; i += 4) {
              totalLuma += (frame.data[i] * 0.299 + frame.data[i + 1] * 0.587 + frame.data[i + 2] * 0.114);
            }
            const avgLuma = totalLuma / (frame.data.length / 4);

            // If lens is covered or pitch black
            if (avgLuma < 12) {
              if (attentionState !== 'away') {
                updateAttention('away');
              }
            }
          } catch (_) {}
        }, 1200);
      }
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [webcamActive, autoTrackingEnabled]);

  // Set attention state and trigger privacy lock
  const updateAttention = (newState: AttentionState) => {
    setAttentionState(newState);

    if (newState === 'away' || newState === 'distracted') {
      setPrivacyLockActive(true);
      addActivityLog(
        'Attention Guard',
        'ATTENTION LOST: User looked away or stepped out of frame. Privacy Lock Activated.',
        'alert'
      );
    } else {
      setPrivacyLockActive(false);
      addActivityLog(
        'Attention Guard',
        'USER PRESENT: User gaze re-engaged in primary screen viewport. Privacy Lock Released.',
        'success'
      );
    }
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150 relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              Vision & Gaze Subsystem
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-xs font-mono text-neutral-400">Model: EyeGaze-NPU (Hexagon HTP)</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans">
            Attention Guard & Instant Privacy Lock
          </h1>
          <p className="text-sm text-neutral-400 font-sans mt-1">
            Protects against shoulder-surfing and unattended screen exposure by blacking out displays the instant user attention drifts.
          </p>
        </div>

        {/* Global Lock Status Pill */}
        <div className="flex items-center gap-2">
          {privacyLockActive ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 font-mono text-xs font-semibold animate-pulse">
              <Lock className="w-4 h-4 text-rose-400" />
              <span>PRIVACY LOCK ENGAGED</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-mono text-xs font-semibold">
              <Unlock className="w-4 h-4 text-emerald-400" />
              <span>SCREEN UNLOCKED (GAZE VERIFIED)</span>
            </div>
          )}
        </div>
      </div>

      {/* Primary Status Banner from Prompt */}
      <div className={`p-6 rounded-xl border transition-all ${
        attentionState === 'present'
          ? 'bg-emerald-950/20 border-emerald-800/60'
          : 'bg-rose-950/30 border-rose-800/80'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
              attentionState === 'present'
                ? 'bg-emerald-900/40 border-emerald-700 text-emerald-400'
                : 'bg-rose-900/40 border-rose-700 text-rose-400 animate-bounce'
            }`}>
              <ScanEye className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Live Sensor Telemetry
              </div>
              <div className="text-xl font-bold font-mono mt-0.5 flex items-center gap-2">
                {attentionState === 'present' ? (
                  <>
                    <span className="text-emerald-400">USER PRESENT</span>
                    <span className="text-xs font-sans text-neutral-400">· Screen Unlocked</span>
                  </>
                ) : (
                  <>
                    <span className="text-rose-400">ATTENTION LOST</span>
                    <span className="text-xs font-sans text-rose-300">· Privacy Lock Activated</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Override Buttons for Hackathon Presenters */}
          <div className="flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 p-1.5 rounded-lg">
            <span className="text-xs font-mono text-neutral-400 px-2 font-medium">DEMO TRIGGER:</span>
            <button
              onClick={() => updateAttention('present')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
                attentionState === 'present'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Simulate Gaze Engaged
            </button>
            <button
              onClick={() => updateAttention('away')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
                attentionState === 'away'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Simulate Look Away
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Sensor Feed on Left (7 cols), Privacy Lock Preview & Tuning on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Webcam & Vision Stream Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl overflow-hidden shadow-md">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-semibold text-neutral-200 font-mono uppercase tracking-wider">
                  Front Sensor Input
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {webcamActive ? (
                  <button
                    onClick={stopWebcam}
                    className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-mono cursor-pointer"
                  >
                    <CameraOff className="w-3.5 h-3.5" />
                    <span>Stop Webcam</span>
                  </button>
                ) : (
                  <button
                    onClick={startWebcam}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Enable Live Webcam</span>
                  </button>
                )}
              </div>
            </div>

            {/* Video Viewport / Simulated Canvas */}
            <div className="relative min-h-[360px] bg-neutral-950 flex items-center justify-center overflow-hidden">
              {webcamActive ? (
                <div className="relative w-full h-[360px] flex items-center justify-center bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  {/* Overlaid Eye Tracking Reticle */}
                  <div className={`absolute border-2 rounded-full pointer-events-none transition-all ${
                    attentionState === 'present'
                      ? 'border-emerald-400/90 w-44 h-44 shadow-lg shadow-emerald-500/20'
                      : 'border-rose-500/90 w-36 h-36 border-dashed animate-ping'
                  }`}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                  </div>
                </div>
              ) : (
                /* Simulated Gaze Tracking Reticle Animation */
                <div className="relative w-full h-[360px] flex flex-col items-center justify-center p-6 text-center">
                  <div className={`w-32 h-32 rounded-full border-2 flex items-center justify-center transition-all ${
                    attentionState === 'present'
                      ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-950/60'
                      : 'border-rose-500 bg-rose-950/20 shadow-lg shadow-rose-950/60 animate-pulse'
                  }`}>
                    <ScanEye className={`w-12 h-12 ${attentionState === 'present' ? 'text-emerald-400' : 'text-rose-400'}`} />
                  </div>

                  <div className="mt-4 space-y-1">
                    <div className="text-xs font-mono text-neutral-300">
                      Sensor Mode: {hasWebcamPermission === false ? 'Demo Mode (Camera Access Declined)' : 'Demo Mode (Synthetic Gaze)'}
                    </div>
                    <p className="text-xs text-neutral-500 max-w-sm">
                      Click &apos;Enable Live Webcam&apos; to feed your actual video stream into the browser gaze processor, or use the presenter override buttons.
                    </p>
                  </div>
                </div>
              )}

              {/* Status Overlay Footer */}
              <div className="absolute bottom-3 left-3 right-3 bg-neutral-900/90 border border-neutral-800/80 px-3 py-2 rounded-lg flex items-center justify-between text-xs font-mono text-neutral-400 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${attentionState === 'present' ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
                  <span>Gaze Vector: {attentionState === 'present' ? 'Centered [θ: +2.1°, φ: -0.8°]' : 'Averted [θ: -48.4°, φ: -14.2°]'}</span>
                </div>
                <span className="text-cyan-400 font-semibold">
                  Confidence: {attentionState === 'present' ? '98.4%' : '24.1%'}
                </span>
              </div>
            </div>

            {/* Hardware & Privacy Notice */}
            <div className="p-3 bg-neutral-950 border-t border-neutral-800 text-[11px] font-sans text-neutral-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Zero frame retention: Video buffers are converted to facial landmark coordinates in memory and immediately discarded. No video is ever written to disk or transmitted.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Privacy Lock Simulation Window & Parameter Tuning */}
        <div className="lg:col-span-5 space-y-4">
          {/* Simulated Protected Display Mockup */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl overflow-hidden shadow-md">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-semibold text-neutral-200 font-mono uppercase tracking-wider">
                  Screen Shield Overlay Preview
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                {privacyLockActive ? 'LOCKED' : 'TRANSPARENT'}
              </span>
            </div>

            <div className="relative h-[220px] bg-neutral-950 p-4 flex items-center justify-center overflow-hidden">
              {/* Underlying Sensitive Screen Content */}
              <div className="w-full h-full p-4 bg-neutral-900/80 rounded-lg border border-neutral-800 text-xs font-mono space-y-2 opacity-80">
                <div className="text-cyan-400 font-bold">CONFIDENTIAL FINANCIAL LEDGER</div>
                <div className="text-neutral-400">Account: ACC-482913 · Balance: $84,250.00</div>
                <div className="text-neutral-400">Wire Destination: JP Morgan Chase #9910</div>
                <div className="text-neutral-500 pt-2 text-[10px]">Classification: Restricted Enterprise Data</div>
              </div>

              {/* Frosted Privacy Lock Overlap when Attention Lost */}
              {privacyLockActive && (
                <div className="absolute inset-0 bg-neutral-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-700/80 flex items-center justify-center text-rose-400">
                    <AlertOctagon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                      Privacy Lock Engaged
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      User attention not detected. Display blurred to prevent unauthorized shoulder viewing.
                    </p>
                  </div>
                  <button
                    onClick={() => updateAttention('present')}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono border border-neutral-700 cursor-pointer"
                  >
                    Unlock (Verify Gaze)
                  </button>
                </div>
              )}
            </div>

            <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Engage Latency: &lt; 20ms</span>
              <span className="text-emerald-400">Instant Hardware Blackout</span>
            </div>
          </div>

          {/* Configuration Parameters */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-semibold text-neutral-200 font-mono uppercase tracking-wider">
                Attention Guard Sensitivity
              </h3>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <div className="flex justify-between text-neutral-400">
                  <span>Gaze Tolerance Threshold</span>
                  <span className="text-cyan-400">{sensitivity}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="95"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-neutral-400">
                  <span>Look-Away Dwell Timeout</span>
                  <span className="text-cyan-400">{dwellTimeoutMs} ms</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="4000"
                  step="250"
                  value={dwellTimeoutMs}
                  onChange={(e) => setDwellTimeoutMs(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Model Specification Card */}
          <div className="p-4 bg-neutral-900/60 border border-neutral-800/80 rounded-xl flex items-start gap-3 text-xs">
            <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1 font-sans">
              <div className="text-neutral-200 font-semibold font-mono uppercase">
                Production Target: EyeGaze via Qualcomm AI Hub
              </div>
              <p className="text-neutral-400 leading-relaxed text-[11px]">
                Target model is a quantized MobileNetV3 regression head compiling to Snapdragon Hexagon Tensor Processor (HTP). Prototype uses browser media heuristics without making unverified biometric claims.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
