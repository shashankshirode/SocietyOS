import { useState } from 'react';
import { billExplanationService } from './billExplanationService';
import type { BillExplanationRequest, BillExplanationResult } from './billExplanation.types';

export function useBillExplanation() {
  const [isExplaining, setIsExplaining] = useState(false);
  const [lastExplanation, setLastExplanation] = useState<BillExplanationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const explainBill = async (request: BillExplanationRequest): Promise<BillExplanationResult | null> => {
    setIsExplaining(true);
    setError(null);

    try {
      const result = await billExplanationService.explainBill(request);
      setLastExplanation(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Explanation failed';
      setError(message);
      return null;
    } finally {
      setIsExplaining(false);
    }
  };

  const getDeterministicExplanation = async (billId: string, language: string): Promise<BillExplanationResult | null> => {
    setIsExplaining(true);
    setError(null);

    try {
      const result = billExplanationService.getDeterministicExplanation(billId, language);
      setLastExplanation(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Deterministic explanation failed';
      setError(message);
      return null;
    } finally {
      setIsExplaining(false);
    }
  };

  const clearExplanation = () => {
    setLastExplanation(null);
    setError(null);
  };

  return {
    explainBill,
    getDeterministicExplanation,
    isExplaining,
    lastExplanation,
    error,
    clearExplanation,
  };
}