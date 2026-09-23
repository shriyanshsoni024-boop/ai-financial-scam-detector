'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnalysisResult } from '@/types/scam';
import RiskSummary from '@/components/RiskSummary';
import RedFlagCard from '@/components/RedFlagCard';
import RecommendationCard from '@/components/RecommendationCard';
import SafetyWarning from '@/components/SafetyWarning';
import Disclaimer from '@/components/Disclaimer';
import { SAMPLE_TEST_CASES } from '@/lib/sample-data';
import { analyzeScam } from '@/lib/engine/analyzer';
import {
  ArrowLeft,
  Share2,
  Check,
  ShieldAlert,
  FileText,
  ImageIcon,
  Globe,
  RotateCcw
} from 'lucide-react';

export default function ResultPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAnalysis() {
      if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem('last_scam_analysis');
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as AnalysisResult;
            if (isMounted) {
              setResult(parsed);
              setLoading(false);
            }
            return;
          } catch (e) {
            console.error('Error parsing stored analysis:', e);
          }
        }
      }

      // Fallback
      try {
        const defaultRes = await analyzeScam(SAMPLE_TEST_CASES[0].text);
        if (isMounted) {
          setResult(defaultRes);
        }
      } catch (e) {
        console.error('Failed to load fallback analysis:', e);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAnalysis();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleShare = () => {
    if (!result) return;
    const shareText = `⚠️ SCAMSHIELD Threat Assessment\nCategory: ${result.category}\nRisk Level: ${result.riskLevel}\nScore: ${result.riskScore}/100\nSignals: ${result.redFlags.map((f) => f.title).join(', ')}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#b6ff00] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#888888] font-medium">Evaluating security heuristics...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-12 h-12 rounded-full bg-[#111111] border border-white/10 text-[#888888] flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6 text-[#b6ff00]" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-[#f2f2f2]">No Recent Analysis Found</h2>
          <p className="text-xs text-[#888888]">Submit a message, screenshot, or URL to begin inspection.</p>
        </div>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#b6ff00] text-[#050505] text-xs font-semibold rounded-full transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Open Scanner</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
      {/* Top Navigation & Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#888888] hover:text-[#f2f2f2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#b6ff00]" />
          <span>Return to Scanner</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#121212] hover:bg-[#1a1a1a] text-[#f2f2f2] border border-white/10 text-xs font-medium rounded-full transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#b6ff00]" /> : <Share2 className="w-3.5 h-3.5 text-[#888888]" />}
            <span>{copied ? 'Copied' : 'Share Report'}</span>
          </button>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#b6ff00] hover:bg-[#c9ff33] text-[#050505] text-xs font-bold rounded-full transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </Link>
        </div>
      </div>

      {/* Asset Inspection (Screenshot or URL or Text) */}
      {result.screenshotUrl ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-[#0e0e0e] border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
              <div className="flex items-center gap-2 text-[#f2f2f2] font-semibold">
                <ImageIcon className="w-4 h-4 text-[#b6ff00]" />
                <span>Original Screenshot</span>
              </div>
            </div>
            <div className="bg-[#050505] border border-white/5 rounded-lg p-2 flex items-center justify-center max-h-56 overflow-hidden">
              <Image
                src={result.screenshotUrl}
                alt="Analyzed Screenshot Asset"
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
                <span>Extracted Text</span>
              </div>
              <span className="text-[10px] text-[#888888] font-mono">{result.analyzedText.length} chars</span>
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
      ) : result.inputType === 'url' && result.urlDetails ? (
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
      ) : (
        /* Text Analysis Message Content */
        <div className="p-5 rounded-xl bg-[#0e0e0e] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#f2f2f2] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#b6ff00]" />
              <span>Analyzed Content</span>
            </span>
            <span className="text-[#666666] font-mono text-[11px]">{result.analyzedText.length} chars</span>
          </div>
          <p className="text-xs text-[#a3a3a3] leading-relaxed break-words bg-[#080808] p-3 rounded-lg border border-white/5">
            &ldquo;{result.analyzedText}&rdquo;
          </p>
        </div>
      )}

      {/* Main Diagnostic Summary */}
      <RiskSummary result={result} />

      {/* Red Flags List (Numbered evidence - Top 3 default) */}
      <RedFlagCard redFlags={result.redFlags} />

      {/* Recommended vs Prohibited Actions */}
      <RecommendationCard
        recommendedActions={result.recommendedActions}
        avoidActions={result.avoidActions}
      />

      {/* Safety & Legal Disclaimers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <SafetyWarning variant="card" />
        <Disclaimer />
      </div>
    </div>
  );
}
