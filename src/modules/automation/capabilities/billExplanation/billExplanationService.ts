import {
  BillExplanationRequest,
  BillExplanationResult,
  BillChargeHead,
  validateBillExplanation,
} from './billExplanation.types';
import { aiOrchestrationService } from '../../../aiServices/core/services';

const mockBills: Map<string, any> = new Map();
const mockChargeHeads: Map<string, BillChargeHead[]> = new Map();

function initializeMockData(): void {
  mockBills.set('BIL-2026-07-A1204', {
    id: 'BIL-2026-07-A1204',
    unitId: 'A-1204',
    societyId: 'soc-canonical-01',
    period: { from: '2026-07-01', to: '2026-07-31' },
    charges: [
      { chargeHeadId: 'ch-1', chargeHead: 'Maintenance Charges', category: 'MAINTENANCE', amount: 3500, isRecurring: true, calculationMethod: 'FLAT', period: { from: '2026-07-01', to: '2026-07-31' } },
      { chargeHeadId: 'ch-2', chargeHead: 'Parking Charges', category: 'PARKING', amount: 1500, isRecurring: true, calculationMethod: 'FLAT', period: { from: '2026-07-01', to: '2026-07-31' } },
      { chargeHeadId: 'ch-3', chargeHead: 'Water Charges', category: 'UTILITY', amount: 850, isRecurring: true, calculationMethod: 'METERED', quantity: 15, rate: 56.67, unit: 'KL', period: { from: '2026-07-01', to: '2026-07-31' } },
      { chargeHeadId: 'ch-4', chargeHead: 'Sinking Fund', category: 'SINKING_FUND', amount: 500, isRecurring: true, calculationMethod: 'PER_SQFT', quantity: 1200, rate: 0.42, unit: 'SQFT', period: { from: '2026-07-01', to: '2026-07-31' } },
      { chargeHeadId: 'ch-5', chargeHead: 'Late Payment Penalty', category: 'PENALTY', amount: 200, isRecurring: false, calculationMethod: 'FLAT', adjustment: { type: 'PENALTY', amount: 200, reason: 'Payment received after due date' }, period: { from: '2026-07-01', to: '2026-07-31' } },
    ],
    totalAmount: 6550,
    previousBalance: 0,
    netPayable: 6550,
    dueDate: '2026-08-10',
    paymentStatus: 'PENDING',
  });

  mockChargeHeads.set('soc-canonical-01', [
    { id: 'ch-1', name: 'Maintenance Charges', category: 'MAINTENANCE', isRecurring: true, calculationMethod: 'FLAT' },
    { id: 'ch-2', name: 'Parking Charges', category: 'PARKING', isRecurring: true, calculationMethod: 'FLAT' },
    { id: 'ch-3', name: 'Water Charges', category: 'UTILITY', isRecurring: true, calculationMethod: 'METERED' },
    { id: 'ch-4', name: 'Sinking Fund', category: 'SINKING_FUND', isRecurring: true, calculationMethod: 'PER_SQFT' },
    { id: 'ch-5', name: 'Late Payment Penalty', category: 'PENALTY', isRecurring: false, calculationMethod: 'FLAT' },
  ]);
}

initializeMockData();

function getBill(billId: string): any {
  return mockBills.get(billId);
}

function getChargeHeads(societyId: string): BillChargeHead[] {
  return mockChargeHeads.get(societyId) || [];
}

