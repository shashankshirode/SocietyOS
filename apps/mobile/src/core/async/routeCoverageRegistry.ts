export type ResidentRouteName =
  | 'ResidentDashboard'
  | 'Notifications'
  | 'ResidenceSwitcher'
  | 'Profile'
  | 'Settings'
  | 'HouseholdFamily'
  | 'AddFamilyMember'
  | 'EditFamilyMember'
  | 'FamilyMemberDetails'
  | 'AccessPermissions'
  | 'TenantManagement'
  | 'TenantOnboarding'
  | 'TenantDetails'
  | 'TenantStatus'
  | 'TenantExit'
  | 'VisitorPasses'
  | 'VisitorDetails'
  | 'CreateVisitorPass'
  | 'VisitorExitConfirmation'
  | 'Complaints'
  | 'ComplaintDetails'
  | 'RaiseComplaint'
  | 'ComplaintTimeline'
  | 'ComplaintFeedback'
  | 'BillsPayments'
  | 'BillDetails'
  | 'PaymentCheckout'
  | 'PaymentStatus'
  | 'Receipts'
  | 'Ledger'
  | 'SocietyNotices'
  | 'NoticeDetails'
  | 'NoticeAcknowledgement'
  | 'DocumentVault'
  | 'DocumentDetails'
  | 'UploadDocument'
  | 'NocCertificates'
  | 'NocDetails'
  | 'CreateNocRequest'
  | 'FacilityBookings'
  | 'FacilityDetails'
  | 'BookingWizard'
  | 'BookingHistory'
  | 'ParkingVehicles'
  | 'VehicleDetails'
  | 'ParkingRequests'
  | 'ResidentConnect'
  | 'ChatList'
  | 'ChannelChat'
  | 'PrivateResidentChat'
  | 'ContactRequests'
  | 'IncomingRequests'
  | 'PendingRequests'
  | 'ResidentDirectory'
  | 'CommunityHub'
  | 'Marketplace'
  | 'MarketplaceDetails'
  | 'CreateListing'
  | 'SkillDirectory'
  | 'BorrowLend'
  | 'LostFound'
  | 'VerifiedVendors'
  | 'EmergencySafety'
  | 'DailyInsights'
  | 'CommunityServices'
  | 'RecentActivity';

export interface ResidentRouteAsyncCoverage {
  routeName: ResidentRouteName;
  hasInitialSkeleton: boolean;
  hasRefreshState: boolean;
  hasErrorState: boolean;
  hasEmptyState: boolean;
  hasReducedMotionSupport: boolean;
  hasTransition: boolean;
}

export const routeCoverageRegistry: Record<ResidentRouteName, ResidentRouteAsyncCoverage> = {
  ResidentDashboard: {
    routeName: 'ResidentDashboard',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  Notifications: {
    routeName: 'Notifications',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  ResidenceSwitcher: {
    routeName: 'ResidenceSwitcher',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  Profile: {
    routeName: 'Profile',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  Settings: {
    routeName: 'Settings',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  HouseholdFamily: {
    routeName: 'HouseholdFamily',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  AddFamilyMember: {
    routeName: 'AddFamilyMember',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  EditFamilyMember: {
    routeName: 'EditFamilyMember',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  FamilyMemberDetails: {
    routeName: 'FamilyMemberDetails',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  AccessPermissions: {
    routeName: 'AccessPermissions',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  TenantManagement: {
    routeName: 'TenantManagement',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  TenantOnboarding: {
    routeName: 'TenantOnboarding',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  TenantDetails: {
    routeName: 'TenantDetails',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  TenantStatus: {
    routeName: 'TenantStatus',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  TenantExit: {
    routeName: 'TenantExit',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  VisitorPasses: {
    routeName: 'VisitorPasses',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  VisitorDetails: {
    routeName: 'VisitorDetails',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  CreateVisitorPass: {
    routeName: 'CreateVisitorPass',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  VisitorExitConfirmation: {
    routeName: 'VisitorExitConfirmation',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  Complaints: {
    routeName: 'Complaints',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  ComplaintDetails: {
    routeName: 'ComplaintDetails',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  RaiseComplaint: {
    routeName: 'RaiseComplaint',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  ComplaintTimeline: {
    routeName: 'ComplaintTimeline',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  ComplaintFeedback: {
    routeName: 'ComplaintFeedback',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  BillsPayments: {
    routeName: 'BillsPayments',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  BillDetails: {
    routeName: 'BillDetails',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  PaymentCheckout: {
    routeName: 'PaymentCheckout',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  PaymentStatus: {
    routeName: 'PaymentStatus',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  Receipts: {
    routeName: 'Receipts',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  Ledger: {
    routeName: 'Ledger',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  SocietyNotices: {
    routeName: 'SocietyNotices',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  NoticeDetails: {
    routeName: 'NoticeDetails',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  NoticeAcknowledgement: {
    routeName: 'NoticeAcknowledgement',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  DocumentVault: {
    routeName: 'DocumentVault',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  DocumentDetails: {
    routeName: 'DocumentDetails',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  UploadDocument: {
    routeName: 'UploadDocument',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  NocCertificates: {
    routeName: 'NocCertificates',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  NocDetails: {
    routeName: 'NocDetails',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  CreateNocRequest: {
    routeName: 'CreateNocRequest',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  FacilityBookings: {
    routeName: 'FacilityBookings',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  FacilityDetails: {
    routeName: 'FacilityDetails',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  BookingWizard: {
    routeName: 'BookingWizard',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  BookingHistory: {
    routeName: 'BookingHistory',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  ParkingVehicles: {
    routeName: 'ParkingVehicles',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  VehicleDetails: {
    routeName: 'VehicleDetails',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  ParkingRequests: {
    routeName: 'ParkingRequests',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  ResidentConnect: {
    routeName: 'ResidentConnect',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  ChatList: {
    routeName: 'ChatList',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  ChannelChat: {
    routeName: 'ChannelChat',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  PrivateResidentChat: {
    routeName: 'PrivateResidentChat',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  ContactRequests: {
    routeName: 'ContactRequests',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  IncomingRequests: {
    routeName: 'IncomingRequests',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  PendingRequests: {
    routeName: 'PendingRequests',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  ResidentDirectory: {
    routeName: 'ResidentDirectory',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  CommunityHub: {
    routeName: 'CommunityHub',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  Marketplace: {
    routeName: 'Marketplace',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  MarketplaceDetails: {
    routeName: 'MarketplaceDetails',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  CreateListing: {
    routeName: 'CreateListing',
    hasInitialSkeleton: true,
    hasRefreshState: false,
    hasErrorState: true,
    hasEmptyState: false,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  SkillDirectory: {
    routeName: 'SkillDirectory',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  BorrowLend: {
    routeName: 'BorrowLend',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  LostFound: {
    routeName: 'LostFound',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  VerifiedVendors: {
    routeName: 'VerifiedVendors',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  EmergencySafety: {
    routeName: 'EmergencySafety',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  DailyInsights: {
    routeName: 'DailyInsights',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  CommunityServices: {
    routeName: 'CommunityServices',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
  RecentActivity: {
    routeName: 'RecentActivity',
    hasInitialSkeleton: true,
    hasRefreshState: true,
    hasErrorState: true,
    hasEmptyState: true,
    hasReducedMotionSupport: true,
    hasTransition: true,
  },
};
