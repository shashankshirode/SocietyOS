export const guardChatMessages = {
  inbox: { title: 'Resident Messages', subtitle: 'Your assigned Security Gate conversations' },
  conversation: { assignedResident: 'Assigned resident conversation', gateContext: 'Gate assignment' },
  empty: { title: 'No assigned conversations', description: 'Resident replies assigned to your shift will appear here.' },
  identityNotice: 'Messages are sent using your authenticated guard identity.',
  loading: 'Loading assigned conversations…',
} as const;
