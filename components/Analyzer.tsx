'use client';

import { useState } from 'react';
import Image from 'next/image';
import TextAnalyzer from './TextAnalyzer';
import ScreenshotAnalyzer from './ScreenshotAnalyzer';
import UrlAnalyzer from './UrlAnalyzer';
import RiskSummary from './RiskSummary';
import RedFlagCard from './RedFlagCard';
import RecommendationCard from './RecommendationCard';
import Disclaimer from './Disclaimer';
import SafetyWarning from './SafetyWarning';
import { AnalysisResult } from '@/types/scam';
import {
  RotateCcw,
  Share2,
  Check,
  FileCheck,
  FileText,
  ImageIcon,
  Globe
} from 'lucide-react';

interface AnalyzerProps {
  initialResult?: AnalysisResult | null;
  redirectToResult?: boolean;
}

export default function Analyzer({
  initialResult = null,
  redirectToResult = false
}: AnalyzerProps) {
  const [activeMode, setActiveMode] = useState<'text' | 'screenshot' | 'url'>('text');
  const [result, setResult] = useState<AnalysisResult | null>(initialResult);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const handleReset = () => {
    setResult(null);
  };

  const handleShare = () => {
    if (!result) return;
    const shareText = `⚠️ SentinelShield Threat Assessment\nCategory: ${result.category}\nRisk Level: ${result.riskLevel}\nScore: ${result.riskScore}/100\nSignals: ${result.redFlags.map((f) => f.title).join(', ')}`;
    navigator.clipboard.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="w-full space-y-6">
      {/* Segmented Mode Switcher */}
      <div className="flex items-center justify-start">
        <div className="p-1 rounded-full bg-[#101010] border border-white/5 inline-flex gap-1">
          <button
            type="button"
            onClick={() => setActiveMode('text')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeMode === 'text'
                ? 'bg-[#1e1e1e] text-[#b6ff00] shadow-sm'
                : 'text-[#888888] hover:text-[#f2f2f2]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('screenshot')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeMode === 'screenshot'
                ? 'bg-[#1e1e1e] text-[#b6ff00] shadow-sm'
                : 'text-[#888888] hover:text-[#f2f2f2]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Screenshot</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeMode === 'url'
                ? 'bg-[#1e1e1e] text-[#b6ff00] shadow-sm'
                : 'text-[#888888] hover:text-[#f2f2f2]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>URL</span>
          </button>
        </div>
      </div>

      {/* Input Section */}
      {activeMode === 'text' && (
        <TextAnalyzer
          onAnalysisComplete={(res) => setResult(res)}
          redirectToResult={redirectToResult}
        />
      )}
      {activeMode === 'screenshot' && (
        <ScreenshotAnalyzer
          onAnalysisComplete={(res) => setResult(res)}
          redirectToResult={redirectToResult}
        />
      )}
      {activeMode === 'url' && (
        <UrlAnalyzer
          onAnalysisComplete={(res) => setResult(res)}
          redirectToResult={redirectToResult}
        />
      )}

      {/* Result Section */}
      {result && (
        <div id="analysis-result-view" className="space-y-6 pt-6 border-t border-white/5">
          {/* Action Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#f2f2f2] text-xs font-bold uppercase tracking-wider">
              <FileCheck className="w-4 h-4 text-[#b6ff00]" />
              <span>Assessment Result</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#121212] hover:bg-[#1a1a1a] text-[#f2f2f2] text-xs font-medium rounded-full border border-white/10 transition-colors cursor-pointer"
              >
                {copiedShare ? <Check className="w-3.5 h-3.5 text-[#b6ff00]" /> : <Share2 className="w-3.5 h-3.5 text-[#888888]" />}
                <span>{copiedShare ? 'Copied' : 'Share'}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#121212] hover:bg-[#1a1a1a] text-[#888888] hover:text-[#f2f2f2] text-xs font-medium rounded-full border border-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Scan</span>
              </button>
            </div>
          </div>

          {/* Screenshot Source Asset (If from screenshot) */}
          {result.screenshotUrl && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-[#0e0e0e] border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2 text-[#f2f2f2] font-semibold">
                    <ImageIcon className="w-4 h-4 text-[#b6ff00]" />
                    <span>Evaluated Screenshot</span>
                  </div>
                </div>
                <div className="bg-[#050505] border border-white/5 rounded-lg p-2 flex items-center justify-center max-h-56 overflow-hidden">
                  <Image
                    src={result.screenshotUrl}
                    alt="Analyzed Screenshot"
                    width={600}
                    height={300}
                    unoptimized
                    className="max-h-52 w-auto object-contain rounded"
                  />
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#0e0e0e] border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2 text-[#f2f2f2] font-semibold">
                    <FileText className="w-4 h-4 text-[#b6ff00]" />
                    <span>OCR Extracted Text</span>
                  </div>
                  <span className="text-[10px] text-[#888888] font-mono">
                    {result.analyzedText.length} chars
                  </span>
                </div>

                <pre className="text-xs text-[#a3a3a3] leading-relaxed whitespace-pre-wrap font-mono max-h-36 overflow-y-auto bg-[#050505] p-3 rounded-lg border border-white/5">
                  {result.analyzedText}
                </pre>

                {result.detectedUrls && result.detectedUrls.length > 0 && (
                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <span className="text-[10px] text-[#888888] font-medium">Detected Links:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.detectedUrls.map((url, i) => (
                        <code
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#141414] border border-red-500/30 text-red-400 text-xs font-mono"
                        >
                          {url}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* URL Asset Inspection (If from URL mode) */}
          {result.inputType === 'url' && result.urlDetails && (
            <div className="p-5 rounded-xl bg-[#0e0e0e] border border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 text-[#f2f2f2] font-semibold">
                  <Globe className="w-4 h-4 text-[#b6ff00]" />
                  <span>Target Domain Overview</span>
                </div>
                <span className="text-[10px] text-[#888888] font-mono">RECONNAISSANCE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-lg bg-[#080808] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#888888] uppercase tracking-wider block">Domain</span>
                  <span className="text-xs font-bold text-[#f2f2f2] font-mono break-all block">{result.urlDetails.domain}</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#080808] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#888888] uppercase tracking-wider block">Protocol</span>
                  <span className={`text-xs font-semibold block ${result.urlDetails.isHttps ? 'text-[#b6ff00]' : 'text-amber-400'}`}>
                    {result.urlDetails.protocol.toUpperCase()} {result.urlDetails.isHttps ? '(Encrypted)' : '(Insecure)'}
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#080808] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#888888] uppercase tracking-wider block">Status</span>
                  <span className={`text-xs font-semibold block ${
                    result.urlDetails.statusLabel === 'Suspicious'
                      ? 'text-red-400'
                      : result.urlDetails.statusLabel === 'Needs Caution'
                      ? 'text-amber-400'
                      : 'text-[#b6ff00]'
                  }`}>
                    {result.urlDetails.statusLabel}
                  </span>
                </div>
              </div>

              {result.urlDetails.keySignals.length > 0 && (
                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[#888888] text-[10px] font-medium mr-1">Signals:</span>
                  {result.urlDetails.keySignals.map((signal, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-[#141414] border border-white/5 text-[#d1d1d1] text-[11px]"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Risk Summary Evaluation */}
          <RiskSummary result={result} />

          {/* Key Signals (Numbered evidence - Top 3 default) */}
          <RedFlagCard redFlags={result.redFlags} />

          {/* Recommended vs Prohibited Actions */}
          <RecommendationCard
            recommendedActions={result.recommendedActions}
            avoidActions={result.avoidActions}
          />

          {/* Safety Warning & Disclaimer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <SafetyWarning variant="card" />
            <Disclaimer />
          </div>
        </div>
      )}
    </div>
  );
}
