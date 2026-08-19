import type { Notice } from '../../types/notice.types';

export function createNotice(overrides: Partial<Notice> = {}): Notice {
  return {
    id: 'notice-001',
    title: 'Annual General Meeting (AGM) Scheduled',
    body: 'The Annual General Meeting of the society is scheduled on 15 July 2026. All members are requested to attend. Agenda is attached.',
    category: 'AGM_MEETING',
    date: '2026-07-08',
    postedBy: 'Society Management Committee',
    isImportant: true,
    priority: 'IMPORTANT',
    status: 'UNREAD',
    societyName: 'Green Valley Heights Phase 2 Cooperative Housing Society',
    targetAudience: 'All Residents',
    acknowledgementRequired: true,
    acknowledged: false,
    ...overrides,
  };
}
