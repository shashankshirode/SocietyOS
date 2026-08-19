import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from './navigation.types';

import { SuperAdminHomeScreen } from '../../modules/superAdmin/screens/SuperAdminHomeScreen';
import { PlatformDashboardScreen } from '../../modules/superAdmin/screens/PlatformDashboardScreen';
import { SocietyDirectoryScreen } from '../../modules/superAdmin/screens/SocietyDirectoryScreen';
import { PlatformSocietyDetailScreen } from '../../modules/superAdmin/screens/PlatformSocietyDetailScreen';
import { SocietyOnboardingScreen } from '../../modules/superAdmin/screens/SocietyOnboardingScreen';
import { SocietyOnboardingReviewScreen } from '../../modules/superAdmin/screens/SocietyOnboardingReviewScreen';
import { SocietyHierarchyTemplateScreen } from '../../modules/superAdmin/screens/SocietyHierarchyTemplateScreen';
import { SocietyModuleConfigurationScreen } from '../../modules/superAdmin/screens/SocietyModuleConfigurationScreen';
import { FeatureFlagManagementScreen } from '../../modules/superAdmin/screens/FeatureFlagManagementScreen';
import { FeatureFlagChangeConfirmationScreen } from '../../modules/superAdmin/screens/FeatureFlagChangeConfirmationScreen';
import { HiddenCommercialControlsScreen } from '../../modules/superAdmin/screens/HiddenCommercialControlsScreen';
import { FreeLaunchPlanMappingScreen } from '../../modules/superAdmin/screens/FreeLaunchPlanMappingScreen';
import { SocietyAdminUsersScreen } from '../../modules/superAdmin/screens/SocietyAdminUsersScreen';
import { PlatformUserLookupScreen } from '../../modules/superAdmin/screens/PlatformUserLookupScreen';
import { SupportConsoleScreen } from '../../modules/superAdmin/screens/SupportConsoleScreen';
import { SupportTicketDetailScreen } from '../../modules/superAdmin/screens/SupportTicketDetailScreen';
import { SupportTicketEscalationScreen } from '../../modules/superAdmin/screens/SupportTicketEscalationScreen';
import { OperationalAlertsScreen } from '../../modules/superAdmin/screens/OperationalAlertsScreen';
import { UsageAnalyticsScreen } from '../../modules/superAdmin/screens/UsageAnalyticsScreen';
import { ModuleAdoptionAnalyticsScreen } from '../../modules/superAdmin/screens/ModuleAdoptionAnalyticsScreen';
import { SocietyHealthOverviewScreen } from '../../modules/superAdmin/screens/SocietyHealthOverviewScreen';
import { IntegrationStatusPlaceholderScreen } from '../../modules/superAdmin/screens/IntegrationStatusPlaceholderScreen';
import { NotificationChannelStatusPlaceholderScreen } from '../../modules/superAdmin/screens/NotificationChannelStatusPlaceholderScreen';
import { DataExportRequestPlaceholderScreen } from '../../modules/superAdmin/screens/DataExportRequestPlaceholderScreen';
import { AdminImpersonationPlaceholderScreen } from '../../modules/superAdmin/screens/AdminImpersonationPlaceholderScreen';
import { PlatformAuditLogScreen } from '../../modules/superAdmin/screens/PlatformAuditLogScreen';
import { PlatformSettingsScreen } from '../../modules/superAdmin/screens/PlatformSettingsScreen';
import { PlatformReleaseRolloutScreen } from '../../modules/superAdmin/screens/PlatformReleaseRolloutScreen';
import { BlueprintFeatureCoverageScreen } from '../../modules/superAdmin/screens/BlueprintFeatureCoverageScreen';
import { BlueprintFeatureDetailScreen } from '../../modules/superAdmin/screens/BlueprintFeatureDetailScreen';

