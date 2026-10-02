import { useState } from 'react';
import { complaintRoutingService } from './complaintRoutingService';
import type { ComplaintClassificationRequest, ComplaintClassificationResult } from './complaintRouting.types';

export function useComplaintRouting() {
  const [isClassifying, setIsClassifying] = useState(false);
  const [lastResult, setLastResult] = useState<ComplaintClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const classifyComplaint = async (
    request: ComplaintClassificationRequest,
    options: { requestedBy: string; priority?: 'LOW' | 'NORMAL' | 'HIGH' }
  ): Promise<ComplaintClassificationResult | null> => {
    setIsClassifying(true);
    setError(null);

    try {
      const result = await complaintRoutingService.classifyComplaint(request, options);
      setLastResult(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Classification failed';
      setError(message);
      return null;
    } finally {
      setIsClassifying(false);
    }
  };

  const clearResult = () => {
    setLastResult(null);
    setError(null);
  };

  return {
    classifyComplaint,
    isClassifying,
    lastResult,
    error,
    clearResult,
  };
}