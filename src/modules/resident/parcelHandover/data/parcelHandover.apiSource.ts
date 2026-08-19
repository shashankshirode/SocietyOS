import type { RepositoryResult } from '../../../../core/repositories/repository.types';
import type { Parcel } from './parcelHandover.types';

export const parcelApiSource = {
  async getParcels(): Promise<RepositoryResult<Parcel[]>> {
    throw new Error('Not implemented');
  },

  async confirmPickup(id: string, otp: string): Promise<RepositoryResult<Parcel>> {
    throw new Error('Not implemented');
  },

  async createParcelHandoverRequest(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async getParcelOtpQr(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async confirmParcelPickup(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },
};
