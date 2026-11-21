import { CommunityMockSource } from './community.mockSource';
import { CommunityApiSource } from './community.apiSource';
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
import { resolveDataSource } from '../../../core/dataSource/dataSourceResolver';

const USE_MOCKS = resolveDataSource('residentMarketplace').isMock;

export class CommunityRepository {
  static async getDashboard(): Promise<CommunityDashboard> {
    return USE_MOCKS ? CommunityMockSource.getDashboard() : CommunityApiSource.getDashboard();
  }

  
  static async getListings(category?: string, query?: string): Promise<MarketplaceListing[]> {
    return USE_MOCKS ? CommunityMockSource.getListings(category, query) : CommunityApiSource.getListings(category, query);
  }

  static async getMyListings(userId: string): Promise<MarketplaceListing[]> {
    return USE_MOCKS ? CommunityMockSource.getMyListings(userId) : CommunityApiSource.getMyListings();
  }

  static async getListing(id: string): Promise<MarketplaceListing | null> {
    return USE_MOCKS ? CommunityMockSource.getListing(id) : CommunityApiSource.getListing(id);
  }

  static async createListing(userId: string, userName: string, userUnit: string, dto: CreateListingDTO): Promise<MarketplaceListing> {
    return USE_MOCKS
      ? CommunityMockSource.createListing(userId, userName, userUnit, dto)
      : CommunityApiSource.createListing(dto);
  }

  static async updateListing(id: string, dto: UpdateListingDTO, userName: string, userUnit: string): Promise<MarketplaceListing> {
    return USE_MOCKS
      ? CommunityMockSource.updateListing(id, dto, userName, userUnit)
      : CommunityApiSource.updateListing(id, dto);
  }

  static async reportListing(id: string, reason: string, userName: string, userUnit: string): Promise<MarketplaceListing> {
    return USE_MOCKS
      ? CommunityMockSource.reportListing(id, reason, userName, userUnit)
      : CommunityApiSource.reportListing(id, reason);
  }

  static async getCategories(): Promise<MarketplaceCategory[]> {
    return USE_MOCKS ? CommunityMockSource.getCategories() : CommunityApiSource.getCategories();
  }

  
  static async getSkillProfiles(category?: string, query?: string): Promise<SkillProfile[]> {
    return USE_MOCKS
      ? CommunityMockSource.getSkillProfiles(category, query)
      : CommunityApiSource.getSkillProfiles(category, query);
  }

  static async getSkillProfile(id: string): Promise<SkillProfile | null> {
    return USE_MOCKS ? CommunityMockSource.getSkillProfile(id) : CommunityApiSource.getSkillProfile(id);
  }

  static async createSkillProfile(userId: string, userName: string, userUnit: string, dto: CreateSkillProfileDTO): Promise<SkillProfile> {
    return USE_MOCKS
      ? CommunityMockSource.createSkillProfile(userId, userName, userUnit, dto)
      : CommunityApiSource.createSkillProfile(dto);
  }

  static async updateSkillProfile(userId: string, active: boolean, userName: string, userUnit: string): Promise<SkillProfile | null> {
    return USE_MOCKS
      ? CommunityMockSource.updateSkillProfile(userId, active, userName, userUnit)
      : CommunityApiSource.updateSkillProfile(active);
  }

  static async getServices(): Promise<ResidentService[]> {
    return USE_MOCKS ? CommunityMockSource.getServices() : CommunityApiSource.getServices();
  }

  static async getServiceRequests(category?: string): Promise<ServiceRequest[]> {
    return USE_MOCKS ? CommunityMockSource.getServiceRequests(category) : CommunityApiSource.getServiceRequests(category);
  }

  static async getServiceRequest(id: string): Promise<ServiceRequest | null> {
    return USE_MOCKS ? CommunityMockSource.getServiceRequest(id) : CommunityApiSource.getServiceRequest(id);
  }

  static async createServiceRequest(userId: string, userName: string, userUnit: string, dto: CreateServiceRequestDTO): Promise<ServiceRequest> {
    return USE_MOCKS
      ? CommunityMockSource.createServiceRequest(userId, userName, userUnit, dto)
      : CommunityApiSource.createServiceRequest(dto);
  }

  static async createContactRequest(userId: string, userName: string, userUnit: string, dto: CreateCommunityContactRequestDTO): Promise<CommunityContactRequest> {
    return USE_MOCKS
      ? CommunityMockSource.createContactRequest(userId, userName, userUnit, dto)
      : CommunityApiSource.createContactRequest(dto);
  }

  
  static async getBorrowableItems(category?: string, query?: string): Promise<BorrowableItem[]> {
    return USE_MOCKS
      ? CommunityMockSource.getBorrowableItems(category, query)
      : CommunityApiSource.getBorrowableItems(category, query);
  }

