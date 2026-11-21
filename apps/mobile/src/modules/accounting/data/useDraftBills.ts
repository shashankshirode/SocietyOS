import { useState } from 'react';
import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { accountingRepository } from './accounting.repository';

export function useDraftBills(cycleId: string) {
  const query = useRepositoryResult(() => accountingRepository.getDraftBills(cycleId), [cycleId]);

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<Error | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const publishBills = async () => {
    setIsPublishing(true);
    setPublishError(null);
    setPublishSuccess(false);
    try {
      const res = await accountingRepository.publishBills(cycleId);
      if (res.ok) {
        setPublishSuccess(true);
        await query.refetch();
      } else {
        throw new Error(res.error.message || 'Failed to publish draft bills');
      }
    } catch (e) {
      setPublishError(e instanceof Error ? e : new Error('Publish error'));
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    ...query,
    publishBills,
    isPublishing,
    publishError,
    publishSuccess,
  };
}
