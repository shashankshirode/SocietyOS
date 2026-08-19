import type { RepositoryResult } from '../../../core/repositories/repository.types';
import type { FinancialReport, ReportCard, SocietyHealthScore } from './reports.types';
const notImplemented = <T>(): Promise<RepositoryResult<T>> => Promise.resolve({ ok: false, error: { message: 'API source not implemented', code: 'NOT_IMPLEMENTED' } });

export const reportsApiSource = {
  getReports: () => notImplemented<FinancialReport[]>(),
  generateReport: (_name: string, _month: string) => notImplemented<FinancialReport>(),
  getFinancialReports: () => notImplemented<ReportCard[]>(),
  getCollectionReport: () => notImplemented<ReportCard[]>(),
  getComplaintSlaReport: () => notImplemented<ReportCard[]>(),
  getVendorPerformanceReport: () => notImplemented<ReportCard[]>(),
  getSecurityReports: () => notImplemented<ReportCard[]>(),
  getStaffAttendanceReports: () => notImplemented<ReportCard[]>(),
  getOwnerTenantLifecycleReport: () => notImplemented<ReportCard[]>(),
  getComplianceReports: () => notImplemented<ReportCard[]>(),
  getCommunityReports: () => notImplemented<ReportCard[]>(),
  getSocietyHealthScore: () => notImplemented<SocietyHealthScore[]>(),
  getSocietyHealthScoreDimension: (_id: string) => notImplemented<SocietyHealthScore>(),
};
