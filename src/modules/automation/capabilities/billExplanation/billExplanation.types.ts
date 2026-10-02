export type BillExplanationRequest = {
  billId: string;
  unitId: string;
  societyId: string;
  requestedBy: string;
  language?: 'en' | 'hi' | 'mr';
};

export type BillExplanationResult = {
  requestId: string;
  billId: string;
  explanation: string;
  format: 'PLAIN_TEXT' | 'MARKDOWN' | 'HTML';
  language: string;
  chargeBreakdown: Array<{
    chargeHead: string;
    description: string;
    amount: number;
    quantity?: number;
    rate?: number;
    unit?: string;
    period: { from: string; to: string };
    isRecurring: boolean;
    adjustment?: {
      type: 'DISCOUNT' | 'PENALTY' | 'WAIVER' | 'REVERSAL';
      amount: number;
      reason: string;
    };
  }>;
  totalAmount: number;
  previousBalance: number;
  netPayable: number;
  dueDate: string;
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE';
  modelVersion: string;
  templateVersion: number;
  source: 'AI_PROVIDER' | 'RULE_FALLBACK';
  confidence: number;
  confidenceBand: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';
  warnings: string[];
  requiresReview: boolean;
  processingTimeMs: number;
  completedAt: string;
};

export type BillChargeHead = {
  id: string;
  name: string;
  category: 'MAINTENANCE' | 'PARKING' | 'UTILITY' | 'SINKING_FUND' | 'AMC' | 'PENALTY' | 'OTHER';
  isRecurring: boolean;
  calculationMethod: 'FLAT' | 'PER_UNIT' | 'PER_SQFT' | 'METERED' | 'PERCENTAGE';
};

export function validateBillExplanation(result: BillExplanationResult): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!result.explanation || result.explanation.trim().length === 0) {
    errors.push('Explanation cannot be empty');
  }

  if (!result.chargeBreakdown || result.chargeBreakdown.length === 0) {
    errors.push('Charge breakdown is required');
  }

  const calculatedTotal = result.chargeBreakdown.reduce((sum, c) => sum + c.amount, 0);
  if (Math.abs(calculatedTotal - result.totalAmount) > 0.01) {
    errors.push(`Charge breakdown total (${calculatedTotal}) does not match bill total (${result.totalAmount})`);
  }

  if (result.netPayable !== result.totalAmount + result.previousBalance) {
    errors.push('Net payable does not match total + previous balance');
  }

  return { valid: errors.length === 0, errors };
}