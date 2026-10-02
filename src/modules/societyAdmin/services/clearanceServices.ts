import type { ClearanceChecklistItem, ClearanceCategory, ClearanceStatus } from '../../../shared/types/moveOut.types';

export interface ClearanceCheckResult {
  status: ClearanceStatus;
  reason?: string;
  amount?: number;
  reference?: string;
  lastChecked: string;
  nextCheckAt?: string;
}

const withMockDelay = <T>(data: T, ms = 500): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const financeClearanceService = {
  async check(moveOutRequestId: string): Promise<ClearanceCheckResult> {
    return withMockDelay({
      status: 'CLEARED',
      reason: 'All dues settled',
      amount: 0,
      reference: 'ACC-2026-001',
      lastChecked: new Date().toISOString(),
    });
  },

  async getOutstandingAmount(residentId: string, unitId: string): Promise<number> {
    return withMockDelay(0);
  },

  async getDuesBreakdown(residentId: string, unitId: string): Promise<{ category: string; amount: number }[]> {
    return withMockDelay([]);
  },
};

export const documentAssetClearanceService = {
  async check(moveOutRequestId: string): Promise<ClearanceCheckResult> {
    return withMockDelay({
      status: 'CLEARED',
      reason: 'All documents returned',
      lastChecked: new Date().toISOString(),
    });
  },

  async getPendingDocuments(residentId: string, unitId: string): Promise<{ id: string; title: string; type: string }[]> {
    return withMockDelay([]);
  },

  async getIssuedAssets(residentId: string, unitId: string): Promise<{ id: string; name: string; type: string; issuedAt: string }[]> {
    return withMockDelay([]);
  },
};

export const parkingClearanceService = {
  async check(moveOutRequestId: string): Promise<ClearanceCheckResult> {
    return withMockDelay({
      status: 'CLEARED',
      reason: 'No parking allocations',
      lastChecked: new Date().toISOString(),
    });
  },

  async getParkingAllocations(residentId: string, unitId: string): Promise<{ id: string; slot: string; vehicle: string; status: string }[]> {
    return withMockDelay([]);
  },

  async releaseParkingSlot(slotId: string): Promise<void> {
    return withMockDelay(undefined);
  },
};

export const accessClearanceService = {
  async check(moveOutRequestId: string): Promise<ClearanceCheckResult> {
    return withMockDelay({
      status: 'CLEARED',
      reason: 'Access cards returned',
      lastChecked: new Date().toISOString(),
    });
  },

  async getAccessCredentials(residentId: string, unitId: string): Promise<{ id: string; type: string; status: string }[]> {
    return withMockDelay([]);
  },

  async revokeAccess(residentId: string, unitId: string): Promise<void> {
    return withMockDelay(undefined);
  },
};

export const meterClearanceService = {
  async check(moveOutRequestId: string): Promise<ClearanceCheckResult> {
    return withMockDelay({
      status: 'CLEARED',
      reason: 'Final reading recorded',
      lastChecked: new Date().toISOString(),
    });
  },

  async getMeterReading(unitId: string): Promise<{ meterId: string; reading: number; readingDate: string } | null> {
    return withMockDelay(null);
  },

  async recordFinalReading(unitId: string, reading: number): Promise<void> {
    return withMockDelay(undefined);
  },
};

export const damageClearanceService = {
  async check(moveOutRequestId: string): Promise<ClearanceCheckResult> {
    return withMockDelay({
      status: 'CLEARED',
      reason: 'No damage found',
      lastChecked: new Date().toISOString(),
    });
  },

  async getDamageReports(unitId: string): Promise<{ id: string; description: string; status: string; amount?: number }[]> {
    return withMockDelay([]);
  },

  async createDamageReport(unitId: string, description: string, estimatedAmount: number): Promise<{ id: string }> {
    return withMockDelay({ id: generateId('dmg') });
  },
};

export const complaintClearanceService = {
  async check(moveOutRequestId: string): Promise<ClearanceCheckResult> {
    return withMockDelay({
      status: 'NOT_APPLICABLE',
      reason: 'No pending complaints',
      lastChecked: new Date().toISOString(),
    });
  },

  async getPendingComplaints(residentId: string, unitId: string): Promise<{ id: string; title: string; status: string }[]> {
    return withMockDelay([]);
  },
};

export const vendorClearanceService = {
  async check(moveOutRequestId: string): Promise<ClearanceCheckResult> {
    return withMockDelay({
      status: 'NOT_APPLICABLE',
      reason: 'No vendor obligations',
      lastChecked: new Date().toISOString(),
    });
  },

  async getPendingVendorObligations(unitId: string): Promise<{ id: string; vendor: string; description: string; status: string }[]> {
    return withMockDelay([]);
  },
};

export const clearanceService = {
  async evaluateMoveOut(moveOutRequestId: string, checklist: ClearanceChecklistItem[]): Promise<{
    overallStatus: 'READY' | 'EXCEPTION';
    clearanceItems: ClearanceChecklistItem[];
    blockingItems: ClearanceChecklistItem[];
    evaluatedAt: string;
  }> {
    return withMockDelay({
      overallStatus: 'READY',
      clearanceItems: checklist,
      blockingItems: [],
      evaluatedAt: new Date().toISOString(),
    });
  },

  async checkCategory(category: ClearanceCategory, moveOutRequestId: string): Promise<ClearanceCheckResult> {
    switch (category) {
      case 'FINANCIAL':
        return financeClearanceService.check(moveOutRequestId);
      case 'DOCUMENT_ASSET':
        return documentAssetClearanceService.check(moveOutRequestId);
      case 'PARKING':
        return parkingClearanceService.check(moveOutRequestId);
      case 'ACCESS':
        return accessClearanceService.check(moveOutRequestId);
      case 'METER':
        return meterClearanceService.check(moveOutRequestId);
      case 'DAMAGE':
        return damageClearanceService.check(moveOutRequestId);
      case 'COMPLAINT':
        return complaintClearanceService.check(moveOutRequestId);
      case 'VENDOR':
        return vendorClearanceService.check(moveOutRequestId);
      default:
        return withMockDelay({
          status: 'NOT_APPLICABLE',
          reason: 'Unknown category',
          lastChecked: new Date().toISOString(),
        });
    }
  },
};

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}