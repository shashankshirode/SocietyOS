import { apiClient } from '../../../core/api/apiClient';
import { apiEndpoints } from '../../../core/api/apiEndpoints';
import type { ComplianceOpsMockSource } from './complianceOps.mockSource';
import type { ComplianceQuery } from './complianceOps.contracts';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
type ComplianceMockResult<TKey extends keyof ComplianceOpsMockSource> = ComplianceOpsMockSource[TKey] extends (...args: never[]) => Promise<infer TResult> ? TResult : never;
export class ComplianceOpsApiSource {
    private get<TKey extends keyof ComplianceOpsMockSource>(_method: TKey, path: string, options?: {
        query?: ComplianceQuery;
    }) {
        return apiClient.get<ComplianceMockResult<TKey>>(path, options);
    }
    private post<TKey extends keyof ComplianceOpsMockSource>(_method: TKey, path: string, body: JsonObject) {
        return apiClient.post<ComplianceMockResult<TKey>>(path, body);
    }
    async getComplianceHome() {
        return this.get('getComplianceHome', apiEndpoints.compliance.dashboard);
    }
    async getComplianceCalendar(params?: ComplianceQuery) {
        return this.get('getComplianceCalendar', apiEndpoints.compliance.calendar, { ...includeWhenPresent("query", params) });
    }
    async getComplianceTasks(params?: ComplianceQuery) {
        return this.get('getComplianceTasks', apiEndpoints.compliance.tasks, { ...includeWhenPresent("query", params) });
    }
    async getComplianceTaskDetail(taskId: string) {
        return this.get('getComplianceTaskDetail', apiEndpoints.compliance.taskDetail(taskId));
    }
    async createComplianceTask(input: JsonObject) {
        return this.post('createComplianceTask', apiEndpoints.compliance.createTask, input);
    }
    async startComplianceTask(taskId: string) {
        return this.post('startComplianceTask', apiEndpoints.compliance.startTask(taskId), {});
    }
    async completeComplianceTask(taskId: string, input: JsonObject) {
        return this.post('completeComplianceTask', apiEndpoints.compliance.completeTask(taskId), input);
    }
    async verifyComplianceTask(taskId: string, input: JsonObject) {
        return this.post('verifyComplianceTask', apiEndpoints.compliance.verifyTask(taskId), input);
    }
    async reopenComplianceTask(taskId: string, input: JsonObject) {
        return this.post('reopenComplianceTask', apiEndpoints.compliance.reopenTask(taskId), input);
    }
    async getWasteDashboard() {
        return this.get('getWasteDashboard', apiEndpoints.compliance.wasteDashboard);
    }
    async getWastePickupSchedule(params?: ComplianceQuery) {
        return this.get('getWastePickupSchedule', apiEndpoints.compliance.wastePickupSchedule, { ...includeWhenPresent("query", params) });
    }
    async markWastePickupCompleted(scheduleId: string, input: JsonObject) {
        return this.post('markWastePickupCompleted', apiEndpoints.compliance.markWastePickupCompleted(scheduleId), input);
    }
    async submitWasteSegregationChecklist(input: JsonObject) {
        return this.post('submitWasteSegregationChecklist', apiEndpoints.compliance.submitWasteSegregationChecklist, input);
    }
    async reportMissedGarbagePickup(input: JsonObject) {
        return this.post('reportMissedGarbagePickup', apiEndpoints.compliance.submitMissedGarbagePickup, input);
    }
    async createWasteViolationPlaceholder(input: JsonObject) {
        return this.post('createWasteViolationPlaceholder', apiEndpoints.compliance.createWasteViolationPlaceholder, input);
    }
    async getWasteSegregationReport(params?: ComplianceQuery) {
        return this.get('getWasteSegregationReport', apiEndpoints.compliance.wasteReports, { ...includeWhenPresent("query", params) });
    }
    async getHousekeepingDashboard() {
        return this.get('getHousekeepingDashboard', apiEndpoints.compliance.housekeepingDashboard);
    }
    async getHousekeepingSchedule(params?: ComplianceQuery) {
        return this.get('getHousekeepingSchedule', apiEndpoints.compliance.housekeepingSchedules, { ...includeWhenPresent("query", params) });
    }
    async getHousekeepingRoundDetail(roundId: string) {
        return this.get('getHousekeepingRoundDetail', apiEndpoints.compliance.housekeepingRoundDetail(roundId));
    }
    async startHousekeepingRound(roundId: string) {
        return this.post('startHousekeepingRound', apiEndpoints.compliance.startHousekeepingRound(roundId), {});
    }
    async completeHousekeepingRound(roundId: string, input: JsonObject) {
        return this.post('completeHousekeepingRound', apiEndpoints.compliance.completeHousekeepingRound(roundId), input);
    }
    async submitFloorCleaningChecklist(input: JsonObject) {
        return this.post('submitFloorCleaningChecklist', apiEndpoints.compliance.submitFloorCleaningChecklist, input);
    }
    async submitCommonAreaInspection(input: JsonObject) {
        return this.post('submitCommonAreaInspection', apiEndpoints.compliance.submitCommonAreaInspection, input);
    }
    async submitSupervisorVerification(input: JsonObject) {
        return this.post('submitSupervisorVerification', apiEndpoints.compliance.submitSupervisorVerification, input);
    }
    async reportHousekeepingIssue(input: JsonObject) {
        return this.post('reportHousekeepingIssue', apiEndpoints.compliance.reportHousekeepingIssue, input);
    }
    async getLiftSafetyDashboard() {
        return this.get('getLiftSafetyDashboard', apiEndpoints.compliance.liftDashboard);
    }
    async getLiftRegister(params?: ComplianceQuery) {
        return this.get('getLiftRegister', apiEndpoints.compliance.lifts, { ...includeWhenPresent("query", params) });
    }
    async getLiftDetail(liftId: string) {
        return this.get('getLiftDetail', apiEndpoints.compliance.liftDetail(liftId));
    }
    async reportLiftBreakdown(liftId: string, input: JsonObject) {
        return this.post('reportLiftBreakdown', apiEndpoints.compliance.reportLiftBreakdown(liftId), input);
    }
    async getLiftMaintenanceVisits(liftId: string) {
        return this.get('getLiftMaintenanceVisits', apiEndpoints.compliance.getLiftMaintenanceVisits(liftId));
    }
    async addLiftMaintenanceVisit(liftId: string, input: JsonObject) {
        return this.post('addLiftMaintenanceVisit', apiEndpoints.compliance.addLiftMaintenanceVisit(liftId), input);
    }
    async getLiftCertificates(liftId: string) {
        return this.get('getLiftCertificates', apiEndpoints.compliance.getLiftCertificates(liftId));
    }
    async startLiftCertificateRenewal(liftId: string, input: JsonObject) {
        return this.post('startLiftCertificateRenewal', apiEndpoints.compliance.startLiftCertificateRenewal(liftId), input);
    }
    async getLiftDowntimeReport(params?: ComplianceQuery) {
        return this.get('getLiftDowntimeReport', apiEndpoints.compliance.liftDowntimeReport, { ...includeWhenPresent("query", params) });
    }
    async getLiftSafetyDocuments(params?: ComplianceQuery) {
        return this.get('getLiftSafetyDocuments', apiEndpoints.compliance.liftSafetyDocuments, { ...includeWhenPresent("query", params) });
    }
    async getFireSafetyDashboard() {
        return this.get('getFireSafetyDashboard', apiEndpoints.compliance.fireDashboard);
    }
    async getFireEquipmentRegister(params?: ComplianceQuery) {
        return this.get('getFireEquipmentRegister', apiEndpoints.compliance.fireEquipment, { ...includeWhenPresent("query", params) });
    }
    async getFireEquipmentDetail(equipmentId: string) {
        return this.get('getFireEquipmentDetail', apiEndpoints.compliance.fireEquipmentDetail(equipmentId));
    }
    async submitFireEquipmentInspection(equipmentId: string, input: JsonObject) {
        return this.post('submitFireEquipmentInspection', apiEndpoints.compliance.submitFireEquipmentInspection(equipmentId), input);
    }
    async markFireEquipmentFaulty(equipmentId: string, input: JsonObject) {
        return this.post('markFireEquipmentFaulty', apiEndpoints.compliance.markFireEquipmentFaulty(equipmentId), input);
    }
    async markFireEquipmentReplaced(equipmentId: string, input: JsonObject) {
        return this.post('markFireEquipmentReplaced', apiEndpoints.compliance.markFireEquipmentReplaced(equipmentId), input);
    }
    async getFireExtinguisherExpiry(params?: ComplianceQuery) {
        return this.get('getFireExtinguisherExpiry', apiEndpoints.compliance.fireExtinguisherExpiry, { ...includeWhenPresent("query", params) });
    }
    async getFireNocTracker() {
        return this.get('getFireNocTracker', apiEndpoints.compliance.fireNoc);
    }
    async startFireNocRenewal(input: JsonObject) {
        return this.post('startFireNocRenewal', apiEndpoints.compliance.startFireNocRenewal, input);
    }
    async submitHydrantPumpChecklist(input: JsonObject) {
        return this.post('submitHydrantPumpChecklist', apiEndpoints.compliance.submitHydrantPumpChecklist, input);
    }
    async getFireDrillRecords(params?: ComplianceQuery) {
        return this.get('getFireDrillRecords', apiEndpoints.compliance.fireDrills, { ...includeWhenPresent("query", params) });
    }
    async getFireDrillDetail(drillId: string) {
        return this.get('getFireDrillDetail', apiEndpoints.compliance.fireDrillDetail(drillId));
    }
    async createFireDrill(input: JsonObject) {
        return this.post('createFireDrill', apiEndpoints.compliance.createFireDrill, input);
    }
    async completeFireDrill(drillId: string, input: JsonObject) {
        return this.post('completeFireDrill', apiEndpoints.compliance.completeFireDrill(drillId), input);
    }
    async getEvacuationPlan() {
        return this.get('getEvacuationPlan', apiEndpoints.compliance.fireEvacuationPlan);
    }
    async getSafetyInspectionReport(params?: ComplianceQuery) {
        return this.get('getSafetyInspectionReport', apiEndpoints.compliance.reports, { ...includeWhenPresent("query", params) });
    }
    async getComplianceReports(params?: ComplianceQuery) {
        return this.get('getComplianceReports', apiEndpoints.compliance.reports, { ...includeWhenPresent("query", params) });
    }
    async requestComplianceReportExport(input: JsonObject) {
        return this.post('requestComplianceReportExport', apiEndpoints.compliance.exportReportPlaceholder, input);
    }
    async getComplianceAuditLogs(params?: ComplianceQuery) {
        return this.get('getComplianceAuditLogs', apiEndpoints.compliance.auditLogs, { ...includeWhenPresent("query", params) });
    }
    async getComplianceSettings() {
        return this.get('getComplianceSettings', apiEndpoints.compliance.settings);
    }
}

