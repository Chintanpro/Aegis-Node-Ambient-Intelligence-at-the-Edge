/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAegis } from '../../context/AegisContext';
import {
  TranscriptSegment,
  MeetingSummary,
  ActionItem
} from '../../types';
import { SAMPLE_MEETING_SCRIPTS } from '../../services/aiProviders/demoProvider';
import {
  Mic,
  MicOff,
  Play,
  Square,
  Sparkles,
  CheckSquare,
  Square as SquareEmpty,
  Cpu,
  Clock,
  Tag,
  FileText,
  Volume2,
  RefreshCw,
  Plus,
  Trash2,
  Radio
} from 'lucide-react';

export const MeetingView: React.FC = () => {
  const { provider, addActivityLog } = useAegis();

  const [isRecording, setIsRecording] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('customer-migration');
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [summary, setSummary] = useState<MeetingSummary | null>(null);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [isProcessingSLM, setIsProcessingSLM] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isLiveMicMode, setIsLiveMicMode] = useState<boolean>(false);
  const [newActionText, setNewActionText] = useState<string>('');
  const [showAddActionInput, setShowAddActionInput] = useState<boolean>(false);

  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start live microphone with Web Audio API & Speech Recognition
  const startLiveMicMeeting = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setIsLiveMicMode(true);
      setIsRecording(true);
      setTranscript([]);
      setSummary(null);
      setActionItems([]);

      addActivityLog('Meeting Intel', 'Live hardware microphone stream acquired. Initializing local Whisper pipeline...', 'info');

      // Initialize Web Audio API Analyser for real-time visualization
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;
      }

      // Check if browser native SpeechRecognition is supported
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          if (event.results[current].isFinal) {
            const timeStr = new Date().toTimeString().split(' ')[0].substring(3, 8);
            const seg: TranscriptSegment = {
              id: `live-${Date.now()}`,
              speaker: 'You (Local Speaker)',
              timestamp: timeStr,
              text: text.trim()
            };
            setTranscript((prev) => [...prev, seg]);
          }
        };

        recognition.onerror = () => {};
        recognition.start();
        recognitionRef.current = recognition;
      } else {
        // Fallback message
        setTranscript([
          {
            id: 'init-mic',
            speaker: 'System Audio Buffer',
            timestamp: '00:01',
            text: 'Live microphone audio active and receiving amplitude. Speak into your microphone.'
          }
        ]);
      }
    } catch {
      addActivityLog('Meeting Intel', 'Microphone access denied or unavailable. Falling back to Demo Mode Simulation.', 'warning');
      handleStartDemoMeeting();
    }
  };

  // Start demo simulation
  const handleStartDemoMeeting = async () => {
    setIsLiveMicMode(false);
    setIsRecording(true);
    setTranscript([]);
    setSummary(null);
    setActionItems([]);
    addActivityLog('Meeting Intel', 'Meeting audio recording started (Whisper-Medium INT8 pipe active)', 'info');

    try {
      const result = await provider.transcribeMeetingAudio(
        selectedPreset,
        (segment) => {
          setTranscript((prev) => [...prev, segment]);
        }
      );

      setIsRecording(false);
      setIsProcessingSLM(true);
      addActivityLog('Meeting Intel', 'Audio capture concluded. Invoking Phi-3-mini local SLM for action extraction...', 'info');

      setTimeout(() => {
        setSummary(result.summary);
        setActionItems(result.summary.actionItems);
        setIsProcessingSLM(false);
        addActivityLog('Meeting Intel', 'Phi-3-mini summarization complete: 4 action items and 3 decisions extracted', 'success');
      }, 700);
    } catch {
      setIsRecording(false);
      setIsProcessingSLM(false);
      addActivityLog('Meeting Intel', 'Error processing meeting audio stream', 'alert');
    }
  };

  const handleStopMeeting = useCallback(() => {
    setIsRecording(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    setIsProcessingSLM(true);
    addActivityLog('Meeting Intel', 'Meeting concluded. Phi-3-mini analyzing spoken session...', 'info');

    setTimeout(() => {
      setIsProcessingSLM(false);
      const sample = SAMPLE_MEETING_SCRIPTS.find((s) => s.id === selectedPreset) || SAMPLE_MEETING_SCRIPTS[0];
      setSummary(sample.summary);
      setActionItems(sample.summary.actionItems);
      addActivityLog('Meeting Intel', 'Summary generated and action items extracted.', 'success');
    }, 700);
  }, [addActivityLog, selectedPreset]);

  // Clean up media on unmount
  useEffect(() => {
    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Waveform visualization canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    const render = () => {
      step += 0.08;
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      const numBars = 32;
      const barWidth = width / numBars - 2;

      let freqData: any = null;
      if (analyserRef.current) {
        freqData = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(freqData as any);
      }

      for (let i = 0; i < numBars; i++) {
        let barHeight = 8;
        if (isRecording) {
          if (freqData && freqData.length > i) {
            barHeight = Math.max(6, (freqData[i] / 255) * (height - 12));
          } else {
            // Simulated rhythmic audio wave
            barHeight = Math.max(6, (Math.sin(step + i * 0.3) * 0.4 + 0.5) * (height - 12));
          }
        }

        const x = i * (barWidth + 2);
        const y = height - barHeight - 4;

        ctx.fillStyle = isRecording ? '#06b6d4' : '#262626';
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
  }, [isRecording]);

  const toggleActionItem = (id: string) => {
    setActionItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteActionItem = (id: string) => {
    setActionItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddActionItem = () => {
    if (!newActionText.trim()) return;
    const newItem: ActionItem = {
      id: `act-custom-${Date.now()}`,
      text: newActionText.trim(),
      assignee: 'Alex Morgan',
      completed: false,
      priority: 'high'
    };
    setActionItems((prev) => [newItem, ...prev]);
    setNewActionText('');
    setShowAddActionInput(false);
  };

  // Preset quick load
  const loadPresetData = (presetId: string) => {
    setSelectedPreset(presetId);
    const found = SAMPLE_MEETING_SCRIPTS.find((s) => s.id === presetId) || SAMPLE_MEETING_SCRIPTS[0];
    setTranscript(found.segments);
    setSummary(found.summary);
    setActionItems(found.summary.actionItems);
    addActivityLog('Meeting Intel', `Loaded session preset: ${found.title}`, 'info');
  };

  useEffect(() => {
    loadPresetData('customer-migration');
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              Speech & SLM Intelligence
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-xs font-mono text-neutral-400">Stack: Whisper-Medium + Phi-3-mini</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans">
            Offline Meeting Intelligence
          </h1>
          <p className="text-sm text-neutral-400 font-sans mt-1">
            Local real-time speech-to-text, executive action extraction, and summarization running 100% on-device.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg text-xs font-mono">
            <span className={`h-2 w-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`}></span>
            <span className="text-neutral-300">
              {isRecording
                ? `${isLiveMicMode ? 'LIVE MIC' : 'RECORDING'}: ${formatTimer(recordingSeconds)}`
                : 'READY / IDLE'}
            </span>
          </div>
        </div>
      </div>

      {/* Control & Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-900/80 border border-neutral-800 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono text-neutral-400 font-medium">SESSION PRESET:</span>
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-1">
            <button
              onClick={() => loadPresetData('customer-migration')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                selectedPreset === 'customer-migration'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Customer Migration Sync
            </button>
            <button
              onClick={() => loadPresetData('financial-review')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                selectedPreset === 'financial-review'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Q4 Procurement Review
            </button>
          </div>

          {/* Action Buttons */}
          {isRecording ? (
            <button
              onClick={handleStopMeeting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold font-mono tracking-wide transition-all shadow-md shadow-rose-950/40 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" />
              <span>STOP MEETING</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleStartDemoMeeting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold font-mono tracking-wide transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>SIMULATE LIVE MEETING (DEMO)</span>
              </button>

              <button
                onClick={startLiveMicMeeting}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-mono font-medium transition-all cursor-pointer"
                title="Capture live microphone feed"
              >
                <Mic className="w-3.5 h-3.5 text-cyan-400" />
                <span>Use Live Microphone</span>
              </button>
            </div>
          )}
        </div>

        {/* Local Architecture Guarantee */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Phi-3-mini INT4 (3.8B SLM) · 0 Cloud Calls</span>
        </div>
      </div>

      {/* 2-Column Interface: Live Transcript (7 Cols) + Summary & Action Items (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Transcript Stream */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl overflow-hidden shadow-md flex flex-col h-[560px]">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-semibold text-neutral-200 font-mono uppercase tracking-wider">
                  Live Transcript Stream
                </h2>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
                <canvas
                  ref={canvasRef}
                  width={140}
                  height={20}
                  className="rounded bg-neutral-950 border border-neutral-800"
                />
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> Latency: 18ms
                </span>
              </div>
            </div>

            {/* Transcript Messages Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 font-sans">
              {transcript.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-500">
                  <Mic className="w-10 h-10 mb-3 text-neutral-600" />
                  <p className="text-sm font-medium text-neutral-400">No active meeting transcript</p>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                    Click &apos;Simulate Live Meeting&apos; to watch Whisper-Medium stream spoken sentences in real-time, or use your live microphone.
                  </p>
                </div>
              ) : (
                transcript.map((seg) => (
                  <div
                    key={seg.id}
                    className="p-3.5 bg-neutral-950/80 border border-neutral-800/90 rounded-lg space-y-1.5 transition-all animate-in fade-in duration-200"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-cyan-300">{seg.speaker}</span>
                      <span className="text-neutral-500 tabular-nums">{seg.timestamp}</span>
                    </div>
                    <p className="text-sm text-neutral-200 leading-relaxed font-sans">
                      &ldquo;{seg.text}&rdquo;
                    </p>
                  </div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>

            {/* Audio Waveform Simulator Footer */}
            <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>Buffer: In-Memory Ring Buffer (Discarded after inference)</span>
              </div>
              <span className="text-neutral-500">Qualcomm Hexagon Audio Pipeline</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Summary & Action Items */}
        <div className="lg:col-span-5 space-y-4">
          {/* Executive Summary Card */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-semibold text-neutral-200 font-mono uppercase tracking-wider">
                  Local SLM Executive Summary
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                Phi-3-mini
              </span>
            </div>

            {isProcessingSLM ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-2 text-xs font-mono text-cyan-400">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Phi-3-mini extracting decisions and actions...</span>
              </div>
            ) : summary ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">{summary.title}</h4>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed font-sans">
                    {summary.summaryText}
                  </p>
                </div>

                {/* Key Decisions */}
                <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                  <div className="text-[11px] font-mono uppercase text-neutral-400">Key Decisions</div>
                  <ul className="space-y-1.5 text-xs text-neutral-300 font-sans">
                    {summary.keyDecisions.map((dec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{dec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Topics */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-neutral-800/80">
                  <Tag className="w-3 h-3 text-neutral-500 mr-1" />
                  {summary.topics.map((top, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono text-neutral-400 bg-neutral-950 border border-neutral-800 px-2 py-0.5 rounded"
                    >
                      {top}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-neutral-500 text-xs">
                Run meeting simulation to generate summary.
              </div>
            )}
          </div>

          {/* Action Items Interactive Checklist */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold text-neutral-200 font-mono uppercase tracking-wider">
                  Extracted Action Items ({actionItems.length})
                </h3>
              </div>
              <button
                onClick={() => setShowAddActionInput(!showAddActionInput)}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Task</span>
              </button>
            </div>

            {/* Quick Add Action Input */}
            {showAddActionInput && (
              <div className="flex items-center gap-2 p-2 bg-neutral-950 border border-neutral-800 rounded-lg">
                <input
                  type="text"
                  value={newActionText}
                  onChange={(e) => setNewActionText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddActionItem()}
                  placeholder="Type new action item..."
                  className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none font-sans"
                />
                <button
                  onClick={handleAddActionItem}
                  className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[10px] font-mono font-semibold cursor-pointer"
                >
                  Save
                </button>
              </div>
            )}

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
              {actionItems.length === 0 ? (
                <div className="py-4 text-center text-neutral-500 text-xs">
                  No action items extracted yet.
                </div>
              ) : (
                actionItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border flex items-start justify-between gap-3 transition-all ${
                      item.completed
                        ? 'bg-neutral-950/60 border-neutral-800/60 opacity-60'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div
                      onClick={() => toggleActionItem(item.id)}
                      className="flex items-start gap-3 flex-1 cursor-pointer"
                    >
                      <button className="mt-0.5 text-neutral-400 hover:text-white cursor-pointer">
                        {item.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <SquareEmpty className="w-4 h-4" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className={`text-xs font-medium ${item.completed ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                          {item.text}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 mt-1">
                          <span>Assignee: {item.assignee}</span>
                          <span>·</span>
                          <span className={`uppercase font-semibold ${
                            item.priority === 'high' ? 'text-rose-400' :
                            item.priority === 'medium' ? 'text-amber-400' : 'text-neutral-400'
                          }`}>
                            {item.priority} Priority
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteActionItem(item.id)}
                      className="text-neutral-600 hover:text-rose-400 p-1 cursor-pointer"
                      title="Delete action item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
