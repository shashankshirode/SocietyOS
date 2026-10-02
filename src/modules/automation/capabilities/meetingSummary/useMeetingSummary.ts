import { useState } from 'react';
import { meetingSummaryService } from './meetingSummaryService';
import type { MeetingSummaryRequest, MeetingSummaryResult } from './meetingSummary.types';

export function useMeetingSummary() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSummary, setLastSummary] = useState<MeetingSummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = async (request: MeetingSummaryRequest): Promise<MeetingSummaryResult | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await meetingSummaryService.generateSummary(request);
      setLastSummary(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Summary generation failed';
      setError(message);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const getDeterministicSummary = async (request: MeetingSummaryRequest): Promise<MeetingSummaryResult | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = meetingSummaryService.getDeterministicSummary(request);
      setLastSummary(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Deterministic summary failed';
      setError(message);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const clearSummary = () => {
    setLastSummary(null);
    setError(null);
  };

  return {
    generateSummary,
    getDeterministicSummary,
    isGenerating,
    lastSummary,
    error,
    clearSummary,
  };
}