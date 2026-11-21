import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { emergencyRepository } from '../data/emergency.repository';

export function useIncidentTimeline() {
  const mutation = useRepositoryMutation(async (input?: any) => {
    const res = await emergencyRepository.getIncidentTimeline(input);
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
