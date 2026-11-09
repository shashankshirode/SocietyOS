import type { Visitor } from '../../shared/types/visitor.types';
import type { VisitorPass, GateEntry, GateExit } from '../../shared/types/visitorPhase5';
import type { Complaint } from '../../shared/types/complaint.types';
import type { Notice } from '../../shared/types/notice.types';
import type { Bill } from '../../shared/types/bill.types';
import type { DocumentInfo } from '../../shared/types/document.types';
import type { NocRequest, NocCertificate } from '../../shared/types/noc.types';
import type { StaffMember } from '../../shared/types/staff.types';
import type { AdminResident } from '../../shared/types/admin.types';
import type { ResidentProfileInfo } from '../../modules/resident/profile/data/residents.types';
import type { SocietyHierarchyNode, UnitDetailInfo } from '../../modules/societySetup/data/societySetup.types';
import type { ChatThread } from '../../shared/types/chat.types';
import type { InterFlatIssue } from '../../shared/types/interFlat.types';
import type { FacilityBooking } from '../../shared/types/facilityBooking.types';
import type { Vehicle } from '../../shared/types/vehicle.types';
import type { JsonObject } from '../api/api.types';
import type {
  AttendancePunch,
  DailyAttendanceSummary,
  LeaveRecord,
  OvertimeRecord,
  AttendanceCorrectionRequest,
  BiometricDevice,
  BiometricMapping,
  BiometricSyncJob,
  BiometricSyncError,
  DuplicatePunchCandidate,
  MissingCheckoutRecord,
  AttendanceSettings,
  SalaryStructure,
  StaffAdvance,
  AdvanceRecovery,
  PayrollAdjustment,
  PayrollPeriod,
  PayrollRecord,
  Payslip,
  ShiftDefinition,
  ShiftAssignment,
  ShiftSwapRequest,
  RosterDefinition,
  StaffOnboardingRecord,
  StaffPerformanceRecord,
  StaffSuspensionRecord,
  StaffTransferRecord,
  StaffExitRecord,
  MonthlyAttendanceRecord,
} from '../../shared/types/workforcePhase11.types';
import type {
  VisitorInvitation,
  VisitorApprovalRequest,
  WatchlistEntry,
  GateEvent,
  UnknownVisitorPolicy,
} from '../../shared/types/visitorPhase8.types';
import type {
  ComplaintAssignment,
  ComplaintComment,
  ComplaintEvidence,
  ComplaintFeedback,
  ComplaintHold,
  ComplaintResolution,
  ComplaintStatusHistoryItem,
  ParentIncident,
  SlaPolicy,
  ComplaintEscalation,
  CorrelationCandidate,
} from '../../shared/types/complaintPhase10.types';
import type {
  MoveOutRequest,
  ClearanceSnapshot,
} from '../../shared/types/moveOut.types';
import type {
  ResidentRegistration,
  RegistrationDocument,
  RegistrationDocumentRequirement,
  RegistrationInvitation,
  RegistrationTimelineEvent,
} from '../../modules/resident/auth/data/registration.types';
import type {
  ResidentRegistration as AdminResidentRegistration,
  ResidentInvitation,
  ResidentDocument,
} from '../../modules/societyAdmin/data/residentRegistration.types';
import type {
  Invoice,
  InvoiceLine,
  Receipt,
  PaymentTransaction,
  PaymentAllocation,
  ReceiptAllocation,
  Refund,
  BankReconciliationRecord,
  BillingRule,
  BillingRun,
  Adjustment,
  InvoicePenalty,
  PaymentAttempt,
} from '../../shared/types/financial.types';
import type { BillingCycle, ChequeRecord, ManualPaymentRecord, DraftBill } from '../../shared/types/accounting.types';

export interface GateLog {
  id: string;
  visitorId: string;
  visitorName: string;
  entryTime: string;
  exitTime?: string;
  guardName: string;
  gateNumber: string;
  visitorType?: string;
  flatNumber?: string;
}

export interface LedgerEntry {
  id: string;
  unitId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  date: string;
}

export interface MockStoreState {
  visitors: Visitor[];
  complaints: Complaint[];
  notices: Notice[];
  bills: Bill[];
  documents: DocumentInfo[];
  nocs: NocRequest[];
  nocRequests?: NocRequest[];
  staff: StaffMember[];
  residents: AdminResident[];
  adminResidents?: AdminResident[];
  residentsNew: ResidentProfileInfo[];
  societyHierarchy: SocietyHierarchyNode;
  societyUnits: UnitDetailInfo[];
  chatThreads: ChatThread[];
  interFlatIssues: InterFlatIssue[];
  facilityBookings: FacilityBooking[];
  vehicles: Vehicle[];
  gateLogs: GateLog[];
  ledgerEntries: LedgerEntry[];
  advanceBalances: Record<string, number>;

