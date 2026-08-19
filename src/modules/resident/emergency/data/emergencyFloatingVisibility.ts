const HIDDEN_SOS_ROUTES = [
  'MockPaymentConfirmation',
  'PaymentSuccess',
  'PaymentCheckout',
  'Checkout',
  'AddFamilyMember',
  'EditFamilyMember',
  'AddFamilyMemberDetail',
  'AddTenantStart',
  'AddTenantPersonalInfo',
  'AddTenantAgreement',
  'AddTenantDocuments',
  'AddTenantAccessPermissions',
  'AddTenantReview',
  'TenantOnboarding',
  'UploadDocument',
  'CreateVisitorPass',
  'CreateVisitorFromHome',
  'CreateComplaint',
  'CreateComplaintFromHome',
  'CreateNocRequest',
  'MoveOutRequest',
  'MoveOutClearanceChecklist',
  'CreateFacilityBooking',
  'FacilityBookingDetail',
  'FlatLedger',
  'RenovationNoc',
  'ParkingNoc',
  'MoveOutNoc',
  'NoDuesCertificate',
  'ResidenceCertificate',
];


export function isSosFloatingVisible(routeName: string): boolean {
  if (!routeName) return true;
  return !HIDDEN_SOS_ROUTES.includes(routeName);
}
