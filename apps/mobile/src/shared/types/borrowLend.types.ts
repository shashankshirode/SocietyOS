export type BorrowItemStatus = 'AVAILABLE' | 'BORROWED' | 'MAINTENANCE' | 'INACTIVE';

export type BorrowRequestStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'RETURNED' | 'OVERDUE';

export interface BorrowableItem {
  id: string;
  title: string;
  description: string;
  category: 'TOOLS' | 'BOOKS' | 'APPLIANCES' | 'SPORTS' | 'TOYS' | 'OTHERS';
  ownerId: string;
  ownerName: string;
  ownerUnit: string;
  status: BorrowItemStatus;
  maxDurationDays: number;
  depositRequired: boolean;
  depositDetails?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface BorrowRequest {
  id: string;
  itemId: string;
  itemTitle: string;
  itemCategory: string;
  ownerId: string;
  ownerName: string;
  ownerUnit: string;
  borrowerId: string;
  borrowerName: string;
  borrowerUnit: string;
  durationDays: number;
  purpose: string;
  status: BorrowRequestStatus;
  requestNote?: string;
  decisionNote?: string;
  borrowedAt?: string;
  dueDate?: string;
  returnedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BorrowHistoryEntry {
  id: string;
  itemId: string;
  itemTitle: string;
  ownerName: string;
  ownerUnit: string;
  borrowerName: string;
  borrowerUnit: string;
  borrowedAt: string;
  returnedAt: string;
  rating?: number;
  review?: string;
}
