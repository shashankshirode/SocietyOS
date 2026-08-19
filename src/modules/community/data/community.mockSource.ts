import { mockMarketplaceListings } from '../../../shared/mock/marketplaceListings.mock';
import { mockMarketplaceCategories } from '../../../shared/mock/marketplaceCategories.mock';
import { mockSkillProfiles } from '../../../shared/mock/skillDirectory.mock';
import { mockServiceRequests } from '../../../shared/mock/serviceRequests.mock';
import { mockCommunityContactRequests } from '../../../shared/mock/communityContactRequests.mock';
import { mockBorrowableItems } from '../../../shared/mock/borrowableItems.mock';
import { mockBorrowRequests } from '../../../shared/mock/borrowRequests.mock';
import { mockLostFoundItems, mockCommunityAuditLogs } from '../../../shared/mock/lostFound.mock';
import { MarketplaceListing, MarketplaceCategory } from '../../../shared/types/marketplace.types';
import { SkillProfile, ResidentService, ServiceRequest } from '../../../shared/types/skillDirectory.types';
import { BorrowableItem, BorrowRequest } from '../../../shared/types/borrowLend.types';
import { LostFoundItem } from '../../../shared/types/lostFound.types';
import { CommunityDashboard, CommunityContactRequest, CommunityAuditLog, CommunitySettings } from '../../../shared/types/community.types';
import { CreateListingDTO, UpdateListingDTO, CreateSkillProfileDTO, CreateServiceRequestDTO, CreateBorrowableItemDTO, CreateBorrowRequestDTO, DecideBorrowRequestDTO, CreateLostFoundDTO, CreateCommunityContactRequestDTO } from './community.dto';
import { resolveRequestContext } from '../../resident/homeContext/utils/resolveRequestContext';
import { getResidentMockRecords } from '../../resident/mock/residentMockRegistry';
import type { ResidentMockFeatureKey, ResidentMockRecord } from '../../resident/mock/residentMockScenario.types';
import { enMessages } from '../../../messages/en';
import { getRequiredItem } from '../../../shared/utils/requiredItem';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
let localListings = [...mockMarketplaceListings];
let localSkillProfiles = [...mockSkillProfiles];
let localServiceRequests = [...mockServiceRequests];
let localContactRequests = [...mockCommunityContactRequests];
let localBorrowableItems = [...mockBorrowableItems];
let localBorrowRequests = [...mockBorrowRequests];
let localLostFoundItems = [...mockLostFoundItems];
let localAuditLogs = [...mockCommunityAuditLogs];
let localSettings: CommunitySettings = {
    allowResidentMarketplace: true,
    requireModerationBeforePublishing: false,
    maxActiveListingsPerResident: 10,
    allowBorrowLend: true,
    maxBorrowedItemsPerResident: 3,
    autoArchiveAfterDays: 30
};
function mockRecordTitle(record: ResidentMockRecord): string {
    const context = resolveRequestContext();
    return enMessages.resident.mockData.recordTitle(enMessages.resident.mockData.featureLabels[record.feature], record.ordinal + 1, context.activeHome.displayUnitName);
}
function mockRecordDescription(record: ResidentMockRecord): string {
    const context = resolveRequestContext();
    return enMessages.resident.mockData.recordDescription(enMessages.resident.mockData.featureLabels[record.feature], context.activeHome.societyName);
}
function scopedRecords(feature: ResidentMockFeatureKey): readonly ResidentMockRecord[] {
    return getResidentMockRecords(resolveRequestContext(), feature);
}
function buildScopedListings(): MarketplaceListing[] {
    const statuses: readonly MarketplaceListing['status'][] = [
        'ACTIVE',
        'PENDING_MODERATION',
        'SOLD',
        'PAUSED',
        'EXPIRED',
        'REPORTED',
    ];
    return scopedRecords('marketplace').map((record) => ({
        id: record.id,
        title: mockRecordTitle(record),
        description: mockRecordDescription(record),
        ...(record.ordinal % 7 === 0 ? {} : { price: 250 + record.ordinal * 125 }),
        isGiveaway: record.ordinal % 7 === 0,
        condition: getRequiredItem(['NEW', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR'] as const, record.ordinal % 5, 'marketplace listing conditions'),
        categorySlug: getRequiredItem(['sell', 'giveaway', 'borrow', 'lend', 'skill', 'service', 'lost-found'] as const, record.ordinal % 7, 'marketplace categories'),
        sellerId: record.ordinal % 3 === 0 ? 'resident-001' : `${record.homeContextId}:seller:${record.ordinal + 1}`,
        sellerName: mockRecordTitle(record),
        sellerUnit: resolveRequestContext().activeHome.displayUnitName,
        status: getRequiredItem(statuses, record.ordinal % statuses.length, 'marketplace statuses'),
        reportedCount: record.ordinal % 6 === 5 ? 1 : 0,
        viewsCount: record.ordinal * 4,
        createdAt: record.createdAtIso,
        updatedAt: record.updatedAtIso
    }));
}
function buildScopedSkills(): SkillProfile[] {
    return scopedRecords('skillDirectory').map((record) => ({
        id: record.id,
        residentId: `${record.homeContextId}:skill-resident:${record.ordinal + 1}`,
        residentName: mockRecordTitle(record),
        residentUnit: resolveRequestContext().activeHome.displayUnitName,
        title: mockRecordTitle(record),
        description: mockRecordDescription(record),
        skills: [mockRecordTitle(record)],
        categorySlug: getRequiredItem(['education', 'food', 'fitness', 'music', 'technology'] as const, record.ordinal % 5, 'skill categories'),
        experienceYears: record.ordinal % 12,
        availabilityHours: record.updatedAtIso,
        averageRating: 3 + (record.ordinal % 3),
        reviewsCount: record.ordinal,
        reviews: [],
        isActive: record.ordinal % 8 !== 0,
        createdAt: record.createdAtIso
    }));
}
function buildScopedBorrowableItems(): BorrowableItem[] {
    return scopedRecords('borrowLend').map((record) => ({
        id: record.id,
        title: mockRecordTitle(record),
        description: mockRecordDescription(record),
        category: getRequiredItem(['TOOLS', 'BOOKS', 'APPLIANCES', 'SPORTS', 'TOYS', 'OTHERS'] as const, record.ordinal % 6, 'borrowable item categories'),
        ownerId: record.ordinal % 4 === 0 ? 'resident-001' : `${record.homeContextId}:owner:${record.ordinal + 1}`,
        ownerName: mockRecordTitle(record),
        ownerUnit: resolveRequestContext().activeHome.displayUnitName,
        status: getRequiredItem(['AVAILABLE', 'BORROWED', 'MAINTENANCE', 'INACTIVE'] as const, record.ordinal % 4, 'borrowable item statuses'),
        maxDurationDays: 1 + (record.ordinal % 14),
        depositRequired: record.ordinal % 3 === 0,
        ...(record.ordinal % 3 === 0 ? { depositDetails: mockRecordDescription(record) } : {}),
        createdAt: record.createdAtIso
    }));
}
function buildScopedLostFoundItems(): LostFoundItem[] {
    return scopedRecords('lostFound').map((record) => ({
        id: record.id,
        title: mockRecordTitle(record),
        description: mockRecordDescription(record),
        type: record.ordinal % 2 === 0 ? 'LOST' : 'FOUND',
        category: getRequiredItem(['ELECTRONICS', 'KEYS', 'WALLETS', 'DOCUMENTS', 'PETS', 'OTHERS'] as const, record.ordinal % 6, 'lost and found categories'),
        location: resolveRequestContext().activeHome.societyName,
        dateHappened: record.createdAtIso.slice(0, 10),
        reporterId: `${record.homeContextId}:reporter:${record.ordinal + 1}`,
        reporterName: mockRecordTitle(record),
        reporterUnit: resolveRequestContext().activeHome.displayUnitName,
        status: getRequiredItem(['ACTIVE', 'CLAIMED', 'RESOLVED'] as const, record.ordinal % 3, 'lost and found statuses'),
        createdAt: record.createdAtIso
    }));
}
export class CommunityMockSource {
    static async getDashboard(): Promise<CommunityDashboard> {
        const listings = buildScopedListings();
        const skills = buildScopedSkills();
        const borrows = buildScopedBorrowableItems();
        const lostFound = buildScopedLostFoundItems();
        const context = resolveRequestContext();
        return {
            activeListingsCount: listings.filter((listing) => listing.status === 'ACTIVE').length,
            skillsRegisteredCount: skills.filter((skill) => skill.isActive).length,
            activeBorrowsCount: borrows.filter((item) => item.status === 'BORROWED').length,
            lostItemsActiveCount: lostFound.filter((item) => item.status === 'ACTIVE' && item.type === 'LOST').length,
            recentActivities: scopedRecords('communityHub').slice(0, 20).map((record) => ({
                id: record.id,
                type: getRequiredItem(['MARKETPLACE', 'SKILL', 'BORROW', 'LOST_FOUND'] as const, record.ordinal % 4, 'community activity types'),
                title: mockRecordTitle(record),
                description: mockRecordDescription(record),
                timestamp: record.updatedAtIso,
                unitNumber: context.activeHome.displayUnitName,
                userName: enMessages.resident.mockData.residentNames[context.activeHome.residentRole]
            }))
        };
    }
    static async getListings(category?: string, query?: string): Promise<MarketplaceListing[]> {
        let list = buildScopedListings();
        if (category) {
            list = list.filter(l => l.categorySlug === category);
        }
        if (query) {
            const q = query.toLowerCase();
            list = list.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
        }
        return list;
    }
    static async getMyListings(userId: string): Promise<MarketplaceListing[]> {
        return buildScopedListings().filter(l => l.sellerId === userId);
    }
    static async getListing(id: string): Promise<MarketplaceListing | null> {
        const item = buildScopedListings().find(l => l.id === id);
        if (item) {
            return { ...item, viewsCount: item.viewsCount + 1 };
        }
        return null;
    }
    static async createListing(userId: string, userName: string, userUnit: string, dto: CreateListingDTO): Promise<MarketplaceListing> {
        const newListing: MarketplaceListing = {
            id: `lst-${Date.now()}`,
            title: dto.title,
            description: dto.description,
            ...includeWhenPresent("price", dto.isGiveaway ? undefined : dto.price),
            isGiveaway: dto.isGiveaway,
            condition: dto.condition,
            categorySlug: dto.categorySlug,
            ...includeWhenPresent("imageUrl", dto.imageUrl),
            sellerId: userId,
            sellerName: userName,
            sellerUnit: userUnit,
            status: localSettings.requireModerationBeforePublishing ? 'PENDING_MODERATION' : 'ACTIVE',
            reportedCount: 0,
            viewsCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        localListings.unshift(newListing);
        this.addAuditLog('Listing Created', 'MARKETPLACE', userName, userUnit, `Created listing: ${dto.title}`);
        return newListing;
    }
    static async updateListing(id: string, dto: UpdateListingDTO, userName: string, userUnit: string): Promise<MarketplaceListing> {
        const index = localListings.findIndex(l => l.id === id);
        if (index === -1)
            throw new Error('Listing not found');
        const existingListing = getRequiredItem(localListings, index, 'marketplace listings');
        const updated = {
            ...existingListing,
            ...dto,
            updatedAt: new Date().toISOString()
        } as MarketplaceListing;
        localListings[index] = updated;
        this.addAuditLog('Listing Updated', 'MARKETPLACE', userName, userUnit, `Updated listing: ${updated.title}`);
        return updated;
    }
    static async reportListing(id: string, reason: string, userName: string, userUnit: string): Promise<MarketplaceListing> {
        const index = localListings.findIndex(l => l.id === id);
        if (index === -1)
            throw new Error('Listing not found');
        const item = getRequiredItem(localListings, index, 'marketplace listings');
        item.reportedCount += 1;
        item.reportedReason = reason;
        if (item.reportedCount >= 3) {
            item.status = 'PENDING_MODERATION';
        }
        else {
            item.status = 'REPORTED';
        }
        this.addAuditLog('Listing Reported', 'MARKETPLACE', userName, userUnit, `Reported listing "${item.title}" for: ${reason}`);
        return { ...item };
    }
    static async getCategories(): Promise<MarketplaceCategory[]> {
        return mockMarketplaceCategories.map(cat => {
            const count = localListings.filter(l => l.categorySlug === cat.slug && l.status === 'ACTIVE').length;
            return { ...cat, listingCount: count };
        });
    }
    static async getSkillProfiles(category?: string, query?: string): Promise<SkillProfile[]> {
        let list = buildScopedSkills().filter(s => s.isActive);
        if (category) {
            list = list.filter(s => s.categorySlug === category);
        }
        if (query) {
            const q = query.toLowerCase();
            list = list.filter(s => s.title.toLowerCase().includes(q) ||
                s.description.toLowerCase().includes(q) ||
                s.skills.some(skill => skill.toLowerCase().includes(q)));
        }
        return list;
    }
    static async getSkillProfile(id: string): Promise<SkillProfile | null> {
        const profile = buildScopedSkills().find(s => s.id === id);
        return profile ? { ...profile } : null;
    }
    static async createSkillProfile(userId: string, userName: string, userUnit: string, dto: CreateSkillProfileDTO): Promise<SkillProfile> {
        const existingIndex = localSkillProfiles.findIndex(s => s.residentId === userId);
        if (existingIndex !== -1) {
            const existingProfile = getRequiredItem(localSkillProfiles, existingIndex, 'skill profiles');
            const updated = {
                ...existingProfile,
                ...dto,
                isActive: true
            } as SkillProfile;
            localSkillProfiles[existingIndex] = updated;
            this.addAuditLog('Skill Profile Updated', 'SKILL_DIRECTORY', userName, userUnit, `Updated skill profile: ${dto.title}`);
            return updated;
        }
        const newProfile: SkillProfile = {
            id: `skl-${Date.now()}`,
            residentId: userId,
            residentName: userName,
            residentUnit: userUnit,
            title: dto.title,
            description: dto.description,
            skills: dto.skills,
            categorySlug: dto.categorySlug,
            ...includeWhenPresent("experienceYears", dto.experienceYears),
            ...includeWhenPresent("availabilityHours", dto.availabilityHours),
            averageRating: 0,
            reviewsCount: 0,
            reviews: [],
            isActive: true,
            createdAt: new Date().toISOString()
        };
        localSkillProfiles.unshift(newProfile);
        this.addAuditLog('Skill Profile Created', 'SKILL_DIRECTORY', userName, userUnit, `Created skill profile: ${dto.title}`);
        return newProfile;
    }
    static async updateSkillProfile(userId: string, active: boolean, userName: string, userUnit: string): Promise<SkillProfile | null> {
        const index = localSkillProfiles.findIndex(s => s.residentId === userId);
        if (index === -1)
            return null;
        const profile = getRequiredItem(localSkillProfiles, index, 'skill profiles');
        profile.isActive = active;
        this.addAuditLog('Skill Profile Status Changed', 'SKILL_DIRECTORY', userName, userUnit, `Set skill profile active=${active}`);
        return { ...profile };
    }
    static async getServices(): Promise<ResidentService[]> {
        return scopedRecords('verifiedVendors').map((record) => ({
            id: record.id,
            name: mockRecordTitle(record),
            slug: `vendor-${record.ordinal + 1}`,
            icon: 'construct-outline',
            profileCount: 1 + record.ordinal
        }));
    }
    static async getServiceRequests(category?: string): Promise<ServiceRequest[]> {
        let list: ServiceRequest[] = scopedRecords('communityServices').map((record) => ({
            id: record.id,
            title: mockRecordTitle(record),
            description: mockRecordDescription(record),
            categorySlug: `service-${record.ordinal % 10}`,
            postedById: `${record.homeContextId}:service:${record.ordinal + 1}`,
            postedByName: mockRecordTitle(record),
            postedByUnit: resolveRequestContext().activeHome.displayUnitName,
            budget: String((record.ordinal + 1) * 250),
            timing: record.updatedAtIso,
            status: record.ordinal % 5 === 0 ? 'COMPLETED' : 'ACTIVE',
            createdAt: record.createdAtIso
        }));
        if (category) {
            list = list.filter(r => r.categorySlug === category);
        }
        return list;
    }
    static async getServiceRequest(id: string): Promise<ServiceRequest | null> {
        const requests = await this.getServiceRequests();
        return localServiceRequests.find((request) => request.id === id)
            ?? requests.find((request) => request.id === id)
            ?? null;
    }
    static async createServiceRequest(userId: string, userName: string, userUnit: string, dto: CreateServiceRequestDTO): Promise<ServiceRequest> {
        const newReq: ServiceRequest = {
            id: `srq-${Date.now()}`,
            title: dto.title,
            description: dto.description,
            categorySlug: dto.categorySlug,
            postedById: userId,
            postedByName: userName,
            postedByUnit: userUnit,
            ...includeWhenPresent("budget", dto.budget),
            ...includeWhenPresent("timing", dto.timing),
            status: 'ACTIVE',
            createdAt: new Date().toISOString()
        };
        localServiceRequests.unshift(newReq);
        this.addAuditLog('Service Request Created', 'SKILL_DIRECTORY', userName, userUnit, `Posted service request: ${dto.title}`);
        return newReq;
    }
    static async createContactRequest(userId: string, userName: string, userUnit: string, dto: CreateCommunityContactRequestDTO): Promise<CommunityContactRequest> {
        const newReq: CommunityContactRequest = {
            id: `crq-${Date.now()}`,
            type: dto.type,
            targetId: dto.targetId,
            targetTitle: dto.targetTitle,
            senderId: userId,
            senderName: userName,
            senderUnit: userUnit,
            receiverId: dto.receiverId,
            receiverName: dto.receiverName,
            receiverUnit: dto.receiverUnit,
            message: dto.message,
            urgency: dto.urgency || 'NORMAL',
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };
        localContactRequests.unshift(newReq);
        this.addAuditLog('Contact Request Sent', 'SETTINGS', userName, userUnit, `Sent contact request to ${dto.receiverName} regarding "${dto.targetTitle}"`);
        return newReq;
    }
    static async getBorrowableItems(category?: string, query?: string): Promise<BorrowableItem[]> {
        let list = buildScopedBorrowableItems();
        if (category) {
            list = list.filter(i => i.category === category.toUpperCase());
        }
        if (query) {
            const q = query.toLowerCase();
            list = list.filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
        }
        return list;
    }
    static async getMyBorrowableItems(userId: string): Promise<BorrowableItem[]> {
        return buildScopedBorrowableItems().filter(i => i.ownerId === userId);
    }
    static async getBorrowableItem(id: string): Promise<BorrowableItem | null> {
        const item = buildScopedBorrowableItems().find(i => i.id === id);
        return item ? { ...item } : null;
    }
    static async createBorrowableItem(userId: string, userName: string, userUnit: string, dto: CreateBorrowableItemDTO): Promise<BorrowableItem> {
        const newItem: BorrowableItem = {
            id: `brw-${Date.now()}`,
            title: dto.title,
            description: dto.description,
            category: dto.category,
            ownerId: userId,
            ownerName: userName,
            ownerUnit: userUnit,
            status: 'AVAILABLE',
            maxDurationDays: dto.maxDurationDays,
            depositRequired: dto.depositRequired,
            ...includeWhenPresent("depositDetails", dto.depositDetails),
            ...includeWhenPresent("imageUrl", dto.imageUrl),
            createdAt: new Date().toISOString()
        };
        localBorrowableItems.unshift(newItem);
        this.addAuditLog('Borrow Item Listed', 'BORROW_LEND', userName, userUnit, `Listed borrowable item: ${dto.title}`);
        return newItem;
    }
    static async getBorrowRequests(userId?: string, type?: 'incoming' | 'outgoing'): Promise<BorrowRequest[]> {
        if (!userId)
            return localBorrowRequests;
        if (type === 'incoming') {
            return localBorrowRequests.filter(r => r.ownerId === userId);
        }
        return localBorrowRequests.filter(r => r.borrowerId === userId);
    }
    static async getBorrowRequest(id: string): Promise<BorrowRequest | null> {
        const req = localBorrowRequests.find(r => r.id === id);
        return req ? { ...req } : null;
    }
    static async createBorrowRequest(userId: string, userName: string, userUnit: string, dto: CreateBorrowRequestDTO): Promise<BorrowRequest> {
        const item = localBorrowableItems.find(i => i.id === dto.itemId);
        if (!item)
            throw new Error('Item not found');
        const newReq: BorrowRequest = {
            id: `brq-${Date.now()}`,
            itemId: dto.itemId,
            itemTitle: item.title,
            itemCategory: item.category,
            ownerId: item.ownerId,
            ownerName: item.ownerName,
            ownerUnit: item.ownerUnit,
            borrowerId: userId,
            borrowerName: userName,
            borrowerUnit: userUnit,
            durationDays: dto.durationDays,
            purpose: dto.purpose,
            status: 'PENDING_APPROVAL',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        localBorrowRequests.unshift(newReq);
        this.addAuditLog('Borrow Request Created', 'BORROW_LEND', userName, userUnit, `Requested to borrow: ${item.title}`);
        return newReq;
    }
    static async decideBorrowRequest(id: string, dto: DecideBorrowRequestDTO, userName: string, userUnit: string): Promise<BorrowRequest> {
        const index = localBorrowRequests.findIndex(r => r.id === id);
        if (index === -1)
            throw new Error('Request not found');
        const req = getRequiredItem(localBorrowRequests, index, 'borrow requests');
        req.status = dto.status === 'APPROVED' ? 'APPROVED' : 'REJECTED';
        if (dto.decisionNote !== undefined) {
            req.decisionNote = dto.decisionNote;
        }
        req.updatedAt = new Date().toISOString();
        if (dto.status === 'APPROVED') {
            req.borrowedAt = new Date().toISOString();
            req.dueDate = new Date(Date.now() + req.durationDays * 24 * 3600 * 1000).toISOString();
            const itemIndex = localBorrowableItems.findIndex(i => i.id === req.itemId);
            if (itemIndex !== -1) {
                getRequiredItem(localBorrowableItems, itemIndex, 'borrowable items').status = 'BORROWED';
            }
        }
        this.addAuditLog('Borrow Request Decided', 'BORROW_LEND', userName, userUnit, `${dto.status} borrow request for item: ${req.itemTitle}`);
        return { ...req };
    }
    static async confirmReturn(id: string, userName: string, userUnit: string): Promise<BorrowRequest> {
        const index = localBorrowRequests.findIndex(r => r.id === id);
        if (index === -1)
            throw new Error('Request not found');
        const req = getRequiredItem(localBorrowRequests, index, 'borrow requests');
        req.status = 'RETURNED';
        req.returnedAt = new Date().toISOString();
        req.updatedAt = new Date().toISOString();
        const itemIndex = localBorrowableItems.findIndex(i => i.id === req.itemId);
        if (itemIndex !== -1) {
            getRequiredItem(localBorrowableItems, itemIndex, 'borrowable items').status = 'AVAILABLE';
        }
        this.addAuditLog('Lend Return Confirmed', 'BORROW_LEND', userName, userUnit, `Confirmed return of item: ${req.itemTitle}`);
        return { ...req };
    }
    static async getLostFoundItems(type?: 'LOST' | 'FOUND', category?: string): Promise<LostFoundItem[]> {
        let list = buildScopedLostFoundItems();
        if (type) {
            list = list.filter(i => i.type === type);
        }
        if (category) {
            list = list.filter(i => i.category === category.toUpperCase());
        }
        return list;
    }
    static async getLostFoundItem(id: string): Promise<LostFoundItem | null> {
        const item = buildScopedLostFoundItems().find(i => i.id === id);
        return item ? { ...item } : null;
    }
    static async createLostFound(userId: string, userName: string, userUnit: string, dto: CreateLostFoundDTO): Promise<LostFoundItem> {
        const newItem: LostFoundItem = {
            id: `lf-${Date.now()}`,
            title: dto.title,
            description: dto.description,
            type: dto.type,
            category: dto.category,
            location: dto.location,
            dateHappened: dto.dateHappened,
            reporterId: userId,
            reporterName: userName,
            reporterUnit: userUnit,
            status: 'ACTIVE',
            ...includeWhenPresent("imageUrl", dto.imageUrl),
            createdAt: new Date().toISOString()
        };
        localLostFoundItems.unshift(newItem);
        this.addAuditLog('Lost/Found Item Reported', 'LOST_FOUND', userName, userUnit, `Reported ${dto.type.toLowerCase()} item: ${dto.title}`);
        return newItem;
    }
    static async claimLostFound(id: string, note: string, userId: string, userName: string, userUnit: string): Promise<LostFoundItem> {
        const index = localLostFoundItems.findIndex(i => i.id === id);
        if (index === -1)
            throw new Error('Item not found');
        const item = getRequiredItem(localLostFoundItems, index, 'lost and found items');
        item.status = 'CLAIMED';
        item.claimantId = userId;
        item.claimantName = userName;
        item.claimantUnit = userUnit;
        item.claimNote = note;
        item.resolvedAt = new Date().toISOString();
        this.addAuditLog('Lost/Found Item Claimed', 'LOST_FOUND', userName, userUnit, `Claimed item "${item.title}"`);
        return { ...item };
    }
    static async getModerationQueue(): Promise<MarketplaceListing[]> {
        return localListings.filter(l => l.status === 'PENDING_MODERATION' || l.status === 'REPORTED');
    }
    static async moderateListing(id: string, action: 'APPROVE' | 'REMOVE', userName: string, userUnit: string): Promise<MarketplaceListing> {
        const index = localListings.findIndex(l => l.id === id);
        if (index === -1)
            throw new Error('Listing not found');
        const item = getRequiredItem(localListings, index, 'marketplace listings');
        if (action === 'APPROVE') {
            item.status = 'ACTIVE';
            item.reportedCount = 0;
        }
        else {
            item.status = 'REMOVED';
        }
        this.addAuditLog('Listing Moderated', 'MARKETPLACE', userName, userUnit, `${action}D listing "${item.title}" in moderation`);
        return { ...item };
    }
    private static addAuditLog(action: string, module: CommunityAuditLog['module'], userName: string, userUnit: string, details: string) {
        const log: CommunityAuditLog = {
            id: `al-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            timestamp: new Date().toISOString(),
            action,
            module,
            performedBy: userName,
            performedByRole: 'RESIDENT',
            unitNumber: userUnit,
            details
        };
        localAuditLogs.unshift(log);
    }
    static async getAuditLogs(): Promise<CommunityAuditLog[]> {
        return localAuditLogs;
    }
    static async getSettings(): Promise<CommunitySettings> {
        return { ...localSettings };
    }
    static async updateSettings(dto: Partial<CommunitySettings>, userName: string, userUnit: string): Promise<CommunitySettings> {
        localSettings = {
            ...localSettings,
            ...dto
        };
        this.addAuditLog('Settings Updated', 'SETTINGS', userName, userUnit, 'Updated community settings');
        return { ...localSettings };
    }
}

