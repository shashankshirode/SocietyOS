import type { AdminDashboardData, AdminUnit, AdminUnitDetail, AdminResident, AdminApproval, AdminNotice, AdminComplaint, AdminAuditLog } from '../../../shared/types/admin.types';
import { apiClient } from '../../../core/api/apiClient';
import { apiEndpoints } from '../../../core/api/apiEndpoints';
import { adminMappers } from './admin.mapper';
import type { AdminDashboardDTO, AdminUnitDTO, AdminResidentDTO, AdminApprovalDTO, AdminNoticeDTO, AdminComplaintDTO, AdminAuditLogDTO } from './admin.dto';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
export const adminApiSource = {
    getDashboard: async (): Promise<AdminDashboardData> => {
        const dto = await apiClient.get<AdminDashboardDTO>(apiEndpoints.adminOffice.dashboard);
        return { ...adminMappers.toDashboard(dto), recentApprovals: [], recentComplaints: [], recentAuditLogs: [] };
    },
    getUnits: async (filters?: Record<string, string>): Promise<AdminUnit[]> => {
        const dtos = await apiClient.get<AdminUnitDTO[]>(apiEndpoints.adminOffice.units, { ...includeWhenPresent("query", filters) });
        return dtos.map(adminMappers.toUnit);
    },
    getUnitDetail: async (unitId: string): Promise<AdminUnitDetail> => {
        const dto = await apiClient.get<AdminUnitDTO & JsonObject>(apiEndpoints.adminOffice.unitDetail(unitId));
        return adminMappers.toUnitDetail(dto);
    },
    getResidents: async (filters?: Record<string, string>): Promise<AdminResident[]> => {
        const dtos = await apiClient.get<AdminResidentDTO[]>(apiEndpoints.adminOffice.residents, { ...includeWhenPresent("query", filters) });
        return dtos.map(adminMappers.toResident);
    },
    getApprovals: async (filters?: Record<string, string>): Promise<AdminApproval[]> => {
        const dtos = await apiClient.get<AdminApprovalDTO[]>(apiEndpoints.adminOffice.approvals, { ...includeWhenPresent("query", filters) });
        return dtos.map(adminMappers.toApproval);
    },
    getApprovalDetail: async (approvalId: string): Promise<AdminApproval> => {
        const dto = await apiClient.get<AdminApprovalDTO>(apiEndpoints.adminOffice.approvalDetail(approvalId));
        return adminMappers.toApproval(dto);
    },
    approveRequest: async (approvalId: string, notes?: string): Promise<{
        success: boolean;
    }> => {
        return apiClient.post<{
            success: boolean;
        }>(apiEndpoints.adminOffice.approveRequest(approvalId), { notes });
    },
    rejectRequest: async (approvalId: string, reason: string): Promise<{
        success: boolean;
    }> => {
        return apiClient.post<{
            success: boolean;
        }>(apiEndpoints.adminOffice.rejectRequest(approvalId), { reason });
    },
    requestMoreInfo: async (approvalId: string, infoRequired: string): Promise<{
        success: boolean;
    }> => {
        return apiClient.post<{
            success: boolean;
        }>(apiEndpoints.adminOffice.requestMoreInfo(approvalId), { infoRequired });
    },
    getNotices: async (filters?: Record<string, string>): Promise<AdminNotice[]> => {
        const dtos = await apiClient.get<AdminNoticeDTO[]>(apiEndpoints.adminOffice.adminNotices, { ...includeWhenPresent("query", filters) });
        return dtos.map(adminMappers.toNotice);
    },
    publishNotice: async (noticeId: string): Promise<{
        success: boolean;
    }> => {
        return apiClient.post<{
            success: boolean;
        }>(apiEndpoints.adminOffice.publishAdminNotice(noticeId), {});
    },
    createNotice: async (payload: Partial<AdminNotice>): Promise<AdminNotice> => {
        const dto = await apiClient.post<AdminNoticeDTO>(apiEndpoints.adminOffice.adminNotices, payload);
        return adminMappers.toNotice(dto);
    },
    getComplaints: async (filters?: Record<string, string>): Promise<AdminComplaint[]> => {
        const dtos = await apiClient.get<AdminComplaintDTO[]>(apiEndpoints.adminOffice.adminComplaints, { ...includeWhenPresent("query", filters) });
        return dtos.map(adminMappers.toComplaint);
    },
    assignComplaint: async (complaintId: string, assignee: string): Promise<{
        success: boolean;
    }> => {
        return apiClient.post<{
            success: boolean;
        }>(apiEndpoints.adminOffice.assignComplaint(complaintId), { assignee });
    },
    escalateComplaint: async (complaintId: string): Promise<{
        success: boolean;
    }> => {
        return apiClient.post<{
            success: boolean;
        }>(apiEndpoints.adminOffice.escalateComplaint(complaintId), {});
    },
    getAuditLogs: async (filters?: Record<string, string>): Promise<AdminAuditLog[]> => {
        const dtos = await apiClient.get<AdminAuditLogDTO[]>(apiEndpoints.adminOffice.auditLogs, { ...includeWhenPresent("query", filters) });
        return dtos.map(adminMappers.toAuditLog);
    }
};

