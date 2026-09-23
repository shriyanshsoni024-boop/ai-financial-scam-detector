import { AnalysisResult, AIAnalysisResponse, RedFlag, RiskLevel, ScamCategory } from '@/types/scam';

/**
 * Combines deterministic rule-based output with AI analysis into a robust hybrid assessment.
 */
export function combineHybridAssessment(
  ruleResult: AnalysisResult,
  aiResponse: AIAnalysisResponse,
  model = 'gemini-2.5-flash',
  latencyMs?: number
): AnalysisResult {
  // 1. Calculate AI numerical score (0 - 100)
  let aiScore = 50;
  if (aiResponse.riskLevel === 'HIGH_RISK') {
    aiScore = Math.min(100, 75 + Math.round(aiResponse.confidence * 0.25));
  } else if (aiResponse.riskLevel === 'NEEDS_CAUTION') {
    aiScore = Math.min(65, 40 + Math.round(aiResponse.confidence * 0.2));
  } else if (aiResponse.riskLevel === 'LOW_CONCERN') {
    aiScore = Math.max(5, Math.round((100 - aiResponse.confidence) * 0.15));
  }

  // 2. Check for critical deterministic safety overrides
  const criticalFlagTypes = [
    'OTP_REQUEST',
    'PIN_REQUEST',
    'PASSWORD_REQUEST',
    'CVV_CARD_REQUEST',
    'ACCOUNT_BLOCK_THREAT',
    'DANGEROUS_FILE_EXTENSION'
  ];

  const hasCriticalRuleFlag = ruleResult.redFlags.some(
    (rf) => criticalFlagTypes.includes(rf.type) || rf.severity === 'high'
  );

  // 3. Weighted hybrid score (55% rule engine + 45% AI model)
  let hybridScore = Math.round(ruleResult.riskScore * 0.55 + aiScore * 0.45);

  // Apply deterministic safety floor if critical patterns exist
  if (hasCriticalRuleFlag) {
    hybridScore = Math.max(hybridScore, ruleResult.riskScore, 65);
  }

  hybridScore = Math.min(100, Math.max(0, hybridScore));

  // 4. Determine final hybrid risk level
  let finalRiskLevel: RiskLevel = 'LOW_CONCERN';
  if (hybridScore >= 60 || hasCriticalRuleFlag) {
    finalRiskLevel = 'HIGH_RISK';
  } else if (hybridScore >= 30) {
    finalRiskLevel = 'NEEDS_CAUTION';
  }

  // 5. Select category (prioritize specific rule matches, fallback to AI)
  let finalCategory: ScamCategory = ruleResult.category;
  if (finalCategory === 'Unknown / Suspicious' && aiResponse.scamCategory) {
    finalCategory = aiResponse.scamCategory as ScamCategory;
  }

  // 6. Merge red flags (preserve rule flags, augment with non-duplicate AI signals)
  const mergedRedFlags: RedFlag[] = [...ruleResult.redFlags];
  const existingTitles = new Set(ruleResult.redFlags.map((f) => f.title.toLowerCase()));

  aiResponse.redFlags.forEach((aiFlagText, idx) => {
    if (!existingTitles.has(aiFlagText.toLowerCase()) && aiFlagText.length > 5) {
      mergedRedFlags.push({
        id: `ai-rf-${idx + 1}`,
        type: 'EMOTIONAL_MANIPULATION',
        title: aiFlagText,
        description: 'Contextual threat signal identified by AI language analysis.',
        severity: aiResponse.riskLevel === 'HIGH_RISK' ? 'high' : 'medium'
      });
      existingTitles.add(aiFlagText.toLowerCase());
    }
  });

  // 7. Merge recommended actions
  const mergedRecommended = [...ruleResult.recommendedActions];
  const recSet = new Set(ruleResult.recommendedActions.map((r) => r.toLowerCase()));

  aiResponse.recommendedActions.forEach((rec) => {
    if (!recSet.has(rec.toLowerCase()) && rec.length > 5) {
      mergedRecommended.push(rec);
      recSet.add(rec.toLowerCase());
    }
  });

  // 8. Blend confidence score
  const finalConfidence = Math.round(ruleResult.confidence * 0.5 + aiResponse.confidence * 0.5);

  // 9. Summary
  const finalSummary =
    aiResponse.summary && aiResponse.summary.length > 15
      ? aiResponse.summary
      : ruleResult.summary;

  return {
    ...ruleResult,
    riskLevel: finalRiskLevel,
    riskScore: hybridScore,
    category: finalCategory,
    confidence: finalConfidence,
    redFlags: mergedRedFlags,
    summary: finalSummary,
    recommendedActions: mergedRecommended.slice(0, 4),
    analysisMode: 'ai_assisted',
    aiAnalysis: {
      enabled: true,
      scamCategory: aiResponse.scamCategory,
      riskLevel: aiResponse.riskLevel,
      confidence: aiResponse.confidence,
      summary: aiResponse.summary,
      redFlags: aiResponse.redFlags,
      recommendedActions: aiResponse.recommendedActions,
      model,
      latencyMs
    }
  };
}
