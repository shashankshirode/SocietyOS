import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';
import type { InterFlatQuery } from './interFlat.dto';

export function useAdminRuleAcknowledgementReport(ruleId: string, params?: InterFlatQuery) {
  return useRepositoryResult(async () => {
    const res = await interFlatRepository.getAdminRuleAcknowledgementReport(ruleId, params);
    return { ok: true, data: res };
  }, [ruleId, JSON.stringify(params)]);
}
