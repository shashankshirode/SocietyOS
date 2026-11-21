import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { SocietySetupRepository } from '../data/societySetup.repository';
import type { TowerSetupData } from '../data/societySetup.types';

export function useTowerWingFloorSetup() {
  const mutation = useRepositoryMutation(async (input: Partial<TowerSetupData>) => {
    const res = await SocietySetupRepository.addTower(input);
    return { ok: true, data: res };
  });

  return {
    data: [],
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
