import { useSyncExternalStore } from 'react';
import type {
  FacilityBookingQuote,
  FacilityBookingSetupSelection,
  FacilityGuestDetail,
} from '../models/facilityBooking.models';

export interface FacilityBookingDraft {
  readonly residenceId: string;
  readonly societyId: string;
  readonly unitId: string;
  readonly facilityId: string;
  readonly slotId: string | null;
  readonly holdId: string | null;
  readonly holdExpiresAt: string | null;
  readonly quoteId: string | null;
  readonly quote: FacilityBookingQuote | null;
  readonly purpose: string;
  readonly guestCount: number;
  readonly contactNumber: string;
  readonly additionalInstructions: string;
  readonly guestDetails: readonly FacilityGuestDetail[];
  readonly setupSelections: readonly FacilityBookingSetupSelection[];
  readonly consentAccepted: boolean;
  readonly acceptedRuleIds: readonly string[];
  readonly updatedAt: string;
}

let currentDraft: FacilityBookingDraft | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

export const facilityBookingDraftStore = {
  getSnapshot(): FacilityBookingDraft | null {
    return currentDraft;
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  start(values: Pick<FacilityBookingDraft, 'residenceId' | 'societyId' | 'unitId' | 'facilityId' | 'contactNumber'>): FacilityBookingDraft {
    currentDraft = {
      ...values,
      slotId: null,
      holdId: null,
      holdExpiresAt: null,
      quoteId: null,
      quote: null,
      purpose: '',
      guestCount: 1,
      additionalInstructions: '',
      guestDetails: [],
      setupSelections: [],
      consentAccepted: false,
      acceptedRuleIds: [],
      updatedAt: new Date().toISOString(),
    };
    emit();
    return currentDraft;
  },
  replace(draft: FacilityBookingDraft): void {
    currentDraft = { ...draft, updatedAt: new Date().toISOString() };
    emit();
  },
  update(values: Partial<FacilityBookingDraft>): FacilityBookingDraft | null {
    if (!currentDraft) return null;
    currentDraft = { ...currentDraft, ...values, updatedAt: new Date().toISOString() };
    emit();
    return currentDraft;
  },
  clear(): void {
    currentDraft = null;
    emit();
  },
};

export function useFacilityBookingDraft(): FacilityBookingDraft | null {
  return useSyncExternalStore(
    facilityBookingDraftStore.subscribe,
    facilityBookingDraftStore.getSnapshot,
    facilityBookingDraftStore.getSnapshot,
  );
}