  adjustments?: Adjustment[];
  adminInvitations?: JsonObject[];
  advanceRecoveries?: AdvanceRecovery[];
  attendanceCorrections?: AttendanceCorrectionRequest[];
  attendancePunches?: AttendancePunch[];
  attendanceSettings?: AttendanceSettings[];
  bankReconciliationRecords?: BankReconciliationRecord[];
  billingCycles?: BillingCycle[];
  billingRules?: BillingRule[];
  billingRuns?: BillingRun[];
  biometricDevicePunches?: JsonObject[];
  biometricDevices?: BiometricDevice[];
  biometricMappings?: BiometricMapping[];
  biometricSyncErrors?: BiometricSyncError[];
  biometricSyncJobs?: BiometricSyncJob[];
  calendars?: JsonObject[];
  cheques?: (ChequeRecord | JsonObject)[];
  clearanceSnapshots?: ClearanceSnapshot[];
  complaintAssignments?: ComplaintAssignment[];
  complaintCancellations?: JsonObject[];
  complaintComments?: ComplaintComment[];
  complaintEscalations?: ComplaintEscalation[];
  complaintEvidence?: ComplaintEvidence[];
  complaintFeedback?: ComplaintFeedback[];
  complaintHolds?: ComplaintHold[];
  complaintReopens?: JsonObject[];
  complaintResolutions?: ComplaintResolution[];
  complaintStatusHistory?: ComplaintStatusHistoryItem[];
  correlationCandidates?: CorrelationCandidate[];
  dailyAttendanceSummaries?: DailyAttendanceSummary[];
  documentAccessLogs?: JsonObject[];
  documentVersions?: JsonObject[];
  draftBills?: DraftBill[];
  duplicatePunches?: DuplicatePunchCandidate[];
  gateEntries?: (GateEntry | JsonObject)[];
  gateEvents?: GateEvent[];
  gateExits?: (GateExit | JsonObject)[];
  gates?: JsonObject[];
  guards?: JsonObject[];
  idempotencyRecords?: JsonObject[];
  invoiceLines?: InvoiceLine[];
  invoicePenalties?: InvoicePenalty[];
  invoices?: Invoice[];
  leaveRecords?: LeaveRecord[];
  manualPayments?: ManualPaymentRecord[];
  missingCheckouts?: MissingCheckoutRecord[];
  monthlyAttendance?: MonthlyAttendanceRecord[];
  moveOutRequests?: MoveOutRequest[];
  nocCertificates?: NocCertificate[];
  overtimeRecords?: OvertimeRecord[];
  parentIncidents?: ParentIncident[];
  paymentAllocations?: PaymentAllocation[];
  paymentAttempts?: PaymentAttempt[];
  paymentTransactions?: PaymentTransaction[];
  payrollAdjustments?: PayrollAdjustment[];
  payrollPeriods?: PayrollPeriod[];
  payrollRecords?: PayrollRecord[];
  payslips?: Payslip[];
  receipts?: Receipt[];
  receiptAllocations?: ReceiptAllocation[];
  refunds?: Refund[];
  registrationDocuments?: RegistrationDocument[];
  registrationInvitations?: RegistrationInvitation[];
  registrationRequirements?: RegistrationDocumentRequirement[];
  registrationTimeline?: RegistrationTimelineEvent[];
  residences?: JsonObject[];
  residentDocuments?: ResidentDocument[];
  residentInvitations?: (ResidentInvitation | JsonObject)[];
  residentMemberships?: JsonObject[];
  residentPermissions?: JsonObject[];
  residentProfiles?: JsonObject[];
  residentRegistrations?: (ResidentRegistration | AdminResidentRegistration)[];
  rosters?: RosterDefinition[];
  salaryStructures?: SalaryStructure[];
  shiftAssignments?: ShiftAssignment[];
  shifts?: ShiftDefinition[];
  slaPolicies?: SlaPolicy[];
  staffAdvances?: StaffAdvance[];
  staffExits?: StaffExitRecord[];
  staffOnboarding?: StaffOnboardingRecord[];
  staffPerformance?: StaffPerformanceRecord[];
  staffSuspensions?: StaffSuspensionRecord[];
  staffTransfers?: StaffTransferRecord[];
  swapRequests?: ShiftSwapRequest[];
  unknownVisitorPolicies?: UnknownVisitorPolicy[];
  visitorApprovalRequests?: VisitorApprovalRequest[];
  visitorInvitations?: VisitorInvitation[];
  visitorPasses?: VisitorPass[];
  visitorVehicles?: JsonObject[];
  watchlistEntries?: WatchlistEntry[];
}
