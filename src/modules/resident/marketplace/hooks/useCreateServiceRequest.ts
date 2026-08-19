import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { serviceMarketplaceRepository } from '../data/serviceMarketplace.repository';

type CreateServiceRequestInput = { providerId: string; residentName: string; categoryName: string; requestedSlot: string };

export function useCreateServiceRequest() {
  return useRepositoryMutation((input: CreateServiceRequestInput) => serviceMarketplaceRepository.createServiceRequest(input));
}
