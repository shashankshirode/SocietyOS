import { GuardMockSource } from './guard.mockSource';
import { GuardApiSource } from './guard.apiSource';

const USE_MOCKS = true;
const mockSource = new GuardMockSource();
const apiSource = new GuardApiSource();

export class GuardRepository {
  static async listExpectedVisitors(params?: JsonValue) {
    return USE_MOCKS ? mockSource.listExpectedVisitors(params) : apiSource.listExpectedVisitors(params);
  }
  static async verifyVisitorPass(params?: JsonValue) {
    return USE_MOCKS ? mockSource.verifyVisitorPass(params) : apiSource.verifyVisitorPass(params);
  }
  static async createManualGateEntry(params?: JsonValue) {
    return USE_MOCKS ? mockSource.createManualGateEntry(params) : apiSource.createManualGateEntry(params);
  }
  static async createDeliveryEntry(params?: JsonValue) {
    return USE_MOCKS ? mockSource.createDeliveryEntry(params) : apiSource.createDeliveryEntry(params);
  }
  static async createCabEntry(params?: JsonValue) {
    return USE_MOCKS ? mockSource.createCabEntry(params) : apiSource.createCabEntry(params);
  }
  static async createVendorGateEntry(params?: JsonValue) {
    return USE_MOCKS ? mockSource.createVendorGateEntry(params) : apiSource.createVendorGateEntry(params);
  }
  static async createMaterialGatePass(params?: JsonValue) {
    return USE_MOCKS ? mockSource.createMaterialGatePass(params) : apiSource.createMaterialGatePass(params);
  }
  static async listGateLogs(params?: JsonValue) {
    return USE_MOCKS ? mockSource.listGateLogs(params) : apiSource.listGateLogs(params);
  }
  static async listOfflineGateEntries(params?: JsonValue) {
    return USE_MOCKS ? mockSource.listOfflineGateEntries(params) : apiSource.listOfflineGateEntries(params);
  }
  static async listWatchlistEntries(params?: JsonValue) {
    return USE_MOCKS ? mockSource.listWatchlistEntries(params) : apiSource.listWatchlistEntries(params);
  }
}
