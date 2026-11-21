import { apiClient } from '../../../core/api/apiClient';
import { apiEndpoints } from '../../../core/api/apiEndpoints';
import type { ReportsMockSource } from './reports.mockSource';
import type { FinancialReport, ReportCard, SocietyHealthScore } from './reports.types';
import { repositorySuccess, type RepositoryResult } from '../../../core/repositories/repository.types';

type ReportsMockResult<TKey extends keyof ReportsMockSource> = ReportsMockSource[TKey] extends (...args: never[]) => Promise<RepositoryResult<infer TResult>> ? TResult : ReportsMockSource[TKey] extends (...args: never[]) => Promise<infer TResult> ? TResult : never;
type QueryParams = Record<string, string | number | boolean>;

export class ReportsApiSource {
  private async get<TKey extends keyof ReportsMockSource>(_method: TKey, path: string, options?: { query?: QueryParams }): Promise<RepositoryResult<ReportsMockResult<TKey>>> {
    const data = await apiClient.get<ReportsMockResult<TKey>>(path, options);
    return repositorySuccess(data);
  }

  private async post<TKey extends keyof ReportsMockSource>(_method: TKey, path: string, body: Record<string, string | number | boolean | null>): Promise<RepositoryResult<ReportsMockResult<TKey>>> {
    const data = await apiClient.post<ReportsMockResult<TKey>>(path, body);
    return repositorySuccess(data);
  }

  async getReports(): Promise<RepositoryResult<FinancialReport[]>> {
    return this.get('getReports', apiEndpoints.accounting.reports);
  }

  async generateReport(name: string, month: string): Promise<RepositoryResult<FinancialReport>> {
    return this.post('generateReport', apiEndpoints.accounting.generateReport('financial'), { name, month });
  }

  async getFinancialReports(): Promise<RepositoryResult<ReportCard[]>> {
    return this.get('getFinancialReports', apiEndpoints.accounting.reports);
  }

  async getCollectionReport(): Promise<RepositoryResult<ReportCard[]>> {
    return this.get('getCollectionReport', `${apiEndpoints.accounting.reports}/collection`);
  }

  async getComplaintSlaReport(): Promise<RepositoryResult<ReportCard[]>> {
    return this.get('getComplaintSlaReport', `${apiEndpoints.complaints.list}/sla-report`);
  }

  async getVendorPerformanceReport(): Promise<RepositoryResult<ReportCard[]>> {
    return this.get('getVendorPerformanceReport', `${apiEndpoints.facilityOps.vendors}/performance-report`);
  }

  async getSecurityReports(): Promise<RepositoryResult<ReportCard[]>> {
    return this.get('getSecurityReports', `${apiEndpoints.gate.activity}/reports`);
  }

  async getStaffAttendanceReports(): Promise<RepositoryResult<ReportCard[]>> {
    return this.get('getStaffAttendanceReports', `${apiEndpoints.staffAttendance.monthlyAttendanceReport}`);
  }

  async getOwnerTenantLifecycleReport(): Promise<RepositoryResult<ReportCard[]>> {
    return this.get('getOwnerTenantLifecycleReport', `${apiEndpoints.occupancy.occupancyTimeline}/report`);
  }

  async getComplianceReports(): Promise<RepositoryResult<ReportCard[]>> {
    return this.get('getComplianceReports', `${apiEndpoints.compliance.dashboard}/reports`);
  }

  async getCommunityReports(): Promise<RepositoryResult<ReportCard[]>> {
    return this.get('getCommunityReports', `${apiEndpoints.residentConnect.directory}/reports`);
  }

  async getSocietyHealthScore(): Promise<RepositoryResult<SocietyHealthScore[]>> {
    return this.get('getSocietyHealthScore', `${apiEndpoints.governance.dashboard}/health-score`);
  }

  async getSocietyHealthScoreDimension(id: string): Promise<RepositoryResult<SocietyHealthScore>> {
    return this.get('getSocietyHealthScoreDimension', `${apiEndpoints.governance.dashboard}/health-score/${id}`);
  }

  async getFinancialReport(id: string): Promise<RepositoryResult<FinancialReport | null>> {
    return this.get('getFinancialReport', `${apiEndpoints.accounting.reports}/${id}`);
  }
}