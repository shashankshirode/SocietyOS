import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { ServiceCategory, ServiceProvider, ServiceRequestRecord, VendorRatingRecord } from './serviceMarketplace.types';
import { featuredServiceCategoryMockData, serviceCategoryMockData, serviceProviderMockData, serviceRequestMockData, vendorRatingMockData } from './serviceMarketplace.mockData';

type CreateServiceRequestInput = { providerId: string; residentName: string; categoryName: string; requestedSlot: string };
type VendorRatingInput = { providerId: string; rating: number; review: string };

export const serviceMarketplaceMockSource = {
  async listServiceCategories(): Promise<RepositoryResult<ServiceCategory[]>> {
    await withMockDelay();
    return repositorySuccess([...serviceCategoryMockData]);
  },
  async listServiceProvidersByCategory(categoryId?: string): Promise<RepositoryResult<ServiceProvider[]>> {
    await withMockDelay();
    const providers = categoryId ? serviceProviderMockData.filter((provider) => provider.categoryId === categoryId) : serviceProviderMockData;
    return repositorySuccess([...providers]);
  },
  async createServiceRequest(input: CreateServiceRequestInput): Promise<RepositoryResult<ServiceRequestRecord>> {
    await withMockDelay();
    const request: ServiceRequestRecord = { id: `sr-${Date.now()}`, status: 'SUBMITTED', ...input };
    serviceRequestMockData.unshift(request);
    return repositorySuccess(request);
  },
  async submitVendorRating(input: VendorRatingInput): Promise<RepositoryResult<VendorRatingRecord>> {
    await withMockDelay();
    const rating: VendorRatingRecord = { id: `vr-${Date.now()}`, createdAt: new Date().toISOString(), ...input };
    vendorRatingMockData.unshift(rating);
    return repositorySuccess(rating);
  },
  async getFeaturedServiceCategory(): Promise<RepositoryResult<ServiceCategory>> {
    await withMockDelay();
    return repositorySuccess(featuredServiceCategoryMockData);
  },
};
