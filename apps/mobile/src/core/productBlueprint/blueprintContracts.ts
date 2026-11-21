type BlueprintRecord = {
  id: string;
  title: string;
  status: 'READY' | 'PENDING' | 'MOCK_ONLY';
};

type BlueprintAction = (input?: JsonValue) => Promise<BlueprintRecord | BlueprintRecord[] | boolean>;

const ready = (id: string, title: string): BlueprintRecord => ({ id, title, status: 'READY' });
const mock = (id: string, title: string): BlueprintRecord => ({ id, title, status: 'MOCK_ONLY' });
const list = (...items: BlueprintRecord[]) => items;
const done = async () => true;

export const societySetupSummaryMockData = ready('society-setup-summary', 'Society setup summary');
export const societyHierarchyMockData = ready('society-hierarchy', 'Society hierarchy');
export const towerWingFloorSetupMockData = ready('tower-wing-floor-setup', 'Tower wing floor setup');
export const unitImportPreviewMockData = ready('unit-import-preview', 'Unit import preview');
export const residentDetailMockData = ready('resident-detail', 'Resident detail');
export const previousResidentDocumentArchiveMockData = ready('previous-resident-document-archive', 'Previous resident document archive');
export const createVisitorPassMockData = ready('create-visitor-pass', 'Create visitor pass');
export const visitorPassQrOtpMockData = ready('visitor-pass-qr-otp', 'Visitor pass QR OTP');
export const generateBillsMockData = ready('generate-bills', 'Generate bills');
export const draftBillReviewMockData = ready('draft-bill-review', 'Draft bill review');
export const publishBillsMockData = ready('publish-bills', 'Publish bills');
export const receiptDetailMockData = ready('receipt-detail', 'Receipt detail');
export const manualPaymentEntryMockData = ready('manual-payment-entry', 'Manual payment entry');
export const billingReversalCorrectionMockData = ready('billing-reversal-correction', 'Billing reversal correction');
export const createComplaintMockData = ready('create-complaint', 'Create complaint');
export const complaintTimelineMockData = list(
  ready('complaint-created', 'Complaint created'),
  ready('complaint-assigned', 'Complaint assigned'),
  ready('complaint-progress', 'Work in progress')
);
export const complaintSlaDashboardMockData = ready('complaint-sla-dashboard', 'Complaint SLA dashboard');
export const complaintStatusUpdateMockData = ready('complaint-status-update', 'Complaint status update');
export const createNoticeMockData = ready('create-notice', 'Create notice');
export const noticeAudienceSelectionMockData = ready('notice-audience-selection', 'Notice audience selection');
export const publishNoticeMockData = ready('publish-notice', 'Publish notice');
export const noticeAcknowledgementReportMockData = ready('notice-acknowledgement-report', 'Notice acknowledgement report');
export const staffDirectoryMockData = ready('staff-directory', 'Staff directory');
export const domesticHelpDirectoryMockData = ready('domestic-help-directory', 'Domestic help directory');
export const staffVerificationMockData = list(ready('staff-verification', 'Staff verification'));
export const shiftRosterMockData = list(ready('shift-roster', 'Shift roster'));
export const manualAttendanceEntryMockData = ready('manual-attendance-entry', 'Manual attendance entry');
export const attendanceCorrectionRequestMockData = ready('attendance-correction-request', 'Attendance correction request');
export const biometricDeviceRegistryMockData = ready('biometric-device-registry', 'Biometric device registry');
export const biometricStaffMappingMockData = ready('biometric-staff-mapping', 'Biometric staff mapping');
export const biometricPunchSyncLogsMockData = ready('biometric-punch-sync-logs', 'Biometric punch sync logs');
export const duplicatePunchReviewMockData = ready('duplicate-punch-review', 'Duplicate punch review');
export const createNocRequestMockData = ready('create-noc-request', 'Create NOC request');
export const qrVerifiableCertificateMockData = ready('qr-verifiable-certificate', 'QR verifiable certificate');
export const privacyDirectorySettingsMockData = ready('privacy-directory-settings', 'Privacy directory settings');
export const searchableFlatResidentMockData = ready('searchable-flat-resident', 'Searchable flat resident');
export const parcelHandoverRequestMockData = ready('parcel-handover-request', 'Parcel handover request');
export const facilitySlotAvailabilityMockData = ready('facility-slot-availability', 'Facility slot availability');
export const createFacilityBookingMockData = ready('create-facility-booking', 'Create facility booking');
export const facilityBookingApprovalMockData = ready('facility-booking-approval', 'Facility booking approval');
export const amcReminderDashboardMockData = ready('amc-reminder-dashboard', 'AMC reminder dashboard');
export const createMeetingNoticeMockData = ready('create-meeting-notice', 'Create meeting notice');
export const seniorCitizenDailyCheckInMockData = ready('senior-citizen-daily-check-in', 'Senior citizen daily check-in');
export const emergencyVolunteerNetworkMockData = ready('emergency-volunteer-network', 'Emergency volunteer network');
export const serviceCategoryListMockData = ready('service-category-list', 'Service category list');
export const hardwareDeviceRegistryMockData = ready('hardware-device-registry', 'Hardware device registry');
export const societyOnboardingMockData = ready('society-onboarding', 'Society onboarding');
export const societyFeatureFlagManagementMockData = ready('society-feature-flag-management', 'Society feature flag management');
export const hiddenCommercialControlsMockData = ready('hidden-commercial-controls', 'Hidden commercial controls');