  static async getMyBorrowableItems(userId: string): Promise<BorrowableItem[]> {
    return USE_MOCKS ? CommunityMockSource.getMyBorrowableItems(userId) : CommunityApiSource.getMyBorrowableItems();
  }

  static async getBorrowableItem(id: string): Promise<BorrowableItem | null> {
    return USE_MOCKS ? CommunityMockSource.getBorrowableItem(id) : CommunityApiSource.getBorrowableItem(id);
  }

  static async createBorrowableItem(userId: string, userName: string, userUnit: string, dto: CreateBorrowableItemDTO): Promise<BorrowableItem> {
    return USE_MOCKS
      ? CommunityMockSource.createBorrowableItem(userId, userName, userUnit, dto)
      : CommunityApiSource.createBorrowableItem(dto);
  }

  static async getBorrowRequests(userId?: string, type?: 'incoming' | 'outgoing'): Promise<BorrowRequest[]> {
    return USE_MOCKS
      ? CommunityMockSource.getBorrowRequests(userId, type)
      : CommunityApiSource.getBorrowRequests(type);
  }

  static async getBorrowRequest(id: string): Promise<BorrowRequest | null> {
    return USE_MOCKS ? CommunityMockSource.getBorrowRequest(id) : CommunityApiSource.getBorrowRequest(id);
  }

  static async createBorrowRequest(userId: string, userName: string, userUnit: string, dto: CreateBorrowRequestDTO): Promise<BorrowRequest> {
    return USE_MOCKS
      ? CommunityMockSource.createBorrowRequest(userId, userName, userUnit, dto)
      : CommunityApiSource.createBorrowRequest(dto);
  }

  static async decideBorrowRequest(id: string, dto: DecideBorrowRequestDTO, userName: string, userUnit: string): Promise<BorrowRequest> {
    return USE_MOCKS
      ? CommunityMockSource.decideBorrowRequest(id, dto, userName, userUnit)
      : CommunityApiSource.decideBorrowRequest(id, dto);
  }

  static async confirmReturn(id: string, userName: string, userUnit: string): Promise<BorrowRequest> {
    return USE_MOCKS
      ? CommunityMockSource.confirmReturn(id, userName, userUnit)
      : CommunityApiSource.confirmReturn(id);
  }

  
  static async getLostFoundItems(type?: 'LOST' | 'FOUND', category?: string): Promise<LostFoundItem[]> {
    return USE_MOCKS
      ? CommunityMockSource.getLostFoundItems(type, category)
      : CommunityApiSource.getLostFoundItems(type, category);
  }

  static async getLostFoundItem(id: string): Promise<LostFoundItem | null> {
    return USE_MOCKS ? CommunityMockSource.getLostFoundItem(id) : CommunityApiSource.getLostFoundItem(id);
  }

  static async createLostFound(userId: string, userName: string, userUnit: string, dto: CreateLostFoundDTO): Promise<LostFoundItem> {
    return USE_MOCKS
      ? CommunityMockSource.createLostFound(userId, userName, userUnit, dto)
      : CommunityApiSource.createLostFound(dto);
  }

  static async claimLostFound(id: string, note: string, userId: string, userName: string, userUnit: string): Promise<LostFoundItem> {
    return USE_MOCKS
      ? CommunityMockSource.claimLostFound(id, note, userId, userName, userUnit)
      : CommunityApiSource.claimLostFound(id, note);
  }

  
  static async getModerationQueue(): Promise<MarketplaceListing[]> {
    return USE_MOCKS ? CommunityMockSource.getModerationQueue() : CommunityApiSource.getModerationQueue();
  }

  static async moderateListing(id: string, action: 'APPROVE' | 'REMOVE', userName: string, userUnit: string): Promise<MarketplaceListing> {
    return USE_MOCKS
      ? CommunityMockSource.moderateListing(id, action, userName, userUnit)
      : CommunityApiSource.moderateListing(id, action);
  }

  static async getAuditLogs(): Promise<CommunityAuditLog[]> {
    return USE_MOCKS ? CommunityMockSource.getAuditLogs() : CommunityApiSource.getAuditLogs();
  }

  static async getSettings(): Promise<CommunitySettings> {
    return USE_MOCKS ? CommunityMockSource.getSettings() : CommunityApiSource.getSettings();
  }

  static async updateSettings(dto: Partial<CommunitySettings>, userName: string, userUnit: string): Promise<CommunitySettings> {
    return USE_MOCKS
      ? CommunityMockSource.updateSettings(dto, userName, userUnit)
      : CommunityApiSource.updateSettings(dto);
  }
}
