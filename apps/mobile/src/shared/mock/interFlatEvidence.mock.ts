import type { Evidence } from '../types/interFlat.types';

export const mockInterFlatEvidence: Evidence[] = [
  {
    id: 'ev-001',
    evidenceType: 'PHOTO',
    fileName: 'ceiling_dampness.jpg',
    fileSizePlaceholder: '2.4 MB',
    uploadedByUserName: 'Shashank',
    uploadedAt: '2026-06-25T10:00:00Z',
    note: 'Damp spot spreading on bathroom ceiling'
  },
  {
    id: 'ev-002',
    evidenceType: 'AUDIO_NOTE',
    fileName: 'night_noise_recording.mp3',
    fileSizePlaceholder: '1.2 MB',
    uploadedByUserName: 'Karan Malhotra',
    uploadedAt: '2026-06-26T23:15:00Z',
    note: 'Recorded at 11:30 PM in the bedroom'
  },
  {
    id: 'ev-003',
    evidenceType: 'PHOTO',
    fileName: 'lobby_scraped_wall.jpg',
    fileSizePlaceholder: '3.1 MB',
    uploadedByUserName: 'Anil Kulkarni',
    uploadedAt: '2026-06-20T15:00:00Z',
    note: 'Wall damage right next to lift B-2'
  },
  {
    id: 'ev-004',
    evidenceType: 'DOCUMENT',
    fileName: 'plumbing_layout_A_wing.pdf',
    fileSizePlaceholder: '4.8 MB',
    uploadedByUserName: 'Suresh Patil',
    uploadedAt: '2026-06-28T16:00:00Z',
    note: 'Plumbing shaft schematic drawing'
  },
  {
    id: 'ev-005',
    evidenceType: 'DAMAGE_ESTIMATE',
    fileName: 'painter_quote_lobby.pdf',
    fileSizePlaceholder: '350 KB',
    uploadedByUserName: 'Suresh Patil',
    uploadedAt: '2026-06-22T11:00:00Z',
    note: 'Repair quotation for elevator lobby wall scraping'
  }
];

for (let i = 6; i <= 15; i++) {
  mockInterFlatEvidence.push({
    id: `ev-0${i}`,
    evidenceType: i % 2 === 0 ? 'PHOTO' : 'VIDEO',
    fileName: `mock_evidence_attachment_0${i}.${i % 2 === 0 ? 'png' : 'mp4'}`,
    fileSizePlaceholder: `${1.5 * (i % 3 + 1)} MB`,
    uploadedByUserName: 'System Admin',
    uploadedAt: `2026-06-${12 + i % 10}T10:00:00Z`,
    note: `Automated mock evidence attachment ${i}`
  });
}
