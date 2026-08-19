import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';
import type { FinancialReport, ReportCard, SocietyHealthScore } from './reports.types';
import { collectionReportMockData, communityReportsMockData, complaintSlaReportMockData, complianceReportsMockData, financialReportsMockData, mockFinancialReports, ownerTenantLifecycleReportMockData, securityReportsMockData, societyHealthScoreMockData, staffAttendanceReportsMockData, vendorPerformanceReportMockData } from './reports.mockData';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
export const reportsMockSource = {
    async getReports(): Promise<RepositoryResult<FinancialReport[]>> {
        await withMockDelay();
        return repositorySuccess(mockFinancialReports);
    },
    async generateReport(name: string, month: string): Promise<RepositoryResult<FinancialReport>> {
        await withMockDelay();
        const report: FinancialReport = { id: `rep-${Date.now()}`, reportName: name, month, outstandingAmount: 20000, collectedAmount: 180000 };
        mockFinancialReports.push(report);
        return repositorySuccess(report);
    },
    async getFinancialReports(): Promise<RepositoryResult<ReportCard[]>> { await withMockDelay(); return repositorySuccess([...financialReportsMockData]); },
    async getCollectionReport(): Promise<RepositoryResult<ReportCard[]>> { await withMockDelay(); return repositorySuccess([...collectionReportMockData]); },
    async getComplaintSlaReport(): Promise<RepositoryResult<ReportCard[]>> { await withMockDelay(); return repositorySuccess([...complaintSlaReportMockData]); },
    async getVendorPerformanceReport(): Promise<RepositoryResult<ReportCard[]>> { await withMockDelay(); return repositorySuccess([...vendorPerformanceReportMockData]); },
    async getSecurityReports(): Promise<RepositoryResult<ReportCard[]>> { await withMockDelay(); return repositorySuccess([...securityReportsMockData]); },
    async getStaffAttendanceReports(): Promise<RepositoryResult<ReportCard[]>> { await withMockDelay(); return repositorySuccess([...staffAttendanceReportsMockData]); },
    async getOwnerTenantLifecycleReport(): Promise<RepositoryResult<ReportCard[]>> { await withMockDelay(); return repositorySuccess([...ownerTenantLifecycleReportMockData]); },
    async getComplianceReports(): Promise<RepositoryResult<ReportCard[]>> { await withMockDelay(); return repositorySuccess([...complianceReportsMockData]); },
    async getCommunityReports(): Promise<RepositoryResult<ReportCard[]>> { await withMockDelay(); return repositorySuccess([...communityReportsMockData]); },
    async getSocietyHealthScore(): Promise<RepositoryResult<SocietyHealthScore[]>> { await withMockDelay(); return repositorySuccess([...societyHealthScoreMockData]); },
    async getSocietyHealthScoreDimension(id: string): Promise<RepositoryResult<SocietyHealthScore>> {
        await withMockDelay();
        return repositorySuccess(societyHealthScoreMockData.find((item) => item.id === id) ?? getRequiredItem(societyHealthScoreMockData, 0, "reports.mockSource.ts"));
    },
};

