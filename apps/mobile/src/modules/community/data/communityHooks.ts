import { useState } from 'react';
import type { CommunitySettings } from '../../../shared/types/community.types';
import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { CommunityRepository } from './community.repository';
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

const MOCK_USER = {
  id: 'res-1',
  name: 'Amit Sharma',
  unit: 'A-102',
};

export function useCommunityDashboard() {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getDashboard();
    return { ok: true, data: res };
  }, []);
}

export function useMarketplaceListings(category?: string, query?: string) {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getListings(category, query);
    return { ok: true, data: res };
  }, [category, query]);
}

export function useMyMarketplaceListings() {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getMyListings(MOCK_USER.id);
    return { ok: true, data: res };
  }, []);
}

export function useMarketplaceListingDetail(listingId: string) {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getListing(listingId);
    return { ok: true, data: res };
  }, [listingId]);
}

export function useCreateMarketplaceListing() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (dto: CreateListingDTO) => {
    setIsPending(true);
    try {
      return await CommunityRepository.createListing(MOCK_USER.id, MOCK_USER.name, MOCK_USER.unit, dto);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useUpdateMarketplaceListing() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ id, dto }: { id: string; dto: UpdateListingDTO }) => {
    setIsPending(true);
    try {
      return await CommunityRepository.updateListing(id, dto, MOCK_USER.name, MOCK_USER.unit);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useReportMarketplaceListing() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ id, reason }: { id: string; reason: string }) => {
    setIsPending(true);
    try {
      return await CommunityRepository.reportListing(id, reason, MOCK_USER.name, MOCK_USER.unit);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useMarketplaceCategories() {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getCategories();
    return { ok: true, data: res };
  }, []);
}

export function useResidentSkillDirectory(category?: string, query?: string) {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getSkillProfiles(category, query);
    return { ok: true, data: res };
  }, [category, query]);
}

export function useSkillProfileDetail(profileId: string) {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getSkillProfile(profileId);
    return { ok: true, data: res };
  }, [profileId]);
}

export function useCreateSkillProfile() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (dto: CreateSkillProfileDTO) => {
    setIsPending(true);
    try {
      return await CommunityRepository.createSkillProfile(MOCK_USER.id, MOCK_USER.name, MOCK_USER.unit, dto);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useUpdateSkillProfile() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (active: boolean) => {
    setIsPending(true);
    try {
      return await CommunityRepository.updateSkillProfile(MOCK_USER.id, active, MOCK_USER.name, MOCK_USER.unit);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useResidentServices() {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getServices();
    return { ok: true, data: res };
  }, []);
}

export function useResidentServiceRequests(category?: string) {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getServiceRequests(category);
    return { ok: true, data: res };
  }, [category]);
}

export function useResidentServiceRequest(requestId: string) {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getServiceRequest(requestId);
    return { ok: true, data: res };
  }, [requestId]);
}

export function useCreateServiceRequest() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (dto: CreateServiceRequestDTO) => {
    setIsPending(true);
    try {
      return await CommunityRepository.createServiceRequest(MOCK_USER.id, MOCK_USER.name, MOCK_USER.unit, dto);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useCreateCommunityContactRequest() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (dto: CreateCommunityContactRequestDTO) => {
    setIsPending(true);
    try {
      return await CommunityRepository.createContactRequest(MOCK_USER.id, MOCK_USER.name, MOCK_USER.unit, dto);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useBorrowableItems(category?: string, query?: string) {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getBorrowableItems(category, query);
    return { ok: true, data: res };
  }, [category, query]);
}

export function useMyBorrowableItems() {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getMyBorrowableItems(MOCK_USER.id);
    return { ok: true, data: res };
  }, []);
}

export function useBorrowableItemDetail(itemId: string) {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getBorrowableItem(itemId);
    return { ok: true, data: res };
  }, [itemId]);
}

export function useCreateBorrowableItem() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (dto: CreateBorrowableItemDTO) => {
    setIsPending(true);
    try {
      return await CommunityRepository.createBorrowableItem(MOCK_USER.id, MOCK_USER.name, MOCK_USER.unit, dto);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useBorrowRequests(type?: 'incoming' | 'outgoing') {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getBorrowRequests(MOCK_USER.id, type);
    return { ok: true, data: res };
  }, [type]);
}

export function useBorrowRequestDetail(requestId: string) {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getBorrowRequest(requestId);
    return { ok: true, data: res };
  }, [requestId]);
}

export function useCreateBorrowRequest() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (dto: CreateBorrowRequestDTO) => {
    setIsPending(true);
    try {
      return await CommunityRepository.createBorrowRequest(MOCK_USER.id, MOCK_USER.name, MOCK_USER.unit, dto);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useDecideBorrowRequest() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ id, dto }: { id: string; dto: DecideBorrowRequestDTO }) => {
    setIsPending(true);
    try {
      return await CommunityRepository.decideBorrowRequest(id, dto, MOCK_USER.name, MOCK_USER.unit);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useConfirmReturn() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (id: string) => {
    setIsPending(true);
    try {
      return await CommunityRepository.confirmReturn(id, MOCK_USER.name, MOCK_USER.unit);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useBorrowHistory() {
  return useRepositoryResult(async () => {
    return { ok: true, data: [] };
  }, []);
}

export function useLostFoundItems(type?: 'LOST' | 'FOUND', category?: string) {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getLostFoundItems(type, category);
    return { ok: true, data: res };
  }, [type, category]);
}

export function useLostFoundItemDetail(itemId: string) {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getLostFoundItem(itemId);
    return { ok: true, data: res };
  }, [itemId]);
}

export function useCreateLostFoundReport() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (dto: CreateLostFoundDTO) => {
    setIsPending(true);
    try {
      return await CommunityRepository.createLostFound(MOCK_USER.id, MOCK_USER.name, MOCK_USER.unit, dto);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useClaimLostFoundItem() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ id, note }: { id: string; note: string }) => {
    setIsPending(true);
    try {
      return await CommunityRepository.claimLostFound(id, note, MOCK_USER.id, MOCK_USER.name, MOCK_USER.unit);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useMarketplaceModerationQueue() {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getModerationQueue();
    return { ok: true, data: res };
  }, []);
}

export function useModerateMarketplaceListing() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ id, action }: { id: string; action: 'APPROVE' | 'REMOVE' }) => {
    setIsPending(true);
    try {
      return await CommunityRepository.moderateListing(id, action, MOCK_USER.name, MOCK_USER.unit);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useCommunityAuditLogs() {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getAuditLogs();
    return { ok: true, data: res };
  }, []);
}

export function useCommunitySettings() {
  return useRepositoryResult(async () => {
    const res = await CommunityRepository.getSettings();
    return { ok: true, data: res };
  }, []);
}

export function useUpdateCommunitySettings() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (dto: Partial<CommunitySettings>) => {
    setIsPending(true);
    try {
      return await CommunityRepository.updateSettings(dto, MOCK_USER.name, MOCK_USER.unit);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useVerifiedVendors() {
  return useRepositoryResult(async () => {
    const placeholders = [
      { id: 'v-1', name: 'Elite Laundry Services', category: 'Laundry', rating: 4.8, status: 'VERIFIED' },
      { id: 'v-2', name: 'Safe Shield Pest Control', category: 'Pest Control', rating: 4.7, status: 'VERIFIED' },
      { id: 'v-3', name: 'Quick Fix Electricians', category: 'Electrical', rating: 4.6, status: 'VERIFIED' },
    ];
    return { ok: true, data: placeholders };
  }, []);
}
