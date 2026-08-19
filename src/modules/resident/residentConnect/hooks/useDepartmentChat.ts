import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { residentConnectRepository } from '../data/residentConnect.repository';

export function useDepartmentChat() {
  const mutation = useRepositoryMutation(async (input: JsonValue) => {
    const res = await residentConnectRepository.sendDepartmentMessage(input);
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
