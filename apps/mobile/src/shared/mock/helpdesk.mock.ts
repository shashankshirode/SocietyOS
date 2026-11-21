import { FaqItem } from '../types/helpdesk.types';

export const mockFaqItems: FaqItem[] = [
  {
    id: 'faq-001',
    question: 'How do I create a visitor pass?',
    answer: 'Go to the Visitors tab and tap "Add". Fill in your visitor\'s name, phone number, expected date and time. A QR code and OTP will be generated that you can share with your visitor for gate entry.',
    category: 'Visitors',
  },
  {
    id: 'faq-002',
    question: 'How do I pay my maintenance bill?',
    answer: 'Online payment integration is coming soon. Currently, you can view your pending bills in the Bills tab. Please pay at the society office or through your bank using the society\'s account details.',
    category: 'Bills',
  },
  {
    id: 'faq-003',
    question: 'How long does it take to resolve a complaint?',
    answer: 'Resolution time depends on the priority and category. Urgent issues are addressed within 4 hours, High priority within 24 hours, Medium within 48 hours, and Low priority within 1 week.',
    category: 'Complaints',
  },
  {
    id: 'faq-004',
    question: 'Can I add a tenant to my flat?',
    answer: 'Tenant management will be available in the next update. For now, please contact the society admin to register a new tenant with proper documentation.',
    category: 'General',
  },
  {
    id: 'faq-005',
    question: 'How do I contact society security?',
    answer: 'Use the Emergency screen from the Home tab to access security contact numbers. For immediate emergencies, use the SOS alert button to notify the security team instantly.',
    category: 'Emergency',
  },
  {
    id: 'faq-006',
    question: 'How do I update my contact details?',
    answer: 'Profile editing will be available in the next update. Please contact the society admin to update your registered phone number or email address.',
    category: 'General',
  },
];