export function useSocietySetupSummary() { return { data: societySetupSummaryMockData, isLoading: false, error: null }; }
export function useResidentDetail() { return { data: residentDetailMockData, isLoading: false, error: null }; }
export function useResidentApprovalQueue() { return { data: list(mock('resident-approval', 'Resident approval')), isLoading: false, error: null }; }
export function useMoveInRequest() { return { data: ready('move-in-request', 'Move-in request'), isLoading: false, error: null }; }
export function useMaterialGatePass() { return { data: ready('material-gate-pass', 'Material gate pass'), isLoading: false, error: null }; }
export function useDraftBillReview() { return { data: draftBillReviewMockData, isLoading: false, error: null }; }
export function useMockBillPayment() { return { data: ready('mock-bill-payment', 'Mock bill payment'), isLoading: false, error: null }; }
export function useBillingReversalCorrection() { return { data: billingReversalCorrectionMockData, isLoading: false, error: null }; }
export function useComplaintAssignment() { return { submit: done, isSubmitting: false }; }
export function useComplaintSlaDashboard() { return { data: complaintSlaDashboardMockData, isLoading: false, error: null }; }
export function useComplaintStatusUpdate() { return { submit: done, isSubmitting: false }; }
export function useComplaintReopen() { return { submit: done, isSubmitting: false }; }
export function useAttendanceCorrectionRequest() { return { data: attendanceCorrectionRequestMockData, isLoading: false, error: null }; }
export function useBiometricDeviceRegistry() { return { data: biometricDeviceRegistryMockData, isLoading: false, error: null }; }
export function useDocumentUpload() { return { data: ready('document-upload', 'Document upload'), isLoading: false, error: null }; }
export function useFirstContactRequest() { return { data: ready('first-contact-request', 'First contact request'), isLoading: false, error: null }; }
export function useWaterLeakageIssue() { return { data: ready('water-leakage-issue', 'Water leakage issue'), isLoading: false, error: null }; }
export function useNoiseComplaintIssue() { return { data: ready('noise-complaint-issue', 'Noise complaint issue'), isLoading: false, error: null }; }
export function useRenovationDisturbanceIssue() { return { data: ready('renovation-disturbance-issue', 'Renovation disturbance issue'), isLoading: false, error: null }; }
export function useWrongParkingIssue() { return { data: ready('wrong-parking-issue', 'Wrong parking issue'), isLoading: false, error: null }; }
export function useParcelHandoverRequest() { return { data: parcelHandoverRequestMockData, isLoading: false, error: null }; }
export function useSeniorCitizenDailyCheckIn() { return { data: seniorCitizenDailyCheckInMockData, isLoading: false, error: null }; }
export function useEmergencyVolunteerNetwork() { return { data: emergencyVolunteerNetworkMockData, isLoading: false, error: null }; }
export function useServiceRequest() { return { data: ready('service-request', 'Service request'), isLoading: false, error: null }; }
export function useHardwareDeviceRegistry() { return { data: hardwareDeviceRegistryMockData, isLoading: false, error: null }; }
export function useSocietyOnboarding() { return { data: societyOnboardingMockData, isLoading: false, error: null }; }
export function useHiddenCommercialControls() { return { data: hiddenCommercialControlsMockData, isLoading: false, error: null }; }

