/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAegis } from '../../context/AegisContext';
import { AudioThreatAnalysis } from '../../types';
import { AUDIO_THREAT_SAMPLES } from '../../services/aiProviders/demoProvider';
import {
  AudioWaveform,
  ShieldCheck,
  AlertTriangle,
  Upload,
  RefreshCw,
  Cpu,
  Info,
  CheckCircle2,
  FileAudio,
  Volume2,
  VolumeX,
  Play,
  Square
} from 'lucide-react';

export const ThreatDetectionView: React.FC = () => {
  const { provider, addActivityLog, setThreatLevel } = useAegis();

  const [selectedSampleKey, setSelectedSampleKey] = useState<string>('deepfake-cloned');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AudioThreatAnalysis | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);

  const runAnalysis = async (sampleKey: string) => {
    setIsAnalyzing(true);
    addActivityLog('Threat Detect', `Initiating synthetic voice & deepfake scan for: ${sampleKey}`, 'info');

    try {
      const result = await provider.analyzeSyntheticVoice(sampleKey);
      setAnalysisResult(result);

      if (result.threatStatus === 'critical_synthetic') {
        setThreatLevel('critical');
        addActivityLog(
          'Threat Detect',
          `HIGH-CONFIDENCE SYNTHETIC ARTIFACTS: Voice authenticity ${result.authenticityScore}%. Review Required.`,
          'alert'
        );
      } else if (result.threatStatus === 'review_required') {
        setThreatLevel('elevated');
        addActivityLog('Threat Detect', 'Elevated synthetic indicators detected. Manual audit advised.', 'warning');
      } else {
        setThreatLevel('secure');
        addActivityLog('Threat Detect', `Authentic biological voice pattern verified (${result.authenticityScore}%).`, 'success');
      }
    } catch {
      addActivityLog('Threat Detect', 'Error during audio analysis pipeline', 'alert');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addActivityLog('Threat Detect', `Custom audio loaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, 'info');
      runAnalysis(file.name);
    }
  };

  // Stop synthetic audio playback
  const stopAudio = useCallback(() => {
    activeOscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (_) {}
    });
    activeOscillatorsRef.current = [];
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsPlayingAudio(false);
  }, []);

  // Synthesize audible demo audio using Web Audio API
  const playSampleAudio = () => {
    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      activeOscillatorsRef.current = [];
      setIsPlayingAudio(true);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.connect(ctx.destination);

      const isSynthetic = selectedSampleKey === 'deepfake-cloned';
      const isAuthentic = selectedSampleKey === 'legit-executive';

      if (isSynthetic) {
        // Metallic robotic stepped vocoder tone
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        // Step frequencies abruptly
        osc.frequency.setValueAtTime(440, ctx.currentTime + 0.3);
        osc.frequency.setValueAtTime(330, ctx.currentTime + 0.6);
        osc.frequency.setValueAtTime(550, ctx.currentTime + 0.9);
        osc.frequency.setValueAtTime(440, ctx.currentTime + 1.2);
        osc.connect(gain);
        osc.start();
        activeOscillatorsRef.current.push(osc);

        setTimeout(() => stopAudio(), 1600);
      } else if (isAuthentic) {
        // Warm organic natural harmonic chord
        [220, 277.18, 329.63].forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          osc.connect(gain);
          osc.start();
          activeOscillatorsRef.current.push(osc);
        });

        setTimeout(() => stopAudio(), 1600);
      } else {
        // Dual-tone dubbing dissonance
        const osc1 = ctx.createOscillator();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(280, ctx.currentTime);
        osc1.connect(gain);
        osc1.start();
        activeOscillatorsRef.current.push(osc1);

        const osc2 = ctx.createOscillator();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(295, ctx.currentTime); // Slight beating detune
        osc2.connect(gain);
        osc2.start();
        activeOscillatorsRef.current.push(osc2);

        setTimeout(() => stopAudio(), 1600);
      }
    } catch {
      setIsPlayingAudio(false);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  // Draw simulated or interactive audio spectrogram canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    const render = () => {
      step += isPlayingAudio ? 0.15 : 0.05;
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      const isSynthetic = analysisResult?.threatStatus === 'critical_synthetic';
      const bars = 48;
      const barWidth = width / bars - 2;

      for (let i = 0; i < bars; i++) {
        let freq = Math.sin(step + i * 0.25) * 0.4 + 0.5;
        if (isSynthetic && i > 30) {
          freq = Math.abs(Math.sin(step * 2 + i * 0.8)) * 0.85 + 0.1;
        }

        if (isPlayingAudio) {
          freq = Math.min(1, freq * 1.3);
        }

        const barHeight = freq * (height - 30);
        const x = i * (barWidth + 2);
        const y = height - barHeight - 15;

        if (isSynthetic && i > 28) {
          ctx.fillStyle = '#f43f5e'; // Rose for vocoder artifacts
        } else {
          ctx.fillStyle = '#06b6d4'; // Cyan for biological harmonics
        }

        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analysisResult, isPlayingAudio]);

  useEffect(() => {
    runAnalysis('deepfake-cloned');
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              Audio & Spectral Subsystem
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-xs font-mono text-neutral-400">Model: Audio-AASIST-V2 (Hexagon NPU)</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans">
            Threat Detection & Synthetic Voice Alert
          </h1>
          <p className="text-sm text-neutral-400 font-sans mt-1">
            Real-time spectral analysis identifying AI voice clones, text-to-speech vocoder artifacts, and audio dubbing attacks.
          </p>
        </div>

        {/* Threat Pill */}
        <div className="flex items-center gap-2">
          {analysisResult?.threatStatus === 'critical_synthetic' ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 font-mono text-xs font-semibold animate-pulse">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>HIGH SYNTHETIC THREAT</span>
            </div>
          ) : analysisResult?.threatStatus === 'review_required' ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-950/80 border border-amber-800 text-amber-300 font-mono text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>REVIEW REQUIRED</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-mono text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>VOICE AUTHENTIC</span>
            </div>
          )}
        </div>
      </div>

      {/* Preset Audio Selection Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-900/80 border border-neutral-800 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono text-neutral-400 font-medium">AUDIO SAMPLE:</span>
          <div className="flex flex-wrap items-center bg-neutral-950 border border-neutral-800 rounded-lg p-1">
            <button
              onClick={() => {
                setSelectedSampleKey('legit-executive');
                runAnalysis('legit-executive');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                selectedSampleKey === 'legit-executive'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Authentic Executive Memo
            </button>
            <button
              onClick={() => {
                setSelectedSampleKey('deepfake-cloned');
                runAnalysis('deepfake-cloned');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                selectedSampleKey === 'deepfake-cloned'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Synthetic Cloned CEO (AI)
            </button>
            <button
              onClick={() => {
                setSelectedSampleKey('dubbed-urgent');
                runAnalysis('dubbed-urgent');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                selectedSampleKey === 'dubbed-urgent'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Wire Transfer Authorization (Dub)
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Audio File</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Playback Demo Button */}
          <button
            onClick={playSampleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-rose-900/60 border-rose-700 text-rose-300'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
            }`}
          >
            {isPlayingAudio ? <Square className="w-3.5 h-3.5 text-rose-400" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isPlayingAudio ? 'Stop Playback' : 'Play Sample Audio'}</span>
          </button>

          <button
            onClick={() => runAnalysis(selectedSampleKey)}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Re-Run Scan</span>
          </button>
        </div>
      </div>

      {/* Main Analysis Display Grid: Spectrogram (7 cols), Authenticity Scores (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Spectrogram & Audio Waveform View */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl overflow-hidden shadow-md">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
              <div className="flex items-center gap-2">
                <AudioWaveform className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-semibold text-neutral-200 font-mono uppercase tracking-wider">
                  Real-Time Spectrogram & Harmonic Analysis
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span>FFT Window: 2048 pts</span>
                <span>·</span>
                <span>Sample Rate: 48 kHz</span>
              </div>
            </div>

            {/* Spectrogram Canvas */}
            <div className="p-6 bg-neutral-950 flex flex-col items-center justify-center">
              <canvas
                ref={canvasRef}
                width={620}
                height={220}
                className="w-full h-auto rounded-lg border border-neutral-800/80 shadow-inner"
              />

              <div className="w-full flex items-center justify-between text-[11px] font-mono text-neutral-500 mt-2 px-1">
                <span>0 Hz (Fundamental)</span>
                <span>4.8 kHz (Vocoder Inversion Cutoff)</span>
                <span>24 kHz (Nyquist Limit)</span>
              </div>
            </div>

            {/* Audio Stream Diagnostic Bar */}
            <div className="p-4 bg-neutral-950/60 border-t border-neutral-800 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span>SAMPLE: {analysisResult?.sampleName || 'Executive Audio Stream'}</span>
                <span className="text-cyan-400">Duration: {analysisResult?.sampleDuration || '00:12'}</span>
              </div>
              <div className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                {analysisResult?.verdictDescription}
              </div>
            </div>
          </div>

          {/* Prototype Labeling & Architectural Note */}
          <div className="p-4 bg-neutral-900/60 border border-neutral-800/80 rounded-xl flex items-start gap-3 text-xs">
            <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-neutral-200 font-semibold font-mono uppercase">
                Prototype Disclaimer & Production Roadmap
              </div>
              <p className="text-neutral-400 font-sans leading-relaxed">
                Prototype results are simulated using client-side acoustic feature heuristics. They do not constitute scientifically certified forensic validation. Production implementation integrates the Audio-AASIST-V2 graph neural network running on the Snapdragon Hexagon NPU.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Required Primary Metrics Interface */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 space-y-6 shadow-md">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-xs font-semibold text-neutral-200 font-mono uppercase tracking-wider">
                Prototype Analysis Interface
              </h3>
              <span className="text-[10px] font-mono text-neutral-400">HEXAGON NPU TARGET</span>
            </div>

            {isAnalyzing ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3 text-cyan-400 font-mono text-xs">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="text-sm font-semibold tracking-wider">ANALYZING AUDIO...</span>
                <span className="text-neutral-500 text-[11px]">Evaluating spectro-temporal features</span>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6 font-mono">
                {/* 1. Voice Authenticity Meter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">VOICE AUTHENTICITY</span>
                    <span className={`text-base font-bold tabular-nums ${
                      analysisResult.authenticityScore >= 70 ? 'text-emerald-400' :
                      analysisResult.authenticityScore >= 40 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {analysisResult.authenticityScore}%
                    </span>
                  </div>

                  {/* Character Bar: ████████░░ 82% from prompt */}
                  <div className="text-sm tracking-widest font-mono select-none">
                    <span className={
                      analysisResult.authenticityScore >= 70 ? 'text-emerald-400' :
                      analysisResult.authenticityScore >= 40 ? 'text-amber-400' : 'text-rose-400'
                    }>
                      {'█'.repeat(Math.round(analysisResult.authenticityScore / 10))}
                    </span>
                    <span className="text-neutral-800">
                      {'░'.repeat(10 - Math.round(analysisResult.authenticityScore / 10))}
                    </span>
                  </div>

                  <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        analysisResult.authenticityScore >= 70 ? 'bg-emerald-500' :
                        analysisResult.authenticityScore >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${analysisResult.authenticityScore}%` }}
                    />
                  </div>
                </div>

                {/* 2. Potential Synthetic Artifacts */}
                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-between">
                  <span className="text-xs text-neutral-400">POTENTIAL SYNTHETIC ARTIFACTS</span>
                  <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${
                    analysisResult.syntheticArtifactsLevel === 'high'
                      ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                      : analysisResult.syntheticArtifactsLevel === 'medium'
                      ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                      : 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                  }`}>
                    {analysisResult.syntheticArtifactsLevel}
                  </span>
                </div>

                {/* 3. Threat Status */}
                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-between">
                  <span className="text-xs text-neutral-400">THREAT STATUS</span>
                  <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${
                    analysisResult.threatStatus === 'critical_synthetic'
                      ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                      : analysisResult.threatStatus === 'review_required'
                      ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                      : 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                  }`}>
                    {analysisResult.threatStatus === 'critical_synthetic' ? 'REVIEW REQUIRED (SYNTHETIC)' :
                     analysisResult.threatStatus === 'review_required' ? 'REVIEW REQUIRED' : 'SECURE'}
                  </span>
                </div>

                {/* Granular Acoustic Biomarkers */}
                <div className="space-y-2 pt-2 border-t border-neutral-800/80 text-xs">
                  <div className="text-[11px] text-neutral-500 uppercase">Acoustic Biomarkers</div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Spectral Phase Anomaly:</span>
                      <span className="text-neutral-200 tabular-nums">{analysisResult.spectralAnomalies}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Prosody Discontinuity:</span>
                      <span className="text-neutral-200 tabular-nums">{analysisResult.prosodyDiscontinuity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Vocal Tract Consistency:</span>
                      <span className="text-neutral-200 tabular-nums">{analysisResult.vocalTractConsistency}%</span>
                    </div>
                  </div>
                </div>

                {/* Production Model Target */}
                <div className="p-3 bg-neutral-950 border border-neutral-800/80 rounded-lg text-[11px] text-neutral-400 flex items-center justify-between">
                  <span>Target: {analysisResult.modelTarget}</span>
                  <span className="text-cyan-400">Local NPU</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