import { SocietyHierarchyScreen, SocietySetupSummaryScreen, TowerWingFloorSetupScreen, UnitDetailScreen, UnitImportPreviewScreen, UnitMasterScreen } from '../../modules/societySetup';
import { OwnerProfileScreen, ResidentApprovalQueueScreen, ResidentDetailScreen, ResidentDirectoryScreen, ResidentKycScreen, TenantProfileScreen } from '../../modules/resident/profile';
import { FamilyMembersScreen } from '../../modules/resident/family';
import { CreateVisitorScreen, VisitorPassQrOtpScreen } from '../../modules/resident/visitors';
import { BlacklistWatchlistScreen, CabEntryScreen, DeliveryEntryScreen, ExpectedVisitorsScreen, GateLogsScreen, ManualGateEntryScreen, MaterialEntryScreen, OfflineQueuePlaceholderScreen, VendorEntryScreen, VerifyVisitorScreen } from '../../modules/guard';
import { ChargeHeadsScreen, DefaulterReportScreen, DraftBillReviewScreen, FlatLedgerScreen, GenerateBillsScreen, ManualPaymentEntryScreen, MockPaymentScreen, PublishBillsConfirmationScreen, ReceiptDetailScreen, ResidentBillListScreen, ReversalCorrectionPlaceholderScreen } from '../../modules/resident/billing';
import { ComplaintAssignmentScreen, ComplaintFeedbackScreen, ComplaintReopenScreen, ComplaintSlaDashboardScreen, ComplaintStatusUpdateScreen, ComplaintTimelineScreen, CreateComplaintScreen, PrivateComplaintPlaceholderScreen } from '../../modules/resident/complaints';
import { CreateNoticeScreen, NoticeAcknowledgementReportScreen, NoticeAudienceSelectionScreen, NoticeReadStatusScreen, PublishNoticeScreen } from '../../modules/resident/notices';
import { ComplianceDocumentsScreen, DocumentAccessLogScreen, DocumentUploadPlaceholderScreen, DocumentVersionHistoryScreen, MoveInDocumentsScreen, MoveOutDocumentsScreen, OwnerDocumentsScreen, RestrictedDocumentAccessScreen, SocietyDocumentsScreen, StaffVendorDocumentsScreen, TenantDocumentsScreen } from '../../modules/resident/documents';
import { CreateNocRequestScreen, MoveOutNocScreen, NoDuesCertificateScreen, NocClearanceChecklistScreen, ParkingNocScreen, QrVerifiableCertificatePlaceholderScreen, RenovationNocScreen, ResidenceCertificateScreen, TenantNocScreen } from '../../modules/resident/noc';
import { AccessActivationRevocationScreen, FlatTimelineScreen, MoveInRequestScreen, MoveOutRequestScreen, OccupancyHistoryScreen, OwnerHistoryScreen, PreviousResidentDocumentArchiveScreen, TenantHistoryScreen } from '../../modules/resident/moveInMoveOut';
import { BlockedReportedUsersScreen, ContactRequestDetailScreen, ControlledGroupChatScreen, DepartmentChatScreen, FirstContactRequestScreen, PrivacyDirectorySettingsScreen, PrivateChatThreadScreen, ReportedMessageModerationPlaceholderScreen, ResidentDirectoryPrivacyScreen, SearchFlatResidentScreen } from '../../modules/resident/residentConnect';
import { ClosureProofScreen, DamageClaimIssueScreen, MediationAssignmentScreen, NoiseComplaintIssueScreen, PetNuisanceIssueScreen, RenovationDisturbanceIssueScreen, ResolutionProposalScreen, WaterLeakageIssueScreen, WrongParkingIssueScreen } from '../../modules/resident/interFlatIssues';
import { ParcelHandoverRequestScreen, ParcelOtpQrPlaceholderScreen, ParcelPickupConfirmationScreen } from '../../modules/resident/parcelHandover';
import { BookingApprovalScreen, BookingCancellationScreen, FacilityListScreen, QrCheckInPlaceholderScreen, SlotAvailabilityScreen } from '../../modules/resident/facilityBooking';
import { ParkingAllocationScreen, ParkingViolationHistoryScreen, RfidReadinessPlaceholderScreen, TemporaryVehiclePassScreen, VehicleRegistrationScreen, VisitorParkingPassScreen } from '../../modules/resident/parking';
import { AmcReminderDashboardScreen, AssetRegisterScreen, AssetServiceScheduleScreen, InventoryIssueReturnScreen, VendorContractScreen, VendorDirectoryScreen, VendorScorecardScreen } from '../../modules/vendorAssets';
import { CandidateProfileScreen, CreateMeetingNoticeScreen, CreatePollScreen, EVotingReadinessScreen, ElectionSetupPlaceholderScreen, MeetingAgendaScreen, MeetingRsvpScreen, MinutesOfMeetingScreen, NominationPlaceholderScreen, PollDetailScreen, ProxyAuthorizationScreen, QuestionSubmissionScreen, ResolutionTrackerScreen, VotingEligibilityScreen, VotingResultPlaceholderScreen } from '../../modules/resident/governance';
import { ContractorPassScreen, DamageInspectionScreen, DebrisClearanceChecklistScreen, RenovationRequestScreen, RuleAcknowledgementReportScreen, RuleAcknowledgementScreen } from '../../modules/compliance';
import { EmergencyAcknowledgementScreen, EmergencyVolunteerNetworkScreen, FireAlertScreen, IncidentTimelineScreen, LiftStuckAlertScreen, MedicalEmergencyScreen, SosScreen } from '../../modules/resident/emergency';
import { SeniorCitizenDailyCheckInScreen } from '../../modules/resident/seniorCare';
import { FamilyConnectScreen } from '../../modules/resident/emergency/screens/safety_screens/FamilyConnectScreen';
import { ServiceCategoryListScreen } from '../../modules/resident/marketplace/screens/ServiceCategoryListScreen';
import { ServiceProviderListScreen } from '../../modules/resident/marketplace/screens/ServiceProviderListScreen';
import { ServiceRequestScreen } from '../../modules/resident/marketplace/screens/ServiceRequestScreen';
import { VendorRatingScreen } from '../../modules/resident/marketplace/screens/VendorRatingScreen';
import { BiometricDeviceRegistryScreen } from '../../modules/biometricAttendance/screens/BiometricDeviceRegistryScreen';
import { BiometricPunchSyncLogsScreen } from '../../modules/biometricAttendance/screens/BiometricPunchSyncLogsScreen';
import { MonthlyBiometricReportScreen } from '../../modules/biometricAttendance/screens/MonthlyBiometricReportScreen';
import { UnknownEmployeeCodeScreen } from '../../modules/biometricAttendance/screens/UnknownEmployeeCodeScreen';
import { VendorBillingAttendanceSupportScreen } from '../../modules/biometricAttendance/screens/VendorBillingAttendanceSupportScreen';
import { AttendanceCorrectionRequestScreen } from '../../modules/staffAttendance/screens/AttendanceCorrectionRequestScreen';
import { BiometricStaffMappingScreen } from '../../modules/staffAttendance/screens/BiometricStaffMappingScreen';
import { DomesticHelpDirectoryScreen } from '../../modules/staffAttendance/screens/DomesticHelpDirectoryScreen';
import { DuplicatePunchReviewScreen } from '../../modules/staffAttendance/screens/DuplicatePunchReviewScreen';
import { ManualAttendanceEntryScreen } from '../../modules/staffAttendance/screens/ManualAttendanceEntryScreen';
import { ShiftRosterScreen } from '../../modules/staffAttendance/screens/ShiftRosterScreen';
import { StaffDirectoryScreen } from '../../modules/staffAttendance/screens/StaffDirectoryScreen';
import { StaffVerificationScreen } from '../../modules/staffAttendance/screens/StaffVerificationScreen';
import { CollectionReportScreen } from '../../modules/reports/screens/CollectionReportScreen';
import { CommunityReportsScreen } from '../../modules/reports/screens/CommunityReportsScreen';
import { ComplaintSlaReportScreen } from '../../modules/reports/screens/ComplaintSlaReportScreen';
import { ComplianceReportsScreen } from '../../modules/reports/screens/ComplianceReportsScreen';
import { FinancialReportsScreen } from '../../modules/reports/screens/FinancialReportsScreen';
import { OwnerTenantLifecycleReportScreen } from '../../modules/reports/screens/OwnerTenantLifecycleReportScreen';
import { SecurityReportsScreen } from '../../modules/reports/screens/SecurityReportsScreen';
import { SocietyHealthScoreDashboardScreen } from '../../modules/reports/screens/SocietyHealthScoreDashboardScreen';
import { StaffAttendanceReportsScreen } from '../../modules/reports/screens/StaffAttendanceReportsScreen';
import { VendorPerformanceReportScreen } from '../../modules/reports/screens/VendorPerformanceReportScreen';
import { AnprIntegrationReadinessScreen } from '../../modules/hardwareIntegration/screens/AnprIntegrationReadinessScreen';
import { BoomBarrierReadinessScreen } from '../../modules/hardwareIntegration/screens/BoomBarrierReadinessScreen';
import { DeviceRegistryScreen } from '../../modules/hardwareIntegration/screens/DeviceRegistryScreen';
import { CctvAccessPlaceholderScreen } from '../../modules/hardwareIntegration/screens/CctvAccessPlaceholderScreen';
import { EvChargingReadinessScreen } from '../../modules/hardwareIntegration/screens/EvChargingReadinessScreen';
import { IntegrationHealthLogsScreen } from '../../modules/hardwareIntegration/screens/IntegrationHealthLogsScreen';
import { RfidIntegrationReadinessScreen } from '../../modules/hardwareIntegration/screens/RfidIntegrationReadinessScreen';
import { SmartMeterReadinessScreen } from '../../modules/hardwareIntegration/screens/SmartMeterReadinessScreen';
import { AutomatedNoticeDraftingPlaceholderScreen, AutomationAuditLogScreen, BillExplanationAssistantPlaceholderScreen, MaintenanceRiskAlertsPlaceholderScreen, MeetingSummaryGeneratorPlaceholderScreen, SmartComplaintRoutingPlaceholderScreen, SmartDocumentSearchPlaceholderScreen } from '../../modules/automation';
import { SocietyFeatureFlagManagementScreen } from '../../modules/superAdmin/screens/SocietyFeatureFlagManagementScreen';
import { SocietyListScreen } from '../../modules/superAdmin/screens/SocietyListScreen';

