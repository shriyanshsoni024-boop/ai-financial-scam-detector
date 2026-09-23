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
  Link as LinkIcon,
  RotateCcw
} from 'lucide-react';

export default function ResultPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAnalysis() {
      // Check for stored session analysis first
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

      // Fallback: analyze test case 1 so page is always useful
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
    const shareText = `⚠️ SENTINELSHIELD Threat Assessment\nCategory: ${result.category}\nRisk Level: ${result.riskLevel}\nScore: ${result.riskScore}/100\nRed Flags: ${result.redFlags.map((f) => f.title).join(', ')}\nAdvice: Verify independently before taking any action.`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4 font-mono">
        <div className="w-8 h-8 border-2 border-[#b6ff00] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-widest text-[#888888]">Executing Assessment...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 font-mono">
        <div className="w-12 h-12 bg-[#111111] border border-[#292929] text-[#888888] flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6 text-[#b6ff00]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-black uppercase text-[#f2f2f2]">No Recent Analysis Found</h2>
          <p className="text-xs text-[#888888]">Submit a message through the diagnostic terminal.</p>
        </div>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#b6ff00] text-[#050505] text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Open Analyzer</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 font-mono">
      {/* Top Navigation & Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-5">
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#888888] hover:text-[#f2f2f2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#b6ff00]" />
          <span>Return to Terminal</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-[#191919] text-[#f2f2f2] border border-[#292929] hover:border-[#b6ff00] text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#b6ff00]" /> : <Share2 className="w-3.5 h-3.5 text-[#888888]" />}
            <span>{copied ? 'Copied' : 'Share Report'}</span>
          </button>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#b6ff00] hover:bg-[#c9ff33] text-[#050505] text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </Link>
        </div>
      </div>

      {/* Screenshot Asset Inspection (If present) */}
      {result.screenshotUrl ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Screenshot Display */}
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
                alt="Analyzed Screenshot Asset"
                width={600}
                height={300}
                unoptimized
                className="max-h-56 w-auto object-contain"
              />
            </div>
          </div>

          {/* Extracted Text & Detected URLs */}
          <div className="p-5 bg-[#111111] border border-[#292929] space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-[#292929] pb-2">
              <div className="flex items-center gap-2 text-[#f2f2f2] font-bold uppercase tracking-wider">
                <FileText className="w-4 h-4 text-[#b6ff00]" />
                <span>Extracted Text</span>
              </div>
              <span className="text-[10px] text-[#888888]">{result.analyzedText.length} chars</span>
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
      ) : (
        /* Text Analysis Message Content */
        <div className="p-6 bg-[#111111] border border-[#292929] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#f2f2f2]">
              <FileText className="w-4 h-4 text-[#b6ff00]" />
              <span>Analyzed Message Content</span>
            </div>
            <span className="text-[#666666] text-xs">{result.analyzedText.length} characters</span>
          </div>
          <div className="p-4 bg-[#0a0a0a] border border-[#292929] text-xs text-[#d1d1d1] leading-relaxed break-words">
            &ldquo;{result.analyzedText}&rdquo;
          </div>
        </div>
      )}

      {/* Main Diagnostic Summary */}
      <RiskSummary result={result} />

      {/* Red Flags List (Numbered evidence) */}
      <RedFlagCard redFlags={result.redFlags} />

      {/* Recommended vs Prohibited Actions */}
      <RecommendationCard
        recommendedActions={result.recommendedActions}
        avoidActions={result.avoidActions}
      />

      {/* Safety & Legal Disclaimers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <SafetyWarning variant="card" />
        <Disclaimer />
      </div>
    </div>
  );
}
