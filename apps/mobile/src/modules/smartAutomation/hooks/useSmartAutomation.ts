import { useRepositoryResult, useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { smartAutomationRepository } from '../data/smartAutomation.repository';

export function useSmartAutomation() {
  return useRepositoryResult(() => smartAutomationRepository.getControllers(), []);
}

export function useToggleController() {
  return useRepositoryMutation(({ id }: { id: string }) =>
    smartAutomationRepository.toggleController(id)
  );
}
