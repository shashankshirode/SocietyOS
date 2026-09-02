import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { Visitor } from '../../shared/types/visitor.types';
import type { Complaint } from '../../shared/types/complaint.types';
import type { Notice } from '../../shared/types/notice.types';
import type { Bill, PaymentMethod } from '../../shared/types/bill.types';
import type { GatePass } from '../../shared/types/gate.types';
import type { InterFlatIssueType } from '../../shared/types/interFlat.types';
import type { Absent } from "../../shared/types/absence.types";
export type RootStackParamList = {
    AppModeSelector: Absent;
    ResidentApp: Absent;
    GuardApp: Absent;
    FacilityManagerApp: Absent;
    SuperAdminApp: Absent;
    HardwareApp: Absent;
    SocietyAdminApp: Absent;
    TreasurerApp: Absent;
};
export type AppModeStackParamList = {
    AppModeSelectorHome: Absent;
};
export type ProfileStackParamList = {
    ProfileHome: Absent;
    Settings: Absent;
    RoleAccount: {
        kind: 'admin' | 'treasurer' | 'facility';
    };
    Appearance: Absent;
    Notifications: Absent;
    Language: Absent;
    Accessibility: Absent;
    Privacy: Absent;
};
export type SuperAdminStackParamList = {
    SuperAdminHome: Absent;
    PlatformDashboard: Absent;
    SocietyDirectory: Absent;
    PlatformSocietyDetail: {
        societyId: string;
    };
    SocietyOnboarding: Absent;
    SocietyOnboardingReview: {
        draftId: string;
    };
    SocietyHierarchyTemplate: Absent;
    SocietyModuleConfiguration: {
        societyId: string;
    };
    FeatureFlagManagement: Absent;
    FeatureFlagChangeConfirmation: {
        flagKey: string;
        societyId?: string;
    };
    HiddenCommercialControls: {
        societyId?: string;
    };
    FreeLaunchPlanMapping: {
        societyId: string;
    };
    SocietyAdminUsers: {
        societyId: string;
    };
    PlatformUserLookup: Absent;
    SupportConsole: Absent;
    SupportTicketDetail: {
        ticketId: string;
    };
    SupportTicketEscalation: {
        ticketId: string;
    };
    OperationalAlerts: Absent;
    UsageAnalytics: Absent;
    ModuleAdoptionAnalytics: Absent;
    SocietyHealthOverview: Absent;
    IntegrationStatusPlaceholder: Absent;
    NotificationChannelStatusPlaceholder: Absent;
    DataExportRequestPlaceholder: {
        societyId?: string;
    };
    AdminImpersonationPlaceholder: {
        societyId?: string;
        userId?: string;
    };
    PlatformAuditLog: Absent;
    PlatformSettings: Absent;
    PlatformReleaseRollout: Absent;
    BlueprintFeatureCoverage: Absent;
    BlueprintFeatureDetail: {
        featureId: string;
    };
    SOCIETY_SETUP_SUMMARY: Absent;
    SOCIETY_HIERARCHY: Absent;
    TOWER_WING_FLOOR_SETUP: Absent;
    UNIT_MASTER: Absent;
    UNIT_DETAIL: {
        id: string;
    };
    UNIT_IMPORT_PREVIEW: Absent;
    RESIDENT_DIRECTORY: Absent;
    RESIDENT_DETAIL: {
        residentId?: string;
    };
    OWNER_PROFILE: Absent;
    TENANT_PROFILE: Absent;
    FAMILY_MEMBERS: {
        unitId?: string;
    };
    RESIDENT_KYC: Absent;
    RESIDENT_APPROVAL_QUEUE: Absent;
    CREATE_VISITOR: Absent;
    VISITOR_PASS_QR_OTP: Absent;
    EXPECTED_VISITORS: Absent;
    VERIFY_VISITOR: Absent;
    MANUAL_GATE_ENTRY: Absent;
    DELIVERY_ENTRY: Absent;
    CAB_ENTRY: Absent;
    VENDOR_ENTRY: Absent;
    MATERIAL_ENTRY: Absent;
    GATE_LOGS: Absent;
    OFFLINE_QUEUE: Absent;
    BLACKLIST_WATCHLIST: Absent;
    CHARGE_HEADS: Absent;
    GENERATE_BILLS: Absent;
    DRAFT_BILL_REVIEW: Absent;
    PUBLISH_BILLS_CONFIRMATION: Absent;
    RESIDENT_BILL_LIST: Absent;
    MOCK_PAYMENT: Absent;
    RECEIPT_DETAIL: {
        id: string;
    };
    FLAT_LEDGER: Absent;
    DEFAULTER_REPORT: Absent;
    MANUAL_PAYMENT_ENTRY: Absent;
    REVERSAL_CORRECTION: Absent;
    CREATE_COMPLAINT: Absent;
    COMPLAINT_TIMELINE: Absent;
    COMPLAINT_SLA_DASHBOARD: Absent;
    COMPLAINT_ASSIGNMENT: Absent;
    COMPLAINT_STATUS_UPDATE: Absent;
    COMPLAINT_REOPEN: {
        complaintId?: string;
    };
    COMPLAINT_FEEDBACK: {
        complaintId?: string;
    };
    PRIVATE_COMPLAINT: Absent;
    CREATE_NOTICE: Absent;
    NOTICE_AUDIENCE_SELECTION: Absent;
    PUBLISH_NOTICE: Absent;
    NOTICE_READ_STATUS: Absent;
    NOTICE_ACKNOWLEDGEMENT_REPORT: Absent;
    STAFF_DIRECTORY: Absent;
    DOMESTIC_HELP_DIRECTORY: Absent;
    STAFF_VERIFICATION: Absent;
    SHIFT_ROSTER: Absent;
    MANUAL_ATTENDANCE_ENTRY: Absent;
    ATTENDANCE_CORRECTION_REQUEST: Absent;
    DOCUMENT_UPLOAD: Absent;
    SOCIETY_DOCUMENTS: Absent;
    OWNER_DOCUMENTS: Absent;
    TENANT_DOCUMENTS: Absent;
    MOVE_IN_DOCUMENTS: Absent;
    MOVE_OUT_DOCUMENTS: Absent;
    STAFF_VENDOR_DOCUMENTS: Absent;
    COMPLIANCE_DOCUMENTS: Absent;
    DOCUMENT_ACCESS_LOG: Absent;
    DOCUMENT_VERSION_HISTORY: {
        unitId?: string;
    };
    RESTRICTED_DOCUMENT_ACCESS: Absent;
    CREATE_NOC_REQUEST: Absent;
    NOC_CLEARANCE_CHECKLIST: Absent;
    NO_DUES_CERTIFICATE: Absent;
    MOVE_OUT_NOC: Absent;
    TENANT_NOC: Absent;
    PARKING_NOC: Absent;
    RENOVATION_NOC: Absent;
    RESIDENCE_CERTIFICATE: Absent;
    QR_VERIFIABLE_CERTIFICATE: Absent;
    OCCUPANCY_HISTORY: {
        unitId?: string;
    };
    OWNER_HISTORY: {
        unitId?: string;
    };
    TENANT_HISTORY: {
        unitId?: string;
    };
    FLAT_TIMELINE: Absent;
    PREVIOUS_RESIDENT_DOCUMENT_ARCHIVE: Absent;
    MOVE_IN_REQUEST: Absent;
    MOVE_OUT_REQUEST: Absent;
    ACCESS_ACTIVATION_REVOCATION: Absent;
    RESIDENT_DIRECTORY_PRIVACY: Absent;
    PRIVACY_DIRECTORY_SETTINGS: Absent;
    SEARCH_FLAT_RESIDENT: Absent;
    FIRST_CONTACT_REQUEST: Absent;
    CONTACT_REQUEST_DETAIL: {
        id: string;
    };
    PRIVATE_CHAT_THREAD: Absent;
    DEPARTMENT_CHAT: Absent;
    CONTROLLED_GROUP_CHAT: Absent;
    BLOCKED_REPORTED_USERS: Absent;
    REPORTED_MESSAGE_MODERATION: Absent;
    WATER_LEAKAGE_ISSUE: Absent;
    NOISE_COMPLAINT_ISSUE: Absent;
    RENOVATION_DISTURBANCE_ISSUE: Absent;
    PET_NUISANCE_ISSUE: Absent;
    DAMAGE_CLAIM_ISSUE: Absent;
    WRONG_PARKING_ISSUE: Absent;
    MEDIATION_ASSIGNMENT: Absent;
    RESOLUTION_PROPOSAL: Absent;
    CLOSURE_PROOF: Absent;
    PARCEL_HANDOVER_REQUEST: Absent;
    PARCEL_OTP_QR: Absent;
    PARCEL_PICKUP_CONFIRMATION: Absent;
    FACILITY_LIST: Absent;
    SLOT_AVAILABILITY: Absent;
    CREATE_FACILITY_BOOKING: Absent;
    BOOKING_APPROVAL: Absent;
    BOOKING_CANCELLATION: Absent;
    FACILITY_QR_CHECK_IN: Absent;
    VEHICLE_REGISTRATION: Absent;
    PARKING_ALLOCATION: Absent;
    VISITOR_PARKING_PASS: Absent;
    TEMPORARY_VEHICLE_PASS: Absent;
    PARKING_VIOLATION_HISTORY: {
        unitId?: string;
    };
    RFID_READINESS: Absent;
    VENDOR_DIRECTORY: Absent;
    VENDOR_CONTRACT: Absent;
    AMC_REMINDER_DASHBOARD: Absent;
    ASSET_REGISTER: Absent;
    ASSET_SERVICE_SCHEDULE: Absent;
    INVENTORY_ISSUE_RETURN: Absent;
    VENDOR_SCORECARD: Absent;
    CREATE_MEETING_NOTICE: Absent;
    MEETING_AGENDA: Absent;
    MEETING_RSVP: {
        meetingId?: string;
    };
    PROXY_AUTHORIZATION: {
        meetingId?: string;
    };
    QUESTION_SUBMISSION: {
        meetingId?: string;
        agendaItemId?: string;
    };
    MINUTES_OF_MEETING: Absent;
    RESOLUTION_TRACKER: Absent;
    CREATE_POLL: Absent;
    POLL_DETAIL: {
        id: string;
    };
    E_VOTING_READINESS: Absent;
    ELECTION_SETUP: Absent;
    NOMINATION_PLACEHOLDER: Absent;
    CANDIDATE_PROFILE: Absent;
    VOTING_ELIGIBILITY: Absent;
    VOTING_RESULT_PLACEHOLDER: Absent;
    RULE_ACKNOWLEDGEMENT: Absent;
    RULE_ACKNOWLEDGEMENT_REPORT: Absent;
    RENOVATION_REQUEST: Absent;
    CONTRACTOR_PASS: Absent;
    DEBRIS_CLEARANCE_CHECKLIST: Absent;
    DAMAGE_INSPECTION: Absent;
    SOS: Absent;
    MEDICAL_EMERGENCY: Absent;
    FIRE_ALERT: Absent;
    LIFT_STUCK_ALERT: Absent;
    EMERGENCY_ACKNOWLEDGEMENT: Absent;
    INCIDENT_TIMELINE: Absent;
    SENIOR_CITIZEN_DAILY_CHECK_IN: Absent;
    EMERGENCY_VOLUNTEER_NETWORK: Absent;
    FAMILY_CONNECT: Absent;
    SERVICE_CATEGORY_LIST: Absent;
    SERVICE_PROVIDER_LIST: Absent;
    SERVICE_REQUEST: Absent;
    VENDOR_RATING: Absent;
    BIOMETRIC_DEVICE_REGISTRY: Absent;
    BIOMETRIC_STAFF_MAPPING: Absent;
    BIOMETRIC_PUNCH_SYNC_LOGS: Absent;
    DUPLICATE_PUNCH_REVIEW: Absent;
    UNKNOWN_EMPLOYEE_CODE: Absent;
    MONTHLY_BIOMETRIC_REPORT: Absent;
    VENDOR_BILLING_ATTENDANCE_SUPPORT: Absent;
    FINANCIAL_REPORTS: Absent;
    COLLECTION_REPORT: Absent;
    COMPLAINT_SLA_REPORT: Absent;
    VENDOR_PERFORMANCE_REPORT: Absent;
    SECURITY_REPORTS: Absent;
    STAFF_ATTENDANCE_REPORTS: Absent;
    OWNER_TENANT_LIFECYCLE_REPORT: Absent;
    COMPLIANCE_REPORTS: Absent;
    COMMUNITY_REPORTS: Absent;
    SOCIETY_HEALTH_SCORE_DASHBOARD: Absent;
    DEVICE_REGISTRY: Absent;
    RFID_INTEGRATION_READINESS: Absent;
    ANPR_INTEGRATION_READINESS: Absent;
    BOOM_BARRIER_READINESS: Absent;
    CCTV_ACCESS_PLACEHOLDER: Absent;
    SMART_METER_READINESS: Absent;
    EV_CHARGING_READINESS: Absent;
    INTEGRATION_HEALTH_LOGS: Absent;
    SMART_COMPLAINT_ROUTING: Absent;
    AUTOMATED_NOTICE_DRAFTING: Absent;
    SMART_DOCUMENT_SEARCH: Absent;
    BILL_EXPLANATION_ASSISTANT: Absent;
    MEETING_SUMMARY_GENERATOR: Absent;
    MAINTENANCE_RISK_ALERTS: Absent;
    AUTOMATION_AUDIT_LOG: Absent;
    SOCIETY_ONBOARDING: Absent;
    SOCIETY_LIST: Absent;
    SOCIETY_FEATURE_FLAG_MANAGEMENT: Absent;
    SUPPORT_CONSOLE: Absent;
    HIDDEN_COMMERCIAL_CONTROLS: {
        societyId?: string;
    } | Absent;
};
export type HomeStackParamList = {
    ResidentHome: Absent;
    CreateVisitorFromHome: Absent;
    CreateComplaintFromHome: Absent;
    ComplaintDetailFromHome: {
        complaint: Complaint;
    };
    ComplaintReopen: {
        complaintId: string;
    };
    ComplaintFeedback: {
        complaintId: string;
    };
    VisitorDetailFromHome: {
        visitor: Visitor;
    };
    NoticeListFromHome: Absent;
    NoticeDetailFromHome: {
        notice: Notice;
    };
    EmergencySos: Absent;
    Helpdesk: Absent;
    BillDetailFromHome: {
        bill: Bill;
    };
    ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
    DocumentVaultHome: Absent;
    MyDocuments: Absent;
    SocietyDocuments: Absent;
    DocumentDetail: {
        documentId: string;
    };
    UploadDocument: Absent;
    DocumentAccessLog: {
        documentId?: string;
    };
    NocRequestList: Absent;
    CreateNocRequest: Absent;
    NocRequestDetail: {
        requestId: string;
    };
    MoveOutRequest: Absent;
    MoveOutClearanceChecklist: {
        moveOutRequestId: string;
    };
    NocCertificate: {
        certificateId: string;
    };
    HouseholdOverview: Absent;
    OwnerTenantOverview: {
        unitId: string;
    };
    CurrentOwnerProfile: {
        unitId: string;
    };
    CurrentTenantProfile: {
        unitId: string;
    };
    FamilyMembers: {
        unitId: string;
    };
    FamilyMemberList: Absent;
    AddFamilyMember: Absent;
    EditFamilyMember: {
        familyMemberId: string;
    };
    FamilyMemberDetail: {
        familyMemberId: string;
    };
    FamilyAccessPermissions: {
        familyMemberId: string;
    };
    FamilyPortability: Absent;
    TenantManagement: Absent;
    RentalDeclaration: Absent;
    ShortStayManagement: Absent;
    AddTenantStart: Absent;
    AddTenantPersonalInfo: {
        requestId: string;
    };
    AddTenantAgreement: {
        requestId: string;
    };
    AddTenantDocuments: {
        requestId: string;
    };
    AddTenantAccessPermissions: {
        requestId: string;
    };
    AddTenantReview: {
        requestId: string;
    };
    TenantOnboardingSuccess: {
        requestId: string;
    };
    TenantOnboardingStatus: {
        requestId: string;
    };
    TenantDetail: {
        tenantId: string;
    };
    TenantRestrictedState: {
        requestId: string;
    };
    UnitVehicles: {
        unitId: string;
    };
    CurrentDocumentsSummary: {
        unitId: string;
    };
    OwnerHistory: {
        unitId: string;
    };
    TenantHistory: {
        unitId: string;
    };
    OccupancyTimeline: {
        unitId: string;
    };
    PreviousResidentDetail: {
        unitId: string;
        residentHistoryId: string;
        residentHistoryType: 'OWNER' | 'TENANT';
    };
    PreviousResidentDocuments: {
        unitId: string;
        residentHistoryId: string;
    };
    MoveInRequest: {
        unitId: string;
    };
    UnitAccessStatus: {
        unitId: string;
    };
    OwnershipTenancySummary: {
        unitId: string;
    };
    ResidentConnectStack: Absent;
    ParkingStack: NavigatorScreenParams<ParkingStackParamList>;
    FacilityStack: NavigatorScreenParams<FacilityStackParamList>;
    GovernanceStack: NavigatorScreenParams<GovernanceStackParamList>;
    EmergencySafetyStack: NavigatorScreenParams<EmergencySafetyStackParamList>;
    SosResponsePlanStack: NavigatorScreenParams<SosResponsePlanStackParamList>;
    InterFlatStack: NavigatorScreenParams<InterFlatStackParamList>;
    CommunityStack: NavigatorScreenParams<CommunityStackParamList>;
    DomesticHelpStack: NavigatorScreenParams<DomesticHelpStackParamList>;
};
export type DomesticHelpStackParamList = {
    DomesticHelpHome: Absent;
    DomesticHelpDetail: {
        domesticHelpId: string;
    };
    DomesticHelpAttendance: {
        domesticHelpId: string;
    };
    DomesticHelpAccess: {
        domesticHelpId: string;
    };
    DomesticHelpServiceControls: {
        domesticHelpId: string;
    };
};
export type DomesticHelpHomeScreenProps = NativeStackScreenProps<DomesticHelpStackParamList, 'DomesticHelpHome'>;
export type DomesticHelpDetailScreenProps = NativeStackScreenProps<DomesticHelpStackParamList, 'DomesticHelpDetail'>;
export type DomesticHelpAttendanceScreenProps = NativeStackScreenProps<DomesticHelpStackParamList, 'DomesticHelpAttendance'>;
export type DomesticHelpAccessScreenProps = NativeStackScreenProps<DomesticHelpStackParamList, 'DomesticHelpAccess'>;
export type DomesticHelpServiceControlsScreenProps = NativeStackScreenProps<DomesticHelpStackParamList, 'DomesticHelpServiceControls'>;
export type FacilityStackParamList = {
    FacilityHome: {
        unitId: string;
    };
    FacilityList: Absent;
    FacilityDetail: {
        facilityId: string;
    };
    FacilitySlotAvailability: {
        facilityId: string;
    };
    CreateFacilityBooking: {
        facilityId?: string;
        selectedSlotId?: string;
    };
    FacilityBookingConsent: Absent;
    FacilityBookingReview: {
        draftBookingId?: string;
        bookingId?: string;
    };
    FacilityBookingConfirmation: {
        bookingId: string;
    };
    FacilityPayment: {
        bookingId: string;
    };
    MyFacilityBookings: {
        unitId: string;
    };
    FacilityBookingDetail: {
        bookingId: string;
    };
    CancelFacilityBooking: {
        bookingId: string;
    };
    RescheduleFacilityBooking: {
        bookingId: string;
    };
    FacilityQrCheckIn: {
        bookingId: string;
    };
    FacilityBookingHistory: {
        unitId: string;
    };
};
export type FacilityOpsStackParamList = {
    FacilityOpsHome: Absent;
    FacilityProfile: Absent;
    VendorDirectory: Absent;
    VendorDetail: {
        vendorId: string;
    };
    RegisterVendor: Absent;
    VendorDocuments: {
        vendorId: string;
    };
    AmcContractList: Absent;
    AmcContractDetail: {
        contractId: string;
    };
    AmcRenewalReminders: Absent;
    AssetRegister: Absent;
    AssetDetail: {
        assetId: string;
    };
    AssetDocuments: {
        assetId: string;
    };
    PreventiveMaintenanceSchedule: Absent;
    WorkOrderList: Absent;
    CreateWorkOrder: {
        assetId?: string;
        vendorId?: string;
        complaintId?: string;
    };
    WorkOrderDetail: {
        workOrderId: string;
    };
    ServiceHistory: Absent;
    InventoryList: Absent;
    InventoryTransaction: {
        itemId?: string;
    };
    PurchaseRequest: Absent;
    VendorScorecard: {
        vendorId: string;
    };
    ComplianceExpiryDashboard: Absent;
    AssetBreakdownReport: {
        assetId?: string;
    };
    StaffAttendanceStack: NavigatorScreenParams<StaffAttendanceStackParamList>;
    DepartmentChat: NavigatorScreenParams<DepartmentChatStackParamList>;
};
export type ParkingStackParamList = {
    ParkingHome: {
        unitId: string;
    };
    MyVehicles: {
        unitId: string;
    };
    VehicleDetail: {
        vehicleId: string;
    };
    AddVehicle: {
        unitId: string;
    };
    ParkingSlotDetail: {
        slotId: string;
    };
    VisitorParkingRequest: {
        unitId: string;
    };
    VisitorParkingPassDetail: {
        passId: string;
    };
    WrongParkingReport: {
        unitId: string;
    };
    VehicleBlockingReport: {
        unitId: string;
    };
    ParkingIncidentList: {
        unitId: string;
    };
    ParkingIncidentDetail: {
        incidentId: string;
    };
    ParkingViolationHistory: {
        unitId: string;
    };
    ParkingStickerRfid: {
        unitId: string;
    };
    GuardVehicleLookup: Absent;
    ParkingRules: Absent;
    ParkingAccessReadiness: {
        societyId: string;
    };
};
export type VisitorStackParamList = {
    VisitorList: Absent;
    VisitorDetail: {
        visitor: Visitor;
    };
    CreateVisitorPass: Absent;
};
export type ComplaintStackParamList = {
    ComplaintList: Absent;
    ComplaintDetail: {
        complaint: Complaint;
    };
    CreateComplaint: Absent;
    ComplaintReopen: {
        complaintId: string;
    };
    ComplaintFeedback: {
        complaintId: string;
    };
};
export type BillStackParamList = {
    BillList: Absent;
    BillDetail: {
        bill: Bill;
    };
    MockPaymentConfirmation: {
        bill: Bill;
    };
    AdvancePayment: Absent;
    FlatLedger: {
        unitId?: string;
    };
    PaymentSuccess: {
        bill: Bill;
        paymentMethod: PaymentMethod;
        transactionId: string;
        receiptNumber: string;
        paymentDate: string;
    };
};
export type ChatStackParamList = {
    ChatHome: Absent;
    Conversation: {
        conversationId: string;
    };
    ResidentDirectorySelection: Absent;
    NewResidentContactRequest: {
        residentProfileId: string;
    };
    ResidentContactRequests: {
        mode: 'incoming' | 'outgoing';
    };
    ResidentDirectConversation: {
        conversationId: string;
    };
};
export type RootTabParamList = {
    HomeTab: NavigatorScreenParams<HomeStackParamList>;
    ActivityTab: Absent;
    CommunityTab: NavigatorScreenParams<CommunityStackParamList>;
    ServicesTab: Absent;
    VisitorTab: NavigatorScreenParams<VisitorStackParamList>;
    ComplaintTab: NavigatorScreenParams<ComplaintStackParamList>;
    BillTab: NavigatorScreenParams<BillStackParamList>;
    ChatTab: NavigatorScreenParams<ChatStackParamList>;
};
export type GuardTabParamList = {
    GuardHomeTab: Absent;
    GuardExpectedTab: Absent;
    GuardSearchTab: Absent;
    GuardLogsTab: Absent;
    GuardMoreTab: Absent;
};
export type GuardStackParamList = {
    GuardHome: Absent;
    ExpectedVisitors: Absent;
    PassSearch: Absent;
    VisitorVerification: {
        passCode?: string;
    };
    RecordEntry: {
        pass: GatePass;
    };
    ManualEntry: Absent;
    QuickEntry: Absent;
    StaffCheckIn: Absent;
    GateActivityLog: Absent;
    OfflineQueue: Absent;
    EmergencyAlert: Absent;
    ShiftHandover: Absent;
    GuardMore: Absent;
    GuardVehicleLookup: Absent;
    GuardChatInbox: Absent;
    GuardChatConversation: {
        interactionId: string;
        residentName: string;
        unitLabel: string;
    };
};
export type AppModeSelectorScreenProps = NativeStackScreenProps<RootStackParamList, 'AppModeSelector'>;
export type ResidentHomeScreenProps = CompositeScreenProps<NativeStackScreenProps<HomeStackParamList, 'ResidentHome'>, BottomTabScreenProps<RootTabParamList>>;
export type CreateVisitorFromHomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'CreateVisitorFromHome'>;
export type CreateComplaintFromHomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'CreateComplaintFromHome'>;
export type VisitorDetailFromHomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'VisitorDetailFromHome'>;
export type NoticeListFromHomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'NoticeListFromHome'>;
export type NoticeDetailFromHomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'NoticeDetailFromHome'>;
export type EmergencySosScreenProps = NativeStackScreenProps<HomeStackParamList, 'EmergencySos'>;
export type HelpdeskScreenProps = NativeStackScreenProps<HomeStackParamList, 'Helpdesk'>;
export type VisitorListScreenProps = CompositeScreenProps<NativeStackScreenProps<VisitorStackParamList, 'VisitorList'>, BottomTabScreenProps<RootTabParamList>>;
export type VisitorDetailScreenProps = NativeStackScreenProps<VisitorStackParamList, 'VisitorDetail'>;
export type CreateVisitorPassScreenProps = NativeStackScreenProps<VisitorStackParamList, 'CreateVisitorPass'>;
export type ComplaintListScreenProps = CompositeScreenProps<NativeStackScreenProps<ComplaintStackParamList, 'ComplaintList'>, BottomTabScreenProps<RootTabParamList>>;
export type ComplaintDetailScreenProps = NativeStackScreenProps<ComplaintStackParamList, 'ComplaintDetail'> | NativeStackScreenProps<HomeStackParamList, 'ComplaintDetailFromHome'>;
export type CreateComplaintScreenProps = NativeStackScreenProps<ComplaintStackParamList, 'CreateComplaint'>;
export type BillListScreenProps = CompositeScreenProps<NativeStackScreenProps<BillStackParamList, 'BillList'>, BottomTabScreenProps<RootTabParamList>>;
export type BillDetailScreenProps = NativeStackScreenProps<BillStackParamList, 'BillDetail'>;
export type BillDetailFromHomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'BillDetailFromHome'>;
export type MockPaymentConfirmationScreenProps = NativeStackScreenProps<BillStackParamList, 'MockPaymentConfirmation'>;
export type PaymentSuccessScreenProps = NativeStackScreenProps<BillStackParamList, 'PaymentSuccess'>;
export type ResidentChatScreenProps = BottomTabScreenProps<RootTabParamList, 'ChatTab'>;
type GuardTabScreenProps<TRoute extends keyof GuardTabParamList> = CompositeScreenProps<BottomTabScreenProps<GuardTabParamList, TRoute>, NativeStackScreenProps<GuardStackParamList>>;
export type GuardHomeScreenProps = GuardTabScreenProps<'GuardHomeTab'>;
export type PassSearchScreenProps = GuardTabScreenProps<'GuardSearchTab'>;
export type VisitorVerificationScreenProps = NativeStackScreenProps<GuardStackParamList, 'VisitorVerification'>;
export type RecordEntryScreenProps = NativeStackScreenProps<GuardStackParamList, 'RecordEntry'>;
export type ManualEntryScreenProps = NativeStackScreenProps<GuardStackParamList, 'ManualEntry'>;
export type QuickEntryScreenProps = NativeStackScreenProps<GuardStackParamList, 'QuickEntry'>;
export type StaffCheckInScreenProps = NativeStackScreenProps<GuardStackParamList, 'StaffCheckIn'>;
export type GateActivityLogScreenProps = GuardTabScreenProps<'GuardLogsTab'>;
export type OfflineQueueScreenProps = NativeStackScreenProps<GuardStackParamList, 'OfflineQueue'>;
export type EmergencyAlertScreenProps = NativeStackScreenProps<GuardStackParamList, 'EmergencyAlert'>;
export type ShiftHandoverScreenProps = NativeStackScreenProps<GuardStackParamList, 'ShiftHandover'>;
export type GuardMoreScreenProps = GuardTabScreenProps<'GuardMoreTab'>;
export type GuardVehicleLookupFromGuardScreenProps = NativeStackScreenProps<GuardStackParamList, 'GuardVehicleLookup'>;
export type DocumentVaultHomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'DocumentVaultHome'>;
export type MyDocumentsScreenProps = NativeStackScreenProps<HomeStackParamList, 'MyDocuments'>;
export type SocietyDocumentsScreenProps = NativeStackScreenProps<HomeStackParamList, 'SocietyDocuments'>;
export type DocumentDetailScreenProps = NativeStackScreenProps<HomeStackParamList, 'DocumentDetail'>;
export type UploadDocumentScreenProps = NativeStackScreenProps<HomeStackParamList, 'UploadDocument'>;
export type DocumentAccessLogScreenProps = NativeStackScreenProps<HomeStackParamList, 'DocumentAccessLog'>;
export type NocRequestListScreenProps = NativeStackScreenProps<HomeStackParamList, 'NocRequestList'>;
export type CreateNocRequestScreenProps = NativeStackScreenProps<HomeStackParamList, 'CreateNocRequest'>;
export type NocRequestDetailScreenProps = NativeStackScreenProps<HomeStackParamList, 'NocRequestDetail'>;
export type MoveOutRequestScreenProps = NativeStackScreenProps<HomeStackParamList, 'MoveOutRequest'>;
export type MoveOutClearanceChecklistScreenProps = NativeStackScreenProps<HomeStackParamList, 'MoveOutClearanceChecklist'>;
export type NocCertificateScreenProps = NativeStackScreenProps<HomeStackParamList, 'NocCertificate'>;
export type OwnerTenantOverviewScreenProps = NativeStackScreenProps<HomeStackParamList, 'OwnerTenantOverview'>;
export type CurrentOwnerProfileScreenProps = NativeStackScreenProps<HomeStackParamList, 'CurrentOwnerProfile'>;
export type CurrentTenantProfileScreenProps = NativeStackScreenProps<HomeStackParamList, 'CurrentTenantProfile'>;
export type FamilyMembersScreenProps = NativeStackScreenProps<HomeStackParamList, 'FamilyMembers'>;
export type HouseholdOverviewScreenProps = NativeStackScreenProps<HomeStackParamList, 'HouseholdOverview'>;
export type FamilyMemberListScreenProps = NativeStackScreenProps<HomeStackParamList, 'FamilyMemberList'>;
export type AddFamilyMemberScreenProps = NativeStackScreenProps<HomeStackParamList, 'AddFamilyMember'>;
export type EditFamilyMemberScreenProps = NativeStackScreenProps<HomeStackParamList, 'EditFamilyMember'>;
export type FamilyMemberDetailScreenProps = NativeStackScreenProps<HomeStackParamList, 'FamilyMemberDetail'>;
export type FamilyAccessPermissionsScreenProps = NativeStackScreenProps<HomeStackParamList, 'FamilyAccessPermissions'>;
export type TenantManagementScreenProps = NativeStackScreenProps<HomeStackParamList, 'TenantManagement'>;
export type AddTenantStartScreenProps = NativeStackScreenProps<HomeStackParamList, 'AddTenantStart'>;
export type AddTenantPersonalInfoScreenProps = NativeStackScreenProps<HomeStackParamList, 'AddTenantPersonalInfo'>;
export type AddTenantAgreementScreenProps = NativeStackScreenProps<HomeStackParamList, 'AddTenantAgreement'>;
export type AddTenantDocumentsScreenProps = NativeStackScreenProps<HomeStackParamList, 'AddTenantDocuments'>;
export type AddTenantAccessPermissionsScreenProps = NativeStackScreenProps<HomeStackParamList, 'AddTenantAccessPermissions'>;
export type AddTenantReviewScreenProps = NativeStackScreenProps<HomeStackParamList, 'AddTenantReview'>;
export type TenantOnboardingSuccessScreenProps = NativeStackScreenProps<HomeStackParamList, 'TenantOnboardingSuccess'>;
export type TenantOnboardingStatusScreenProps = NativeStackScreenProps<HomeStackParamList, 'TenantOnboardingStatus'>;
export type TenantDetailScreenProps = NativeStackScreenProps<HomeStackParamList, 'TenantDetail'>;
export type TenantRestrictedStateScreenProps = NativeStackScreenProps<HomeStackParamList, 'TenantRestrictedState'>;
export type UnitVehiclesScreenProps = NativeStackScreenProps<HomeStackParamList, 'UnitVehicles'>;
export type CurrentDocumentsSummaryScreenProps = NativeStackScreenProps<HomeStackParamList, 'CurrentDocumentsSummary'>;
export type OwnerHistoryScreenProps = NativeStackScreenProps<HomeStackParamList, 'OwnerHistory'>;
export type TenantHistoryScreenProps = NativeStackScreenProps<HomeStackParamList, 'TenantHistory'>;
export type OccupancyTimelineScreenProps = NativeStackScreenProps<HomeStackParamList, 'OccupancyTimeline'>;
export type PreviousResidentDetailScreenProps = NativeStackScreenProps<HomeStackParamList, 'PreviousResidentDetail'>;
export type PreviousResidentDocumentsScreenProps = NativeStackScreenProps<HomeStackParamList, 'PreviousResidentDocuments'>;
export type MoveInRequestScreenProps = NativeStackScreenProps<HomeStackParamList, 'MoveInRequest'>;
export type UnitAccessStatusScreenProps = NativeStackScreenProps<HomeStackParamList, 'UnitAccessStatus'>;
export type OwnershipTenancySummaryScreenProps = NativeStackScreenProps<HomeStackParamList, 'OwnershipTenancySummary'>;
export type ParkingHomeScreenProps = NativeStackScreenProps<ParkingStackParamList, 'ParkingHome'>;
export type MyVehiclesScreenProps = NativeStackScreenProps<ParkingStackParamList, 'MyVehicles'>;
export type VehicleDetailScreenProps = NativeStackScreenProps<ParkingStackParamList, 'VehicleDetail'>;
export type AddVehicleScreenProps = NativeStackScreenProps<ParkingStackParamList, 'AddVehicle'>;
export type ParkingSlotDetailScreenProps = NativeStackScreenProps<ParkingStackParamList, 'ParkingSlotDetail'>;
export type VisitorParkingRequestScreenProps = NativeStackScreenProps<ParkingStackParamList, 'VisitorParkingRequest'>;
export type VisitorParkingPassDetailScreenProps = NativeStackScreenProps<ParkingStackParamList, 'VisitorParkingPassDetail'>;
export type WrongParkingReportScreenProps = NativeStackScreenProps<ParkingStackParamList, 'WrongParkingReport'>;
export type VehicleBlockingReportScreenProps = NativeStackScreenProps<ParkingStackParamList, 'VehicleBlockingReport'>;
export type ParkingIncidentListScreenProps = NativeStackScreenProps<ParkingStackParamList, 'ParkingIncidentList'>;
export type ParkingIncidentDetailScreenProps = NativeStackScreenProps<ParkingStackParamList, 'ParkingIncidentDetail'>;
export type ParkingViolationHistoryScreenProps = NativeStackScreenProps<ParkingStackParamList, 'ParkingViolationHistory'>;
export type ParkingStickerRfidScreenProps = NativeStackScreenProps<ParkingStackParamList, 'ParkingStickerRfid'>;
export type GuardVehicleLookupScreenProps = NativeStackScreenProps<GuardStackParamList, 'GuardVehicleLookup'>;
export type ParkingRulesScreenProps = NativeStackScreenProps<ParkingStackParamList, 'ParkingRules'>;
export type ParkingAccessReadinessScreenProps = NativeStackScreenProps<ParkingStackParamList, 'ParkingAccessReadiness'>;
export type ResidentConnectStackParamList = {
    ResidentConnectHome: Absent;
    ResidentDirectory: Absent;
    ResidentSearch: Absent;
    ResidentPreview: {
        residentId: string;
    };
    CreateContactRequest: {
        recipientResidentId: string;
    };
    IncomingContactRequests: Absent;
    OutgoingContactRequests: Absent;
    ContactRequestDetail: {
        requestId: string;
    };
    AcceptedContacts: Absent;
    ChatThreadList: Absent;
    ChatConversation: {
        threadId: string;
    };
    BlockedResidents: Absent;
    ReportResidentConnect: {
        targetType: 'MESSAGE' | 'RESIDENT' | 'CONTACT_REQUEST';
        targetId: string;
        contextText?: string;
    };
    ResidentPrivacySettings: Absent;
    ModerationPlaceholder: Absent;
};
export type ResidentConnectHomeScreenProps = NativeStackScreenProps<ResidentConnectStackParamList, 'ResidentConnectHome'>;
export type ResidentDirectoryScreenProps = NativeStackScreenProps<ResidentConnectStackParamList, 'ResidentDirectory'>;
export type ResidentSearchScreenProps = NativeStackScreenProps<ResidentConnectStackParamList, 'ResidentSearch'>;
export type ResidentPreviewScreenProps = NativeStackScreenProps<ResidentConnectStackParamList, 'ResidentPreview'>;
export type CreateContactRequestScreenProps = NativeStackScreenProps<ResidentConnectStackParamList, 'CreateContactRequest'>;
export type IncomingContactRequestsScreenProps = NativeStackScreenProps<ResidentConnectStackParamList, 'IncomingContactRequests'>;
export type OutgoingContactRequestsScreenProps = NativeStackScreenProps<ResidentConnectStackParamList, 'OutgoingContactRequests'>;
export type ContactRequestDetailScreenProps = NativeStackScreenProps<ResidentConnectStackParamList, 'ContactRequestDetail'>;
export type AcceptedContactsScreenProps = NativeStackScreenProps<ResidentConnectStackParamList, 'AcceptedContacts'>;
export type ChatThreadListScreenProps = NativeStackScreenProps<ResidentConnectStackParamList, 'ChatThreadList'>;
export type ChatConversationScreenProps = NativeStackScreenProps<ResidentConnectStackParamList, 'ChatConversation'>;
export type BlockedResidentsScreenProps = NativeStackScreenProps<ResidentConnectStackParamList, 'BlockedResidents'>;
export type ReportResidentConnectScreenProps = NativeStackScreenProps<ResidentConnectStackParamList, 'ReportResidentConnect'>;
export type ResidentPrivacySettingsScreenProps = NativeStackScreenProps<ResidentConnectStackParamList, 'ResidentPrivacySettings'>;
export type ModerationPlaceholderScreenProps = NativeStackScreenProps<ResidentConnectStackParamList, 'ModerationPlaceholder'>;
export type GovernanceStackParamList = {
    GovernanceHome: Absent;
    MeetingList: Absent;
    MeetingDetail: {
        meetingId: string;
    };
    CreateMeeting: Absent;
    MeetingAgenda: {
        meetingId: string;
    };
    MeetingAttendance: {
        meetingId: string;
    };
    MeetingRsvp: {
        meetingId: string;
    };
    QuestionSubmission: {
        meetingId: string;
        agendaItemId?: string;
    };
    ProxyAuthorization: {
        meetingId: string;
    };
    ResolutionList: Absent;
    ResolutionDetail: {
        resolutionId: string;
    };
    CastResolutionVote: {
        resolutionId: string;
    };
    ResolutionResults: {
        resolutionId: string;
    };
    MeetingMinutesDetail: {
        meetingId: string;
    };
    PollList: Absent;
    PollDetail: {
        pollId: string;
    };
    CreatePoll: Absent;
    SubmitPollVote: {
        pollId: string;
    };
    PollResults: {
        pollId: string;
    };
    ElectionDashboard: Absent;
};
export type GovernanceHomeScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'GovernanceHome'>;
export type MeetingListScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'MeetingList'>;
export type MeetingDetailScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'MeetingDetail'>;
export type CreateMeetingScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'CreateMeeting'>;
export type MeetingAgendaScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'MeetingAgenda'>;
export type MeetingAttendanceScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'MeetingAttendance'>;
export type MeetingRsvpScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'MeetingRsvp'>;
export type QuestionSubmissionScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'QuestionSubmission'>;
export type ProxyAuthorizationScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'ProxyAuthorization'>;
export type ResolutionListScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'ResolutionList'>;
export type ResolutionDetailScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'ResolutionDetail'>;
export type CastResolutionVoteScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'CastResolutionVote'>;
export type ResolutionResultsScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'ResolutionResults'>;
export type MeetingMinutesDetailScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'MeetingMinutesDetail'>;
export type PollListScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'PollList'>;
export type PollDetailScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'PollDetail'>;
export type CreatePollScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'CreatePoll'>;
export type SubmitPollVoteScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'SubmitPollVote'>;
export type PollResultsScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'PollResults'>;
export type ElectionDashboardScreenProps = NativeStackScreenProps<GovernanceStackParamList, 'ElectionDashboard'>;
export type StaffAttendanceStackParamList = {
    StaffAttendanceHome: Absent;
    StaffDirectory: Absent;
    StaffDetail: {
        staffId: string;
    };
    RegisterStaff: Absent;
    DomesticHelpDirectory: Absent;
    DomesticHelpDetail: {
        domesticHelpId: string;
    };
    DomesticHelpVerification: {
        domesticHelpId: string;
    };
    ShiftManagement: Absent;
    ShiftAssignment: {
        staffId?: string;
        shiftId?: string;
    };
    DailyAttendanceDashboard: Absent;
    AttendancePunchList: Absent;
    ManualAttendanceEntry: Absent;
    AttendanceCorrectionRequest: Absent;
    AttendanceCorrectionApproval: Absent;
    MonthlyAttendanceReport: Absent;
    VendorAttendanceReport: Absent;
    StaffAttendanceDetail: {
        staffId: string;
    };
    BiometricDeviceList: Absent;
    BiometricDeviceDetail: {
        deviceId: string;
    };
    BiometricStaffMapping: {
        deviceId?: string;
        employeeCode?: string;
    };
    BiometricSyncJobLogs: Absent;
    BiometricSyncErrorReview: {
        syncJobId: string;
    };
    DuplicatePunchReview: Absent;
    MissingCheckoutReview: Absent;
    StaffIdCard: {
        staffId: string;
    };
    AttendanceSettings: Absent;
    ManageStaffChannels: {
        staffId: string;
        staffName: string;
        roleCode: import('../../modules/chat/domain/chat.types').StaffRoleCode;
    };
};
export type EmergencySafetyStackParamList = {
    EmergencySafetyHome: Absent;
    SosQuickAction: Absent;
    EmergencyTypeSelection: Absent;
    MedicalEmergency: Absent;
    FireAlert: Absent;
    LiftStuckAlert: Absent;
    SecurityThreatAlert: Absent;
    EmergencyConfirmation: {
        draftIncidentId?: string;
        emergencyType: import('../../shared/types/emergency.types').EmergencyType;
    };
    ActiveEmergencyDetail: {
        incidentId: string;
    };
    EmergencyIncidentTimeline: {
        incidentId: string;
    };
    MyEmergencyHistory: Absent;
    EmergencyContactManagement: Absent;
    FamilyConnect: Absent;
    SeniorCitizenProfile: {
        seniorId?: string;
    };
    SeniorSimpleMode: Absent;
    SeniorDailyCheckIn: Absent;
    SeniorInactivityAlerts: Absent;
    EmergencyVolunteerDirectory: Absent;
    EmergencyVolunteerRegistration: Absent;
    VolunteerAlertDetail: {
        alertId: string;
    };
    SafetyInstructions: Absent;
};
export type SosResponsePlanStackParamList = {
    EmergencyAndSosSettings: Absent;
    SosResponsePlans: Absent;
    SosResponsePlanDetails: {
        sosType: string;
    };
    EmergencyContacts: Absent;
    AddEmergencyContact: Absent;
    EditEmergencyContact: {
        contactId: string;
    };
    EmergencyContactDetails: {
        contactId: string;
    };
    TrustedResidentSearch: Absent;
    EmergencyProfile: Absent;
    SosTestMode: Absent;
    SosConfigurationHistory: Absent;
};
export type InterFlatStackParamList = {
    InterFlatHome: Absent;
    MyInterFlatIssues: Absent;
    CreateInterFlatIssue: {
        issueType: InterFlatIssueType;
    } | Absent;
    IssueTypeSelection: Absent;
    WaterLeakageIssue: Absent;
    NoiseComplaint: Absent;
    RenovationDisturbance: Absent;
    PetNuisanceIssue: Absent;
    CommonAreaDamageClaim: Absent;
    AffectedFlatSelection: Absent;
    InterFlatIssueDetail: {
        issueId: string;
    };
    IssueTimeline: {
        issueId: string;
    };
    NeighbourNotificationPreview: {
        issueId: string;
    };
    RespondToInterFlatIssue: {
        issueId: string;
    };
    FacilityInspectionRequest: {
        issueId: string;
    };
    FacilityInspectionDetail: {
        inspectionId: string;
    };
    MediationCaseDetail: {
        mediationId: string;
    };
    ResolutionProposal: {
        mediationId: string;
    };
    ResolutionAcceptance: {
        proposalId: string;
    };
    ClosureProof: {
        proposalId: string;
    };
    EscalationToCommittee: {
        issueId: string;
    };
    DisputeHistory: Absent;
    RuleLibrary: {
        category?: string;
    } | Absent;
    RuleCategoryList: Absent;
    RuleDetail: {
        ruleId: string;
    };
    RuleAcknowledgement: {
        ruleId: string;
    };
    MyRuleAcknowledgements: Absent;
    AdminRuleAcknowledgementReport: {
        ruleId?: string;
    };
    RuleViolationPlaceholder: {
        violationId?: string;
    };
    PenaltyReadinessPlaceholder: {
        violationId?: string;
    };
    InterFlatSettings: Absent;
    InterFlatAuditLog: Absent;
};
export type CreateInterFlatIssueScreenProps = NativeStackScreenProps<InterFlatStackParamList, 'CreateInterFlatIssue'>;
export type InterFlatScreenProps<RouteName extends keyof InterFlatStackParamList> = NativeStackScreenProps<InterFlatStackParamList, RouteName>;
export type ComplianceOpsStackParamList = {
    ComplianceHome: Absent;
    ComplianceCalendar: Absent;
    ComplianceTaskList: Absent;
    ComplianceTaskDetail: {
        taskId: string;
    };
    CreateComplianceTask: Absent;
    WasteComplianceDashboard: Absent;
    WastePickupSchedule: Absent;
    WasteSegregationChecklist: Absent;
    MissedGarbagePickup: Absent;
    WasteViolationNoticePlaceholder: Absent;
    WasteSegregationReport: Absent;
    HousekeepingDashboard: Absent;
    HousekeepingSchedule: Absent;
    HousekeepingRoundDetail: {
        roundId: string;
    };
    FloorCleaningChecklist: {
        roundId: string;
    };
    CommonAreaInspection: Absent;
    HousekeepingSupervisorVerification: {
        roundId: string;
    };
    HousekeepingIssueReport: Absent;
    LiftSafetyDashboard: Absent;
    LiftRegister: Absent;
    LiftDetail: {
        liftId: string;
    };
    LiftBreakdownReport: {
        liftId?: string;
    };
    LiftMaintenanceVisitLog: {
        liftId?: string;
    };
    LiftCertificateTracker: {
        liftId?: string;
    };
    LiftDowntimeReport: Absent;
    LiftSafetyDocuments: Absent;
    FireSafetyDashboard: Absent;
    FireEquipmentRegister: Absent;
    FireEquipmentDetail: {
        equipmentId: string;
    };
    FireExtinguisherExpiryTracker: Absent;
    FireNocTracker: Absent;
    HydrantPumpInspectionChecklist: Absent;
    FireDrillRecords: Absent;
    FireDrillDetail: {
        drillId: string;
    };
    EvacuationPlanPlaceholder: Absent;
    SafetyInspectionReport: Absent;
    ComplianceReports: Absent;
    ComplianceAuditLog: Absent;
    ComplianceSettings: Absent;
};
export type CommunityStackParamList = {
    CommunityHome: Absent;
    MarketplaceListingFeed: Absent;
    MarketplaceListingDetail: {
        listingId: string;
    };
    CreateMarketplaceListing: Absent;
    MyMarketplaceListings: Absent;
    EditMarketplaceListing: {
        listingId: string;
    };
    ListingCategory: {
        categorySlug: string;
    };
    ListingSearchFilters: Absent;
    ResidentSkillDirectory: Absent;
    SkillProfileDetail: {
        profileId: string;
    };
    CreateSkillProfile: Absent;
    ResidentServiceListing: Absent;
    ServiceRequestDetail: {
        requestId: string;
    };
    CreateServiceRequest: Absent;
    CommunityContactRequest: {
        type: 'MARKETPLACE' | 'SKILL' | 'BORROW' | 'LOST_FOUND';
        targetId: string;
        targetTitle: string;
        receiverId: string;
        receiverName: string;
        receiverUnit: string;
    };
    BorrowLendHome: Absent;
    BorrowableItemList: Absent;
    BorrowableItemDetail: {
        itemId: string;
    };
    CreateBorrowableItem: Absent;
    MyBorrowableItems: Absent;
    BorrowRequest: {
        itemId: string;
    };
    BorrowRequestDetail: {
        requestId: string;
    };
    BorrowApproval: {
        requestId: string;
    };
    ReturnConfirmation: {
        requestId: string;
    };
    BorrowLendHistory: Absent;
    LostFoundList: Absent;
    LostFoundDetail: {
        itemId: string;
    };
    CreateLostFoundReport: Absent;
    VerifiedVendors: Absent;
    ReportListing: {
        listingId: string;
    };
    CommunitySafetyGuidelines: Absent;
};
export type BorrowRequestScreenProps = NativeStackScreenProps<CommunityStackParamList, 'BorrowRequest'>;
export type EditMarketplaceListingScreenProps = NativeStackScreenProps<CommunityStackParamList, 'EditMarketplaceListing'>;
export type HardwareIntegrationStackParamList = {
    HardwareHome: Absent;
    DeviceRegistry: Absent;
    HardwareDeviceDetail: {
        deviceId: string;
    };
    RegisterHardwareDevice: Absent;
    DeviceLocationMapping: Absent;
    GateHardwareDashboard: Absent;
    RfidReadiness: Absent;
    RfidTagMapping: {
        mappingId?: string;
        tagCode?: string;
    };
    AnprReadiness: Absent;
    AnprVehicleMatchReview: {
        eventId: string;
    };
    BoomBarrierPlaceholder: {
        barrierId?: string;
    };
    CctvAccessPlaceholder: Absent;
    CctvCameraRegistry: Absent;
    SmartMeterDashboard: Absent;
    SmartMeterReadingDetail: {
        meterId: string;
        readingId?: string;
    };
    MeterReadingImportPlaceholder: Absent;
    EvChargingDashboard: Absent;
    EvChargerDetail: {
        chargerId: string;
    };
    EvChargingSessionPlaceholder: {
        sessionId: string;
    };
    BiometricConnectorAlignment: Absent;
    HardwareSyncJobLogs: {
        deviceId?: string;
    };
    HardwareEventLogs: {
        deviceId?: string;
    };
    HardwareErrorReview: {
        errorId?: string;
    };
    IntegrationHealthDashboard: Absent;
    DevicePermissionMatrix: Absent;
    HardwarePrivacyRules: Absent;
    HardwareAuditLog: Absent;
    HardwareSettings: Absent;
};
export type SocietyAdminStackParamList = {
    SocietyAdminHome: Absent;
    AdminProfile: Absent;
    UnitMaster: Absent;
    ResidentDirectory: Absent;
    PendingApprovals: Absent;
    NoticeControl: Absent;
    ComplaintControl: Absent;
    AdminAuditLog: Absent;
    FeatureConfiguration: Absent;
    SocietySetupSummary: Absent;
    SocietyHierarchy: Absent;
    TowerWingFloorSetup: Absent;
    UnitDetail: {
        unitId: string;
    };
    UnitImportPlaceholder: Absent;
    UnitImportPreview: Absent;
    UnitOccupancyStatus: Absent;
    SocietyConfiguration: Absent;
    ResidentDirectoryNew: Absent;
    ResidentDetail: {
        residentId: string;
    };
    OwnerProfile: Absent;
    TenantProfile: Absent;
    FamilyMembers: {
        unitId: string;
    };
    ResidentKyc: {
        residentId: string;
    };
    ResidentVehicleSummary: Absent;
    ResidentApprovalQueue: Absent;
    ResidentAccessStatus: {
        residentId: string;
    };
    DepartmentChat: NavigatorScreenParams<DepartmentChatStackParamList>;
    StaffAttendanceStack: NavigatorScreenParams<StaffAttendanceStackParamList>;
};
export type TreasurerStackParamList = {
    TreasurerHome: Absent;
    TreasurerProfile: Absent;
    ChargeHeads: Absent;
    BillingCycles: Absent;
    DraftBillReview: {
        cycleId: string;
    };
    FlatLedger: {
        unitId?: string;
    };
    ManualPaymentEntry: Absent;
    ReceiptDetail: {
        receiptId: string;
    };
    DefaulterReport: Absent;
    DepartmentChat: NavigatorScreenParams<DepartmentChatStackParamList>;
};
export type EmergencyAndSosSettingsScreenProps = NativeStackScreenProps<SosResponsePlanStackParamList, 'EmergencyAndSosSettings'>;
export type SosResponsePlansScreenProps = NativeStackScreenProps<SosResponsePlanStackParamList, 'SosResponsePlans'>;
export type SosResponsePlanDetailsScreenProps = NativeStackScreenProps<SosResponsePlanStackParamList, 'SosResponsePlanDetails'>;
export type EmergencyContactsScreenProps = NativeStackScreenProps<SosResponsePlanStackParamList, 'EmergencyContacts'>;
export type AddEmergencyContactScreenProps = NativeStackScreenProps<SosResponsePlanStackParamList, 'AddEmergencyContact'>;
export type EditEmergencyContactScreenProps = NativeStackScreenProps<SosResponsePlanStackParamList, 'EditEmergencyContact'>;
export type EmergencyContactDetailsScreenProps = NativeStackScreenProps<SosResponsePlanStackParamList, 'EmergencyContactDetails'>;
export type TrustedResidentSearchScreenProps = NativeStackScreenProps<SosResponsePlanStackParamList, 'TrustedResidentSearch'>;
export type EmergencyProfileScreenProps = NativeStackScreenProps<SosResponsePlanStackParamList, 'EmergencyProfile'>;
export type SosTestModeScreenProps = NativeStackScreenProps<SosResponsePlanStackParamList, 'SosTestMode'>;
export type DepartmentChatStackParamList = {
    DepartmentInbox: {
        channelId?: string;
    } | Absent;
    DepartmentConversation: {
        channelId: string;
        residenceId: string;
        residentUserId: string;
        residentName: string;
        unitLabel: string;
    };
};
