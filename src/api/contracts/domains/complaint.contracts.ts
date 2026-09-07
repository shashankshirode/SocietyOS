import type { EndpointDefinition } from '../api.types';
import type { PaginatedResponse } from '../api.types';
import type { Absent } from "../../../shared/types/absence.types";
export interface Complaint {
    id: string;
    societyId: string;
    unitId: string;
    tower: string;
    floor: number;
    reportedBy: string;
    reporterName: string;
    reporterPhone: string;
    category: ComplaintCategory;
    subCategory?: string | Absent;
    title: string;
    description: string;
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL' | 'EMERGENCY';
    status: ComplaintStatus;
    slaHours: number;
    slaDeadline: string;
    assignedTo?: string | Absent;
    assigneeName?: string | Absent;
    assigneeRole?: string | Absent;
    mediaUrls: string[];
    location?: string | Absent;
    tags: string[];
    parentComplaintId?: string | Absent;
    childComplaintIds: string[];
    resolutionSummary?: string | Absent;
    resolutionMediaUrls: string[];
    resolvedAt?: string | Absent;
    resolvedBy?: string | Absent;
    feedback?: ComplaintFeedback | Absent;
    createdAt: string;
    updatedAt: string;
}
export type ComplaintCategory = 'PLUMBING' | 'ELECTRICAL' | 'HVAC' | 'STRUCTURAL' | 'SECURITY' | 'HOUSEKEEPING' | 'PEST_CONTROL' | 'WATER_SUPPLY' | 'POWER_BACKUP' | 'LIFT' | 'FIRE_SAFETY' | 'WASTE_MANAGEMENT' | 'NOISE' | 'PARKING' | 'OTHER';
export type ComplaintStatus = 'CREATED' | 'CLASSIFIED' | 'ASSIGNED' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'WAITING' | 'HOLD' | 'RESOLVED' | 'REOPENED' | 'CLOSED';
export interface ComplaintFeedback {
    rating: 1 | 2 | 3 | 4 | 5;
    comment?: string;
    submittedAt: string;
}
export interface ComplaintSlaSummary {
    total: number;
    onTrack: number;
    atRisk: number;
    breached: number;
    avgResolutionHours: number;
    byCategory: Record<ComplaintCategory, {
        total: number;
        avgHours: number;
    }>;
    byPriority: Record<Complaint['priority'], {
        total: number;
        avgHours: number;
    }>;
}
export interface CreateComplaintRequest {
    category: ComplaintCategory;
    subCategory?: string;
    title: string;
    description: string;
    priority?: Complaint['priority'];
    mediaUrls?: string[];
    location?: string;
    tags?: string[];
}
export interface UpdateComplaintRequest {
    category?: ComplaintCategory;
    subCategory?: string;
    title?: string;
    description?: string;
    priority?: Complaint['priority'];
    status?: ComplaintStatus;
    assignedTo?: string;
    tags?: string[];
}
export interface AssignComplaintRequest {
    assigneeId: string;
    assigneeRole: string;
    note?: string;
}
export interface ReopenComplaintRequest {
    reason: string;
    mediaUrls?: string[];
}
export interface ComplaintComment {
    id: string;
    complaintId: string;
    authorId: string;
    authorName: string;
    authorRole: string;
    content: string;
    isInternal: boolean;
    createdAt: string;
}
export const complaintEndpoints = {
    list: {
        method: 'GET' as const,
        path: '/complaints',
        queryParams: ['page', 'pageSize', 'status', 'category', 'priority', 'assignedTo', 'dateFrom', 'dateTo', 'search', 'sortBy', 'sortOrder'],
        responseBody: {} as PaginatedResponse<Complaint>,
        authRequired: true,
    },
    get: {
        method: 'GET' as const,
        path: '/complaints/{complaintId}',
        pathParams: ['complaintId'],
        responseBody: {} as Complaint,
        authRequired: true,
    },
    create: {
        method: 'POST' as const,
        path: '/complaints',
        requestBody: {} as CreateComplaintRequest,
        responseBody: {} as Complaint,
        authRequired: true,
    },
    update: {
        method: 'PATCH' as const,
        path: '/complaints/{complaintId}',
        pathParams: ['complaintId'],
        requestBody: {} as UpdateComplaintRequest,
        responseBody: {} as Complaint,
        authRequired: true,
    },
    assign: {
        method: 'POST' as const,
        path: '/complaints/{complaintId}/assign',
        pathParams: ['complaintId'],
        requestBody: {} as AssignComplaintRequest,
        responseBody: {} as Complaint,
        authRequired: true,
    },
    reopen: {
        method: 'POST' as const,
        path: '/complaints/{complaintId}/reopen',
        pathParams: ['complaintId'],
        requestBody: {} as ReopenComplaintRequest,
        responseBody: {} as Complaint,
        authRequired: true,
    },
    addComment: {
        method: 'POST' as const,
        path: '/complaints/{complaintId}/comments',
        pathParams: ['complaintId'],
        requestBody: {} as {
            content: string;
            isInternal: boolean;
        },
        responseBody: {} as ComplaintComment,
        authRequired: true,
    },
    getComments: {
        method: 'GET' as const,
        path: '/complaints/{complaintId}/comments',
        pathParams: ['complaintId'],
        queryParams: ['page', 'pageSize'],
        responseBody: {} as PaginatedResponse<ComplaintComment>,
        authRequired: true,
    },
    submitFeedback: {
        method: 'POST' as const,
        path: '/complaints/{complaintId}/feedback',
        pathParams: ['complaintId'],
        requestBody: {} as ComplaintFeedback,
        responseBody: {} as Complaint,
        authRequired: true,
    },
    getSlaSummary: {
        method: 'GET' as const,
        path: '/complaints/sla/summary',
        queryParams: ['dateFrom', 'dateTo', 'category'],
        responseBody: {} as ComplaintSlaSummary,
        authRequired: true,
    },
    getCategories: {
        method: 'GET' as const,
        path: '/complaints/categories',
        responseBody: {} as {
            category: ComplaintCategory;
            subCategories: string[];
        }[],
        authRequired: true,
    },
} as const satisfies Record<string, EndpointDefinition>;

