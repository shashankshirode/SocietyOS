import type { ServiceCategory, ServiceProvider, ServiceRequestRecord, VendorRatingRecord } from './serviceMarketplace.types';
import { getRequiredItem } from '../../../../shared/utils/requiredItem';

export const serviceCategoryMockData: ServiceCategory[] = [
  { id: 'svc-cleaning', name: 'Cleaning', description: 'Deep cleaning, sofa cleaning and kitchen cleaning providers.', providerCount: 4 },
  { id: 'svc-car-wash', name: 'Car Wash', description: 'Daily and subscription-based vehicle cleaning providers.', providerCount: 3 },
  { id: 'svc-pest-control', name: 'Pest Control', description: 'Apartment-safe pest control services with society approval.', providerCount: 2 },
  { id: 'svc-elder-care', name: 'Elder Care', description: 'Verified care support for senior residents.', providerCount: 2 },
];

export const serviceProviderMockData: ServiceProvider[] = [
  { id: 'sp-1', categoryId: 'svc-cleaning', name: 'Sparkle Home Services', rating: 4.7, availability: 'AVAILABLE', serviceArea: 'Towers A, B, C' },
  { id: 'sp-2', categoryId: 'svc-car-wash', name: 'Daily Shine Car Wash', rating: 4.5, availability: 'BUSY', serviceArea: 'Basement P1 and P2' },
  { id: 'sp-3', categoryId: 'svc-pest-control', name: 'SafeNest Pest Control', rating: 4.8, availability: 'AVAILABLE', serviceArea: 'All towers' },
  { id: 'sp-4', categoryId: 'svc-elder-care', name: 'CarePlus Resident Assist', rating: 4.6, availability: 'AVAILABLE', serviceArea: 'Tower C and D' },
];

export const serviceRequestMockData: ServiceRequestRecord[] = [
  { id: 'sr-1', providerId: 'sp-1', residentName: 'Anita Rao', categoryName: 'Cleaning', requestedSlot: '2026-07-06 10:00', status: 'SUBMITTED' },
];

export const vendorRatingMockData: VendorRatingRecord[] = [
  { id: 'vr-1', providerId: 'sp-1', rating: 5, review: 'Reached on time and closed the request cleanly.', createdAt: '2026-07-01T10:30:00Z' },
];

export const featuredServiceCategoryMockData = getRequiredItem(serviceCategoryMockData, 0, 'service categories');
