'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { extractTextFromImage, validateImageFile } from '@/lib/ocr/extractText';
import { analyzeScam } from '@/lib/engine/analyzer';
import { SAMPLE_SCREENSHOTS, SampleScreenshotPreset, createSampleScreenshotDataUrl } from '@/lib/sample-data';
import { AnalysisResult } from '@/types/scam';
import {
  UploadCloud,
  ImageIcon,
  Trash2,
  ArrowRight,
  AlertCircle,
  Link as LinkIcon,
  FileText,
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
    <div className="w-full space-y-3 font-mono">
      {/* Sample Presets */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#888888] uppercase tracking-wider">Sample Screenshots</span>
          <span className="text-[#666666] text-[10px]">Click to test</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_SCREENSHOTS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              disabled={isBusy}
              className="p-3 text-left bg-[#111111] hover:bg-[#191919] border border-[#292929] hover:border-[#b6ff00] transition-colors flex items-center justify-between gap-2 cursor-pointer group disabled:opacity-50"
            >
              <span className="text-xs font-bold text-[#f2f2f2] uppercase tracking-wider truncate group-hover:text-[#b6ff00] transition-colors">
                {preset.title}
              </span>
              <span className="text-[9px] px-1 py-0.2 uppercase font-bold border bg-[#0a0a0a] text-red-400 border-red-500/50 shrink-0">
                Sample
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="p-5 bg-[#111111] border border-[#292929] space-y-4">
        <SafetyWarning variant="inline" />

        {/* Upload Drop Zone / Image Preview */}
        {!imagePreview ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`p-6 sm:p-8 border-2 border-dashed transition-colors flex flex-col items-center justify-center text-center space-y-3 cursor-pointer ${
              isDragOver
                ? 'border-[#b6ff00] bg-[#1a1a1a]'
                : 'border-[#292929] hover:border-[#b6ff00] bg-[#0a0a0a]'
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

            <div className="w-10 h-10 bg-[#111111] border border-[#292929] flex items-center justify-center text-[#b6ff00]">
              <UploadCloud className="w-5 h-5" />
            </div>

            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-bold text-[#f2f2f2] uppercase tracking-wider">
                Drop screenshot here, or <span className="text-[#b6ff00] underline">browse</span>
              </p>
              <p className="text-[11px] text-[#888888]">
                PNG, JPG, JPEG, WEBP (Max 10MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-[#292929] pb-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#b6ff00]" />
                <span className="font-bold text-[#f2f2f2] uppercase tracking-wider">{fileName}</span>
                <span className="text-[#666666]">({fileSize})</span>
              </div>
              <button
                type="button"
                onClick={handleClear}
                disabled={isBusy}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#191919] hover:bg-[#252525] text-[#888888] hover:text-red-400 text-xs border border-[#292929] transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>

            <div className="bg-[#050505] border border-[#292929] p-2 flex items-center justify-center max-h-64 overflow-hidden">
              <Image
                src={imagePreview}
                alt="Screenshot Preview"
                width={700}
                height={350}
                unoptimized
                className="max-h-56 w-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* Live Progress Bar */}
        {isBusy && (
          <div className="p-3 bg-[#0a0a0a] border border-[#292929] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[#f2f2f2] flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#b6ff00]" />
                <span>{progressMessage || 'Processing...'}</span>
              </span>
              <span className="text-[#b6ff00] font-black">{progressPercent}%</span>
            </div>
            <div className="w-full h-1 bg-[#1b1b1b] overflow-hidden">
              <div
                className="h-full bg-[#b6ff00] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Extracted Text & Detected URLs Preview */}
        {extractedTextPreview && (
          <div className="p-3.5 bg-[#0a0a0a] border border-[#292929] space-y-2.5">
            <div className="flex items-center justify-between text-xs border-b border-[#292929] pb-1.5">
              <div className="flex items-center gap-2 text-[#f2f2f2] font-bold uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-[#b6ff00]" />
                <span>Extracted Text ({extractedTextPreview.length} chars)</span>
              </div>
              <span className="text-[#666666] text-[10px]">TESSERACT OCR</span>
            </div>

            <pre className="text-xs text-[#d1d1d1] leading-relaxed whitespace-pre-wrap font-mono max-h-28 overflow-y-auto">
              {extractedTextPreview}
            </pre>

            {detectedUrls.length > 0 && (
              <div className="pt-2 border-t border-[#292929] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#f2f2f2]">
                  <LinkIcon className="w-3.5 h-3.5 text-[#b6ff00]" />
                  <span>Detected Links:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {detectedUrls.map((url, i) => (
                    <code
                      key={i}
                      className="px-1.5 py-0.5 bg-[#111111] border border-red-500/50 text-red-400 text-xs"
                    >
                      {url}
                    </code>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 p-2.5 bg-[#0a0a0a] border border-red-500/50 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-[#666666]">
            In-memory OCR. Zero credential retention.
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {imagePreview && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isBusy}
                className="px-3.5 py-2 bg-[#191919] hover:bg-[#252525] text-[#f2f2f2] text-xs font-bold uppercase tracking-wider border border-[#292929] transition-colors disabled:opacity-50 cursor-pointer"
              >
                Clear
              </button>
            )}

            <button
              id="analyze-screenshot-button"
              type="button"
              onClick={handleAnalyze}
              disabled={isBusy || !imagePreview}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#b6ff00] hover:bg-[#c9ff33] text-[#050505] text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
