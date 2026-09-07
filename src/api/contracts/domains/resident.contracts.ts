import type { EndpointDefinition } from '../api.types';
import type { PaginatedResponse } from '../api.types';
import type { Absent } from "../../../shared/types/absence.types";
export interface Resident {
    id: string;
    userId: string;
    societyId: string;
    unitId: string;
    unitNumber: string;
    tower: string;
    floor: number;
    type: 'OWNER' | 'TENANT' | 'FAMILY' | 'CO_OWNER';
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED';
    fullName: string;
    phone: string;
    email?: string | Absent;
    avatarUrl?: string | Absent;
    dateOfBirth?: string | Absent;
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | Absent;
    occupation?: string | Absent;
    emergencyContact?: EmergencyContact | Absent;
    kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
    kycDocuments: KycDocument[];
    vehicles: Vehicle[];
    createdAt: string;
    updatedAt: string;
}
export interface EmergencyContact {
    name: string;
    phone: string;
    relationship: string;
    isPrimary: boolean;
}
export interface KycDocument {
    id: string;
    type: 'AADHAAR' | 'PAN' | 'PASSPORT' | 'DRIVING_LICENSE' | 'VOTER_ID';
    documentUrl: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    verifiedAt?: string | Absent;
    verifiedBy?: string | Absent;
    expiryDate?: string | Absent;
}
export interface Vehicle {
    id: string;
    vehicleNumber: string;
    type: 'CAR' | 'BIKE' | 'CYCLE' | 'EV' | 'OTHER';
    make?: string | Absent;
    model?: string | Absent;
    color?: string | Absent;
    rfidTag?: string | Absent;
    isPrimary: boolean;
    status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
}
export interface Unit {
    id: string;
    societyId: string;
    unitNumber: string;
    tower: string;
    floor: number;
    type: 'RESIDENTIAL' | 'COMMERCIAL' | 'PARKING' | 'STORAGE' | 'AMENITY';
    status: 'OCCUPIED' | 'VACANT' | 'UNDER_MAINTENANCE' | 'RESERVED';
    area: number;
    bedrooms?: number | Absent;
    bathrooms?: number | Absent;
    balcony?: boolean | Absent;
    parkingSlots: ParkingSlot[];
    currentOwner?: Resident | Absent;
    currentTenant?: Resident | Absent;
    residents: Resident[];
}
export interface ParkingSlot {
    id: string;
    slotNumber: string;
    type: 'COVERED' | 'OPEN' | 'EV_CHARGING' | 'VISITOR' | 'HANDICAPPED';
    status: 'AVAILABLE' | 'ALLOCATED' | 'RESERVED' | 'MAINTENANCE';
    allocatedTo?: Resident;
    vehicle?: Vehicle;
}
export interface FamilyMember {
    id: string;
    residentId: string;
    fullName: string;
    relationship: 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING' | 'OTHER';
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    phone?: string;
    email?: string;
    isDependent: boolean;
    kycStatus: 'PENDING' | 'VERIFIED' | 'NOT_REQUIRED';
    documents: KycDocument[];
}
export interface Household {
    id: string;
    unitId: string;
    primaryResidentId: string;
    members: FamilyMember[];
    createdAt: string;
    updatedAt: string;
}
export const residentEndpoints = {
    getProfile: {
        method: 'GET' as const,
        path: '/residents/me',
        responseBody: {} as Resident,
        authRequired: true,
    },
    updateProfile: {
        method: 'PATCH' as const,
        path: '/residents/me',
        requestBody: {} as Partial<Resident>,
        responseBody: {} as Resident,
        authRequired: true,
    },
    getUnits: {
        method: 'GET' as const,
        path: '/residents/me/units',
        responseBody: {} as Unit[],
        authRequired: true,
    },
    getUnit: {
        method: 'GET' as const,
        path: '/units/{unitId}',
        pathParams: ['unitId'],
        responseBody: {} as Unit,
        authRequired: true,
    },
    getFamilyMembers: {
        method: 'GET' as const,
        path: '/residents/me/family',
        responseBody: {} as FamilyMember[],
        authRequired: true,
    },
    addFamilyMember: {
        method: 'POST' as const,
        path: '/residents/me/family',
        requestBody: {} as Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>,
        responseBody: {} as FamilyMember,
        authRequired: true,
    },
    updateFamilyMember: {
        method: 'PATCH' as const,
        path: '/residents/me/family/{memberId}',
        pathParams: ['memberId'],
        requestBody: {} as Partial<FamilyMember>,
        responseBody: {} as FamilyMember,
        authRequired: true,
    },
    removeFamilyMember: {
        method: 'DELETE' as const,
        path: '/residents/me/family/{memberId}',
        pathParams: ['memberId'],
        authRequired: true,
    },
    getVehicles: {
        method: 'GET' as const,
        path: '/residents/me/vehicles',
        responseBody: {} as Vehicle[],
        authRequired: true,
    },
    addVehicle: {
        method: 'POST' as const,
        path: '/residents/me/vehicles',
        requestBody: {} as Omit<Vehicle, 'id' | 'status'>,
        responseBody: {} as Vehicle,
        authRequired: true,
    },
    updateVehicle: {
        method: 'PATCH' as const,
        path: '/residents/me/vehicles/{vehicleId}',
        pathParams: ['vehicleId'],
        requestBody: {} as Partial<Vehicle>,
        responseBody: {} as Vehicle,
        authRequired: true,
    },
    removeVehicle: {
        method: 'DELETE' as const,
        path: '/residents/me/vehicles/{vehicleId}',
        pathParams: ['vehicleId'],
        authRequired: true,
    },
    uploadKyc: {
        method: 'POST' as const,
        path: '/residents/me/kyc',
        requestBody: {} as {
            type: KycDocument['type'];
            documentUrl: string;
        },
        responseBody: {} as KycDocument,
        authRequired: true,
    },
    getKycStatus: {
        method: 'GET' as const,
        path: '/residents/me/kyc',
        responseBody: {} as {
            status: Resident['kycStatus'];
            documents: KycDocument[];
        },
        authRequired: true,
    },
} as const satisfies Record<string, EndpointDefinition>;

