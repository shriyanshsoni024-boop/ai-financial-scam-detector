import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'SCAMSHIELD | AI Financial Scam Detector',
  description:
    'Identify fake KYC threats, bank impersonation, UPI fraud, and phishing messages before you click or share OTPs. Heuristic-backed explainable risk analysis.',
  keywords: [
    'financial scam detector',
    'fake kyc scam',
    'upi fraud detection',
    'phishing analyzer',
    'bank fraud warning',
    'cyber security tool'
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#050505] text-[#f2f2f2] font-sans antialiased selection:bg-[#b6ff00] selection:text-[#050505]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
