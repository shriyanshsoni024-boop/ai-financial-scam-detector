'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeScam } from '@/lib/engine/analyzer';
import { SAMPLE_TEST_CASES } from '@/lib/sample-data';
import { saveScanToHistory } from '@/lib/history';
import { AnalysisResult, SampleTestCase } from '@/types/scam';
import {
  Loader2,
  Trash2,
  Copy,
  Check,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import SafetyWarning from './SafetyWarning';

interface TextAnalyzerProps {
  onAnalysisComplete?: (result: AnalysisResult) => void;
  redirectToResult?: boolean;
  initialText?: string;
}

export default function TextAnalyzer({
  onAnalysisComplete,
  redirectToResult = false,
  initialText = ''
}: TextAnalyzerProps) {
  const router = useRouter();
  const [text, setText] = useState<string>(initialText);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleAnalyze = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Please enter message text to analyze.');
      return;
    }

    if (trimmed.length < 10) {
      setError('Message text is too brief for pattern analysis.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await analyzeScam(trimmed);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('last_scam_analysis', JSON.stringify(result));
        saveScanToHistory(result);
      }

      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }

      if (redirectToResult) {
        router.push('/result');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = (sample: SampleTestCase) => {
    setText(sample.text);
    setError(null);
  };

  const handleClear = () => {
    setText('');
    setError(null);
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-4">
      {/* Sample Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-[#666666] mr-1">Quick Presets:</span>
        {SAMPLE_TEST_CASES.slice(0, 3).map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => loadSample(sample)}
            className="px-3 py-1.5 rounded-full bg-[#121212] hover:bg-[#1a1a1a] text-xs font-medium text-[#c4c4c4] hover:text-[#f2f2f2] border border-white/5 hover:border-white/15 transition-all cursor-pointer"
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* Main Textarea Container */}
      <div className="p-6 rounded-2xl bg-[#0e0e0e] border border-white/5 space-y-4">
        <SafetyWarning variant="inline" />

        {/* Text Input */}
        <div className="space-y-1.5">
          <div className="relative">
            <textarea
              id="scam-text-input"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste suspicious SMS notification, payment request, or email here..."
              rows={4}
              className="w-full p-4 rounded-xl bg-[#080808] border border-white/10 focus:border-[#b6ff00]/60 text-[#f2f2f2] placeholder:text-[#555555] text-sm leading-relaxed resize-y focus:outline-none transition-colors"
            />

            {text && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy"
                  className="p-1.5 rounded-md bg-[#161616] hover:bg-[#222222] text-[#888888] hover:text-[#f2f2f2] border border-white/5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#b6ff00]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear"
                  className="p-1.5 rounded-md bg-[#161616] hover:bg-[#222222] text-[#888888] hover:text-red-400 border border-white/5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/20 border border-red-500/30 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <span className="text-xs text-[#666666]">
            In-memory evaluation · Zero credential retention
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {text && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="px-4 py-2 rounded-full bg-[#141414] hover:bg-[#1f1f1f] text-[#f2f2f2] text-xs font-semibold border border-white/10 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Clear
              </button>
            )}

            <button
              id="analyze-submit-button"
              type="button"
              onClick={handleAnalyze}
              disabled={isLoading || !text.trim()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#b6ff00] hover:bg-[#c9ff33] text-[#050505] text-xs sm:text-sm font-bold rounded-full transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#050505]" />
                  <span>Analyzing message...</span>
                </>
              ) : (
                <>
                  <span>Analyze Message</span>
                  <ArrowRight className="w-4 h-4 text-[#050505]" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
