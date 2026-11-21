export const departmentChatMessages = {
  inbox: { title: 'Department Messages', subtitle: 'Shared resident conversations for your assigned channels' },
  sharedHistory: 'Shared department history',
  senderIdentityNotice: 'Replies use your authenticated staff identity and preserve it in message history.',
  empty: { title: 'No department conversations', description: 'Resident conversations for this channel will appear here.' },
  loading: 'Loading department conversations…',
  actions: {
    accountsTitle: 'Accounts Messages',
    accountsDescription: 'Open shared Accounts resident conversations.',
    facilityTitle: 'Helpdesk Messages',
    facilityDescription: 'Open shared Facility Helpdesk resident conversations.',
    officeTitle: 'Society Office Messages',
    officeDescription: 'Open shared Society Office resident conversations.',
  },
} as const;
