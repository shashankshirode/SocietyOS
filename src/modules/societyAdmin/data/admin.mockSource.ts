import type { AdminDashboardData, AdminUnit, AdminUnitDetail, AdminResident, AdminApproval, AdminNotice, AdminComplaint, AdminAuditLog, AdminNoticeTarget, AdminNoticeStatus } from '../../../shared/types/admin.types';
import { mockAdminDashboard } from '../../../shared/mock/adminDashboard.mock';
import { mockAdminUnits, mockAdminUnitDetail } from '../../../shared/mock/adminUnits.mock';
import { mockAdminApprovals } from '../../../shared/mock/adminApprovals.mock';
import { mockAdminComplaints } from '../../../shared/mock/adminComplaints.mock';
import { mockAdminAuditLogs } from '../../../shared/mock/adminAuditLogs.mock';
import { mockStore } from '../../../core/mockStore/mockStore';
import type { NoticeCategory } from '../../../shared/types/notice.types';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
const withMockDelay = <T>(data: T, ms = 600): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), ms));
export const adminMockSource = {
    getDashboard: (): Promise<AdminDashboardData> => withMockDelay(mockAdminDashboard),
    getUnits: (_filters?: Record<string, string>): Promise<AdminUnit[]> => withMockDelay(mockAdminUnits),
    getUnitDetail: (_unitId: string): Promise<AdminUnitDetail> => withMockDelay(mockAdminUnitDetail),
    getResidents: (_filters?: Record<string, string>): Promise<AdminResident[]> => withMockDelay(mockStore.getState().residents as AdminResident[]),
    getApprovals: (_filters?: Record<string, string>): Promise<AdminApproval[]> => withMockDelay(mockAdminApprovals),
    getApprovalDetail: (approvalId: string): Promise<AdminApproval> => withMockDelay(mockAdminApprovals.find(a => a.id === approvalId) ?? getRequiredItem(mockAdminApprovals, 0, "admin.mockSource.ts")),
    approveRequest: (_approvalId: string, _notes?: string): Promise<{
        success: boolean;
    }> => withMockDelay({ success: true }, 800),
    rejectRequest: (_approvalId: string, _reason: string): Promise<{
        success: boolean;
    }> => withMockDelay({ success: true }, 800),
    requestMoreInfo: (_approvalId: string, _info: string): Promise<{
        success: boolean;
    }> => withMockDelay({ success: true }, 800),
    getNotices: (_filters?: Record<string, string>): Promise<AdminNotice[]> => {
        const mapped = mockStore.getState().notices.map((n) => ({
            id: n.id,
            title: n.title,
            content: n.body,
            category: n.category,
            target: (n.targetAudience || 'ALL_RESIDENTS') as AdminNoticeTarget,
            status: (n.status === 'EXPIRED' ? 'EXPIRED' : 'PUBLISHED') as AdminNoticeStatus,
            createdBy: n.postedBy || 'Admin',
            acknowledgementCount: n.acknowledged ? 1 : 0,
            totalTargetCount: 8,
            createdAt: n.date + 'T09:00:00Z',
        }));
        return withMockDelay(mapped);
    },
    publishNotice: (_noticeId: string): Promise<{
        success: boolean;
    }> => withMockDelay({ success: true }, 800),
    createNotice: (payload: Partial<AdminNotice>): Promise<AdminNotice> => {
        const newId = `notice-${Date.now()}`;
        mockStore.addNotice({
            id: newId,
            title: payload.title || '',
            body: payload.content || '',
            category: (payload.category?.toUpperCase() || 'GENERAL') as NoticeCategory,
            date: getRequiredItem(new Date().toISOString().split('T'), 0, "admin.mockSource.ts"),
            postedBy: 'Society Admin (Rohan)',
            isImportant: true,
            priority: 'NORMAL',
            status: 'UNREAD',
            societyName: 'Green Valley Heights',
            targetAudience: payload.target || 'ALL_RESIDENTS',
            acknowledgementRequired: true,
            acknowledged: false,
        });
        const created: AdminNotice = {
            id: newId,
            title: payload.title || '',
            content: payload.content || '',
            category: payload.category || 'General',
            target: payload.target || 'ALL_RESIDENTS',
            status: 'PUBLISHED',
            createdBy: 'Society Admin (Rohan)',
            acknowledgementCount: 0,
            totalTargetCount: 8,
            createdAt: new Date().toISOString(),
        };
        return withMockDelay(created, 800);
    },
    getComplaints: (_filters?: Record<string, string>): Promise<AdminComplaint[]> => withMockDelay(mockAdminComplaints),
    assignComplaint: (_complaintId: string, _assignee: string): Promise<{
        success: boolean;
    }> => withMockDelay({ success: true }, 800),
    escalateComplaint: (_complaintId: string): Promise<{
        success: boolean;
    }> => withMockDelay({ success: true }, 800),
    getAuditLogs: (_filters?: Record<string, string>): Promise<AdminAuditLog[]> => withMockDelay(mockAdminAuditLogs),
};

