import * as mockData from './guard.mockData';

export class GuardMockSource {
  async listExpectedVisitors(params?: JsonValue) {
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
    return mockData.gateLogsMockData;
  }
  async listOfflineGateEntries(params?: JsonValue) {
    return mockData.offlineGateQueueMockData;
  }
  async listWatchlistEntries(params?: JsonValue) {
    return mockData.blacklistWatchlistMockData;
  }
}
