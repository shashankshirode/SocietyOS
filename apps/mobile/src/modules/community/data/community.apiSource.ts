import { apiEndpoints } from '../../../core/api/apiEndpoints';
import { MarketplaceListing, MarketplaceCategory } from '../../../shared/types/marketplace.types';
import { SkillProfile, ResidentService, ServiceRequest } from '../../../shared/types/skillDirectory.types';
import { BorrowableItem, BorrowRequest } from '../../../shared/types/borrowLend.types';
import { LostFoundItem } from '../../../shared/types/lostFound.types';
import { CommunityDashboard, CommunityContactRequest, CommunityAuditLog, CommunitySettings } from '../../../shared/types/community.types';
import {
  CreateListingDTO,
  UpdateListingDTO,
  CreateSkillProfileDTO,
  CreateServiceRequestDTO,
  CreateBorrowableItemDTO,
  CreateBorrowRequestDTO,
  DecideBorrowRequestDTO,
  CreateLostFoundDTO,
  CreateCommunityContactRequestDTO
} from './community.dto';


const mockFetch = async (url: string, options?: JsonValue) => {
  throw new Error('API integration not yet implemented. Set feature flags to mock mode.');
};

export class CommunityApiSource {
  static async getDashboard(): Promise<CommunityDashboard> {
    return mockFetch(apiEndpoints.community.dashboard);
  }

  static async getListings(category?: string, query?: string): Promise<MarketplaceListing[]> {
    let url = apiEndpoints.community.listings;
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('query', query);
    if (params.toString()) url += `?${params.toString()}`;
    return mockFetch(url);
  }

  static async getMyListings(): Promise<MarketplaceListing[]> {
    return mockFetch(apiEndpoints.community.myListings);
  }

  static async getListing(id: string): Promise<MarketplaceListing> {
    return mockFetch(apiEndpoints.community.listingDetail(id));
  }

  static async createListing(dto: CreateListingDTO): Promise<MarketplaceListing> {
    return mockFetch(apiEndpoints.community.createListing, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  static async updateListing(id: string, dto: UpdateListingDTO): Promise<MarketplaceListing> {
    return mockFetch(apiEndpoints.community.updateListing(id), {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  }

  static async reportListing(id: string, reason: string): Promise<MarketplaceListing> {
    return mockFetch(apiEndpoints.community.reportListing(id), {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  static async getCategories(): Promise<MarketplaceCategory[]> {
    return mockFetch('/community/marketplace/categories');
  }

  static async getSkillProfiles(category?: string, query?: string): Promise<SkillProfile[]> {
    let url = apiEndpoints.community.skills;
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('query', query);
    if (params.toString()) url += `?${params.toString()}`;
    return mockFetch(url);
  }

  static async getSkillProfile(id: string): Promise<SkillProfile> {
    return mockFetch(apiEndpoints.community.skillDetail(id));
  }

  static async createSkillProfile(dto: CreateSkillProfileDTO): Promise<SkillProfile> {
    return mockFetch(apiEndpoints.community.createSkillProfile, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  static async updateSkillProfile(active: boolean): Promise<SkillProfile> {
    return mockFetch(apiEndpoints.community.updateSkillProfile, {
      method: 'PUT',
      body: JSON.stringify({ active }),
    });
  }

  static async getServices(): Promise<ResidentService[]> {
    return mockFetch(apiEndpoints.community.services);
  }

  static async getServiceRequests(category?: string): Promise<ServiceRequest[]> {
    let url = apiEndpoints.community.serviceRequests;
    if (category) url += `?category=${category}`;
    return mockFetch(url);
  }

  static async getServiceRequest(id: string): Promise<ServiceRequest> {
    return mockFetch(apiEndpoints.community.serviceRequestDetail(id));
  }

  static async createServiceRequest(dto: CreateServiceRequestDTO): Promise<ServiceRequest> {
    return mockFetch(apiEndpoints.community.createServiceRequest, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  static async createContactRequest(dto: CreateCommunityContactRequestDTO): Promise<CommunityContactRequest> {
    return mockFetch(apiEndpoints.community.contactRequest, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  static async getBorrowableItems(category?: string, query?: string): Promise<BorrowableItem[]> {
    let url = apiEndpoints.community.borrowableItems;
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('query', query);
    if (params.toString()) url += `?${params.toString()}`;
    return mockFetch(url);
  }

  static async getMyBorrowableItems(): Promise<BorrowableItem[]> {
    return mockFetch(apiEndpoints.community.myBorrowableItems);
  }

  static async getBorrowableItem(id: string): Promise<BorrowableItem> {
    return mockFetch(apiEndpoints.community.borrowableItemDetail(id));
  }

  static async createBorrowableItem(dto: CreateBorrowableItemDTO): Promise<BorrowableItem> {
    return mockFetch(apiEndpoints.community.createBorrowableItem, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  static async getBorrowRequests(type?: 'incoming' | 'outgoing'): Promise<BorrowRequest[]> {
    let url = apiEndpoints.community.borrowRequests;
    if (type) url += `?type=${type}`;
    return mockFetch(url);
  }

  static async getBorrowRequest(id: string): Promise<BorrowRequest> {
    return mockFetch(apiEndpoints.community.borrowRequestDetail(id));
  }

  static async createBorrowRequest(dto: CreateBorrowRequestDTO): Promise<BorrowRequest> {
    return mockFetch(apiEndpoints.community.createBorrowRequest, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  static async decideBorrowRequest(id: string, dto: DecideBorrowRequestDTO): Promise<BorrowRequest> {
    return mockFetch(apiEndpoints.community.decideBorrowRequest(id), {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  static async confirmReturn(id: string): Promise<BorrowRequest> {
    return mockFetch(apiEndpoints.community.confirmReturn(id), {
      method: 'POST',
    });
  }

  static async getLostFoundItems(type?: 'LOST' | 'FOUND', category?: string): Promise<LostFoundItem[]> {
    let url = apiEndpoints.community.lostFound;
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (category) params.append('category', category);
    if (params.toString()) url += `?${params.toString()}`;
    return mockFetch(url);
  }

  static async getLostFoundItem(id: string): Promise<LostFoundItem> {
    return mockFetch(apiEndpoints.community.lostFoundDetail(id));
  }

  static async createLostFound(dto: CreateLostFoundDTO): Promise<LostFoundItem> {
    return mockFetch(apiEndpoints.community.createLostFound, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  static async claimLostFound(id: string, note: string): Promise<LostFoundItem> {
    return mockFetch(apiEndpoints.community.claimLostFound(id), {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  }

  static async getModerationQueue(): Promise<MarketplaceListing[]> {
    return mockFetch(apiEndpoints.community.moderationQueue);
  }

  static async moderateListing(id: string, action: 'APPROVE' | 'REMOVE'): Promise<MarketplaceListing> {
    return mockFetch(apiEndpoints.community.moderateListing(id), {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  }

  static async getAuditLogs(): Promise<CommunityAuditLog[]> {
    return mockFetch(apiEndpoints.community.auditLogs);
  }

  static async getSettings(): Promise<CommunitySettings> {
    return mockFetch(apiEndpoints.community.settings);
  }

  static async updateSettings(dto: Partial<CommunitySettings>): Promise<CommunitySettings> {
    return mockFetch(apiEndpoints.community.updateSettings, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  }
}
