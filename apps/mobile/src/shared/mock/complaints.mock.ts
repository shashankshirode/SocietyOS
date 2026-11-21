import { Complaint } from '../types/complaint.types';

function createMockComplaint(item: {
  id: string;
  title: string;
  description: string;
  category: any;
  status: any;
  priority: any;
  location: string;
  flatNumber: string;
  residentName: string;
  createdAt: string;
  updatedAt: string;
  slaText: string;
  assignedTo?: string;
  resolutionNote?: string;
  isPrivate?: boolean;
}): Complaint {
  const statusMap: Record<string, string> = {
    OPEN: 'CREATED',
    WAITING_FOR_RESIDENT: 'WAITING',
  };
  const priorityMap: Record<string, string> = {
    URGENT: 'CRITICAL',
  };
  const categoryMap: Record<string, string> = {
    WATER_LEAKAGE: 'PLUMBING',
    LIFT: 'ELEVATOR',
    PARKING: 'PARKING_ISSUE',
    HOUSEKEEPING: 'CLEANING',
  };

  const status = (statusMap[item.status] || item.status) as any;
  const priority = (priorityMap[item.priority] || item.priority) as any;
  const category = (categoryMap[item.category] || item.category) as any;

  return {
    id: item.id,
    ticketNumber: `CMP-${item.id.replace('comp-', '')}`,
    title: item.title,
    description: item.description,
    category,
    status,
    priority,
    visibility: 'PUBLIC',
    source: 'RESIDENT_APP',
    unitId: `unit-${item.flatNumber.toLowerCase()}`,
    unitNumber: item.flatNumber,
    societyId: 'soc-greenwood-pune',
    reportedByUserId: 'usr-shashank-01',
    reportedByDisplayName: item.residentName,
    reportedByRole: 'RESIDENT',
    isPrivate: item.isPrivate ?? false,
    isSensitive: false,
    escalationLevel: 'TECHNICIAN',
    slaIsPaused: false,
    isParentIncident: false,
    childComplaintIds: [],
    evidenceIds: [],
    comments: [],
    statusHistory: [],
    dataVersion: 1,
    location: item.location,
    flatNumber: item.flatNumber,
    residentName: item.residentName,
    slaText: item.slaText,
    ...(item.assignedTo ? { assignedTo: item.assignedTo } : {}),
    ...(item.resolutionNote ? { resolutionNote: item.resolutionNote } : {}),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export const mockComplaints: Complaint[] = [
  createMockComplaint({
    id: 'comp-1024',
    title: 'Water leakage in bathroom',
    description:
      'There is continuous water leakage from the ceiling of the bathroom. The plaster is getting damaged and water is dripping onto the floor. This needs urgent attention.',
    category: 'PLUMBING',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    location: 'A-1204, Bathroom',
    flatNumber: 'A-1204',
    residentName: 'Shashank',
    createdAt: '2026-10-02T10:15:00Z',
    updatedAt: '2026-10-02T14:45:00Z',
    slaText: 'Technician assigned — in progress',
  }),
  createMockComplaint({
    id: 'comp-001',
    title: 'Water leakage in master bathroom',
    description:
      'There is continuous water leakage from the ceiling of the master bathroom. The plaster is getting damaged and water is dripping onto the floor. This needs urgent attention as it is spreading to the bedroom wall.',
    category: 'WATER_LEAKAGE',
    status: 'OPEN',
    priority: 'HIGH',
    location: 'A-1204, Master Bathroom',
    flatNumber: 'A-1204',
    residentName: 'Shashank',
    createdAt: '2026-06-27T09:00:00Z',
    updatedAt: '2026-06-27T09:00:00Z',
    slaText: 'Resolution expected within 24 hours',
  }),
  createMockComplaint({
    id: 'comp-002',
    title: 'Lift not working in A Wing',
    description:
      'The passenger lift in A Wing has been out of service since yesterday evening. Senior citizens and families with children are facing difficulty. The lift displays an error code E-04 on the panel.',
    category: 'LIFT',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    location: 'A Wing, Ground Floor Lobby',
    flatNumber: 'A-1204',
    residentName: 'Shashank',
    createdAt: '2026-06-26T18:30:00Z',
    updatedAt: '2026-06-28T10:00:00Z',
    slaText: 'Technician assigned — ETA 2 hours',
    assignedTo: 'Sharma Elevators Pvt. Ltd.',
  }),
  createMockComplaint({
    id: 'comp-003',
    title: 'Parking slot blocked by unknown vehicle',
    description:
      'An unregistered white Hyundai Creta (MH-15-XX-9876) has been parked in my reserved slot B-24 since morning. Unable to park my own vehicle. Please take immediate action.',
    category: 'PARKING',
    status: 'WAITING_FOR_RESIDENT',
    priority: 'MEDIUM',
    location: 'Basement Parking, Slot B-24',
    flatNumber: 'A-1204',
    residentName: 'Shashank',
    createdAt: '2026-06-28T07:00:00Z',
    updatedAt: '2026-06-28T14:00:00Z',
    slaText: 'Awaiting vehicle owner identification',
  }),
  createMockComplaint({
    id: 'comp-004',
    title: 'Corridor lights not working on 12th floor',
    description:
      'All three corridor lights on the 12th floor of A Wing are not working. The corridor is completely dark after sunset which is a safety hazard, especially for senior citizens.',
    category: 'ELECTRICAL',
    status: 'RESOLVED',
    priority: 'LOW',
    location: 'A Wing, 12th Floor Corridor',
    flatNumber: 'A-1204',
    residentName: 'Shashank',
    createdAt: '2026-06-20T16:00:00Z',
    updatedAt: '2026-06-22T11:00:00Z',
    slaText: 'Resolved on 22 Jun',
    assignedTo: 'Building Maintenance Team',
    resolutionNote: 'All three LED panels replaced. Wiring checked and secured.',
  }),
  createMockComplaint({
    id: 'comp-005',
    title: 'Low water pressure on upper floors',
    description:
      'Water pressure has been very low on the 12th floor for the past three days. Morning hours are especially affected. The booster pump may need inspection or replacement.',
    category: 'PLUMBING',
    status: 'OPEN',
    priority: 'MEDIUM',
    location: 'A Wing, 12th Floor',
    flatNumber: 'A-1204',
    residentName: 'Shashank',
    createdAt: '2026-06-28T06:30:00Z',
    updatedAt: '2026-06-28T06:30:00Z',
    slaText: 'Resolution expected within 48 hours',
  }),
  createMockComplaint({
    id: 'comp-006',
    title: 'Intercom wiring repaired — confirmation required',
    description: 'The lobby intercom wiring was replaced and is awaiting resident confirmation.',
    category: 'ELECTRICAL',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    location: 'A-1204, Entrance',
    flatNumber: 'A-1204',
    residentName: 'Shashank',
    createdAt: '2026-06-18T10:00:00Z',
    updatedAt: '2026-06-19T13:00:00Z',
    slaText: 'Awaiting resident confirmation',
  }),
  createMockComplaint({
    id: 'comp-007',
    title: 'Closed housekeeping follow-up',
    description: 'The housekeeping follow-up was completed and confirmed by the resident.',
    category: 'HOUSEKEEPING',
    status: 'CLOSED',
    priority: 'LOW',
    location: 'A Wing, Floor 12',
    flatNumber: 'A-1204',
    residentName: 'Shashank',
    createdAt: '2026-06-15T08:00:00Z',
    updatedAt: '2026-06-16T09:00:00Z',
    slaText: 'Closed on 16 Jun',
  }),
  createMockComplaint({
    id: 'comp-008',
    title: 'Reopened water pressure issue',
    description: 'Water pressure dropped again after the earlier repair and requires another inspection.',
    category: 'PLUMBING',
    status: 'REOPENED',
    priority: 'HIGH',
    location: 'A-1204, Kitchen',
    flatNumber: 'A-1204',
    residentName: 'Shashank',
    createdAt: '2026-06-14T06:00:00Z',
    updatedAt: '2026-06-17T06:30:00Z',
    slaText: 'Reopened — response overdue by 3 hours',
  }),
  createMockComplaint({
    id: 'comp-009',
    title: 'Private security access concern',
    description: 'A private access-control concern was submitted for management review.',
    category: 'SECURITY',
    status: 'OPEN',
    priority: 'URGENT',
    location: 'A Wing, Entrance',
    flatNumber: 'A-1204',
    residentName: 'Shashank',
    createdAt: '2026-06-13T21:00:00Z',
    updatedAt: '2026-06-13T21:00:00Z',
    slaText: 'SLA overdue by 2 hours',
    isPrivate: true,
  }),
];
