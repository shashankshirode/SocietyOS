import type { EndpointDefinition } from '../api.types';
import type { PaginatedResponse } from '../api.types';

export interface Notice {
  id: string;
  societyId: string;
  title: string;
  content: string;
  summary?: string;
  category: 'GENERAL' | 'MAINTENANCE' | 'EVENT' | 'EMERGENCY' | 'POLICY' | 'FINANCIAL' | 'SECURITY' | 'OTHER';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL' | 'EMERGENCY';
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'EXPIRED' | 'WITHDRAWN' | 'ARCHIVED';
  targetAudience: 'ALL' | 'OWNERS' | 'TENANTS' | 'RESIDENTS' | 'STAFF' | 'VENDORS' | 'SPECIFIC_UNITS';
  targetUnits?: string[];
  targetTowers?: string[];
  publishedAt?: string;
  expiresAt?: string;
  attachments: NoticeAttachment[];
  authorId: string;
  authorName: string;
  authorRole: string;
  acknowledgeRequired: boolean;
  acknowledgements: Acknowledgement[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeAttachment {
  id: string;
  name: string;
  url: string;
  type: 'IMAGE' | 'PDF' | 'DOCUMENT' | 'VIDEO' | 'OTHER';
  size: number;
}

export interface Acknowledgement {
  residentId: string;
  residentName: string;
  unitNumber: string;
  acknowledgedAt: string;
}

export interface CreateNoticeRequest {
  title: string;
  content: string;
  summary?: string;
  category: Notice['category'];
  priority: Notice['priority'];
  targetAudience: Notice['targetAudience'];
  targetUnits?: string[];
  targetTowers?: string[];
  publishAt?: string;
  expiresAt?: string;
  attachments?: Omit<NoticeAttachment, 'id'>[];
  acknowledgeRequired: boolean;
}

export interface UpdateNoticeRequest {
  title?: string;
  content?: string;
  summary?: string;
  category?: Notice['category'];
  priority?: Notice['priority'];
  targetAudience?: Notice['targetAudience'];
  targetUnits?: string[];
  targetTowers?: string[];
  publishAt?: string;
  expiresAt?: string;
  attachments?: Omit<NoticeAttachment, 'id'>[];
  acknowledgeRequired?: boolean;
}

export interface NoticeListParams {
  page?: number;
  pageSize?: number;
  category?: Notice['category'][];
  priority?: Notice['priority'][];
  status?: Notice['status'][];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  acknowledged?: boolean;
  sortBy?: 'publishedAt' | 'createdAt' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export const noticeEndpoints = {
  list: {
    method: 'GET' as const,
    path: '/notices',
    queryParams: ['page', 'pageSize', 'category', 'priority', 'status', 'dateFrom', 'dateTo', 'search', 'acknowledged', 'sortBy', 'sortOrder'],
    responseBody: {} as PaginatedResponse<Notice>,
    authRequired: true,
  },
  get: {
    method: 'GET' as const,
    path: '/notices/{noticeId}',
    pathParams: ['noticeId'],
    responseBody: {} as Notice,
    authRequired: true,
  },
  create: {
    method: 'POST' as const,
    path: '/notices',
    requestBody: {} as CreateNoticeRequest,
    responseBody: {} as Notice,
    authRequired: true,
  },
  update: {
    method: 'PATCH' as const,
    path: '/notices/{noticeId}',
    pathParams: ['noticeId'],
    requestBody: {} as UpdateNoticeRequest,
    responseBody: {} as Notice,
    authRequired: true,
  },
  publish: {
    method: 'POST' as const,
    path: '/notices/{noticeId}/publish',
    pathParams: ['noticeId'],
    responseBody: {} as Notice,
    authRequired: true,
  },
  withdraw: {
    method: 'POST' as const,
    path: '/notices/{noticeId}/withdraw',
    pathParams: ['noticeId'],
    requestBody: {} as { reason: string },
    responseBody: {} as Notice,
    authRequired: true,
  },
  acknowledge: {
    method: 'POST' as const,
    path: '/notices/{noticeId}/acknowledge',
    pathParams: ['noticeId'],
    responseBody: {} as Notice,
    authRequired: true,
  },
  getUnreadCount: {
    method: 'GET' as const,
    path: '/notices/unread-count',
    responseBody: {} as { count: number },
    authRequired: true,
  },
  getAcknowledgements: {
    method: 'GET' as const,
    path: '/notices/{noticeId}/acknowledgements',
    pathParams: ['noticeId'],
    queryParams: ['page', 'pageSize'],
    responseBody: {} as PaginatedResponse<Acknowledgement>,
    authRequired: true,
  },
} as const satisfies Record<string, EndpointDefinition>;