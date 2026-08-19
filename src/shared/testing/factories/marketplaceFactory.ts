import type { MarketplaceCategory, MarketplaceListing } from '../../types/marketplace.types';

export function createMarketplaceCategory(overrides: Partial<MarketplaceCategory> = {}): MarketplaceCategory {
  return {
    id: 'cat-001',
    name: 'Electronics',
    slug: 'electronics',
    icon: 'laptop-outline',
    listingCount: 15,
    ...overrides,
  };
}

export function createMarketplaceListing(overrides: Partial<MarketplaceListing> = {}): MarketplaceListing {
  return {
    id: 'lst-001',
    title: 'Pre-owned Washing Machine',
    description: 'Bosch 7kg Front Loading Washing machine in excellent condition. 2 years old, selling due to relocation.',
    price: 15000,
    isGiveaway: false,
    condition: 'EXCELLENT',
    categorySlug: 'electronics',
    sellerId: 'res-dir-002',
    sellerName: 'Priya Sharma',
    sellerUnit: 'B-302',
    status: 'ACTIVE',
    reportedCount: 0,
    viewsCount: 45,
    createdAt: '2026-07-06T10:00:00Z',
    updatedAt: '2026-07-06T10:00:00Z',
    ...overrides,
  };
}
