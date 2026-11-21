export const contactRequestMessages = {
  title: 'Contact Request',
  subtitle: 'Introduce the topic before starting a chat',
  selectedResident: 'Selected resident',
  maskedResident: 'Private resident',
  residentAndFlat: (residentName: string, flatNumber: string) => `${residentName} · ${flatNumber}`,
  subject: {
    label: 'Subject',
    placeholder: 'What would you like to discuss?',
    required: 'Subject is required.',
    minimum: 'Subject must be at least 5 characters.',
    maximum: 'Subject cannot exceed 80 characters.',
  },
  message: {
    label: 'Message',
    placeholder: 'Add a short and respectful introduction',
    helper: 'Briefly explain why you would like to contact this resident.',
    charactersRemaining: (count: number) => `${count} characters remaining`,
    required: 'Message is required.',
    minimum: 'Message must be at least 10 characters.',
    maximum: 'Message cannot exceed 500 characters.',
  },
  topic: {
    label: 'Topic',
    neighbourCoordination: 'Neighbour Coordination',
    parking: 'Parking',
    maintenanceImpact: 'Maintenance Impact',
    communityActivity: 'Community Activity',
    misdeliveredItem: 'Lost or Misdelivered Item',
    other: 'Other',
  },
  privacy: {
    title: 'Your contact details stay private',
    description: 'Your phone number and email will not be shared. A private chat will be created only after the resident accepts.',
  },
  action: {
    send: 'Send Contact Request',
  },
  accessibility: {
    subjectInput: 'Contact request subject',
    messageInput: 'Contact request message',
    send: 'Send contact request',
  },
};
