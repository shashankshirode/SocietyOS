import { useState } from 'react';
import { noticeDraftingService } from './noticeDraftingService';
import type { NoticeDraftingRequest, NoticeDraftingResult, NoticeTemplate } from './noticeDrafting.types';

export function useNoticeDrafting() {
  const [isDrafting, setIsDrafting] = useState(false);
  const [lastDraft, setLastDraft] = useState<NoticeDraftingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createDraft = async (
    request: NoticeDraftingRequest,
    options: { requestedBy: string }
  ): Promise<NoticeDraftingResult | null> => {
    setIsDrafting(true);
    setError(null);

    try {
      const result = await noticeDraftingService.createDraft(request, options);
      setLastDraft(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Draft creation failed';
      setError(message);
      return null;
    } finally {
      setIsDrafting(false);
    }
  };

  const getTemplates = (language: string): NoticeTemplate[] => {
    return noticeDraftingService.getAvailableTemplates(language);
  };

  const clearDraft = () => {
    setLastDraft(null);
    setError(null);
  };

  return {
    createDraft,
    getTemplates,
    isDrafting,
    lastDraft,
    error,
    clearDraft,
  };
}