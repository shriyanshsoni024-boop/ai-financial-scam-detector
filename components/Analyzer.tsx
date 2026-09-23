'use client';

import { useState } from 'react';
import Image from 'next/image';
import TextAnalyzer from './TextAnalyzer';
import ScreenshotAnalyzer from './ScreenshotAnalyzer';
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
  Link as LinkIcon
} from 'lucide-react';

interface AnalyzerProps {
  initialResult?: AnalysisResult | null;
  redirectToResult?: boolean;
}

export default function Analyzer({
  initialResult = null,
  redirectToResult = false
}: AnalyzerProps) {
  const [activeMode, setActiveMode] = useState<'text' | 'screenshot'>('text');
  const [result, setResult] = useState<AnalysisResult | null>(initialResult);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const handleReset = () => {
    setResult(null);
  };

  const handleShare = () => {
    if (!result) return;
    const shareText = `⚠️ SENTINELSHIELD Threat Assessment\nCategory: ${result.category}\nRisk Level: ${result.riskLevel}\nScore: ${result.riskScore}/100\nRed Flags: ${result.redFlags.map((f) => f.title).join(', ')}\nAdvice: Verify independently before taking any action.`;
    navigator.clipboard.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="w-full space-y-6 font-mono">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[#292929] pb-3">
        <button
          type="button"
          onClick={() => setActiveMode('text')}
          className={`flex items-center gap-2 px-4 py-2 text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer border ${
            activeMode === 'text'
              ? 'bg-[#111111] text-[#b6ff00] border-[#b6ff00]'
              : 'bg-[#0a0a0a] text-[#888888] border-[#292929] hover:text-[#f2f2f2]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>[ TEXT ANALYSIS ]</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('screenshot')}
          className={`flex items-center gap-2 px-4 py-2 text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer border ${
            activeMode === 'screenshot'
              ? 'bg-[#111111] text-[#b6ff00] border-[#b6ff00]'
              : 'bg-[#0a0a0a] text-[#888888] border-[#292929] hover:text-[#f2f2f2]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>[ SCREENSHOT ANALYSIS ]</span>
        </button>
      </div>

      {/* Input Section */}
      {activeMode === 'text' ? (
        <TextAnalyzer
          onAnalysisComplete={(res) => setResult(res)}
          redirectToResult={redirectToResult}
        />
      ) : (
        <ScreenshotAnalyzer
          onAnalysisComplete={(res) => setResult(res)}
          redirectToResult={redirectToResult}
        />
      )}

      {/* Result Section (When available) */}
      {result && (
        <div id="analysis-result-view" className="space-y-6 pt-6 border-t border-[#292929]">
          {/* Action Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-4">
            <div className="flex items-center gap-2.5 text-[#f2f2f2] text-xs font-bold uppercase tracking-wider">
              <FileCheck className="w-4 h-4 text-[#b6ff00]" />
              <span>
                Security Assessment Output{' '}
                {result.inputType === 'screenshot' && (
                  <span className="text-[#b6ff00] font-normal">[SCREENSHOT OCR]</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-[#191919] text-[#f2f2f2] text-xs border border-[#292929] hover:border-[#b6ff00] transition-colors cursor-pointer"
              >
                {copiedShare ? (
                  <Check className="w-3.5 h-3.5 text-[#b6ff00]" />
                ) : (
                  <Share2 className="w-3.5 h-3.5 text-[#888888]" />
                )}
                <span>{copiedShare ? 'Copied' : 'Copy Summary'}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-[#191919] text-[#888888] hover:text-[#f2f2f2] text-xs border border-[#292929] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#888888]" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Screenshot Source & Detected URLs (If from screenshot) */}
          {result.screenshotUrl && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Screenshot Box */}
              <div className="p-5 bg-[#111111] border border-[#292929] space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-[#292929] pb-2">
                  <div className="flex items-center gap-2 text-[#f2f2f2] font-bold uppercase tracking-wider">
                    <ImageIcon className="w-4 h-4 text-[#b6ff00]" />
                    <span>Original Screenshot</span>
                  </div>
                  <span className="text-[10px] text-[#888888]">EVALUATED ASSET</span>
                </div>
                <div className="bg-[#050505] border border-[#292929] p-2 flex items-center justify-center max-h-60 overflow-hidden">
                  <Image
                    src={result.screenshotUrl}
                    alt="Analyzed Screenshot"
                    width={600}
                    height={300}
                    unoptimized
                    className="max-h-56 w-auto object-contain"
                  />
                </div>
              </div>

              {/* Extracted Text & Detected URLs Box */}
              <div className="p-5 bg-[#111111] border border-[#292929] space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-[#292929] pb-2">
                  <div className="flex items-center gap-2 text-[#f2f2f2] font-bold uppercase tracking-wider">
                    <FileText className="w-4 h-4 text-[#b6ff00]" />
                    <span>OCR Extracted Text</span>
                  </div>
                  <span className="text-[10px] text-[#888888]">
                    {result.analyzedText.length} chars
                  </span>
                </div>

                <pre className="text-xs text-[#d1d1d1] leading-relaxed whitespace-pre-wrap font-mono max-h-36 overflow-y-auto bg-[#0a0a0a] p-3 border border-[#292929]">
                  {result.analyzedText}
                </pre>

                {result.detectedUrls && result.detectedUrls.length > 0 && (
                  <div className="pt-2 border-t border-[#292929] space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#f2f2f2]">
                      <LinkIcon className="w-3.5 h-3.5 text-red-400" />
                      <span>Detected URLs ({result.detectedUrls.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.detectedUrls.map((url, i) => (
                        <code
                          key={i}
                          className="px-2 py-0.5 bg-[#0a0a0a] border border-red-500/50 text-red-400 text-xs"
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

          {/* Risk Summary Evaluation */}
          <RiskSummary result={result} />

          {/* Numbered Red Flags & Evidence */}
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
