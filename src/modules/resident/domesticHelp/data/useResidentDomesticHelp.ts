import { useCallback } from 'react';
import { useRepositoryMutation, useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { domesticHelpRepository } from './domesticHelp.repository';
import type { DomesticHelpAccessStatus, DomesticHelpServiceAction } from './domesticHelp.types';

export function useResidentDomesticHelpList() {
  const { activeContext } = useActiveResidentHome();
  const context = { activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey };
  return useRepositoryResult(() => domesticHelpRepository.list(context), [context.dataScopeKey]);
}

export function useResidentDomesticHelpDetail(domesticHelpId: string) {
  const { activeContext } = useActiveResidentHome();
  const context = { activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey };
  return useRepositoryResult(
    () => domesticHelpRepository.detail(context, domesticHelpId),
    [context.dataScopeKey, domesticHelpId]
  );
}

export function useResidentDomesticHelpAccess(domesticHelpId: string) {
  const { activeContext } = useActiveResidentHome();
  const mutation = useCallback(
    (accessStatus: DomesticHelpAccessStatus) => domesticHelpRepository.setAccess({
      context: { activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey },
      domesticHelpId,
      accessStatus,
    }),
    [activeContext, domesticHelpId]
  );
  return useRepositoryMutation(mutation);
}

export function useResidentDomesticHelpServiceAction(domesticHelpId: string) {
  const { activeContext } = useActiveResidentHome();
  const mutation = useCallback(
    (action: DomesticHelpServiceAction) => domesticHelpRepository.applyServiceAction({
      context: { activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey },
      domesticHelpId,
      action,
    }),
    [activeContext, domesticHelpId]
  );
  return useRepositoryMutation(mutation);
}
