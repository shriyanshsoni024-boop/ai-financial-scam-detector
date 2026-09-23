'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnalysisResult } from '@/types/scam';
import RiskBadge from '@/components/RiskBadge';
import {
  getScanHistory,
  getHistoryStats,
  clearScanHistory,
  loadSampleScans,
  deleteScanFromHistory,
  formatScanDate
} from '@/lib/history';
import {
  Shield,
  FileText,
  ImageIcon,
  Globe,
  ArrowRight,
  Trash2,
  RotateCcw,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Inbox
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const scans = getScanHistory();
      if (isMounted) {
        setHistory(scans);
        setIsLoaded(true);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = getHistoryStats(history);

  const handleViewAssessment = (scan: AnalysisResult) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('last_scam_analysis', JSON.stringify(scan));
    }
    router.push('/result');
  };

  const handleClearHistory = () => {
    clearScanHistory();
    setHistory([]);
    setShowClearConfirm(false);
  };

  const handleLoadSamples = () => {
    const samples = loadSampleScans();
    setHistory(samples);
  };

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = deleteScanFromHistory(id);
    setHistory(updated);
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'screenshot':
        return <ImageIcon className="w-3.5 h-3.5 text-[#b6ff00]" />;
      case 'url':
        return <Globe className="w-3.5 h-3.5 text-[#b6ff00]" />;
      case 'text':
      default:
        return <FileText className="w-3.5 h-3.5 text-[#b6ff00]" />;
    }
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case 'screenshot':
        return 'SCREENSHOT';
      case 'url':
        return 'URL';
      case 'text':
      default:
        return 'TEXT';
    }
  };

  if (!isLoaded) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#b6ff00] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#888888] font-medium">Loading security telemetry...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#111111] border border-white/10 text-[10px] font-mono uppercase tracking-wider text-[#b6ff00]">
            <Shield className="w-3 h-3" />
            <span>Audit Trail & Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f2f2f2] tracking-tight">
            Security Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#888888]">
            Local historical log of analyzed messages, screenshots, and domains.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5">
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#121212] hover:bg-[#1a1a1a] text-[#888888] hover:text-red-400 text-xs font-medium border border-white/5 hover:border-white/15 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Log</span>
            </button>
          )}

          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#b6ff00] hover:bg-[#c9ff33] text-[#050505] text-xs font-bold rounded-full transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Scan</span>
          </Link>
        </div>
      </div>

      {/* Confirmation Modal for Clear Log */}
      {showClearConfirm && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Are you sure you want to clear all local scan logs? This cannot be undone.</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-full bg-[#161616] text-xs font-medium text-[#c4c4c4] hover:text-white border border-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleClearHistory}
              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
            >
              Confirm Clear
            </button>
          </div>
        </div>
      )}

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Scans */}
        <div className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/5 space-y-1.5">
          <span className="text-[11px] font-semibold text-[#888888] tracking-wider uppercase block">
            Total Scans
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#f2f2f2] tracking-tight">
            {stats.total}
          </div>
          <span className="text-[11px] text-[#666666] block">
            Evaluated items
          </span>
        </div>

        {/* High Risk */}
        <div className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-red-400 tracking-wider uppercase">
              High Risk
            </span>
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-red-400 tracking-tight">
            {stats.highRisk}
          </div>
          <span className="text-[11px] text-[#666666] block">
            Severe threats identified
          </span>
        </div>

        {/* Needs Caution */}
        <div className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase">
              Needs Caution
            </span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
            {stats.needsCaution}
          </div>
          <span className="text-[11px] text-[#666666] block">
            Suspicious anomalies
          </span>
        </div>

        {/* Low Concern */}
        <div className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#b6ff00] tracking-wider uppercase">
              Low Concern
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#b6ff00]" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-[#b6ff00] tracking-tight">
            {stats.lowConcern}
          </div>
          <span className="text-[11px] text-[#666666] block">
            Benign communications
          </span>
        </div>
      </div>

      {/* Recent Scans Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-[#f2f2f2]">
              Recent Scans
            </h2>
            <p className="text-xs text-[#888888]">
              Select any entry to review full diagnostic assessment and recommendations.
            </p>
          </div>
          {history.length === 0 && (
            <button
              type="button"
              onClick={handleLoadSamples}
              className="inline-flex items-center gap-1.5 text-xs text-[#b6ff00] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load sample logs</span>
            </button>
          )}
        </div>

        {/* Table or Empty State */}
        {history.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#0e0e0e] border border-white/5 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center text-[#888888] mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <p className="text-sm font-bold text-[#f2f2f2]">No previous scans recorded</p>
              <p className="text-xs text-[#888888]">
                Analyze suspicious text messages, screenshots, or website links to generate threat logs.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#b6ff00] text-[#050505] text-xs font-bold rounded-full transition-all hover:scale-[1.02]"
              >
                <span>Run First Scan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleLoadSamples}
                className="px-4 py-2 rounded-full bg-[#161616] hover:bg-[#202020] text-[#f2f2f2] text-xs font-medium border border-white/10 transition-colors cursor-pointer"
              >
                Load Sample Data
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-2xl bg-[#0e0e0e] border border-white/5 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-[#0a0a0a] text-[10px] font-mono text-[#888888] uppercase tracking-wider">
                    <th className="py-3.5 px-5">Risk</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-5 text-right">Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {history.map((scan) => (
                    <tr
                      key={scan.id}
                      onClick={() => handleViewAssessment(scan)}
                      className="group hover:bg-[#141414] transition-colors cursor-pointer"
                    >
                      {/* RISK */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <RiskBadge level={scan.riskLevel} size="sm" />
                      </td>

                      {/* TYPE */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#161616] border border-white/5 text-[#c4c4c4] text-[10px] font-mono">
                          {getTypeIcon(scan.inputType)}
                          <span>{getTypeLabel(scan.inputType)}</span>
                        </div>
                      </td>

                      {/* CATEGORY & PREVIEW */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5 max-w-md">
                          <span className="font-semibold text-[#f2f2f2] block">
                            {scan.category}
                          </span>
                          <span className="text-[#888888] text-[11px] truncate block max-w-sm font-mono">
                            {scan.analyzedText}
                          </span>
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="py-4 px-4 whitespace-nowrap text-[#888888] text-[11px] font-mono">
                        {formatScanDate(scan.analyzedAt)}
                      </td>

                      {/* ACTION [ VIEW ] */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleDeleteItem(e, scan.id)}
                            title="Delete scan"
                            className="p-1.5 rounded-full hover:bg-[#222222] text-[#666666] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#181818] group-hover:bg-[#b6ff00] text-[#c4c4c4] group-hover:text-[#050505] text-[11px] font-bold border border-white/10 group-hover:border-[#b6ff00] transition-all">
                            <span>VIEW</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Card View */}
            <div className="md:hidden space-y-3">
              {history.map((scan) => (
                <div
                  key={scan.id}
                  onClick={() => handleViewAssessment(scan)}
                  className="p-4 rounded-xl bg-[#0e0e0e] border border-white/5 hover:border-white/15 space-y-3 transition-colors cursor-pointer"
                >
                  {/* Top Bar: Risk Badge + Type + Date */}
                  <div className="flex items-center justify-between gap-2">
                    <RiskBadge level={scan.riskLevel} size="sm" />
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#161616] border border-white/5 text-[#c4c4c4] text-[10px] font-mono">
                        {getTypeIcon(scan.inputType)}
                        <span>{getTypeLabel(scan.inputType)}</span>
                      </div>
                      <span className="text-[10px] text-[#666666] font-mono">
                        {formatScanDate(scan.analyzedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Category & Content */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#f2f2f2]">
                      {scan.category}
                    </h3>
                    <p className="text-xs text-[#888888] line-clamp-2 font-mono leading-relaxed bg-[#080808] p-2.5 rounded-lg border border-white/5">
                      {scan.analyzedText}
                    </p>
                  </div>

                  {/* View Button */}
                  <div className="pt-1 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => handleDeleteItem(e, scan.id)}
                      className="text-[11px] text-[#666666] hover:text-red-400 inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#b6ff00]">
                      <span>View Assessment</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
