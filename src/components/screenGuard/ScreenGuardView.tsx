/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAegis } from '../../context/AegisContext';
import { DetectedPII } from '../../types';
import { SAMPLE_CRM_PII_REGIONS } from '../../services/aiProviders/demoProvider';
import {
  EyeOff,
  Eye,
  Upload,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Info,
  Layers,
  Sparkles,
  Sliders,
  Image as ImageIcon,
  Layout,
  Lock,
  Unlock
} from 'lucide-react';

export const ScreenGuardView: React.FC = () => {
  const { provider, addActivityLog } = useAegis();

  const [activeTab, setActiveTab] = useState<'sample' | 'upload'>('sample');
  const [crmDisplayMode, setCrmDisplayMode] = useState<'live_form' | 'captured_image'>('live_form');
  const [viewMode, setViewMode] = useState<'protected' | 'original'>('protected');
  const [redactionMode, setRedactionMode] = useState<'blackout' | 'blur' | 'tokenize'>('blackout');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedPII, setDetectedPII] = useState<DetectedPII[]>(SAMPLE_CRM_PII_REGIONS);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [selectedPIIId, setSelectedPIIId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger analysis
  const runAnalysis = async (mode: 'sensitive_crm' | 'general_screen' = 'sensitive_crm', source: string = 'sample') => {
    setIsAnalyzing(true);
    addActivityLog('Screen Guard', `Initiating screen analysis using local pipeline [${source}]`, 'info');

    try {
      const results = await provider.detectPII(source, mode);
      setDetectedPII(results);
      addActivityLog(
        'Screen Guard',
        `Screen analysis complete: ${results.length} sensitive PII entities identified & localized`,
        'success'
      );
    } catch {
      addActivityLog('Screen Guard', 'Inference error during screen scan', 'alert');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadedImageSrc(result);
        setActiveTab('upload');
        runAnalysis('general_screen', 'Uploaded Screenshot');
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEntityRedaction = (id: string) => {
    setDetectedPII((prev) =>
      prev.map((item) => (item.id === id ? { ...item, redacted: !item.redacted } : item))
    );
  };

  const redactAll = (redact: boolean) => {
    setDetectedPII((prev) => prev.map((item) => ({ ...item, redacted: redact })));
    addActivityLog('Screen Guard', redact ? 'All PII redactions activated' : 'All PII redactions temporarily revealed', 'warning');
  };

  const isEntityRedacted = (id: string): boolean => {
    if (viewMode === 'original') return false;
    const found = detectedPII.find((p) => p.id === id);
    return found ? found.redacted : true;
  };

  // Helper to render field content based on current redaction style
  const renderFieldContent = (
    id: string,
    rawText: string,
    maskedText: string,
    tokenText: string
  ) => {
    const redacted = isEntityRedacted(id);

    if (!redacted) {
      return (
        <span className="text-rose-300 font-mono transition-all">
          {rawText}
        </span>
      );
    }

    if (redactionMode === 'blur') {
      return (
        <span className="text-cyan-300 font-mono blur-[5px] select-none transition-all hover:blur-[3px]">
          {rawText}
        </span>
      );
    }

    if (redactionMode === 'tokenize') {
      return (
        <span className="text-cyan-400 font-mono tracking-wider font-semibold transition-all">
          {tokenText}
        </span>
      );
    }

    // Default: Blackout
    return (
      <span className="text-cyan-400 font-mono tracking-wider font-semibold transition-all">
        {maskedText}
      </span>
    );
  };

  useEffect(() => {
    runAnalysis('sensitive_crm', 'Sample CRM');
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              Vision & PII Subsystem
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-xs font-mono text-neutral-400">Model: YOLOv8n + FastOCR</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans">
            Real-Time Screen Guard & PII Redaction
          </h1>
          <p className="text-sm text-neutral-400 font-sans mt-1">
            Detects and scrubs confidential customer data, payment credentials, and secrets prior to display or screen sharing.
          </p>
        </div>

        {/* View Toggle Bar (ORIGINAL vs PROTECTED) */}
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-1.5 rounded-lg">
          <span className="text-xs font-mono text-neutral-400 px-2 font-medium">VIEW:</span>
          <button
            onClick={() => setViewMode('original')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
              viewMode === 'original'
                ? 'bg-rose-950/80 border border-rose-800 text-rose-300 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>ORIGINAL (UNMASKED)</span>
          </button>
          <button
            onClick={() => setViewMode('protected')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
              viewMode === 'protected'
                ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PROTECTED (REDACTED)</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Source selection & Redaction Styles */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-900/80 border border-neutral-800 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono text-neutral-400 font-medium">INPUT SOURCE:</span>
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-1">
            <button
              onClick={() => {
                setActiveTab('sample');
                runAnalysis('sensitive_crm', 'Sample CRM');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeTab === 'sample'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sample Enterprise CRM
            </button>
            <button
              onClick={() => {
                if (uploadedImageSrc) {
                  setActiveTab('upload');
                  runAnalysis('general_screen', 'Uploaded Screenshot');
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Upload Custom Image
            </button>
          </div>

          {activeTab === 'sample' && (
            <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setCrmDisplayMode('live_form')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all cursor-pointer ${
                  crmDisplayMode === 'live_form'
                    ? 'bg-cyan-950 text-cyan-300 font-medium'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Interactive Live Form</span>
              </button>
              <button
                onClick={() => setCrmDisplayMode('captured_image')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all cursor-pointer ${
                  crmDisplayMode === 'captured_image'
                    ? 'bg-cyan-950 text-cyan-300 font-medium'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Captured Screen View</span>
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Screenshot</span>
          </button>

          <button
            onClick={() => runAnalysis(activeTab === 'sample' ? 'sensitive_crm' : 'general_screen', activeTab)}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Re-Scan Screen</span>
          </button>
        </div>

        {/* Redaction Visual Style Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-400">STYLE:</span>
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-1 text-xs font-mono">
            {(['blackout', 'blur', 'tokenize'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setRedactionMode(mode)}
                className={`px-2.5 py-1 rounded capitalize transition-all cursor-pointer ${
                  redactionMode === mode
                    ? 'bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Screen Canvas Area */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl relative">
            {/* Window Chrome Mockup */}
            <div className="bg-neutral-950 px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                </div>
                <span className="text-neutral-400 ml-2">Enterprise CRM — Account Portal</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-cyan-400">
                  {viewMode === 'protected' ? '● Redaction Layer Active' : '○ Raw Screen Pass-Through'}
                </span>
                <span className="text-neutral-600">|</span>
                <span className="text-[10px] text-amber-400/90 bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.5 rounded">
                  SYNTHETIC DEMO DATA
                </span>
              </div>
            </div>

            {/* Screen Content Viewport */}
            <div className="relative min-h-[460px] bg-neutral-950 p-6 flex items-center justify-center overflow-hidden">
              {activeTab === 'upload' && uploadedImageSrc ? (
                /* Uploaded User Image with Overlaid Bounding Boxes */
                <div className="relative w-full max-w-2xl mx-auto rounded-lg overflow-hidden border border-neutral-800">
                  <img
                    src={uploadedImageSrc}
                    alt="Uploaded Screen"
                    className="w-full h-auto object-contain block"
                  />
                  {detectedPII.map((item) => {
                    const isRedacted = viewMode === 'protected' && item.redacted;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedPIIId(item.id);
                          toggleEntityRedaction(item.id);
                        }}
                        style={{
                          left: `${item.box.x}%`,
                          top: `${item.box.y}%`,
                          width: `${item.box.width}%`,
                          height: `${item.box.height}%`
                        }}
                        className={`absolute rounded transition-all cursor-pointer flex items-center justify-center text-[10px] font-mono font-semibold ${
                          isRedacted
                            ? redactionMode === 'blackout'
                              ? 'bg-neutral-950 border border-cyan-500 text-neutral-400'
                              : redactionMode === 'blur'
                              ? 'backdrop-blur-md bg-black/40 border border-cyan-500 text-transparent'
                              : 'bg-neutral-900 border border-cyan-500 text-cyan-300'
                            : 'border-2 border-dashed border-rose-500 bg-rose-500/20 text-rose-200'
                        }`}
                        title="Click to toggle redaction"
                      >
                        {isRedacted ? (
                          redactionMode === 'tokenize' ? '[TOKENIZED]' : '[REDACTED]'
                        ) : (
                          item.label
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : activeTab === 'sample' && crmDisplayMode === 'captured_image' ? (
                /* Captured Screen Screenshot with Overlaid Interactive Bounding Boxes */
                <div className="relative w-full max-w-3xl mx-auto rounded-lg overflow-hidden border border-neutral-800 shadow-2xl">
                  <img
                    src="/src/assets/images/crm_sample_dashboard_1790706214451.jpg"
                    alt="Captured CRM Dashboard"
                    className="w-full h-auto object-cover block"
                  />
                  {/* Bounding box overlays positioned over the image */}
                  {detectedPII.map((item) => {
                    const isRedacted = viewMode === 'protected' && item.redacted;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedPIIId(item.id);
                          toggleEntityRedaction(item.id);
                        }}
                        style={{
                          left: `${item.box.x}%`,
                          top: `${item.box.y}%`,
                          width: `${item.box.width}%`,
                          height: `${item.box.height}%`
                        }}
                        className={`absolute rounded transition-all cursor-pointer flex items-center justify-center text-[10px] font-mono font-semibold shadow-lg ${
                          isRedacted
                            ? redactionMode === 'blackout'
                              ? 'bg-neutral-950/95 border-2 border-cyan-500 text-cyan-300'
                              : redactionMode === 'blur'
                              ? 'backdrop-blur-xl bg-black/50 border-2 border-cyan-500 text-transparent'
                              : 'bg-neutral-950/90 border-2 border-cyan-500 text-cyan-300'
                            : 'border-2 border-dashed border-rose-500 bg-rose-500/30 text-rose-100'
                        }`}
                        title={`Click to toggle: ${item.label}`}
                      >
                        {isRedacted ? (
                          <div className="flex items-center gap-1 px-1">
                            <Lock className="w-3 h-3 text-cyan-400" />
                            <span>{redactionMode === 'tokenize' ? '[TOKEN]' : '[REDACTED]'}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-1">
                            <Unlock className="w-3 h-3 text-rose-300" />
                            <span>{item.label}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* High-Fidelity Interactive Synthetic CRM Dashboard Form */
                <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-inner space-y-6">
                  {/* CRM Header */}
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300 font-bold text-sm">
                        AM
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">Alex Morgan</h3>
                          <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-mono">
                            Enterprise Tier
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">Account status: Active · Verified</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-neutral-400 font-mono">SYNTHETIC CRM DATA</div>
                      <div className="text-xs text-emerald-400 font-mono font-semibold">HP Security Test Suite</div>
                    </div>
                  </div>

                  {/* 2-Column CRM Fields with Interactive Redaction Blocks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Column 1: Personal & Contact */}
                    <div className="space-y-4">
                      {/* Customer ID */}
                      <div
                        onClick={() => toggleEntityRedaction('pii-1')}
                        className="space-y-1 cursor-pointer group"
                      >
                        <label className="text-[11px] font-mono text-neutral-400 uppercase flex items-center justify-between">
                          <span>Customer ID</span>
                          <span className="text-[10px] text-neutral-500 group-hover:text-cyan-400">Click to toggle</span>
                        </label>
                        <div className="p-2.5 bg-neutral-950 border border-neutral-800 group-hover:border-cyan-700/60 rounded-lg flex items-center justify-between text-xs font-mono">
                          {renderFieldContent('pii-1', 'ACC-482913', 'ACC-••••••', '[TOKEN_CUST_482913]')}
                          <span className="text-[10px] text-neutral-500">[Detected ID]</span>
                        </div>
                      </div>

                      {/* Email */}
                      <div
                        onClick={() => toggleEntityRedaction('pii-2')}
                        className="space-y-1 cursor-pointer group"
                      >
                        <label className="text-[11px] font-mono text-neutral-400 uppercase flex items-center justify-between">
                          <span>Email Address</span>
                          <span className="text-[10px] text-neutral-500 group-hover:text-cyan-400">Click to toggle</span>
                        </label>
                        <div className="p-2.5 bg-neutral-950 border border-neutral-800 group-hover:border-cyan-700/60 rounded-lg flex items-center justify-between text-xs font-mono">
                          {renderFieldContent('pii-2', 'alex.morgan@example.com', 'a•••••••••••@example.com', '[TOKEN_EMAIL_SECURE]')}
                          <span className="text-[10px] text-neutral-500">[RFC-5322]</span>
                        </div>
                      </div>

                      {/* Phone */}
                      <div
                        onClick={() => toggleEntityRedaction('pii-3')}
                        className="space-y-1 cursor-pointer group"
                      >
                        <label className="text-[11px] font-mono text-neutral-400 uppercase flex items-center justify-between">
                          <span>Phone Number</span>
                          <span className="text-[10px] text-neutral-500 group-hover:text-cyan-400">Click to toggle</span>
                        </label>
                        <div className="p-2.5 bg-neutral-950 border border-neutral-800 group-hover:border-cyan-700/60 rounded-lg flex items-center justify-between text-xs font-mono">
                          {renderFieldContent('pii-3', '+1 555 018 2934', '+1 555 ••• ••••', '[TOKEN_PHONE_E164]')}
                          <span className="text-[10px] text-neutral-500">[E.164]</span>
                        </div>
                      </div>

                      {/* Address */}
                      <div
                        onClick={() => toggleEntityRedaction('pii-4')}
                        className="space-y-1 cursor-pointer group"
                      >
                        <label className="text-[11px] font-mono text-neutral-400 uppercase flex items-center justify-between">
                          <span>Billing Address</span>
                          <span className="text-[10px] text-neutral-500 group-hover:text-cyan-400">Click to toggle</span>
                        </label>
                        <div className="p-2.5 bg-neutral-950 border border-neutral-800 group-hover:border-cyan-700/60 rounded-lg flex items-center justify-between text-xs font-mono">
                          {renderFieldContent('pii-4', '742 Evergreen Terrace, Springfield, OR', '•••••••••••••••••••••••••••••••••••••', '[TOKEN_ADDR_RESTRICTED]')}
                          <span className="text-[10px] text-neutral-500">[Street]</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Financial & Payment */}
                    <div className="space-y-4">
                      {/* Credit Card */}
                      <div
                        onClick={() => toggleEntityRedaction('pii-5')}
                        className="space-y-1 cursor-pointer group"
                      >
                        <label className="text-[11px] font-mono text-neutral-400 uppercase flex items-center justify-between">
                          <span>Payment Method (PCI-DSS)</span>
                          <span className="text-[10px] text-neutral-500 group-hover:text-cyan-400">Click to toggle</span>
                        </label>
                        <div className="p-2.5 bg-neutral-950 border border-neutral-800 group-hover:border-cyan-700/60 rounded-lg flex items-center justify-between text-xs font-mono">
                          {renderFieldContent('pii-5', '4111 1111 1111 1111', '•••• •••• •••• 1111', '[TOKEN_PAN_VAULT_91]')}
                          <span className="text-[10px] text-neutral-500">[Visa]</span>
                        </div>
                      </div>

                      {/* Balance */}
                      <div
                        onClick={() => toggleEntityRedaction('pii-6')}
                        className="space-y-1 cursor-pointer group"
                      >
                        <label className="text-[11px] font-mono text-neutral-400 uppercase flex items-center justify-between">
                          <span>Current Account Balance</span>
                          <span className="text-[10px] text-neutral-500 group-hover:text-cyan-400">Click to toggle</span>
                        </label>
                        <div className="p-2.5 bg-neutral-950 border border-neutral-800 group-hover:border-cyan-700/60 rounded-lg flex items-center justify-between text-xs font-mono">
                          {renderFieldContent('pii-6', '$84,250.00 USD', '$••,•••.•• USD', '[TOKEN_BAL_CONFIDENTIAL]')}
                          <span className="text-[10px] text-neutral-500">[Ledger]</span>
                        </div>
                      </div>

                      {/* Tax ID */}
                      <div
                        onClick={() => toggleEntityRedaction('pii-7')}
                        className="space-y-1 cursor-pointer group"
                      >
                        <label className="text-[11px] font-mono text-neutral-400 uppercase flex items-center justify-between">
                          <span>Tax Identification (SSN/TIN)</span>
                          <span className="text-[10px] text-neutral-500 group-hover:text-cyan-400">Click to toggle</span>
                        </label>
                        <div className="p-2.5 bg-neutral-950 border border-neutral-800 group-hover:border-cyan-700/60 rounded-lg flex items-center justify-between text-xs font-mono">
                          {renderFieldContent('pii-7', '984-02-XXXX', '•••-••-••••', '[TOKEN_SSN_MASKED]')}
                          <span className="text-[10px] text-neutral-500">[IRS]</span>
                        </div>
                      </div>

                      {/* Protection Badge */}
                      <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-lg flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div className="text-[11px] text-neutral-400 leading-snug">
                          {viewMode === 'protected' ? (
                            <span className="text-emerald-400 font-medium font-mono">
                              Active Shield: {detectedPII.filter((p) => p.redacted).length}/{detectedPII.length} PII items masked on frame buffer.
                            </span>
                          ) : (
                            <span className="text-rose-400 font-medium font-mono">
                              Warning: Unmasked view. Sensitive PII visible to viewers.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Architectural Separation Banner */}
          <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-xl flex items-start gap-3 text-xs">
            <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-neutral-200 font-semibold font-mono uppercase">
                Inference Architecture Separation
              </div>
              <p className="text-neutral-400 font-sans leading-relaxed">
                <strong className="text-white">Prototype Inference:</strong> Client-side geometric OCR & pattern matcher executing in browser sandbox.
                <br />
                <strong className="text-cyan-300">Planned Snapdragon NPU Inference:</strong> YOLOv8n object detection model + Qualcomm FastOCR quantized to INT8, executed directly via Qualcomm QNN Execution Provider on the Hexagon NPU with sub-15ms frame latency.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Detected Entities List & Toggles (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl overflow-hidden shadow-md">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-semibold text-neutral-200 font-mono uppercase tracking-wider">
                  Detected Regions ({detectedPII.length})
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => redactAll(true)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-mono cursor-pointer"
                >
                  Mask All
                </button>
                <span className="text-neutral-700">·</span>
                <button
                  onClick={() => redactAll(false)}
                  className="text-[11px] text-neutral-400 hover:text-white underline font-mono cursor-pointer"
                >
                  Unmask All
                </button>
              </div>
            </div>

            <div className="p-3 max-h-[440px] overflow-y-auto space-y-2">
              {detectedPII.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPIIId(item.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedPIIId === item.id
                      ? 'bg-neutral-800 border-cyan-500/80 shadow-sm'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white">{item.label}</span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-1.5 py-0.5 rounded">
                      {Math.round(item.confidence * 100)}% Conf
                    </span>
                  </div>

                  <div className="text-xs font-mono text-neutral-400 truncate mb-2">
                    {viewMode === 'protected' && item.redacted ? (
                      <span className="text-emerald-400">
                        {redactionMode === 'tokenize'
                          ? `[TOKEN_${item.category.toUpperCase()}]`
                          : item.maskedText}
                      </span>
                    ) : (
                      <span className="text-rose-300">{item.rawText}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[11px] font-mono">
                    <span className="text-neutral-500 uppercase">{item.category}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEntityRedaction(item.id);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                        item.redacted
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-white'
                      }`}
                    >
                      {item.redacted ? 'Redacted' : 'Pass-Through'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Policy: GDPR / PCI-DSS Strict</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