export const blueprintRepositoryMethodAliases: Record<string, BlueprintAction> = {
  getSocietySetupSummary: async () => societySetupSummaryMockData,
  updateSocietySetupSummary: done,
  addSocietyPhase: done,
  addSocietyBlock: done,
  addFlat: done,
  filterUnitsByTowerWingFloorOccupancy: async () => list(towerWingFloorSetupMockData),
  updateUnitBillingAttributes: done,
  updateUnitParkingMapping: done,
  filterResidentsByRoleAndTower: async () => list(residentDetailMockData),
  getResidentById: async () => residentDetailMockData,
  updateResidentStatus: done,
  updateOwnerContactPreferences: done,
  updateTenantPoliceVerificationStatus: done,
  updateFamilyMemberPermission: done,
  approveResidentKyc: done,
  rejectResidentKyc: done,
  approveResidentOnboarding: done,
  rejectResidentOnboarding: done,
  filterOccupancyHistory: async () => list(mock('occupancy-history', 'Occupancy history')),
  getOwnerHistoryDetail: async () => mock('owner-history-detail', 'Owner history detail'),
  getTenantHistoryDetail: async () => mock('tenant-history-detail', 'Tenant history detail'),
  addFlatTimelineEvent: done,
  requestPreviousResidentDocumentAccess: done,
  updateMoveInOwnerApproval: done,
  updateMoveInAdminApproval: done,
  updateMoveOutClearanceChecklist: done,
  revokeResidentAccess: done,
  getVisitorPassById: async () => createVisitorPassMockData,
  getVisitorOtp: async () => visitorPassQrOtpMockData,
  regenerateVisitorOtp: done,
  filterExpectedVisitors: async () => list(mock('expected-visitor', 'Expected visitor')),
  verifyVisitorOtp: done,
  approveVisitorEntry: done,
  rejectVisitorEntry: done,
  createGateLogFromVisitor: done,
  createManualGuestEntry: done,
  markDeliveryCollected: done,
  markDeliveryReturned: done,
  checkoutVendorGateEntry: done,
  approveMaterialGatePass: done,
  filterGateLogs: async () => list(mock('gate-log', 'Gate log')),
  listOfflineGateQueue: async () => list(mock('offline-gate-queue', 'Offline gate queue')),
  addOfflineGateEntry: done,
  syncOfflineGateQueue: done,
  addWatchlistEntry: done,
  removeWatchlistEntry: done,
  previewBillGeneration: async () => generateBillsMockData,
  updateDraftBillCharge: done,
  markDraftBillReviewed: done,
  createReceiptAfterMockPayment: async () => receiptDetailMockData,
  updateLedgerAfterMockPayment: done,
  filterFlatLedger: async () => list(mock('flat-ledger', 'Flat ledger')),
  createManualPaymentReceipt: async () => manualPaymentEntryMockData,
  filterDefaulters: async () => list(mock('defaulter', 'Defaulter')),
  listComplaintTimelineEvents: async () => complaintTimelineMockData,
  addComplaintTimelineEvent: done,
  assignComplaintToFacilityManager: done,
  assignComplaintToVendor: done,
  assignComplaintToStaff: done,
  getComplaintSlaDashboard: async () => complaintSlaDashboardMockData,
  filterComplaintSlaItems: async () => list(complaintSlaDashboardMockData),
  getNoticeReadStatus: async () => ready('notice-read-status', 'Notice read status'),
  filterNoticeAcknowledgements: async () => list(noticeAcknowledgementReportMockData),
  listStaff: async () => list(staffDirectoryMockData),
  filterStaffByRoleVendorStatus: async () => list(staffDirectoryMockData),
  listDomesticHelp: async () => list(domesticHelpDirectoryMockData),
  filterDomesticHelp: async () => list(domesticHelpDirectoryMockData),
  updateStaffVerificationStatus: done,
  listShiftRosters: async () => shiftRosterMockData,
  assignStaffShift: done,
  createManualAttendancePunch: done,
  createAttendanceCorrectionRequest: async () => attendanceCorrectionRequestMockData,
  approveAttendanceCorrectionRequest: done,
  rejectAttendanceCorrectionRequest: done,
  registerBiometricDevicePlaceholder: done,
  mapEmployeeCodeToStaffProfile: done,
  filterBiometricPunchSyncLogs: async () => list(biometricPunchSyncLogsMockData),
  listDuplicatePunches: async () => list(duplicatePunchReviewMockData),
  ignoreDuplicatePunch: done,
  filterMonthlyBiometricReport: async () => list(mock('monthly-biometric-report', 'Monthly biometric report')),
  attachPickedFileToDocument: done,
  attachCameraImageToDocument: done,
  createDocumentVersion: done,
  runMoveOutNocClearanceChecklist: done,
  updateNocClearanceItem: done,
  generateQrVerificationPlaceholder: async () => qrVerifiableCertificateMockData,
  getPrivacyDirectorySettings: async () => privacyDirectorySettingsMockData,
  updatePrivacyDirectoryVisibility: done,
  getPrivateChatThread: async () => ready('private-chat-thread', 'Private chat thread'),
  assignInterFlatIssueMediator: done,
  checkFacilitySlotConflict: done,
  rejectFacilityBooking: done,
  releaseParkingSlot: done,
  addParkingViolation: done,
  filterAmcReminders: async () => list(amcReminderDashboardMockData),
  returnInventoryItem: done,
  listMeetingAgendaItems: async () => list(mock('meeting-agenda-item', 'Meeting agenda item')),
  addMeetingAgendaItem: done,
  publishMinutesOfMeeting: done,
  updateResolutionStatus: done,
  getVotingEligibilityPreview: async () => ready('voting-eligibility-preview', 'Voting eligibility preview'),
  filterCollectionReport: async () => list(mock('collection-report', 'Collection report')),
  listHardwareDevices: async () => list(hardwareDeviceRegistryMockData),
  registerHardwareDevicePlaceholder: done,
  createSocietyOnboardingDraft: async () => societyOnboardingMockData,
  listSocietyFeatureFlags: async () => list(societyFeatureFlagManagementMockData),
  getHiddenCommercialControls: async () => hiddenCommercialControlsMockData,
};