function generateDeterministicExplanation(bill: any, language: string): {
  explanation: string;
  chargeBreakdown: BillExplanationResult['chargeBreakdown'];
} {
  const lines: string[] = [];
  lines.push(`Bill ${bill.id} for period ${bill.period.from} to ${bill.period.to}`);
  lines.push('');
  lines.push('Charge Breakdown:');

  const breakdown: BillExplanationResult['chargeBreakdown'] = [];

  for (const charge of bill.charges) {
    let desc = `${charge.chargeHead}: ₹${charge.amount.toLocaleString()}`;
    if (charge.quantity !== undefined && charge.rate !== undefined && charge.unit) {
      desc += ` (${charge.quantity} ${charge.unit} × ₹${charge.rate}/${charge.unit})`;
    }
    if (charge.adjustment) {
      desc += ` [${charge.adjustment.type}: ₹${charge.adjustment.amount} - ${charge.adjustment.reason}]`;
    }
    lines.push(`• ${desc}`);

    breakdown.push({
      chargeHead: charge.chargeHead,
      description: charge.category,
      amount: charge.amount,
      quantity: charge.quantity,
      rate: charge.rate,
      unit: charge.unit,
      period: charge.period,
      isRecurring: charge.isRecurring,
      adjustment: charge.adjustment,
    });
  }

  lines.push('');
  lines.push(`Total Charges: ₹${bill.totalAmount.toLocaleString()}`);
  if (bill.previousBalance > 0) {
    lines.push(`Previous Balance: ₹${bill.previousBalance.toLocaleString()}`);
  }
  lines.push(`Net Payable: ₹${bill.netPayable.toLocaleString()}`);
  lines.push(`Due Date: ${bill.dueDate}`);
  lines.push(`Payment Status: ${bill.paymentStatus}`);

  const explanation = lines.join('\n');

  return { explanation, chargeBreakdown: breakdown };
}

