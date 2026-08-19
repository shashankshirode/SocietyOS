import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { NoticesRepository } from '../data/notices.repository';
import type { NoticeWorkflowParams } from '../data/notices.mockSource';

export function useNoticeReadStatus() {
  const mutation = useRepositoryMutation(async (input: NoticeWorkflowParams) => {
    const res = await NoticesRepository.markNoticeRead(input);
    const data = (res && typeof res === 'object' && 'data' in res) ? res.data : res;
    return { ok: true, data };
  });

  return {
    data: [],
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
