import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { ServiceCategory, ServiceProvider, ServiceRequestRecord, VendorRatingRecord } from './serviceMarketplace.types';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
type CreateServiceRequestInput = {
    providerId: string;
    residentName: string;
    categoryName: string;
    requestedSlot: string;
};
type VendorRatingInput = {
    providerId: string;
    rating: number;
    review: string;
};
async function request<T>(loader: () => Promise<T>): Promise<RepositoryResult<T>> {
    try {
        return repositorySuccess(await loader());
    }
    catch (error) {
        return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
}
export const serviceMarketplaceApiSource = {
    listServiceCategories: () => request<ServiceCategory[]>(() => apiClient.get(apiEndpoints.community.serviceCategories)),
    listServiceProvidersByCategory: (categoryId?: string) => request<ServiceProvider[]>(() => apiClient.get(apiEndpoints.community.serviceProviders, {
        ...includeWhenPresent("query", categoryId ? { categoryId } : undefined)
    })),
    createServiceRequest: (input: CreateServiceRequestInput) => request<ServiceRequestRecord>(() => apiClient.post(apiEndpoints.community.createServiceRequest, input, {
        idempotencyKey: createIdempotencyKey(`service-request-${input.providerId}-${input.requestedSlot}`)
    })),
    submitVendorRating: (input: VendorRatingInput) => request<VendorRatingRecord>(() => apiClient.post(apiEndpoints.community.vendorRatings(input.providerId), input, {
        idempotencyKey: createIdempotencyKey(`vendor-rating-${input.providerId}`)
    })),
    getFeaturedServiceCategory: () => request<ServiceCategory>(() => apiClient.get(apiEndpoints.community.featuredServiceCategory))
};

