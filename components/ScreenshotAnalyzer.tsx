'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { extractTextFromImage, validateImageFile } from '@/lib/ocr/extractText';
import { analyzeScam } from '@/lib/engine/analyzer';
import { SAMPLE_SCREENSHOTS, SampleScreenshotPreset, createSampleScreenshotDataUrl } from '@/lib/sample-data';
import { saveScanToHistory } from '@/lib/history';
import { AnalysisResult } from '@/types/scam';
import {
  UploadCloud,
  ImageIcon,
  Trash2,
  ArrowRight,
  AlertCircle,
  Link as LinkIcon,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import SafetyWarning from './SafetyWarning';

interface ScreenshotAnalyzerProps {
  onAnalysisComplete?: (result: AnalysisResult) => void;
  redirectToResult?: boolean;
}

export type OCRStage = 'idle' | 'uploading' | 'recognizing' | 'analyzing' | 'complete';

export default function ScreenshotAnalyzer({
  onAnalysisComplete,
  redirectToResult = false
}: ScreenshotAnalyzerProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const [stage, setStage] = useState<OCRStage>('idle');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [extractedTextPreview, setExtractedTextPreview] = useState<string>('');
  const [detectedUrls, setDetectedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file.');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(1) + 'MB');
    setExtractedTextPreview('');
    setDetectedUrls([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleLoadPreset = (preset: SampleScreenshotPreset) => {
    setError(null);
    setExtractedTextPreview('');
    setDetectedUrls([]);
    const dataUrl = createSampleScreenshotDataUrl(preset);
    if (dataUrl) {
      setImagePreview(dataUrl);
      setSelectedFile(null);
      setFileName(`${preset.id}.png`);
      setFileSize('Preset');
    }
  };

  const handleClear = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setFileName('');
    setFileSize('');
    setExtractedTextPreview('');
    setDetectedUrls([]);
    setError(null);
    setStage('idle');
    setProgressPercent(0);
    setProgressMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) {
      setError('Please upload a screenshot to analyze.');
      return;
    }

    setError(null);
    setStage('uploading');
    setProgressPercent(15);
    setProgressMessage('Preparing image...');

    try {
      const ocrResult = await extractTextFromImage(selectedFile || imagePreview, {
        onProgress: (p) => {
          setStage(p.stage);
          setProgressPercent(p.percent);
          setProgressMessage(p.message);
        }
      });

      setExtractedTextPreview(ocrResult.text);
      setDetectedUrls(ocrResult.detectedUrls);

      setStage('analyzing');
      setProgressPercent(90);
      setProgressMessage('Evaluating heuristics...');

      const baseResult = await analyzeScam(ocrResult.text);

      const enrichedResult: AnalysisResult = {
        ...baseResult,
        inputType: 'screenshot',
        screenshotUrl: imagePreview,
        detectedUrls: ocrResult.detectedUrls
      };

      setStage('complete');
      setProgressPercent(100);
      setProgressMessage('Complete.');

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('last_scam_analysis', JSON.stringify(enrichedResult));
        saveScanToHistory(enrichedResult);
      }

      if (onAnalysisComplete) {
        onAnalysisComplete(enrichedResult);
      }

      if (redirectToResult) {
        router.push('/result');
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'OCR failed. Please try a clearer screenshot.';
      setError(msg);
      setStage('idle');
    }
  };

  const isBusy = stage !== 'idle' && stage !== 'complete';

  return (
    <div className="w-full space-y-4">
      {/* Sample Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-[#666666] mr-1">Sample Images:</span>
        {SAMPLE_SCREENSHOTS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handleLoadPreset(preset)}
            disabled={isBusy}
            className="px-3 py-1.5 rounded-full bg-[#121212] hover:bg-[#1a1a1a] text-xs font-medium text-[#c4c4c4] hover:text-[#f2f2f2] border border-white/5 hover:border-white/15 transition-all cursor-pointer disabled:opacity-50"
          >
            {preset.title}
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div className="p-6 rounded-2xl bg-[#0e0e0e] border border-white/5 space-y-4">
        <SafetyWarning variant="inline" />

        {/* Upload Drop Zone / Image Preview */}
        {!imagePreview ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`p-8 sm:p-10 rounded-xl border border-dashed transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer ${
              isDragOver
                ? 'border-[#b6ff00] bg-[#141414]'
                : 'border-white/10 hover:border-[#b6ff00]/60 bg-[#080808]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            <div className="w-10 h-10 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center text-[#b6ff00]">
              <UploadCloud className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#f2f2f2]">
                Drop screenshot here, or <span className="text-[#b6ff00] underline">browse</span>
              </p>
              <p className="text-xs text-[#666666]">
                PNG, JPG, JPEG, WEBP (Max 10MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#b6ff00]" />
                <span className="font-semibold text-[#f2f2f2]">{fileName}</span>
                <span className="text-[#666666]">({fileSize})</span>
              </div>
              <button
                type="button"
                onClick={handleClear}
                disabled={isBusy}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#161616] hover:bg-[#222222] text-[#888888] hover:text-red-400 text-xs rounded-full border border-white/5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>

            <div className="rounded-xl bg-[#050505] border border-white/5 p-3 flex items-center justify-center max-h-64 overflow-hidden">
              <Image
                src={imagePreview}
                alt="Screenshot Preview"
                width={700}
                height={350}
                unoptimized
                className="max-h-56 w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Live Progress Bar */}
        {isBusy && (
          <div className="p-3.5 rounded-xl bg-[#080808] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#f2f2f2] flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#b6ff00]" />
                <span>{progressMessage || 'Processing...'}</span>
              </span>
              <span className="text-[#b6ff00] font-mono font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#1c1c1c] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#b6ff00] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Extracted Text & Detected URLs Preview */}
        {extractedTextPreview && (
          <div className="p-4 rounded-xl bg-[#080808] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
              <span className="font-semibold text-[#f2f2f2]">
                Extracted Text ({extractedTextPreview.length} chars)
              </span>
              <span className="text-[10px] text-[#666666] font-mono">OCR ENGINE</span>
            </div>

            <pre className="text-xs text-[#a3a3a3] leading-relaxed whitespace-pre-wrap font-mono max-h-24 overflow-y-auto">
              {extractedTextPreview}
            </pre>

            {detectedUrls.length > 0 && (
              <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-[#666666] font-medium flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-[#b6ff00]" />
                  <span>Links:</span>
                </span>
                {detectedUrls.map((url, i) => (
                  <code
                    key={i}
                    className="px-2 py-0.5 rounded bg-[#141414] border border-red-500/30 text-red-400 text-xs font-mono"
                  >
                    {url}
                  </code>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/20 border border-red-500/30 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <span className="text-xs text-[#666666]">
            In-memory OCR · Zero credential retention
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {imagePreview && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isBusy}
                className="px-4 py-2 rounded-full bg-[#141414] hover:bg-[#1f1f1f] text-[#f2f2f2] text-xs font-semibold border border-white/10 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Clear
              </button>
            )}

            <button
              id="analyze-screenshot-button"
              type="button"
              onClick={handleAnalyze}
              disabled={isBusy || !imagePreview}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#b6ff00] hover:bg-[#c9ff33] text-[#050505] text-xs sm:text-sm font-bold rounded-full transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isBusy ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#050505]" />
                  <span>{progressMessage || 'Processing...'}</span>
                </>
              ) : stage === 'complete' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#050505]" />
                  <span>Re-Scan</span>
                </>
              ) : (
                <>
                  <span>Extract & Scan</span>
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
