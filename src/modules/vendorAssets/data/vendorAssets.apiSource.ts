import type { RepositoryResult } from '../../../core/repositories/repository.types';
import type { Vendor, Asset } from './vendorAssets.types';

export const vendorAssetsApiSource = {
  async getVendors(): Promise<RepositoryResult<Vendor[]>> {
    throw new Error('Not implemented');
  },

  async logAssetMaintenance(id: string): Promise<RepositoryResult<Asset>> {
    throw new Error('Not implemented');
  },

  async listVendors(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async getVendorContract(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async listAmcReminders(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async listAssets(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async listAssetServiceSchedules(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async issueInventoryItem(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async getVendorScorecard(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },
};
