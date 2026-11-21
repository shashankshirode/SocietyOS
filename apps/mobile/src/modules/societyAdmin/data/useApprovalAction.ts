import { useState } from 'react';
import { adminRepository } from './admin.repository';

type ActionType = 'approve' | 'reject' | 'requestMoreInfo';

export function useApprovalAction() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const execute = async (action: ActionType, approvalId: string, payload?: string) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      if (action === 'approve') await adminRepository.approveRequest(approvalId, payload);
      else if (action === 'reject') await adminRepository.rejectRequest(approvalId, payload ?? 'No reason provided');
      else await adminRepository.requestMoreInfo(approvalId, payload ?? '');
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Action failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { execute, isSubmitting, error, success };
}
