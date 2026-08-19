import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { governanceRepository } from '../data/governance.repository';

export function useCreateMeetingNotice() {
  const mutation = useRepositoryMutation(async (input: JsonValue) => {
    const res = await governanceRepository.createMeetingNotice(input);
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
