import { mockComplianceDashboard } from '../../../shared/mock/complianceDashboard.mock';
import { mockComplianceTasks } from '../../../shared/mock/complianceTasks.mock';
import { mockComplianceCalendar } from '../../../shared/mock/complianceCalendar.mock';
import { mockWasteCompliance } from '../../../shared/mock/wasteCompliance.mock';
import { mockWastePickupSchedule } from '../../../shared/mock/wastePickupSchedule.mock';
import { mockHousekeepingSchedule } from '../../../shared/mock/housekeepingSchedule.mock';
import { mockHousekeepingRounds } from '../../../shared/mock/housekeepingRounds.mock';
import { mockLiftRegister } from '../../../shared/mock/liftRegister.mock';
import { mockLiftBreakdowns } from '../../../shared/mock/liftBreakdowns.mock';
import { mockLiftMaintenanceVisits } from '../../../shared/mock/liftMaintenanceVisits.mock';
import { mockLiftCertificates } from '../../../shared/mock/liftCertificates.mock';
import { mockFireEquipment } from '../../../shared/mock/fireEquipment.mock';
import { mockFireNoc } from '../../../shared/mock/fireNoc.mock';
import { mockFireDrills } from '../../../shared/mock/fireDrills.mock';
import { mockSafetyInspectionReports } from '../../../shared/mock/safetyInspectionReports.mock';
import { mockComplianceReports } from '../../../shared/mock/complianceReports.mock';
import { mockComplianceAuditLogs } from '../../../shared/mock/complianceAuditLogs.mock';
import type { ComplianceQuery } from './complianceOps.contracts';

export type WasteSegregationAudit = {
  id: string;
  recordedAt: string;
  tower: string;
  checkedUnitsCount: number;
  compliantUnitsCount: number;
  complianceRate: number;
  recordedBy: string;
};

export type LiftSafetyDocument = {
  id: string;
  documentName: string;
  documentType: string;
  uploadedAt: string;
  status: string;
};

export class ComplianceOpsMockSource {
  async getComplianceHome() {
    return mockComplianceDashboard;
  }

  async getComplianceCalendar(params?: ComplianceQuery) {
    return mockComplianceCalendar;
  }

  async getComplianceTasks(params?: ComplianceQuery) {
    return mockComplianceTasks;
  }

  async getComplianceTaskDetail(taskId: string) {
    return mockComplianceTasks.find(t => t.id === taskId) || mockComplianceTasks[0];
  }

  async createComplianceTask(input: JsonObject) {
    return { id: `task-new-${Date.now()}`, ...input, status: 'OPEN' };
  }

  async startComplianceTask(taskId: string) {
    return { success: true };
  }

  async completeComplianceTask(taskId: string, input: JsonObject) {
    return { success: true };
  }

  async verifyComplianceTask(taskId: string, input: JsonObject) {
    return { success: true };
  }

  async reopenComplianceTask(taskId: string, input: JsonObject) {
    return { success: true };
  }

  async getWasteDashboard() {
    const completedPickups = mockWastePickupSchedule.filter((pickup) => pickup.status === 'COMPLETED').length;
    return {
      todayCleanups: completedPickups,
      missedPickups: mockWasteCompliance.missedPickupsCount,
      segregationComplianceRate: Math.round(
        (mockWasteCompliance.wetWasteComplianceRate + mockWasteCompliance.dryWasteComplianceRate) / 2,
      ),
    };
  }

  async getWastePickupSchedule(params?: ComplianceQuery) {
    return mockWastePickupSchedule;
  }

  async markWastePickupCompleted(scheduleId: string, input: JsonObject) {
    return { success: true };
  }

  async submitWasteSegregationChecklist(input: JsonObject) {
    return { success: true };
  }

  async reportMissedGarbagePickup(input: JsonObject) {
    return { success: true };
  }

  async createWasteViolationPlaceholder(input: JsonObject) {
    return { success: true };
  }

  async getWasteSegregationReport(params?: ComplianceQuery) {
    const reports: WasteSegregationAudit[] = [
      {
        id: 'waste-audit-1',
        recordedAt: '2026-07-12T10:30:00+05:30',
        tower: 'A Wing',
        checkedUnitsCount: 48,
        compliantUnitsCount: 44,
        complianceRate: 92,
        recordedBy: 'Kavita Jadhav',
      },
    ];
    return reports;
  }

  async getHousekeepingDashboard() {
    return {
      completionRate: 88,
      pendingRoundsCount: 4,
      activeStaffCount: 12,
    };
  }

  async getHousekeepingSchedule(params?: ComplianceQuery) {
    return mockHousekeepingSchedule;
  }

  async getHousekeepingRoundDetail(roundId: string) {
    return mockHousekeepingRounds.find(r => r.id === roundId) || mockHousekeepingRounds[0];
  }

  async startHousekeepingRound(roundId: string) {
    return { success: true };
  }

  async completeHousekeepingRound(roundId: string, input: JsonObject) {
    return { success: true };
  }

