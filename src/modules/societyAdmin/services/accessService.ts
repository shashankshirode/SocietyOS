import type { Absent } from '../../../shared/types/absence.types';

const withMockDelay = <T>(data: T, ms = 500): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export interface AccessRevocationResult {
  success: boolean;
  revokedAt?: string;
  revokedCredentials?: string[];
  failedCredentials?: string[];
  error?: string;
}

export interface ResidentAccessStatus {
  residentId: string;
  unitId: string;
  hasActiveSession: boolean;
  gateMappings: { id: string; type: string; status: string }[];
  accessCards: { id: string; type: string; status: string }[];
  biometricMappings: { id: string; type: string; status: string }[];
}

export const accessService = {
  async getResidentAccessStatus(residentId: string, unitId: string): Promise<ResidentAccessStatus> {
    return withMockDelay({
      residentId,
      unitId,
      hasActiveSession: true,
      gateMappings: [
        { id: 'gate-1', type: 'RFID', status: 'ACTIVE' },
        { id: 'gate-2', type: 'BIOMETRIC', status: 'ACTIVE' },
      ],
      accessCards: [
        { id: 'card-1', type: 'RFID_CARD', status: 'ACTIVE' },
        { id: 'card-2', type: 'CLUB_CARD', status: 'ACTIVE' },
      ],
      biometricMappings: [
        { id: 'bio-1', type: 'FINGERPRINT', status: 'ACTIVE' },
      ],
    });
  },

  async revokeResidentAccess(
    residentId: string,
    unitId: string,
    revokedBy: string,
    reason: string
  ): Promise<AccessRevocationResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const accessStatus = {
          residentId,
          unitId,
          hasActiveSession: true,
          gateMappings: [
            { id: 'gate-1', type: 'RFID', status: 'ACTIVE' },
            { id: 'gate-2', type: 'BIOMETRIC', status: 'ACTIVE' },
          ],
          accessCards: [
            { id: 'card-1', type: 'RFID_CARD', status: 'ACTIVE' },
            { id: 'card-2', type: 'CLUB_CARD', status: 'ACTIVE' },
          ],
          biometricMappings: [
            { id: 'bio-1', type: 'FINGERPRINT', status: 'ACTIVE' },
          ],
        };

        const revokedCredentials: string[] = [];
        const failedCredentials: string[] = [];

        accessStatus.gateMappings.forEach((mapping) => {
          if (Math.random() > 0.1) {
            revokedCredentials.push(`${mapping.type} gate mapping (${mapping.id})`);
          } else {
            failedCredentials.push(`${mapping.type} gate mapping (${mapping.id})`);
          }
        });

        accessStatus.accessCards.forEach((card) => {
          if (Math.random() > 0.1) {
            revokedCredentials.push(`${card.type} access card (${card.id})`);
          } else {
            failedCredentials.push(`${card.type} access card (${card.id})`);
          }
        });

        accessStatus.biometricMappings.forEach((bio) => {
          if (Math.random() > 0.1) {
            revokedCredentials.push(`${bio.type} biometric (${bio.id})`);
          } else {
            failedCredentials.push(`${bio.type} biometric (${bio.id})`);
          }
        });

        const success = failedCredentials.length === 0;

        resolve({
          success,
          revokedAt: new Date().toISOString(),
          revokedCredentials,
          failedCredentials: failedCredentials.length > 0 ? failedCredentials : [],
          error: failedCredentials.length > 0 ? 'Some credentials could not be revoked' : undefined,
        });
      }, 1000);
    });
  },

  async revokeSpecificCredential(
    residentId: string,
    credentialType: 'GATE_MAPPING' | 'ACCESS_CARD' | 'BIOMETRIC',
    credentialId: string,
    revokedBy: string
  ): Promise<{ success: boolean; revokedAt?: string; error?: string }> {
    return withMockDelay({
      success: true,
      revokedAt: new Date().toISOString(),
    });
  },

  async checkAccessRevocationStatus(residentId: string, unitId: string): Promise<{
    isRevoked: boolean;
    revokedAt?: string;
    pendingCredentials: number;
  }> {
    return withMockDelay({
      isRevoked: false,
      pendingCredentials: 0,
    });
  },

  async requestAccessRevocation(
    moveOutRequestId: string,
    revokedBy: string,
    reason: string
  ): Promise<AccessRevocationResult> {
    return withMockDelay({
      success: true,
      revokedAt: new Date().toISOString(),
      revokedCredentials: [
        'RFID gate mapping (gate-1)',
        'Biometric gate mapping (gate-2)',
        'RFID_CARD access card (card-1)',
        'CLUB_CARD access card (card-2)',
        'FINGERPRINT biometric (bio-1)',
      ],
    });
  },
};