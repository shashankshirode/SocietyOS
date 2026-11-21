import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';
import type { ComplianceItem } from './compliance.types';
import { mockComplianceItems } from './compliance.mockData';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
export const complianceMockSource = {
    async getComplianceItems(): Promise<RepositoryResult<ComplianceItem[]>> {
        await withMockDelay();
        return repositorySuccess(mockComplianceItems);
    },
    async submitComplianceCheck(id: string, status: 'COMPLIANT' | 'NON_COMPLIANT'): Promise<RepositoryResult<ComplianceItem>> {
        await withMockDelay();
        const item = mockComplianceItems.find(i => i.id === id);
        if (item) {
            item.status = status;
            item.lastChecked = getRequiredItem(new Date().toISOString().split('T'), 0, "compliance.mockSource.ts");
            return repositorySuccess(item);
        }
        return repositorySuccess(getRequiredItem(mockComplianceItems, 0, "compliance.mockSource.ts"));
    },
    async acknowledgeSocietyRules(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async getRuleAcknowledgementReport(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async createRenovationRequest(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async createContractorPass(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async updateDebrisClearanceChecklist(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async submitDamageInspection(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
};

