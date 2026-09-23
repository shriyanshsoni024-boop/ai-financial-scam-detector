'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeScam } from '@/lib/engine/analyzer';
import { SAMPLE_TEST_CASES } from '@/lib/sample-data';
import { AnalysisResult, SampleTestCase } from '@/types/scam';
import {
  Loader2,
  Trash2,
  Copy,
  Check,
  ArrowRight,
  AlertCircle,
  FileText
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
    <div className="w-full space-y-3 font-mono">
      {/* Sample Presets */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#888888] uppercase tracking-wider">Sample Presets</span>
          <span className="text-[#666666] text-[10px]">Click to load</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_TEST_CASES.slice(0, 3).map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => loadSample(sample)}
              className="p-3 text-left bg-[#111111] hover:bg-[#191919] border border-[#292929] hover:border-[#b6ff00] transition-colors flex items-center justify-between gap-2 cursor-pointer group"
            >
              <span className="text-xs font-bold text-[#f2f2f2] uppercase tracking-wider truncate group-hover:text-[#b6ff00] transition-colors">
                {sample.title}
              </span>
              <span
                className={`text-[9px] px-1 py-0.2 uppercase font-bold shrink-0 border ${
                  sample.expectedRisk === 'HIGH_RISK'
                    ? 'bg-[#0a0a0a] text-red-400 border-red-500/50'
                    : 'bg-[#0a0a0a] text-[#b6ff00] border-[#b6ff00]/50'
                }`}
              >
                {sample.expectedRisk === 'HIGH_RISK' ? 'High Risk' : 'Low Risk'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea Container */}
      <div className="p-5 bg-[#111111] border border-[#292929] space-y-3">
        <SafetyWarning variant="inline" />

        {/* Text Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#f2f2f2] uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#b6ff00]" />
              <span>Message Content</span>
            </span>
            <span className="text-[#666666] text-[11px]">{text.length} chars</span>
          </div>

          <div className="relative">
            <textarea
              id="scam-text-input"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste suspicious SMS, email notice, or payment text here..."
              rows={4}
              className="w-full p-3.5 bg-[#0a0a0a] border border-[#292929] focus:border-[#b6ff00] text-[#f2f2f2] placeholder:text-[#555555] text-xs sm:text-sm font-mono leading-relaxed resize-y focus:outline-none transition-colors"
            />

            {text && (
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy"
                  className="p-1 bg-[#191919] hover:bg-[#252525] text-[#888888] hover:text-[#f2f2f2] border border-[#292929] transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-[#b6ff00]" /> : <Copy className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear"
                  className="p-1 bg-[#191919] hover:bg-[#252525] text-[#888888] hover:text-red-400 border border-[#292929] transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-2.5 bg-[#0a0a0a] border border-red-500/50 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-[#666666]">
            In-memory evaluation. Zero credential persistence.
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {text && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="px-3.5 py-2 bg-[#191919] hover:bg-[#252525] text-[#f2f2f2] text-xs font-bold uppercase tracking-wider border border-[#292929] transition-colors disabled:opacity-50 cursor-pointer"
              >
                Clear
              </button>
            )}

            <button
              id="analyze-submit-button"
              type="button"
              onClick={handleAnalyze}
              disabled={isLoading || !text.trim()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#b6ff00] hover:bg-[#c9ff33] text-[#050505] text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#050505]" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <span>Run Scan</span>
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
