import type { PostIncidentReview } from '../types/safety.types';

export const mockPostIncidentReviews: PostIncidentReview[] = [
  {
    id: 'rev-001',
    incidentId: 'inc-005',
    incidentNumber: 'EMR-2026-005',
    emergencyType: 'SOS',
    reviewOwnerName: 'Suresh Patil',
    whatHappened: 'SOS button triggered from Flat A-0302. Guards reached within 3 minutes and confirmed it was a false alarm by a child playing with the phone.',
    responseTimeMinutes: 3,
    whatWorkedWell: 'Alert broadcast to guard console was immediate. Guards responded quickly.',
    whatFailed: 'No phone confirmation was done before running to the flat.',
    followUpActions: 'Educate residents on locking the app or explaining the SOS button to children.',
    responsiblePerson: 'A Wing Committee Representative',
    dueDate: '2026-07-15',
    status: 'COMPLETED',
    createdAt: '2026-06-27T10:00:00Z',
  },
  {
    id: 'rev-002',
    incidentId: 'inc-006',
    incidentNumber: 'EMR-2026-006',
    emergencyType: 'ACCIDENT',
    reviewOwnerName: 'Suresh Patil',
    whatHappened: 'A child fell from the swing and sustained a minor fracture. First-aid volunteer doctor attended.',
    responseTimeMinutes: 5,
    whatWorkedWell: 'Volunteer doctor arrived within 5 minutes and immobilized the arm.',
    whatFailed: 'Playground swing chains were worn out and snapped.',
    followUpActions: 'Inspect and replace all playground swing chains and S-hooks.',
    responsiblePerson: 'Estate Manager',
    dueDate: '2026-07-05',
    status: 'ACTION_REQUIRED',
    createdAt: '2026-06-26T19:00:00Z',
  }
];
export type { PostIncidentReview };
