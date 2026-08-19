export type LostFoundType = 'LOST' | 'FOUND';

export type LostFoundStatus = 'ACTIVE' | 'CLAIMED' | 'RESOLVED';

export interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  type: LostFoundType;
  category: 'ELECTRONICS' | 'KEYS' | 'WALLETS' | 'DOCUMENTS' | 'PETS' | 'OTHERS';
  location: string; 
  dateHappened: string; 
  reporterId: string;
  reporterName: string;
  reporterUnit: string;
  status: LostFoundStatus;
  imageUrl?: string;
  claimantId?: string;
  claimantName?: string;
  claimantUnit?: string;
  claimNote?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface LostFoundClaim {
  id: string;
  itemId: string;
  itemTitle: string;
  claimantId: string;
  claimantName: string;
  claimantUnit: string;
  description: string; 
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}
