import type { ResidentPrivacySettings, BlockedResidentInfo } from '../types/privacy.types';

export const mockPrivacySettings: ResidentPrivacySettings = {
  showFlatNumber: true,
  showDisplayName: true,
  allowFirstContact: true,
  sameTowerOnly: false,
  allowCommitteeContact: true,
};

export const mockBlockedResidents: BlockedResidentInfo[] = [
  {
    id: 'block-001',
    blockedResidentId: 'resident-009',
    blockedResidentName: 'Sneha Kulkarni',
    blockedFlat: 'A-903',
    blockedDate: '2026-06-25',
    reason: 'Spamming about personal garage sale items.',
  },
];