const Stack = createNativeStackNavigator<SuperAdminStackParamList>();

function CreateFacilityBookingAdminRedirect({ navigation }: NativeStackScreenProps<SuperAdminStackParamList, 'CREATE_FACILITY_BOOKING'>) {
  React.useEffect(() => {
    navigation.replace('FACILITY_LIST');
  }, [navigation]);
  return null;
}
const options = { headerShown: false, animation: 'slide_from_right' as const, animationDuration: 220 };


export function SuperAdminStack() {
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen name="SuperAdminHome" component={SuperAdminHomeScreen} />
      <Stack.Screen name="PlatformDashboard" component={PlatformDashboardScreen} />
      <Stack.Screen name="SocietyDirectory" component={SocietyDirectoryScreen} />
      <Stack.Screen name="PlatformSocietyDetail" component={PlatformSocietyDetailScreen} />
      <Stack.Screen name="SocietyOnboarding" component={SocietyOnboardingScreen} />
      <Stack.Screen name="SocietyOnboardingReview" component={SocietyOnboardingReviewScreen} />
      <Stack.Screen name="SocietyHierarchyTemplate" component={SocietyHierarchyTemplateScreen} />
      <Stack.Screen name="SocietyModuleConfiguration" component={SocietyModuleConfigurationScreen} />
      <Stack.Screen name="FeatureFlagManagement" component={FeatureFlagManagementScreen} />
      <Stack.Screen name="FeatureFlagChangeConfirmation" component={FeatureFlagChangeConfirmationScreen} />
      <Stack.Screen name="HiddenCommercialControls" component={HiddenCommercialControlsScreen} />
      <Stack.Screen name="FreeLaunchPlanMapping" component={FreeLaunchPlanMappingScreen} />
      <Stack.Screen name="SocietyAdminUsers" component={SocietyAdminUsersScreen} />
      <Stack.Screen name="PlatformUserLookup" component={PlatformUserLookupScreen} />
      <Stack.Screen name="SupportConsole" component={SupportConsoleScreen} />
      <Stack.Screen name="SupportTicketDetail" component={SupportTicketDetailScreen} />
      <Stack.Screen name="SupportTicketEscalation" component={SupportTicketEscalationScreen} />
      <Stack.Screen name="OperationalAlerts" component={OperationalAlertsScreen} />
      <Stack.Screen name="UsageAnalytics" component={UsageAnalyticsScreen} />
      <Stack.Screen name="ModuleAdoptionAnalytics" component={ModuleAdoptionAnalyticsScreen} />
      <Stack.Screen name="SocietyHealthOverview" component={SocietyHealthOverviewScreen} />
      <Stack.Screen name="IntegrationStatusPlaceholder" component={IntegrationStatusPlaceholderScreen} />
      <Stack.Screen name="NotificationChannelStatusPlaceholder" component={NotificationChannelStatusPlaceholderScreen} />
      <Stack.Screen name="DataExportRequestPlaceholder" component={DataExportRequestPlaceholderScreen} />
      <Stack.Screen name="AdminImpersonationPlaceholder" component={AdminImpersonationPlaceholderScreen} />
      <Stack.Screen name="PlatformAuditLog" component={PlatformAuditLogScreen} />
      <Stack.Screen name="PlatformSettings" component={PlatformSettingsScreen} />
      <Stack.Screen name="PlatformReleaseRollout" component={PlatformReleaseRolloutScreen} />
      <Stack.Screen name="BlueprintFeatureCoverage" component={BlueprintFeatureCoverageScreen} />
      <Stack.Screen name="BlueprintFeatureDetail" component={BlueprintFeatureDetailScreen} />
      <Stack.Screen name="SOCIETY_SETUP_SUMMARY" component={SocietySetupSummaryScreen} />
      <Stack.Screen name="SOCIETY_HIERARCHY" component={SocietyHierarchyScreen} />
      <Stack.Screen name="TOWER_WING_FLOOR_SETUP" component={TowerWingFloorSetupScreen} />
      <Stack.Screen name="UNIT_MASTER" component={UnitMasterScreen} />
      <Stack.Screen name="UNIT_DETAIL" component={UnitDetailScreen} />
      <Stack.Screen name="UNIT_IMPORT_PREVIEW" component={UnitImportPreviewScreen} />
      <Stack.Screen name="RESIDENT_DIRECTORY" component={ResidentDirectoryScreen} />
      <Stack.Screen name="RESIDENT_DETAIL" component={ResidentDetailScreen} />
      <Stack.Screen name="OWNER_PROFILE" component={OwnerProfileScreen} />
      <Stack.Screen name="TENANT_PROFILE" component={TenantProfileScreen} />
      <Stack.Screen name="FAMILY_MEMBERS" component={FamilyMembersScreen} />
      <Stack.Screen name="RESIDENT_KYC" component={ResidentKycScreen} />
      <Stack.Screen name="RESIDENT_APPROVAL_QUEUE" component={ResidentApprovalQueueScreen} />
      <Stack.Screen name="CREATE_VISITOR" component={CreateVisitorScreen as React.ComponentType} />
      <Stack.Screen name="VISITOR_PASS_QR_OTP" component={VisitorPassQrOtpScreen} />
      <Stack.Screen name="EXPECTED_VISITORS" component={ExpectedVisitorsScreen} />
      <Stack.Screen name="VERIFY_VISITOR" component={VerifyVisitorScreen} />
      <Stack.Screen name="MANUAL_GATE_ENTRY" component={ManualGateEntryScreen} />
      <Stack.Screen name="DELIVERY_ENTRY" component={DeliveryEntryScreen} />
      <Stack.Screen name="CAB_ENTRY" component={CabEntryScreen} />
      <Stack.Screen name="VENDOR_ENTRY" component={VendorEntryScreen} />
      <Stack.Screen name="MATERIAL_ENTRY" component={MaterialEntryScreen} />
      <Stack.Screen name="GATE_LOGS" component={GateLogsScreen} />
      <Stack.Screen name="OFFLINE_QUEUE" component={OfflineQueuePlaceholderScreen} />
      <Stack.Screen name="BLACKLIST_WATCHLIST" component={BlacklistWatchlistScreen} />
      <Stack.Screen name="CHARGE_HEADS" component={ChargeHeadsScreen} />
      <Stack.Screen name="GENERATE_BILLS" component={GenerateBillsScreen} />
      <Stack.Screen name="DRAFT_BILL_REVIEW" component={DraftBillReviewScreen} />
      <Stack.Screen name="PUBLISH_BILLS_CONFIRMATION" component={PublishBillsConfirmationScreen} />
      <Stack.Screen name="RESIDENT_BILL_LIST" component={ResidentBillListScreen as React.ComponentType} />
      <Stack.Screen name="MOCK_PAYMENT" component={MockPaymentScreen as React.ComponentType} />
      <Stack.Screen name="RECEIPT_DETAIL" component={ReceiptDetailScreen} />
      <Stack.Screen name="FLAT_LEDGER" component={FlatLedgerScreen} />
      <Stack.Screen name="DEFAULTER_REPORT" component={DefaulterReportScreen} />
      <Stack.Screen name="MANUAL_PAYMENT_ENTRY" component={ManualPaymentEntryScreen} />
      <Stack.Screen name="REVERSAL_CORRECTION" component={ReversalCorrectionPlaceholderScreen} />
      <Stack.Screen name="CREATE_COMPLAINT" component={CreateComplaintScreen} />
      <Stack.Screen name="COMPLAINT_TIMELINE" component={ComplaintTimelineScreen} />
      <Stack.Screen name="COMPLAINT_SLA_DASHBOARD" component={ComplaintSlaDashboardScreen} />
      <Stack.Screen name="COMPLAINT_ASSIGNMENT" component={ComplaintAssignmentScreen} />
      <Stack.Screen name="COMPLAINT_STATUS_UPDATE" component={ComplaintStatusUpdateScreen} />
      <Stack.Screen name="COMPLAINT_REOPEN" component={ComplaintReopenScreen} />
      <Stack.Screen name="COMPLAINT_FEEDBACK" component={ComplaintFeedbackScreen} />
      <Stack.Screen name="PRIVATE_COMPLAINT" component={PrivateComplaintPlaceholderScreen} />
      <Stack.Screen name="CREATE_NOTICE" component={CreateNoticeScreen} />
      <Stack.Screen name="NOTICE_AUDIENCE_SELECTION" component={NoticeAudienceSelectionScreen} />
      <Stack.Screen name="PUBLISH_NOTICE" component={PublishNoticeScreen} />
      <Stack.Screen name="NOTICE_READ_STATUS" component={NoticeReadStatusScreen} />
      <Stack.Screen name="NOTICE_ACKNOWLEDGEMENT_REPORT" component={NoticeAcknowledgementReportScreen} />
      <Stack.Screen name="STAFF_DIRECTORY" component={StaffDirectoryScreen as React.ComponentType} />
      <Stack.Screen name="DOMESTIC_HELP_DIRECTORY" component={DomesticHelpDirectoryScreen as React.ComponentType} />
      <Stack.Screen name="STAFF_VERIFICATION" component={StaffVerificationScreen} />
      <Stack.Screen name="SHIFT_ROSTER" component={ShiftRosterScreen} />
      <Stack.Screen name="MANUAL_ATTENDANCE_ENTRY" component={ManualAttendanceEntryScreen as React.ComponentType} />
      <Stack.Screen name="ATTENDANCE_CORRECTION_REQUEST" component={AttendanceCorrectionRequestScreen as React.ComponentType} />
      <Stack.Screen name="DOCUMENT_UPLOAD" component={DocumentUploadPlaceholderScreen} />
      <Stack.Screen name="SOCIETY_DOCUMENTS" component={SocietyDocumentsScreen} />
      <Stack.Screen name="OWNER_DOCUMENTS" component={OwnerDocumentsScreen} />
      <Stack.Screen name="TENANT_DOCUMENTS" component={TenantDocumentsScreen} />
      <Stack.Screen name="MOVE_IN_DOCUMENTS" component={MoveInDocumentsScreen} />
      <Stack.Screen name="MOVE_OUT_DOCUMENTS" component={MoveOutDocumentsScreen} />
      <Stack.Screen name="STAFF_VENDOR_DOCUMENTS" component={StaffVendorDocumentsScreen} />
      <Stack.Screen name="COMPLIANCE_DOCUMENTS" component={ComplianceDocumentsScreen} />
      <Stack.Screen name="DOCUMENT_ACCESS_LOG" component={DocumentAccessLogScreen} />
      <Stack.Screen name="DOCUMENT_VERSION_HISTORY" component={DocumentVersionHistoryScreen} />
      <Stack.Screen name="RESTRICTED_DOCUMENT_ACCESS" component={RestrictedDocumentAccessScreen} />
      <Stack.Screen name="CREATE_NOC_REQUEST" component={CreateNocRequestScreen} />
      <Stack.Screen name="NOC_CLEARANCE_CHECKLIST" component={NocClearanceChecklistScreen as React.ComponentType} />
      <Stack.Screen name="NO_DUES_CERTIFICATE" component={NoDuesCertificateScreen} />
      <Stack.Screen name="MOVE_OUT_NOC" component={MoveOutNocScreen} />
      <Stack.Screen name="TENANT_NOC" component={TenantNocScreen} />
      <Stack.Screen name="PARKING_NOC" component={ParkingNocScreen} />
      <Stack.Screen name="RENOVATION_NOC" component={RenovationNocScreen} />
      <Stack.Screen name="RESIDENCE_CERTIFICATE" component={ResidenceCertificateScreen} />
      <Stack.Screen name="QR_VERIFIABLE_CERTIFICATE" component={QrVerifiableCertificatePlaceholderScreen} />
      <Stack.Screen name="OCCUPANCY_HISTORY" component={OccupancyHistoryScreen} />
      <Stack.Screen name="OWNER_HISTORY" component={OwnerHistoryScreen} />
      <Stack.Screen name="TENANT_HISTORY" component={TenantHistoryScreen} />
      <Stack.Screen name="FLAT_TIMELINE" component={FlatTimelineScreen} />
      <Stack.Screen name="PREVIOUS_RESIDENT_DOCUMENT_ARCHIVE" component={PreviousResidentDocumentArchiveScreen} />
      <Stack.Screen name="MOVE_IN_REQUEST" component={MoveInRequestScreen} />
      <Stack.Screen name="MOVE_OUT_REQUEST" component={MoveOutRequestScreen} />
      <Stack.Screen name="ACCESS_ACTIVATION_REVOCATION" component={AccessActivationRevocationScreen} />
      <Stack.Screen name="RESIDENT_DIRECTORY_PRIVACY" component={ResidentDirectoryPrivacyScreen} />
      <Stack.Screen name="PRIVACY_DIRECTORY_SETTINGS" component={PrivacyDirectorySettingsScreen} />
      <Stack.Screen name="SEARCH_FLAT_RESIDENT" component={SearchFlatResidentScreen} />
      <Stack.Screen name="FIRST_CONTACT_REQUEST" component={FirstContactRequestScreen} />
      <Stack.Screen name="CONTACT_REQUEST_DETAIL" component={ContactRequestDetailScreen} />
      <Stack.Screen name="PRIVATE_CHAT_THREAD" component={PrivateChatThreadScreen} />
      <Stack.Screen name="DEPARTMENT_CHAT" component={DepartmentChatScreen} />
      <Stack.Screen name="CONTROLLED_GROUP_CHAT" component={ControlledGroupChatScreen} />
      <Stack.Screen name="BLOCKED_REPORTED_USERS" component={BlockedReportedUsersScreen} />
      <Stack.Screen name="REPORTED_MESSAGE_MODERATION" component={ReportedMessageModerationPlaceholderScreen} />
      <Stack.Screen name="WATER_LEAKAGE_ISSUE" component={WaterLeakageIssueScreen} />
      <Stack.Screen name="NOISE_COMPLAINT_ISSUE" component={NoiseComplaintIssueScreen} />
      <Stack.Screen name="RENOVATION_DISTURBANCE_ISSUE" component={RenovationDisturbanceIssueScreen} />
      <Stack.Screen name="PET_NUISANCE_ISSUE" component={PetNuisanceIssueScreen} />
      <Stack.Screen name="DAMAGE_CLAIM_ISSUE" component={DamageClaimIssueScreen} />
      <Stack.Screen name="WRONG_PARKING_ISSUE" component={WrongParkingIssueScreen} />
      <Stack.Screen name="MEDIATION_ASSIGNMENT" component={MediationAssignmentScreen} />
      <Stack.Screen name="RESOLUTION_PROPOSAL" component={ResolutionProposalScreen} />
      <Stack.Screen name="CLOSURE_PROOF" component={ClosureProofScreen} />
      <Stack.Screen name="PARCEL_HANDOVER_REQUEST" component={ParcelHandoverRequestScreen} />
      <Stack.Screen name="PARCEL_OTP_QR" component={ParcelOtpQrPlaceholderScreen} />
      <Stack.Screen name="PARCEL_PICKUP_CONFIRMATION" component={ParcelPickupConfirmationScreen} />
      <Stack.Screen name="FACILITY_LIST" component={FacilityListScreen} />
      <Stack.Screen name="SLOT_AVAILABILITY" component={SlotAvailabilityScreen} />
      <Stack.Screen name="CREATE_FACILITY_BOOKING" component={CreateFacilityBookingAdminRedirect} />
      <Stack.Screen name="BOOKING_APPROVAL" component={BookingApprovalScreen} />
      <Stack.Screen name="BOOKING_CANCELLATION" component={BookingCancellationScreen} />
      <Stack.Screen name="FACILITY_QR_CHECK_IN" component={QrCheckInPlaceholderScreen} />
      <Stack.Screen name="VEHICLE_REGISTRATION" component={VehicleRegistrationScreen} />
      <Stack.Screen name="PARKING_ALLOCATION" component={ParkingAllocationScreen} />
      <Stack.Screen name="VISITOR_PARKING_PASS" component={VisitorParkingPassScreen} />
      <Stack.Screen name="TEMPORARY_VEHICLE_PASS" component={TemporaryVehiclePassScreen} />
      <Stack.Screen name="PARKING_VIOLATION_HISTORY" component={ParkingViolationHistoryScreen} />
      <Stack.Screen name="RFID_READINESS" component={RfidReadinessPlaceholderScreen} />
      <Stack.Screen name="VENDOR_DIRECTORY" component={VendorDirectoryScreen} />
      <Stack.Screen name="VENDOR_CONTRACT" component={VendorContractScreen} />
      <Stack.Screen name="AMC_REMINDER_DASHBOARD" component={AmcReminderDashboardScreen} />
      <Stack.Screen name="ASSET_REGISTER" component={AssetRegisterScreen} />
      <Stack.Screen name="ASSET_SERVICE_SCHEDULE" component={AssetServiceScheduleScreen} />
      <Stack.Screen name="INVENTORY_ISSUE_RETURN" component={InventoryIssueReturnScreen} />
      <Stack.Screen name="VENDOR_SCORECARD" component={VendorScorecardScreen} />
      <Stack.Screen name="CREATE_MEETING_NOTICE" component={CreateMeetingNoticeScreen} />
      <Stack.Screen name="MEETING_AGENDA" component={MeetingAgendaScreen} />
      <Stack.Screen name="MEETING_RSVP" component={MeetingRsvpScreen} />
      <Stack.Screen name="PROXY_AUTHORIZATION" component={ProxyAuthorizationScreen} />
      <Stack.Screen name="QUESTION_SUBMISSION" component={QuestionSubmissionScreen} />
      <Stack.Screen name="MINUTES_OF_MEETING" component={MinutesOfMeetingScreen} />
      <Stack.Screen name="RESOLUTION_TRACKER" component={ResolutionTrackerScreen} />
      <Stack.Screen name="CREATE_POLL" component={CreatePollScreen} />
      <Stack.Screen name="POLL_DETAIL" component={PollDetailScreen} />
      <Stack.Screen name="E_VOTING_READINESS" component={EVotingReadinessScreen} />
      <Stack.Screen name="ELECTION_SETUP" component={ElectionSetupPlaceholderScreen} />
      <Stack.Screen name="NOMINATION_PLACEHOLDER" component={NominationPlaceholderScreen} />
      <Stack.Screen name="CANDIDATE_PROFILE" component={CandidateProfileScreen} />
      <Stack.Screen name="VOTING_ELIGIBILITY" component={VotingEligibilityScreen} />
      <Stack.Screen name="VOTING_RESULT_PLACEHOLDER" component={VotingResultPlaceholderScreen} />
      <Stack.Screen name="RULE_ACKNOWLEDGEMENT" component={RuleAcknowledgementScreen} />
      <Stack.Screen name="RULE_ACKNOWLEDGEMENT_REPORT" component={RuleAcknowledgementReportScreen} />
      <Stack.Screen name="RENOVATION_REQUEST" component={RenovationRequestScreen} />
      <Stack.Screen name="CONTRACTOR_PASS" component={ContractorPassScreen} />
      <Stack.Screen name="DEBRIS_CLEARANCE_CHECKLIST" component={DebrisClearanceChecklistScreen} />
      <Stack.Screen name="DAMAGE_INSPECTION" component={DamageInspectionScreen} />
      <Stack.Screen name="SOS" component={SosScreen} />
      <Stack.Screen name="MEDICAL_EMERGENCY" component={MedicalEmergencyScreen} />
      <Stack.Screen name="FIRE_ALERT" component={FireAlertScreen} />
      <Stack.Screen name="LIFT_STUCK_ALERT" component={LiftStuckAlertScreen} />
      <Stack.Screen name="EMERGENCY_ACKNOWLEDGEMENT" component={EmergencyAcknowledgementScreen} />
      <Stack.Screen name="INCIDENT_TIMELINE" component={IncidentTimelineScreen} />
      <Stack.Screen name="SENIOR_CITIZEN_DAILY_CHECK_IN" component={SeniorCitizenDailyCheckInScreen} />
      <Stack.Screen name="EMERGENCY_VOLUNTEER_NETWORK" component={EmergencyVolunteerNetworkScreen} />
      <Stack.Screen name="FAMILY_CONNECT" component={FamilyConnectScreen as React.ComponentType} />
      <Stack.Screen name="SERVICE_CATEGORY_LIST" component={ServiceCategoryListScreen} />
      <Stack.Screen name="SERVICE_PROVIDER_LIST" component={ServiceProviderListScreen} />
      <Stack.Screen name="SERVICE_REQUEST" component={ServiceRequestScreen} />
      <Stack.Screen name="VENDOR_RATING" component={VendorRatingScreen} />
      <Stack.Screen name="BIOMETRIC_DEVICE_REGISTRY" component={BiometricDeviceRegistryScreen} />
      <Stack.Screen name="BIOMETRIC_STAFF_MAPPING" component={BiometricStaffMappingScreen as React.ComponentType} />
      <Stack.Screen name="BIOMETRIC_PUNCH_SYNC_LOGS" component={BiometricPunchSyncLogsScreen} />
      <Stack.Screen name="DUPLICATE_PUNCH_REVIEW" component={DuplicatePunchReviewScreen as React.ComponentType} />
      <Stack.Screen name="UNKNOWN_EMPLOYEE_CODE" component={UnknownEmployeeCodeScreen} />
      <Stack.Screen name="MONTHLY_BIOMETRIC_REPORT" component={MonthlyBiometricReportScreen} />
      <Stack.Screen name="VENDOR_BILLING_ATTENDANCE_SUPPORT" component={VendorBillingAttendanceSupportScreen} />
      <Stack.Screen name="FINANCIAL_REPORTS" component={FinancialReportsScreen} />
      <Stack.Screen name="COLLECTION_REPORT" component={CollectionReportScreen} />
      <Stack.Screen name="COMPLAINT_SLA_REPORT" component={ComplaintSlaReportScreen} />
      <Stack.Screen name="VENDOR_PERFORMANCE_REPORT" component={VendorPerformanceReportScreen} />
      <Stack.Screen name="SECURITY_REPORTS" component={SecurityReportsScreen} />
      <Stack.Screen name="STAFF_ATTENDANCE_REPORTS" component={StaffAttendanceReportsScreen} />
      <Stack.Screen name="OWNER_TENANT_LIFECYCLE_REPORT" component={OwnerTenantLifecycleReportScreen} />
      <Stack.Screen name="COMPLIANCE_REPORTS" component={ComplianceReportsScreen} />
      <Stack.Screen name="COMMUNITY_REPORTS" component={CommunityReportsScreen} />
      <Stack.Screen name="SOCIETY_HEALTH_SCORE_DASHBOARD" component={SocietyHealthScoreDashboardScreen} />
      <Stack.Screen name="DEVICE_REGISTRY" component={DeviceRegistryScreen} />
      <Stack.Screen name="RFID_INTEGRATION_READINESS" component={RfidIntegrationReadinessScreen} />
      <Stack.Screen name="ANPR_INTEGRATION_READINESS" component={AnprIntegrationReadinessScreen} />
      <Stack.Screen name="BOOM_BARRIER_READINESS" component={BoomBarrierReadinessScreen} />
      <Stack.Screen name="CCTV_ACCESS_PLACEHOLDER" component={CctvAccessPlaceholderScreen} />
      <Stack.Screen name="SMART_METER_READINESS" component={SmartMeterReadinessScreen} />
      <Stack.Screen name="EV_CHARGING_READINESS" component={EvChargingReadinessScreen} />
      <Stack.Screen name="INTEGRATION_HEALTH_LOGS" component={IntegrationHealthLogsScreen} />
      <Stack.Screen name="SMART_COMPLAINT_ROUTING" component={SmartComplaintRoutingPlaceholderScreen} />
      <Stack.Screen name="AUTOMATED_NOTICE_DRAFTING" component={AutomatedNoticeDraftingPlaceholderScreen} />
      <Stack.Screen name="SMART_DOCUMENT_SEARCH" component={SmartDocumentSearchPlaceholderScreen} />
      <Stack.Screen name="BILL_EXPLANATION_ASSISTANT" component={BillExplanationAssistantPlaceholderScreen} />
      <Stack.Screen name="MEETING_SUMMARY_GENERATOR" component={MeetingSummaryGeneratorPlaceholderScreen} />
      <Stack.Screen name="MAINTENANCE_RISK_ALERTS" component={MaintenanceRiskAlertsPlaceholderScreen} />
      <Stack.Screen name="AUTOMATION_AUDIT_LOG" component={AutomationAuditLogScreen} />
      <Stack.Screen name="SOCIETY_ONBOARDING" component={SocietyOnboardingScreen as React.ComponentType} />
      <Stack.Screen name="SOCIETY_LIST" component={SocietyListScreen} />
      <Stack.Screen name="SOCIETY_FEATURE_FLAG_MANAGEMENT" component={SocietyFeatureFlagManagementScreen} />
      <Stack.Screen name="SUPPORT_CONSOLE" component={SupportConsoleScreen as React.ComponentType} />
      <Stack.Screen name="HIDDEN_COMMERCIAL_CONTROLS" component={HiddenCommercialControlsScreen as React.ComponentType} />
    </Stack.Navigator>
  );
}
