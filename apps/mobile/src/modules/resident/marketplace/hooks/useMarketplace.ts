import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { CommunityRepository } from '../../../community/data/community.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useMarketplace() {
  const { activeContext } = useActiveResidentHome();
  return useRepositoryResult(async () => {
    const data = await CommunityRepository.getBorrowableItems();
    return { ok: true, data };
  }, [activeContext.dataScopeKey]);
}
export default useMarketplace;
