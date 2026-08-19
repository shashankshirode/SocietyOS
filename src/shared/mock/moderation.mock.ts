import type { ModerationReport } from '../types/privacy.types';

export const mockModerationReports: ModerationReport[] = [
  {
    id: 'rep-001',
    targetType: 'MESSAGE',
    targetId: 'msg-009-4',
    reportedBy: 'Shashank Shirode',
    reportedFlat: 'A-1204',
    category: 'SPAM',
    description: 'Received repeated promotional links selling private insurance items in personal messaging.',
    status: 'SUBMITTED',
    createdAt: '2026-06-25T14:20:00Z',
    messageContext: 'Click here to secure your home package deal today at low premium rates!',
  },
  {
    id: 'rep-002',
    targetType: 'CONTACT_REQUEST',
    targetId: 'req-inc-002',
    reportedBy: 'Shashank Shirode',
    reportedFlat: 'A-1204',
    category: 'ABUSIVE_LANGUAGE',
    description: 'Inappropriate language used in water leakage notification request.',
    status: 'UNDER_REVIEW',
    createdAt: '2026-06-28T09:30:00Z',
    messageContext: 'Your leaking flat is ruining my ceiling, fix it immediately or face severe consequences you idiot.',
  },
];
