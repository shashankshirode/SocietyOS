import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { billRepository } from './billing.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useBillDetail(billId: string) {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryResult(
    () => billRepository.getBillDetail(context, billId),
    [billId, context.dataScopeKey],
  );
}
export default useBillDetail;