  async submitFloorCleaningChecklist(input: JsonObject) {
    return { success: true };
  }

  async submitCommonAreaInspection(input: JsonObject) {
    return { success: true };
  }

  async submitSupervisorVerification(input: JsonObject) {
    return { success: true };
  }

  async reportHousekeepingIssue(input: JsonObject) {
    return { success: true };
  }

  async getLiftSafetyDashboard() {
    return {
      totalLifts: 8,
      activeBreakdowns: mockLiftBreakdowns.filter((breakdown) => breakdown.status !== 'RESOLVED').length,
      expiringCertificates: mockLiftCertificates.filter((certificate) => certificate.status === 'EXPIRING_SOON').length,
    };
  }

  async getLiftRegister(params?: ComplianceQuery) {
    return mockLiftRegister;
  }

  async getLiftDetail(liftId: string) {
    return mockLiftRegister.find(l => l.id === liftId) || mockLiftRegister[0];
  }

  async reportLiftBreakdown(liftId: string, input: JsonObject) {
    return { success: true };
  }

  async getLiftMaintenanceVisits(liftId: string) {
    return mockLiftMaintenanceVisits.filter(v => v.liftId === liftId);
  }

  async addLiftMaintenanceVisit(liftId: string, input: JsonObject) {
    return { success: true };
  }

  async getLiftCertificates(liftId: string) {
    return mockLiftCertificates.filter(c => c.liftId === liftId);
  }

  async startLiftCertificateRenewal(liftId: string, input: JsonObject) {
    return { success: true };
  }

  async getLiftDowntimeReport(params?: ComplianceQuery) {
    return mockLiftBreakdowns;
  }

  async getLiftSafetyDocuments(params?: ComplianceQuery) {
    const documents: LiftSafetyDocument[] = [
      {
        id: 'lift-safety-doc-1',
        documentName: 'Annual lift safety operating certificate',
        documentType: 'Operating certificate',
        uploadedAt: '2026-07-01T09:00:00+05:30',
        status: 'VALID',
      },
    ];
    return documents;
  }

  async getFireSafetyDashboard() {
    return {
      totalEquipmentCount: mockFireEquipment.length,
      faultyEquipmentCount: mockFireEquipment.filter((equipment) => equipment.status === 'FAULTY').length,
      nocExpiryDaysRemaining: 58,
    };
  }

  async getFireEquipmentRegister(params?: ComplianceQuery) {
    return mockFireEquipment;
  }

  async getFireEquipmentDetail(equipmentId: string) {
    return mockFireEquipment.find(e => e.id === equipmentId) || mockFireEquipment[0];
  }

  async submitFireEquipmentInspection(equipmentId: string, input: JsonObject) {
    return { success: true };
  }

  async markFireEquipmentFaulty(equipmentId: string, input: JsonObject) {
    return { success: true };
  }

  async markFireEquipmentReplaced(equipmentId: string, input: JsonObject) {
    return { success: true };
  }

  async getFireExtinguisherExpiry(params?: ComplianceQuery) {
    return mockFireEquipment.filter(e => e.type === 'FIRE_EXTINGUISHER');
  }

  async getFireNocTracker() {
    return mockFireNoc;
  }

  async startFireNocRenewal(input: JsonObject) {
    return { success: true };
  }

  async submitHydrantPumpChecklist(input: JsonObject) {
    return { success: true };
  }

  async getFireDrillRecords(params?: ComplianceQuery) {
    return mockFireDrills;
  }

  async getFireDrillDetail(drillId: string) {
    return mockFireDrills.find(d => d.id === drillId) || mockFireDrills[0];
  }

  async createFireDrill(input: JsonObject) {
    return { success: true };
  }

  async completeFireDrill(drillId: string, input: JsonObject) {
    return { success: true };
  }

  async getEvacuationPlan() {
    return {
      title: 'Green Valley Evacuation Route v1.2',
      assemblyPointLocation: 'North lawn assembly area',
      lastUpdated: '2026-06-30T09:30:00+05:30',
      instructions: 'Use the nearest marked staircase and report to the tower marshal.',
    };
  }

  async getSafetyInspectionReport(params?: ComplianceQuery) {
    return mockSafetyInspectionReports;
  }

  async getComplianceReports(params?: ComplianceQuery) {
    return mockComplianceReports;
  }

  async requestComplianceReportExport(input: JsonObject) {
    return { success: true };
  }

  async getComplianceAuditLogs(params?: ComplianceQuery) {
    return mockComplianceAuditLogs;
  }

  async getComplianceSettings() {
    return {
      wasteScheduleInterval: 'DAILY',
      housekeepingCheckFrequency: 'DAILY',
      liftSafetyCheckFrequency: 'MONTHLY',
      hydrantPumpCheckFrequency: 'WEEKLY',
      fireExtinguisherCheckFrequency: 'MONTHLY',
      fireNocReminderDaysBefore: 60,
      liftCertificateReminderDaysBefore: 30,
    };
  }
}
