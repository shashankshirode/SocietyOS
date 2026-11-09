import * as mockData from './guard.mockData';
import { mockStore } from '../../../core/mockStore/mockStore';

export class GuardMockSource {
  async listExpectedVisitors(params?: JsonValue) {
    const storeVisitors = mockStore.getState().visitors;
    if (storeVisitors && storeVisitors.length > 0) {
      return storeVisitors.map((v) => ({
        id: v.id,
        name: v.name,
        visitorName: v.name,
        type: v.type,
        status: v.status,
        flatNumber: v.flatNumber,
        otp: v.otp,
        expectedDate: v.expectedDate,
        expectedTime: v.expectedTime,
      }));
    }
    return mockData.expectedVisitorsMockData;
  }
  async verifyVisitorPass(params?: JsonValue) {
    return mockData.verifyVisitorMockData;
  }
  async createManualGateEntry(params?: JsonValue) {
    return mockData.manualGateEntryMockData;
  }
  async createDeliveryEntry(params?: JsonValue) {
    return mockData.deliveryEntryMockData;
  }
  async createCabEntry(params?: JsonValue) {
    return mockData.cabEntryMockData;
  }
  async createVendorGateEntry(params?: JsonValue) {
    return mockData.vendorGateEntryMockData;
  }
  async createMaterialGatePass(params?: JsonValue) {
    return mockData.materialGatePassMockData;
  }
  async listGateLogs(params?: JsonValue) {
    const storeLogs = mockStore.getState().gateLogs;
    if (storeLogs && storeLogs.length > 0) {
      return storeLogs;
    }
    return mockData.gateLogsMockData;
  }
  async listOfflineGateEntries(params?: JsonValue) {
    return mockData.offlineGateQueueMockData;
  }
  async listWatchlistEntries(params?: JsonValue) {
    return mockData.blacklistWatchlistMockData;
  }
}

export const guardMockSource = new GuardMockSource();
