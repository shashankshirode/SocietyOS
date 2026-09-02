const HIDE_TAB_ROUTES = new Set([
  // Visitor flows
  'VisitorDetail',
  'VisitorDetailFromHome',
  'CreateVisitorPass',
  'CreateVisitorFromHome',

  // Document flows
  'DocumentDetail',
  'UploadDocument',
  'DocumentVaultHome',
  'MyDocuments',
  'SocietyDocuments',
  'DocumentAccessLog',
  'CurrentDocumentsSummary',
  'PreviousResidentDocuments',

  // Facilities & Bookings
  'FacilityDetail',
  'CreateFacilityBooking',
  'FacilityList',
  'FacilityBookingSuccess',

  // NOC & Move-out
  'CreateNocRequest',
  'NocRequestDetail',
  'NocCertificate',
  'NocRequestList',
  'MoveOutRequest',
  'MoveOutClearanceChecklist',
  'MoveInRequest',

  // Complaints & Helpdesk
  'ComplaintDetail',
  'ComplaintDetailFromHome',
  'CreateComplaint',
  'CreateComplaintFromHome',
  'ComplaintReopen',
  'ComplaintFeedback',
  'Helpdesk',

  // Household & Tenant Management
  'AddTenantStart',
  'AddTenantPersonalInfo',
  'AddTenantAgreement',
  'AddTenantDocuments',
  'AddTenantAccessPermissions',
  'AddTenantReview',
  'TenantOnboardingSuccess',
  'TenantOnboardingStatus',
  'TenantDetail',
  'TenantManagement',
  'TenantRestrictedState',
  'AddFamilyMember',
  'EditFamilyMember',
  'FamilyAccessPermissions',
  'FamilyMemberList',
  'FamilyMemberDetail',
  'HouseholdOverview',
  'OwnerTenantOverview',
  'CurrentOwnerProfile',
  'CurrentTenantProfile',
  'OwnerHistory',
  'TenantHistory',
  'OccupancyTimeline',
  'PreviousResidentDetail',
  'UnitVehicles',
  'UnitAccessStatus',
  'OwnershipTenancySummary',
  'FamilyPortability',
  'RentalDeclaration',
  'ShortStayManagement',

  // Emergency & SOS
  'EmergencySos',
  'SosResponsePlanStack',
  'IncidentTimeline',
  'SeniorCitizenDailyCheckIn',

  // Billing & Payments
  'FlatLedger',
  'MockPaymentConfirmation',
  'PaymentSuccess',
  'BillDetail',
  'AdvancePayment',

  // Notices
  'NoticeDetail',
  'NoticeListFromHome',

  // Chats & Resident Connect
  'Conversation',
  'ResidentConversation',
  'ResidentDirectConversation',
  'ChatConversation',
  'PrivateChatThread',
  'ControlledGroupChat',
  'DepartmentChat',
  'DepartmentConversation',
  'InterFlatConversation',
  'ResidentContactRequests',
  'ResidentDirectorySelection',
  'NewResidentContactRequest',

  // Profile & Settings
  'ProfileHome',
  'Settings',
  'RoleAccount',
  'Appearance',
  'Notifications',
  'Language',
  'Accessibility',
  'Privacy',
]);

export function shouldHideTabBar(routeName: string): boolean {
  return HIDE_TAB_ROUTES.has(routeName);
}
