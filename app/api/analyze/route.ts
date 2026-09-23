import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithGemini } from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, detectedUrls = [] } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Message text is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        fallback: true,
        message: 'AI API Key not configured. Using deterministic heuristic engine.'
      });
    }

    // Execute Gemini AI Analysis
    const aiResult = await analyzeWithGemini(text, detectedUrls);

    return NextResponse.json({
      success: true,
      ai: aiResult.response,
      model: aiResult.model,
      latencyMs: aiResult.latencyMs
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'AI evaluation failed';
    console.warn('[ScamShield AI Route] Analysis failed, falling back to rule engine:', message);

    return NextResponse.json({
      success: false,
      fallback: true,
      error: message
    });
  }
}
