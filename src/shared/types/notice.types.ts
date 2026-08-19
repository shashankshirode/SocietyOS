import type { ResidentScopedEntity } from './residentScope.types';



export type NoticeCategory =
  | 'GENERAL'
  | 'MAINTENANCE'
  | 'WATER_SUPPLY'
  | 'AGM_MEETING'
  | 'FIRE_SAFETY'
  | 'BILLING'
  | 'PARKING'
  | 'FESTIVAL_EVENT'
  | 'EMERGENCY';

export type NoticePriority = 'LOW' | 'NORMAL' | 'IMPORTANT' | 'URGENT';

export type NoticeStatus = 'UNREAD' | 'READ' | 'PINNED' | 'EXPIRED';

export interface NoticeAttachment {
  name: string;
  type: string;
  size: string;
}

export interface Notice extends ResidentScopedEntity {
  id: string;
  title: string;
  body: string;
  category: NoticeCategory;
  date: string;
  postedBy: string;
  isImportant: boolean;
  priority: NoticePriority;
  status: NoticeStatus;
  societyName: string;
  targetAudience?: string;
  attachment?: NoticeAttachment;
  acknowledgementRequired?: boolean;
  acknowledged?: boolean;
  acknowledgedResidents?: string[];
}
