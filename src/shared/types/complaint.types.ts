import type { JsonObject } from '../../core/api/api.types';
import type {
  Complaint as ComplaintPhase6,
  ComplaintCategory,
  ComplaintPriority,
} from './complaintPhase6';

export type {
  ComplaintCategory,
  ComplaintSubcategory,
  ComplaintPriority,
  ComplaintVisibility,
  ComplaintSource,
  ComplaintStatus,
} from './complaintPhase6';

export type Complaint = ComplaintPhase6;

export interface CreateComplaintPayload extends JsonObject {
  category: ComplaintCategory;
  title: string;
  description: string;
  priority: ComplaintPriority;
  location: string;
  isPrivate?: boolean;
}
