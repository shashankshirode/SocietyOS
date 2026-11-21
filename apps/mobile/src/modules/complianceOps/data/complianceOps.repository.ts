import { DATA_SOURCE_MODE } from '../../../core/config/dataSourceMode';
import { ComplianceOpsMockSource } from './complianceOps.mockSource';
import { ComplianceOpsApiSource } from './complianceOps.apiSource';
import type { ComplianceQuery } from './complianceOps.contracts';

class ComplianceOpsRepository {
  private mockSource = new ComplianceOpsMockSource();
  private apiSource = new ComplianceOpsApiSource();

  private get source() {
    return DATA_SOURCE_MODE === 'api' ? this.apiSource : this.mockSource;
  }

  getComplianceHome() {
    return this.source.getComplianceHome();
  }

  getComplianceCalendar(params?: ComplianceQuery) {
    return this.source.getComplianceCalendar(params);
  }

  getComplianceTasks(params?: ComplianceQuery) {
    return this.source.getComplianceTasks(params);
  }

  getComplianceTaskDetail(taskId: string) {
    return this.source.getComplianceTaskDetail(taskId);
  }

  createComplianceTask(input: JsonObject) {
    return this.source.createComplianceTask(input);
  }

  startComplianceTask(taskId: string) {
    return this.source.startComplianceTask(taskId);
  }

  completeComplianceTask(taskId: string, input: JsonObject) {
    return this.source.completeComplianceTask(taskId, input);
  }

  verifyComplianceTask(taskId: string, input: JsonObject) {
    return this.source.verifyComplianceTask(taskId, input);
  }

  reopenComplianceTask(taskId: string, input: JsonObject) {
    return this.source.reopenComplianceTask(taskId, input);
  }

  getWasteDashboard() {
    return this.source.getWasteDashboard();
  }

  getWastePickupSchedule(params?: ComplianceQuery) {
    return this.source.getWastePickupSchedule(params);
  }

  markWastePickupCompleted(scheduleId: string, input: JsonObject) {
    return this.source.markWastePickupCompleted(scheduleId, input);
  }

  submitWasteSegregationChecklist(input: JsonObject) {
    return this.source.submitWasteSegregationChecklist(input);
  }

  reportMissedGarbagePickup(input: JsonObject) {
    return this.source.reportMissedGarbagePickup(input);
  }

  createWasteViolationPlaceholder(input: JsonObject) {
    return this.source.createWasteViolationPlaceholder(input);
  }

  getWasteSegregationReport(params?: ComplianceQuery) {
    return this.source.getWasteSegregationReport(params);
  }

  getHousekeepingDashboard() {
    return this.source.getHousekeepingDashboard();
  }

  getHousekeepingSchedule(params?: ComplianceQuery) {
    return this.source.getHousekeepingSchedule(params);
  }

  getHousekeepingRoundDetail(roundId: string) {
    return this.source.getHousekeepingRoundDetail(roundId);
  }

  startHousekeepingRound(roundId: string) {
    return this.source.startHousekeepingRound(roundId);
  }

  completeHousekeepingRound(roundId: string, input: JsonObject) {
    return this.source.completeHousekeepingRound(roundId, input);
  }

  submitFloorCleaningChecklist(input: JsonObject) {
    return this.source.submitFloorCleaningChecklist(input);
  }

  submitCommonAreaInspection(input: JsonObject) {
    return this.source.submitCommonAreaInspection(input);
  }

  submitSupervisorVerification(input: JsonObject) {
    return this.source.submitSupervisorVerification(input);
  }

  reportHousekeepingIssue(input: JsonObject) {
    return this.source.reportHousekeepingIssue(input);
  }

  getLiftSafetyDashboard() {
    return this.source.getLiftSafetyDashboard();
  }

  getLiftRegister(params?: ComplianceQuery) {
    return this.source.getLiftRegister(params);
  }

  getLiftDetail(liftId: string) {
    return this.source.getLiftDetail(liftId);
  }

  reportLiftBreakdown(liftId: string, input: JsonObject) {
    return this.source.reportLiftBreakdown(liftId, input);
  }

  getLiftMaintenanceVisits(liftId: string) {
    return this.source.getLiftMaintenanceVisits(liftId);
  }

  addLiftMaintenanceVisit(liftId: string, input: JsonObject) {
    return this.source.addLiftMaintenanceVisit(liftId, input);
  }

  getLiftCertificates(liftId: string) {
    return this.source.getLiftCertificates(liftId);
  }

  startLiftCertificateRenewal(liftId: string, input: JsonObject) {
    return this.source.startLiftCertificateRenewal(liftId, input);
  }

  getLiftDowntimeReport(params?: ComplianceQuery) {
    return this.source.getLiftDowntimeReport(params);
  }

  getLiftSafetyDocuments(params?: ComplianceQuery) {
    return this.source.getLiftSafetyDocuments(params);
  }

  getFireSafetyDashboard() {
    return this.source.getFireSafetyDashboard();
  }

  getFireEquipmentRegister(params?: ComplianceQuery) {
    return this.source.getFireEquipmentRegister(params);
  }

  getFireEquipmentDetail(equipmentId: string) {
    return this.source.getFireEquipmentDetail(equipmentId);
  }

  submitFireEquipmentInspection(equipmentId: string, input: JsonObject) {
    return this.source.submitFireEquipmentInspection(equipmentId, input);
  }

  markFireEquipmentFaulty(equipmentId: string, input: JsonObject) {
    return this.source.markFireEquipmentFaulty(equipmentId, input);
  }

  markFireEquipmentReplaced(equipmentId: string, input: JsonObject) {
    return this.source.markFireEquipmentReplaced(equipmentId, input);
  }

  getFireExtinguisherExpiry(params?: ComplianceQuery) {
    return this.source.getFireExtinguisherExpiry(params);
  }

  getFireNocTracker() {
    return this.source.getFireNocTracker();
  }

  startFireNocRenewal(input: JsonObject) {
    return this.source.startFireNocRenewal(input);
  }

  submitHydrantPumpChecklist(input: JsonObject) {
    return this.source.submitHydrantPumpChecklist(input);
  }

  getFireDrillRecords(params?: ComplianceQuery) {
    return this.source.getFireDrillRecords(params);
  }

  getFireDrillDetail(drillId: string) {
    return this.source.getFireDrillDetail(drillId);
  }

  createFireDrill(input: JsonObject) {
    return this.source.createFireDrill(input);
  }

  completeFireDrill(drillId: string, input: JsonObject) {
    return this.source.completeFireDrill(drillId, input);
  }

  getEvacuationPlan() {
    return this.source.getEvacuationPlan();
  }

  getSafetyInspectionReport(params?: ComplianceQuery) {
    return this.source.getSafetyInspectionReport(params);
  }

  getComplianceReports(params?: ComplianceQuery) {
    return this.source.getComplianceReports(params);
  }

  requestComplianceReportExport(input: JsonObject) {
    return this.source.requestComplianceReportExport(input);
  }

  getComplianceAuditLogs(params?: ComplianceQuery) {
    return this.source.getComplianceAuditLogs(params);
  }

  getComplianceSettings() {
    return this.source.getComplianceSettings();
  }
}

export const complianceOpsRepository = new ComplianceOpsRepository();
export type { ComplianceOpsRepository };