export const billExplanationService = {
  async explainBill(
    request: BillExplanationRequest
  ): Promise<BillExplanationResult> {
    const bill = getBill(request.billId);
    if (!bill) {
      throw new Error('BILL_NOT_FOUND');
    }

    if (bill.societyId !== request.societyId) {
      throw new Error('CROSS_SOCIETY_ACCESS_DENIED');
    }

    const chargeHeads = getChargeHeads(request.societyId);

    const aiCommand = {
      capability: 'BILL_EXPLANATION' as const,
      input: {
        billId: request.billId,
        chargeBreakdown: bill.charges,
        totalAmount: bill.totalAmount,
        previousBalance: bill.previousBalance,
        netPayable: bill.netPayable,
        dueDate: bill.dueDate,
        paymentStatus: bill.paymentStatus,
        language: request.language || 'en',
      },
      societyId: request.societyId,
      requestedBy: request.requestedBy,
      priority: 'NORMAL',
      timeoutMs: 30000,
    };

    let explanation: string;
    let chargeBreakdown: BillExplanationResult['chargeBreakdown'];
    let modelVersion = 'deterministic-v1';
    let templateVersion = 1;
    let source: 'AI_PROVIDER' | 'RULE_FALLBACK' = 'RULE_FALLBACK';
    let confidence = 1.0;
    let confidenceBand: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN' = 'HIGH';
    let warnings: string[] = ['DETERMINISTIC_EXPLANATION: Generated from authoritative bill data'];
    let requiresReview = false;
    let processingTimeMs = 10;

    try {
      const aiResponse = await aiOrchestrationService.requestAnalysis(aiCommand);

      if (aiResponse.source === 'AI_PROVIDER' && aiResponse.status === 'SUCCESS') {
        const aiOutput = aiResponse.primaryOutput as any;
        explanation = aiOutput.explanation || generateDeterministicExplanation(bill, request.language).explanation;
        chargeBreakdown = aiOutput.chargeBreakdown || generateDeterministicExplanation(bill, request.language).chargeBreakdown;
        modelVersion = aiResponse.modelVersion;
        templateVersion = aiResponse.templateVersion;
        source = 'AI_PROVIDER';
        confidence = aiResponse.confidence;
        confidenceBand = aiResponse.confidenceBand;
        warnings = [...(aiResponse.warnings || []), 'AI_ENHANCED: Natural language explanation added'];
        requiresReview = aiResponse.status === 'REQUIRES_REVIEW' || aiResponse.confidence < 0.7;
        processingTimeMs = aiResponse.processingTimeMs;
      } else {
        const det = generateDeterministicExplanation(bill, request.language);
        explanation = det.explanation;
        chargeBreakdown = det.chargeBreakdown;
      }
    } catch (error) {
      warnings.push(`AI_UNAVAILABLE: ${error instanceof Error ? error.message : 'Unknown error'}`);
      const det = generateDeterministicExplanation(bill, request.language);
      explanation = det.explanation;
      chargeBreakdown = det.chargeBreakdown;
    }

    const result: BillExplanationResult = {
      requestId: `bexp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      billId: request.billId,
      explanation,
      format: 'PLAIN_TEXT',
      language: request.language || 'en',
      chargeBreakdown,
      totalAmount: bill.totalAmount,
      previousBalance: bill.previousBalance,
      netPayable: bill.netPayable,
      dueDate: bill.dueDate,
      paymentStatus: bill.paymentStatus,
      modelVersion,
      templateVersion,
      source,
      confidence,
      confidenceBand,
      warnings,
      requiresReview,
      processingTimeMs,
      completedAt: new Date().toISOString(),
    };

    const validation = validateBillExplanation(result);
    if (!validation.valid) {
      result.warnings.push(...validation.errors);
      result.requiresReview = true;
    }

    return result;
  },

  getDeterministicExplanation(billId: string, language: string): BillExplanationResult | null {
    const bill = getBill(billId);
    if (!bill) return null;

    const { explanation, chargeBreakdown } = generateDeterministicExplanation(bill, language);

    return {
      requestId: `bexp_${Date.now()}`,
      billId,
      explanation,
      format: 'PLAIN_TEXT',
      language,
      chargeBreakdown,
      totalAmount: bill.totalAmount,
      previousBalance: bill.previousBalance,
      netPayable: bill.netPayable,
      dueDate: bill.dueDate,
      paymentStatus: bill.paymentStatus,
      modelVersion: 'deterministic-v1',
      templateVersion: 1,
      source: 'RULE_FALLBACK',
      confidence: 1.0,
      confidenceBand: 'HIGH',
      warnings: ['DETERMINISTIC_EXPLANATION: Generated from authoritative bill data'],
      requiresReview: false,
      processingTimeMs: 5,
      completedAt: new Date().toISOString(),
    };
  },

  getChargeHeads(societyId: string): BillChargeHead[] {
    return getChargeHeads(societyId);
  },

  compareBills(billId1: string, billId2: string): {
    bill1: any;
    bill2: any;
    differences: Array<{
      chargeHead: string;
      amount1: number;
      amount2: number;
      difference: number;
      changeType: 'INCREASED' | 'DECREASED' | 'NEW' | 'REMOVED';
    }>;
    totalDifference: number;
  } | null {
    const bill1 = getBill(billId1);
    const bill2 = getBill(billId2);
    if (!bill1 || !bill2) return null;

    const chargeMap1 = new Map(bill1.charges.map(c => [c.chargeHead, c]));
    const chargeMap2 = new Map(bill2.charges.map(c => [c.chargeHead, c]));
    const allHeads = new Set([...chargeMap1.keys(), ...chargeMap2.keys()]);

    const differences = Array.from(allHeads).map(head => {
      const c1 = chargeMap1.get(head);
      const c2 = chargeMap2.get(head);
      const amount1 = c1?.amount || 0;
      const amount2 = c2?.amount || 0;
      const diff = amount2 - amount1;

      let changeType: 'INCREASED' | 'DECREASED' | 'NEW' | 'REMOVED' = 'INCREASED';
      if (!c1) changeType = 'NEW';
      else if (!c2) changeType = 'REMOVED';
      else if (diff > 0) changeType = 'INCREASED';
      else if (diff < 0) changeType = 'DECREASED';

      return { chargeHead: head, amount1, amount2, difference: diff, changeType };
    }).filter(d => d.difference !== 0);

    return {
      bill1,
      bill2,
      differences,
      totalDifference: bill2.totalAmount - bill1.totalAmount,
    };
  },
};