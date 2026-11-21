export type ListingCondition = 'NEW' | 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR';

export type ListingStatus = 'ACTIVE' | 'PENDING_MODERATION' | 'SOLD' | 'PAUSED' | 'EXPIRED' | 'REPORTED' | 'REMOVED';

export interface MarketplaceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string; 
  listingCount: number;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price?: number; 
  isGiveaway: boolean;
  condition: ListingCondition;
  categorySlug: string;
  imageUrl?: string;
  sellerId: string;
  sellerName: string;
  sellerUnit: string;
  status: ListingStatus;
  reportedCount: number;
  reportedReason?: string;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceListingReport {
  id: string;
  listingId: string;
  listingTitle: string;
  reportedById: string;
  reportedByName: string;
  reportedByUnit: string;
  reason: string;
  details?: string;
  status: 'PENDING' | 'DISMISSED' | 'ACTION_TAKEN';
  createdAt: string;
}
