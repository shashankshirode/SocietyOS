import type { PlatformUserRecord } from '../types/platformSociety.types';
import { getRequiredItem } from "../utils/requiredItem";
export const mockPlatformUsers: PlatformUserRecord[] = Array.from({ length: 40 }, (_, i) => ({
    id: `usr-${String(i + 1).padStart(3, '0')}`,
    displayName: getRequiredItem(['Rajesh Patil', 'Priya Sharma', 'Amit Shah', 'Neha Kulkarni', 'Vikram Joshi', 'Sunita Deshmukh', 'Arun Kale', 'Meena Iyer', 'Sanjay Naik', 'Kavita Rao', 'Rahul Deshpande', 'Anita Bhosale', 'Deepak Gadkari', 'Sneha Phadke', 'Manoj Chavan', 'Pooja Jadhav', 'Suresh Thakur', 'Ritu Wagh', 'Ashish More', 'Vaishali Pawar'], i % 20, "platformUsers.mock.ts"),
    society: getRequiredItem(['Green Valley Heights', 'Riverfront Residency', 'Palm Grove CHS', 'Skyline Towers', 'Sahyadri Enclave', 'Lotus Garden Society', 'Sunrise Heights', 'Metro Square', 'Lakewood Residency', 'Emerald Gardens'], i % 10, "platformUsers.mock.ts"),
    societyId: `soc-${String((i % 10) + 1).padStart(3, '0')}`,
    role: getRequiredItem((['RESIDENT_OWNER', 'RESIDENT_TENANT', 'SECRETARY', 'TREASURER', 'FACILITY_MANAGER', 'SOCIETY_ADMIN', 'SECURITY_GUARD', 'COMMITTEE_MEMBER'] as const), i % 8, "platformUsers.mock.ts"),
    status: getRequiredItem((['ACTIVE', 'ACTIVE', 'ACTIVE', 'SUSPENDED'] as const), i % 4, "platformUsers.mock.ts"),
    lastActivity: '2026-06-30T10:00:00Z',
    emailMasked: `${getRequiredItem(['r', 'p', 'a', 'n', 'v', 's', 'a', 'm', 's', 'k'], i % 10, "platformUsers.mock.ts")}****@example.com`,
    mobileMasked: `98****${String(1000 + i).slice(-4)}`,
}));

