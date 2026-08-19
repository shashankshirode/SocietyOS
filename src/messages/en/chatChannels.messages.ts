export const chatChannelsMessages = {
  channel: {
    securityGate: {
      title: 'Security Gate',
      description: 'Visitor, delivery and live gate communication',
      historyMode: 'Individual interaction access',
    },
    securityDesk: {
      title: 'Security Desk',
      description: 'Security assistance, incidents and lost-and-found',
      historyMode: 'Shared Security Desk history',
    },
    accounts: {
      title: 'Accounts',
      description: 'Billing, receipts and payment support',
      historyMode: 'Shared Accounts history',
    },
    facilityHelpdesk: {
      title: 'Facility Helpdesk',
      description: 'Repairs, amenities and maintenance support',
      historyMode: 'Shared Facility Helpdesk history',
    },
    societyOffice: {
      title: 'Society Office',
      description: 'Documents, governance and society administration',
      historyMode: 'Shared Society Office history',
    },
  },
  status: {
    pending: 'Pending', active: 'Active', inactive: 'Inactive', suspended: 'Suspended', expired: 'Expired',
  },
} as const;
