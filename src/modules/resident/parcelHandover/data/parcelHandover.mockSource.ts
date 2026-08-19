import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { Parcel } from './parcelHandover.types';
import { mockParcels } from './parcelHandover.mockData';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
export const parcelMockSource = {
    async getParcels(): Promise<RepositoryResult<Parcel[]>> {
        await withMockDelay();
        return repositorySuccess(mockParcels);
    },
    async confirmPickup(id: string, otp: string): Promise<RepositoryResult<Parcel>> {
        await withMockDelay();
        const parcel = mockParcels.find(p => p.id === id);
        if (parcel) {
            if (parcel.pickupOtp === otp) {
                parcel.status = 'COLLECTED';
                return repositorySuccess(parcel);
            }
        }
        return repositorySuccess(getRequiredItem(mockParcels, 0, "parcelHandover.mockSource.ts"));
    },
    async createParcelHandoverRequest(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async getParcelOtpQr(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async confirmParcelPickup(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
};

