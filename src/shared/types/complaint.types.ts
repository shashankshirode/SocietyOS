import type { ResidentScopedEntity } from './residentScope.types';



export type ComplaintCategory =
  | 'PLUMBING'
  | 'LIFT'
  | 'SECURITY'
  | 'HOUSEKEEPING'
  | 'PARKING'
  | 'NOISE'
  | 'WATER_LEAKAGE'
  | 'ELECTRICAL'
  | 'OTHER';

export type ComplaintStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_RESIDENT'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REOPENED';

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Complaint extends ResidentScopedEntity {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  location: string;
  flatNumber: string;
  residentName: string;
  createdAt: string;
  updatedAt: string;
  slaText: string;
  assignedTo?: string;
  resolutionNote?: string;
  updates?: { id: string; status: string; note: string; timestamp: string }[];
  feedbackRating?: number;
  feedbackComment?: string;
  technicianName?: string;
  technicianContact?: string;
  isPrivate?: boolean;
  raisedBy?: string;
  reportedByUserId?: string;
  reportedByDisplayName?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface CreateComplaintPayload extends JsonObject {
  category: ComplaintCategory;
  title: string;
  description: string;
  priority: ComplaintPriority;
  location: string;
  isPrivate?: boolean;
}
