export const residentMockDataMessages = {
  featureLabels: {
    homeContext: 'Home context',
    dashboard: 'Dashboard priority',
    todaysPriority: 'Today priority',
    residencePulse: 'Residence pulse',
    dailyInsights: 'Daily insight',
    notifications: 'Notification',
    visitors: 'Visitor pass',
    visitorExitAssurance: 'Visitor exit assurance',
    gateEntry: 'Gate entry',
    billing: 'Maintenance bill',
    complaints: 'Helpdesk complaint',
    documents: 'Document vault item',
    noc: 'NOC request',
    family: 'Family member',
    tenant: 'Tenant record',
    ownerTenantHistory: 'Occupancy history',
    moveInMoveOut: 'Move request',
    parking: 'Vehicle and parking record',
    facilityBooking: 'Facility booking',
    facilitySlots: 'Facility slot',
    residentConnect: 'Resident connection',
    chat: 'Resident conversation',
    notices: 'Society notice',
    governance: 'Governance item',
    communityHub: 'Community activity',
    marketplace: 'Marketplace listing',
    borrowLend: 'Borrow and lend item',
    lostFound: 'Lost and found item',
    skillDirectory: 'Resident skill',
    verifiedVendors: 'Verified vendor',
    emergency: 'Emergency event',
    seniorCare: 'Senior care check-in',
    childSafety: 'Child safety alert',
    petCommunity: 'Pet community item',
    knowledgeBase: 'Knowledge article',
    communityServices: 'Community service',
    interFlatIssues: 'Inter-flat issue',
    rules: 'Rule acknowledgement',
    domesticHelp: 'Domestic help record',
    contextualInsights: 'Local advisory',
    recentActivity: 'Recent activity',
    profileSettings: 'Profile setting',
  },
  recordTitle: (featureLabel: string, ordinal: number, _unitLabel: string) => {
    const f = featureLabel.toLowerCase();
    if (f.includes('bill') || f.includes('payment')) {
      if (ordinal === 0) return 'July 2026 Maintenance Bill';
      if (ordinal === 1) return 'Clubhouse Booking Deposit';
      if (ordinal === 2) return 'Late Payment Fee';
      return `Maintenance Bill ${ordinal + 1}`;
    }
    if (f.includes('document') || f.includes('vault')) {
      if (ordinal === 0) return 'Rent Agreement';
      if (ordinal === 1) return 'Tenant KYC';
      if (ordinal === 2) return 'Police Verification';
      if (ordinal === 3) return 'Move-in Form';
      if (ordinal === 4) return 'Vehicle Details';
      return `Rule Acknowledgement`;
    }
    if (f.includes('visitor')) {
      if (ordinal === 0) return 'Rajesh Kumar';
      if (ordinal === 1) return 'Amazon Delivery';
      if (ordinal === 2) return 'Blue Dart Parcel';
      return 'Courier Delivery';
    }
    if (f.includes('tenant')) {
      if (ordinal === 0) return 'Rent Agreement';
      if (ordinal === 1) return 'Tenant KYC';
      if (ordinal === 2) return 'Police Verification';
      if (ordinal === 3) return 'Owner Consent';
      if (ordinal === 4) return 'Move-in Form';
      return `Tenant Checklist Item ${ordinal + 1}`;
    }
    return `${featureLabel} ${ordinal + 1}`;
  },
  recordDescription: (featureLabel: string, societyName: string) =>
    `${featureLabel} scenario for ${societyName}`,
  edgeCaseTitle: (stateLabel: string, featureLabel: string) =>
    `${stateLabel} ${featureLabel} scenario`,
  residentNames: {
    owner: 'Shashank Shirode',
    tenant: 'Amit Kulkarni',
    familyMember: 'Neha Shirode',
    authorizedOccupant: 'Riya Mehta',
    coOwner: 'Anita Shirode',
  },
  visitorPurpose: 'Approved residence visit',
  maintenanceCharge: 'Monthly maintenance',
  serviceCharge: 'Society service charge',
  billingNote: 'Context-scoped mock bill for resident testing',
  complaintLocation: (unitLabel: string) => `${unitLabel}, residence common area`,
  complaintSla: 'Resolution tracked under society service SLA',
  documentDescription: 'Context-scoped resident vault document',
  societyOffice: 'Society office',
  noticeAudience: 'Active residents',
  nocReason: 'Resident service request',
  nocTimelineSubmitted: 'Request submitted',
  nocTimelineReview: 'Society review',
  nocTimelineDescription: 'Status is tracked for the active residence only',
  validation: {
    configurationInvalid: 'Resident mock data configuration is invalid',
    contextMissing: 'Resident home scenario is missing',
    duplicateId: 'Resident mock record ID is duplicated',
    scopeMismatch: 'Resident mock record has an invalid residence scope',
    featureMissing: 'An enabled resident feature has no mock records',
    volumeBelowMinimum: 'Resident mock data is below the required feature volume',
    messageKeyMissing: 'Resident mock record message key is missing',
  },
} as const;

export default residentMockDataMessages;
