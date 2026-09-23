'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeUrl, validateAndNormalizeUrl } from '@/lib/url/urlAnalyzer';
import { AnalysisResult } from '@/types/scam';
import {
  Loader2,
  Trash2,
  Copy,
  Check,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import SafetyWarning from './SafetyWarning';

interface UrlAnalyzerProps {
  onAnalysisComplete?: (result: AnalysisResult) => void;
  redirectToResult?: boolean;
  initialUrl?: string;
}

interface SampleUrlPreset {
  id: string;
  title: string;
  url: string;
}

const SAMPLE_URL_PRESETS: SampleUrlPreset[] = [
  {
    id: 'url-sample-1',
    title: 'SBI Fake KYC Link',
    url: 'http://sbi-kyc-update.xyz/verify-pan?session=9382&token=abc83719'
  },
  {
    id: 'url-sample-2',
    title: 'IP Address Banking',
    url: 'http://192.241.144.22/secure-banking/login.php'
  },
  {
    id: 'url-sample-3',
    title: 'Shortened Reward Link',
    url: 'https://bit.ly/sbi-urgent-reward'
  },
  {
    id: 'url-sample-4',
    title: 'Official Bank Portal',
    url: 'https://www.onlinesbi.sbi/'
  }
];

export default function UrlAnalyzer({
  onAnalysisComplete,
  redirectToResult = false,
  initialUrl = ''
}: UrlAnalyzerProps) {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState<string>(initialUrl);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleAnalyze = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError('Please enter a web address or domain to analyze.');
      return;
    }

    const validation = validateAndNormalizeUrl(trimmed);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid URL or domain format.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await analyzeUrl(trimmed);

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
      const message = err instanceof Error ? err.message : 'URL analysis failed. Please verify the URL.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreset = (preset: SampleUrlPreset) => {
    setUrlInput(preset.url);
    setError(null);
  };

  const handleClear = () => {
    setUrlInput('');
    setError(null);
  };

  const handleCopy = () => {
    if (!urlInput) return;
    navigator.clipboard.writeText(urlInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-4">
      {/* Sample Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-[#666666] mr-1">Sample URLs:</span>
        {SAMPLE_URL_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => loadPreset(preset)}
            className="px-3 py-1.5 rounded-full bg-[#121212] hover:bg-[#1a1a1a] text-xs font-medium text-[#c4c4c4] hover:text-[#f2f2f2] border border-white/5 hover:border-white/15 transition-all cursor-pointer"
          >
            {preset.title}
          </button>
        ))}
      </div>

      {/* Main Input Container */}
      <div className="p-6 rounded-2xl bg-[#0e0e0e] border border-white/5 space-y-4">
        <SafetyWarning variant="inline" />

        {/* URL Input */}
        <div className="space-y-1.5">
          <div className="relative">
            <input
              id="scam-url-input"
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAnalyze();
                }
              }}
              placeholder="e.g. sbi-kyc-update.xyz/verify or http://192.168.1.1/login"
              className="w-full p-4 rounded-xl bg-[#080808] border border-white/10 focus:border-[#b6ff00]/60 text-[#f2f2f2] placeholder:text-[#555555] text-sm leading-relaxed focus:outline-none transition-colors pr-20 font-mono"
            />

            {urlInput && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy"
                  className="p-1.5 rounded-md bg-[#161616] hover:bg-[#222222] text-[#888888] hover:text-[#f2f2f2] border border-white/5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#b6ff00]" /> : <Copy className="w-3.5 h-3.5 text-[#888888]" />}
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
            Checks HTTPS, IP hosts, shorteners, and domain typosquatting
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {urlInput && (
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
              id="analyze-url-submit-button"
              type="button"
              onClick={handleAnalyze}
              disabled={isLoading || !urlInput.trim()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#b6ff00] hover:bg-[#c9ff33] text-[#050505] text-xs sm:text-sm font-bold rounded-full transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#050505]" />
                  <span>Inspecting URL...</span>
                </>
              ) : (
                <>
                  <span>Scan URL</span>
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
