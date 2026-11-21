import type { LegalNotice } from '../types/complianceCalendar.types';

export const mockLegalNoticesList: LegalNotice[] = [
  {
    id: 'notice-001',
    noticeNumber: 'GVH-LEGAL-2026-001',
    title: 'Municipal Notice — Water Meter Inaccuracy',
    source: 'Nashik Municipal Corporation (NMC)',
    receivedDate: '2026-06-15',
    responseDueDate: '2026-07-05',
    responsiblePerson: 'Sunil Patil (Secretary)',
    status: 'UNDER_REVIEW',
    priority: 'HIGH',
    summary: 'Official notice claiming common borewell extraction limits exceeded by 10% and discrepancy in water supply meter logs.',
    timeline: [
      { stage: 'Notice Received', date: '2026-06-15', actor: 'Gate Security' },
      { stage: 'Consulted Society Advocate', date: '2026-06-20', actor: 'Sunil Patil', details: 'Forwarded to Advocate K. Joshi for drafting response.' },
    ],
  },
  {
    id: 'notice-002',
    noticeNumber: 'GVH-LEGAL-2026-002',
    title: 'Property Tax Discrepancy Assessment',
    source: 'Property Tax Department, NMC',
    receivedDate: '2026-05-12',
    responseDueDate: '2026-06-20',
    responsiblePerson: 'Amit Joshi (Treasurer)',
    status: 'RESPONSE_SENT',
    priority: 'HIGH',
    summary: 'Demand notice for property tax assessment adjustments of Tower B commercial common rooms from 2024-25.',
    timeline: [
      { stage: 'Received Notice', date: '2026-05-12', actor: 'Treasurer' },
      { stage: 'Response Drafted & Approved', date: '2026-06-10', actor: 'Committee' },
      { stage: 'Official Response Dispatched', date: '2026-06-15', actor: 'Amit Joshi', details: 'Response sent via speed post with tax deposit receipts.' },
    ],
  },
];


for (let i = 1; i <= 4; i++) {
  mockLegalNoticesList.push({
    id: `notice-dummy-0${i}`,
    noticeNumber: `GVH-LEGAL-2026-0${i + 2}`,
    title: `Administrative Notice Mandate ${i}`,
    source: 'Sub-Registrar Cooperative Societies',
    receivedDate: `2026-0${i}-10`,
    responseDueDate: `2026-0${i + 1}-10`,
    responsiblePerson: 'Sunil Patil (Secretary)',
    status: 'CLOSED',
    priority: 'LOW',
    summary: `Statutory guidelines check notice from cooperative registrar authority relating to compliance checklist ${i}.`,
    timeline: [
      { stage: 'Received Notice', date: `2026-0${i}-10`, actor: 'Secretary' },
      { stage: 'Notice Closed', date: `2026-0${i}-25`, actor: 'Secretary', details: 'Necessary documents filed.' },
    ],
  });
}
