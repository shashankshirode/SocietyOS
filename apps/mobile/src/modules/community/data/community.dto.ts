import { ListingCondition, ListingStatus } from '../../../shared/types/marketplace.types';
import { LostFoundType } from '../../../shared/types/lostFound.types';


export interface CreateListingDTO {
  title: string;
  description: string;
  price?: number;
  isGiveaway: boolean;
  condition: ListingCondition;
  categorySlug: string;
  imageUrl?: string;
}

export interface UpdateListingDTO {
  title?: string;
  description?: string;
  price?: number;
  isGiveaway?: boolean;
  condition?: ListingCondition;
  categorySlug?: string;
  imageUrl?: string;
  status?: ListingStatus;
}


export interface CreateSkillProfileDTO {
  title: string;
  description: string;
  skills: string[];
  categorySlug: string;
  experienceYears?: number;
  availabilityHours?: string;
}

export interface CreateServiceRequestDTO {
  title: string;
  description: string;
  categorySlug: string;
  budget?: string;
  timing?: string;
}


export interface CreateBorrowableItemDTO {
  title: string;
  description: string;
  category: 'TOOLS' | 'BOOKS' | 'APPLIANCES' | 'SPORTS' | 'TOYS' | 'OTHERS';
  maxDurationDays: number;
  depositRequired: boolean;
  depositDetails?: string;
  imageUrl?: string;
}

export interface CreateBorrowRequestDTO {
  itemId: string;
  durationDays: number;
  purpose: string;
}

export interface DecideBorrowRequestDTO {
  status: 'APPROVED' | 'REJECTED';
  decisionNote?: string;
}


export interface CreateLostFoundDTO {
  title: string;
  description: string;
  type: LostFoundType;
  category: 'ELECTRONICS' | 'KEYS' | 'WALLETS' | 'DOCUMENTS' | 'PETS' | 'OTHERS';
  location: string;
  dateHappened: string;
  imageUrl?: string;
}


export interface CreateCommunityContactRequestDTO {
  type: 'MARKETPLACE' | 'SKILL' | 'BORROW' | 'LOST_FOUND';
  targetId: string;
  targetTitle: string;
  receiverId: string;
  receiverName: string;
  receiverUnit: string;
  message: string;
  urgency?: 'NORMAL' | 'IMPORTANT' | 'URGENT';
}
