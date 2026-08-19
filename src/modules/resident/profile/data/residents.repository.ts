import { mockStore } from '../../../../core/mockStore/mockStore';
import type { ResidentProfileInfo } from './residents.types';
import type { Absent } from "../../../../shared/types/absence.types";
export class ResidentsRepository {
    static async getResidents(): Promise<ResidentProfileInfo[]> {
        return new Promise((resolve) => setTimeout(() => resolve(mockStore.getState().residentsNew), 300));
    }
    static async getResidentDetail(id: string): Promise<ResidentProfileInfo | Absent> {
        return new Promise((resolve) => {
            const item = mockStore.getState().residentsNew.find((r) => r.id === id);
            setTimeout(() => resolve(item), 300);
        });
    }
    static async updateAccessStatus(id: string, status: 'ACTIVE' | 'SUSPENDED'): Promise<boolean> {
        return new Promise((resolve) => {
            mockStore.updateResidentNew(id, { accessStatus: status });
            setTimeout(() => resolve(true), 300);
        });
    }
    static async approveKyc(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            mockStore.updateResidentNew(id, { kycStatus: 'APPROVED' });
            setTimeout(() => resolve(true), 300);
        });
    }
    static async listResidents(_input?: JsonValue): Promise<ResidentProfileInfo[]> {
        return this.getResidents();
    }
    static async searchResidents(_input?: JsonValue): Promise<ResidentProfileInfo[]> {
        return this.getResidents();
    }
    static async filterResidents(_input?: JsonValue): Promise<ResidentProfileInfo[]> {
        return this.getResidents();
    }
    static async getOwnerProfile(_input?: JsonValue): Promise<ResidentProfileInfo | Absent> {
        const residents = await this.getResidents();
        return residents.find((resident) => resident.role === 'OWNER') ?? residents[0];
    }
    static async updateOwnerProfile(_input?: JsonValue): Promise<boolean> {
        return true;
    }
    static async getTenantProfile(_input?: JsonValue): Promise<ResidentProfileInfo | Absent> {
        const residents = await this.getResidents();
        return residents.find((resident) => resident.role === 'TENANT') ?? residents[0];
    }
    static async updateTenantVerificationStatus(id = 'resident-1'): Promise<boolean> {
        const resident = await this.getResidentDetail(id);
        if (resident) {
            mockStore.updateResidentNew(id, { policeVerified: !resident.policeVerified });
        }
        return true;
    }
    static async listFamilyMembers(_input?: JsonValue): Promise<ResidentProfileInfo[]> {
        const residents = await this.getResidents();
        return residents.filter((resident) => resident.role === 'FAMILY');
    }
    static async addFamilyMember(_input?: JsonValue): Promise<boolean> {
        return true;
    }
    static async updateFamilyMemberAccess(id = 'resident-1'): Promise<boolean> {
        return this.updateAccessStatus(id, 'ACTIVE');
    }
    static async getResidentKyc(_input?: JsonValue): Promise<ResidentProfileInfo | Absent> {
        const residents = await this.getResidents();
        return residents.find((resident) => resident.kycStatus === 'PENDING') ?? residents[0];
    }
    static async updateResidentKycStatus(id = 'resident-1'): Promise<boolean> {
        return this.approveKyc(id);
    }
    static async listPendingResidentApprovals(_input?: JsonValue): Promise<ResidentProfileInfo[]> {
        const residents = await this.getResidents();
        return residents.filter((resident) => resident.kycStatus === 'PENDING');
    }
    static async approveResident(id = 'resident-1'): Promise<boolean> {
        return this.approveKyc(id);
    }
    static async rejectResident(id = 'resident-1'): Promise<boolean> {
        mockStore.updateResidentNew(id, { kycStatus: 'REJECTED' });
        return true;
    }
}

