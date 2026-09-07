import { DATA_SOURCE_MODE } from '../../../core/config/dataSourceMode';
import { ReportsMockSource } from './reports.mockSource';
import { ReportsApiSource } from './reports.apiSource';

class ReportsRepository {
  private mockSource = new ReportsMockSource();
  private apiSource = new ReportsApiSource();

  private get source() {
    return DATA_SOURCE_MODE === 'api' ? this.apiSource : this.mockSource;
  }

  getReports() {
    return this.source.getReports();
  }

  generateReport(name: string, month: string) {
    return this.source.generateReport(name, month);
  }

  getFinancialReports() {
    return this.source.getFinancialReports();
  }

  getCollectionReport() {
    return this.source.getCollectionReport();
  }

  getComplaintSlaReport() {
    return this.source.getComplaintSlaReport();
  }

  getVendorPerformanceReport() {
    return this.source.getVendorPerformanceReport();
  }

  getSecurityReports() {
    return this.source.getSecurityReports();
  }

  getStaffAttendanceReports() {
    return this.source.getStaffAttendanceReports();
  }

  getOwnerTenantLifecycleReport() {
    return this.source.getOwnerTenantLifecycleReport();
  }

  getComplianceReports() {
    return this.source.getComplianceReports();
  }

  getCommunityReports() {
    return this.source.getCommunityReports();
  }

  getSocietyHealthScore() {
    return this.source.getSocietyHealthScore();
  }

  getSocietyHealthScoreDimension(id: string) {
    return this.source.getSocietyHealthScoreDimension(id);
  }

  getFinancialReport(id: string) {
    return this.source.getFinancialReport(id);
  }
}

export const reportsRepository = new ReportsRepository();
export type { ReportsRepository };