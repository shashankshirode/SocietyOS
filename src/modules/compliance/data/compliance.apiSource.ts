import type { RepositoryResult } from '../../../core/repositories/repository.types';
import type { ComplianceItem } from './compliance.types';

export const complianceApiSource = {
  async getComplianceItems(): Promise<RepositoryResult<ComplianceItem[]>> {
    throw new Error('Not implemented');
  },

  async submitComplianceCheck(id: string, status: 'COMPLIANT' | 'NON_COMPLIANT'): Promise<RepositoryResult<ComplianceItem>> {
    throw new Error('Not implemented');
  },

  async acknowledgeSocietyRules(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async getRuleAcknowledgementReport(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async createRenovationRequest(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async createContractorPass(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async updateDebrisClearanceChecklist(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async submitDamageInspection(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },
};
