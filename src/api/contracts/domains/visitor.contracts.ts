import type { EndpointDefinition } from '../api.types';
import type { PaginatedResponse } from '../api.types';
import type { Absent } from "../../../shared/types/absence.types";
export interface VisitorPass {
    id: string;
    societyId: string;
    unitId: string;
    unitNumber: string;
    tower: string;
    hostResidentId: string;
    hostName: string;
    hostPhone: string;
    visitorName: string;
    visitorPhone: string;
    visitorEmail?: string | Absent;
    visitorPhotoUrl?: string | Absent;
    visitorIdProof?: {
        type: 'AADHAAR' | 'PAN' | 'PASSPORT' | 'DRIVING_LICENSE';
        number: string;
        documentUrl: string;
    } | Absent;
    purpose: string;
    expectedArrival: string;
    expectedDeparture: string;
    actualArrival?: string | Absent;
    actualDeparture?: string | Absent;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'EXPIRED' | 'CANCELLED';
    otp?: string | Absent;
    qrCodeUrl?: string | Absent;
    vehicleNumber?: string | Absent;
    vehicleType?: ('CAR' | 'BIKE' | 'AUTO' | 'TAXI' | 'DELIVERY' | 'OTHER') | Absent;
    numberOfGuests: number;
    specialInstructions?: string | Absent;
    approvedBy?: string | Absent;
    approvedAt?: string | Absent;
    rejectedBy?: string | Absent;
    rejectedAt?: string | Absent;
    rejectionReason?: string | Absent;
    createdAt: string;
    updatedAt: string;
}
export interface VisitorPassListParams {
    page?: number;
    pageSize?: number;
    status?: VisitorPass['status'][];
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    sortBy?: 'expectedArrival' | 'createdAt' | 'visitorName';
    sortOrder?: 'asc' | 'desc';
}
export interface CreateVisitorPassRequest {
    visitorName: string;
    visitorPhone: string;
    visitorEmail?: string;
    purpose: string;
    expectedArrival: string;
    expectedDeparture: string;
    vehicleNumber?: string;
    vehicleType?: VisitorPass['vehicleType'];
    numberOfGuests: number;
    specialInstructions?: string;
    visitorIdProof?: VisitorPass['visitorIdProof'];
}
export interface PreApproveVisitorRequest {
    visitorName: string;
    visitorPhone: string;
    purpose: string;
    validFrom: string;
    validTo: string;
    numberOfGuests: number;
    vehicleNumber?: string;
}
export interface VisitorExitAlert {
    id: string;
    visitorPassId: string;
    visitorName: string;
    visitorPhone: string;
    unitNumber: string;
    tower: string;
    expectedDeparture: string;
    alertType: 'EXIT_DUE' | 'OVERSTAY' | 'MANUAL';
    status: 'PENDING' | 'CONFIRMED_LEFT' | 'STILL_INSIDE' | 'EXTENDED' | 'CONTACTED_SECURITY';
    createdAt: string;
    resolvedAt?: string;
    resolvedBy?: string;
}
export const visitorEndpoints = {
    list: {
        method: 'GET' as const,
        path: '/visitors',
        queryParams: ['page', 'pageSize', 'status', 'dateFrom', 'dateTo', 'search', 'sortBy', 'sortOrder'],
        responseBody: {} as PaginatedResponse<VisitorPass>,
        authRequired: true,
    },
    get: {
        method: 'GET' as const,
        path: '/visitors/{passId}',
        pathParams: ['passId'],
        responseBody: {} as VisitorPass,
        authRequired: true,
    },
    create: {
        method: 'POST' as const,
        path: '/visitors',
        requestBody: {} as CreateVisitorPassRequest,
        responseBody: {} as VisitorPass,
        authRequired: true,
    },
    preApprove: {
        method: 'POST' as const,
        path: '/visitors/preapprove',
        requestBody: {} as PreApproveVisitorRequest,
        responseBody: {} as VisitorPass,
        authRequired: true,
    },
    cancel: {
        method: 'POST' as const,
        path: '/visitors/{passId}/cancel',
        pathParams: ['passId'],
        requestBody: {} as {
            reason: string;
        },
        responseBody: {} as VisitorPass,
        authRequired: true,
    },
    approve: {
        method: 'POST' as const,
        path: '/visitors/{passId}/approve',
        pathParams: ['passId'],
        responseBody: {} as VisitorPass,
        authRequired: true,
    },
    reject: {
        method: 'POST' as const,
        path: '/visitors/{passId}/reject',
        pathParams: ['passId'],
        requestBody: {} as {
            reason: string;
        },
        responseBody: {} as VisitorPass,
        authRequired: true,
    },
    extend: {
        method: 'POST' as const,
        path: '/visitors/{passId}/extend',
        pathParams: ['passId'],
        requestBody: {} as {
            newDeparture: string;
            reason: string;
        },
        responseBody: {} as VisitorPass,
        authRequired: true,
    },
    getExitAlerts: {
        method: 'GET' as const,
        path: '/visitors/exit-alerts',
        queryParams: ['page', 'pageSize', 'status'],
        responseBody: {} as PaginatedResponse<VisitorExitAlert>,
        authRequired: true,
    },
    confirmExit: {
        method: 'POST' as const,
        path: '/visitors/exit-alerts/{alertId}/confirm-left',
        pathParams: ['alertId'],
        responseBody: {} as VisitorExitAlert,
        authRequired: true,
    },
    confirmStillInside: {
        method: 'POST' as const,
        path: '/visitors/exit-alerts/{alertId}/confirm-still-inside',
        pathParams: ['alertId'],
        responseBody: {} as VisitorExitAlert,
        authRequired: true,
    },
    contactSecurity: {
        method: 'POST' as const,
        path: '/visitors/exit-alerts/{alertId}/contact-security',
        pathParams: ['alertId'],
        responseBody: {} as VisitorExitAlert,
        authRequired: true,
    },
} as const satisfies Record<string, EndpointDefinition>;

