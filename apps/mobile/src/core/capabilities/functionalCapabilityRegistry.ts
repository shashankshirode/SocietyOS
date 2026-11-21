export type CapabilityStatus =
  | 'NOT_IMPLEMENTED'
  | 'PARTIAL'
  | 'MOCK_FUNCTIONAL'
  | 'API_READY'
  | 'INTEGRATED';

export interface FunctionalCapability {
  id: string;
  module:
    | 'HOUSEHOLD'
    | 'VISITORS'
    | 'FACILITIES'
    | 'BILLING'
    | 'COMPLAINTS'
    | 'EMERGENCY'
    | 'DOCUMENTS'
    | 'NOC'
    | 'PARKING'
    | 'STAFF'
    | 'NOTICES'
    | 'COMMUNITY'
    | 'RESIDENCY_LIFECYCLE';
  name: string;
  status: CapabilityStatus;
  requiredPermission: string;
  serviceMethod: string;
  mockImplemented: boolean;
  uiConnected: boolean;
  crossAppConnected: boolean;
  persistenceConnected: boolean;
}

export const FUNCTIONAL_CAPABILITY_REGISTRY: Record<string, FunctionalCapability> = {
  HOUSEHOLD_INVITE_MEMBER: {
    id: 'HOUSEHOLD_INVITE_MEMBER',
    module: 'HOUSEHOLD',
    name: 'Invite Family Member / Tenant',
    status: 'MOCK_FUNCTIONAL',
    requiredPermission: 'HOUSEHOLD_INVITE',
    serviceMethod: 'residentHouseholdMockSource.addFamilyMember',
    mockImplemented: true,
    uiConnected: true,
    crossAppConnected: true,
    persistenceConnected: true,
  },
  HOUSEHOLD_MANAGE_PERMISSIONS: {
    id: 'HOUSEHOLD_MANAGE_PERMISSIONS',
    module: 'HOUSEHOLD',
    name: 'Manage Family Member Capabilities',
    status: 'MOCK_FUNCTIONAL',
    requiredPermission: 'HOUSEHOLD_PERMISSIONS_MANAGE',
    serviceMethod: 'residentHouseholdMockSource.updateFamilyMemberPermissions',
    mockImplemented: true,
    uiConnected: true,
    crossAppConnected: true,
    persistenceConnected: true,
  },
  HOUSEHOLD_MANAGE_NOTIFICATIONS: {
    id: 'HOUSEHOLD_MANAGE_NOTIFICATIONS',
    module: 'HOUSEHOLD',
    name: 'Configure Household Notification Policy',
    status: 'MOCK_FUNCTIONAL',
    requiredPermission: 'HOUSEHOLD_NOTIFICATIONS_MANAGE',
    serviceMethod: 'updateHouseholdNotificationPolicy',
    mockImplemented: true,
    uiConnected: true,
    crossAppConnected: true,
    persistenceConnected: true,
  },
  HOUSEHOLD_MANAGE_EMERGENCY_CONTACTS: {
    id: 'HOUSEHOLD_MANAGE_EMERGENCY_CONTACTS',
    module: 'HOUSEHOLD',
    name: 'Configure Household SOS Contacts',
    status: 'MOCK_FUNCTIONAL',
    requiredPermission: 'HOUSEHOLD_EMERGENCY_MANAGE',
    serviceMethod: 'emergencyRoutingService.updateHouseholdEmergencyPolicy',
    mockImplemented: true,
    uiConnected: true,
    crossAppConnected: true,
    persistenceConnected: true,
  },
  VISITOR_CREATE: {
    id: 'VISITOR_CREATE',
    module: 'VISITORS',
    name: 'Create Visitor Pass with Real Host Attribution',
    status: 'MOCK_FUNCTIONAL',
    requiredPermission: 'VISITOR_CREATE',
    serviceMethod: 'visitorsMockSource.create',
    mockImplemented: true,
    uiConnected: true,
    crossAppConnected: true,
    persistenceConnected: true,
  },
  VISITOR_GUARD_VALIDATE: {
    id: 'VISITOR_GUARD_VALIDATE',
    module: 'VISITORS',
    name: 'Guard Entry/Exit Pass Validation & Rejection of Cancelled Passes',
    status: 'MOCK_FUNCTIONAL',
    requiredPermission: 'GUARD_OPERATIONS',
    serviceMethod: 'visitorsMockSource.validatePassAtGate',
    mockImplemented: true,
    uiConnected: true,
    crossAppConnected: true,
    persistenceConnected: true,
  },
  FACILITY_BOOK: {
    id: 'FACILITY_BOOK',
    module: 'FACILITIES',
    name: 'Reserve Facility with Conflict & Authorization Checks',
    status: 'MOCK_FUNCTIONAL',
    requiredPermission: 'FACILITY_BOOK_FREE',
    serviceMethod: 'facilityMockSource.createFacilityBooking',
    mockImplemented: true,
    uiConnected: true,
    crossAppConnected: true,
    persistenceConnected: true,
  },
  BILL_PAY: {
    id: 'BILL_PAY',
    module: 'BILLING',
    name: 'Pay Maintenance Bill with Ledger Attribution',
    status: 'MOCK_FUNCTIONAL',
    requiredPermission: 'BILL_PAY',
    serviceMethod: 'billMockSource.mockPayment',
    mockImplemented: true,
    uiConnected: true,
    crossAppConnected: true,
    persistenceConnected: true,
  },
  COMPLAINT_CREATE: {
    id: 'COMPLAINT_CREATE',
    module: 'COMPLAINTS',
    name: 'Raise Helpdesk Ticket with Reporter Attribution',
    status: 'MOCK_FUNCTIONAL',
    requiredPermission: 'COMPLAINT_CREATE',
    serviceMethod: 'complaintMockSource.create',
    mockImplemented: true,
    uiConnected: true,
    crossAppConnected: true,
    persistenceConnected: true,
  },
  SOS_TRIGGER: {
    id: 'SOS_TRIGGER',
    module: 'EMERGENCY',
    name: 'Trigger SOS Alert with 2-Layer Society + Household Routing',
    status: 'MOCK_FUNCTIONAL',
    requiredPermission: 'SOS_TRIGGER',
    serviceMethod: 'emergencyRoutingService.triggerEmergency',
    mockImplemented: true,
    uiConnected: true,
    crossAppConnected: true,
    persistenceConnected: true,
  },
  SOS_GUARD_ACKNOWLEDGE: {
    id: 'SOS_GUARD_ACKNOWLEDGE',
    module: 'EMERGENCY',
    name: 'Guard Operational SOS Acknowledgment',
    status: 'MOCK_FUNCTIONAL',
    requiredPermission: 'SOS_ACKNOWLEDGE',
    serviceMethod: 'emergencyRoutingService.acknowledgeEmergency',
    mockImplemented: true,
    uiConnected: true,
    crossAppConnected: true,
    persistenceConnected: true,
  },
  DOCUMENTS_MANAGE: {
    id: 'DOCUMENTS_MANAGE',
    module: 'DOCUMENTS',
    name: 'Document Vault & Unit Document Access',
    status: 'MOCK_FUNCTIONAL',
    requiredPermission: 'DOCUMENTS_VIEW',
    serviceMethod: 'residentDocumentsMockSource.list',
    mockImplemented: true,
    uiConnected: true,
    crossAppConnected: true,
    persistenceConnected: true,
  },
  NOC_REQUEST: {
    id: 'NOC_REQUEST',
    module: 'NOC',
    name: 'Request & Multi-Step NOC Clearances',
    status: 'MOCK_FUNCTIONAL',
    requiredPermission: 'NOC_REQUEST',
    serviceMethod: 'residentNocMockSource.createRequest',
    mockImplemented: true,
    uiConnected: true,
    crossAppConnected: true,
    persistenceConnected: true,
  },
  PARKING_MANAGE: {
    id: 'PARKING_MANAGE',
    module: 'PARKING',
    name: 'Vehicle Management & Parking Spot Tracking',
    status: 'MOCK_FUNCTIONAL',
    requiredPermission: 'PARKING_VIEW',
    serviceMethod: 'residentParkingMockSource.list',
    mockImplemented: true,
    uiConnected: true,
    crossAppConnected: true,
    persistenceConnected: true,
  },
  STAFF_MANAGE: {
    id: 'STAFF_MANAGE',
    module: 'STAFF',
    name: 'Domestic Help Association & Gate Attendance',
    status: 'MOCK_FUNCTIONAL',
    requiredPermission: 'STAFF_VIEW',
    serviceMethod: 'residentDomesticHelpMockSource.list',
    mockImplemented: true,
    uiConnected: true,
    crossAppConnected: true,
    persistenceConnected: true,
  },
  NOTICES_VIEW: {
    id: 'NOTICES_VIEW',
    module: 'NOTICES',
    name: 'Society Notices & Acknowledgement Tracking',
    status: 'MOCK_FUNCTIONAL',
    requiredPermission: 'NOTICES_VIEW',
    serviceMethod: 'residentNoticesMockSource.list',
    mockImplemented: true,
    uiConnected: true,
    crossAppConnected: true,
    persistenceConnected: true,
  },
};
