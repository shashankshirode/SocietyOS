import type { AmcContract, AmcRenewalReminder } from '../types/amc.types';

const amcCategories = ['LIFT', 'FIRE_SYSTEM', 'WATER_PUMP', 'GENERATOR', 'CCTV', 'INTERCOM', 'STP', 'PEST_CONTROL'] as const;

export const mockAmcContracts: AmcContract[] = amcCategories.map((category, index) => ({
  id: `amc-${index + 1}`,
  contractNumber: `AMC-GVH-2026-${String(index + 1).padStart(3, '0')}`,
  vendorId: `vendor-${(index % 6) + 1}`,
  vendorName: `${category.replace(/_/g, ' ')} Services Nashik`,
  category,
  linkedAssets: [`asset-${index + 1}`, `asset-${index + 2}`],
  startDate: '2026-01-01',
  endDate: `2026-${String(index + 6).padStart(2, '0')}-30`,
  renewalNoticeDate: `2026-${String(index + 5).padStart(2, '0')}-30`,
  renewalDueInDays: 15 + index * 8,
  contractAmount: 45000 + index * 12000,
  status: index === 1 ? 'EXPIRING_SOON' : index === 2 ? 'RENEWAL_PENDING' : 'ACTIVE',
  serviceFrequency: index % 2 === 0 ? 'Monthly' : 'Quarterly',
  lastServiceDate: `2026-06-${String(index + 5).padStart(2, '0')}`,
  nextServiceDate: `2026-07-${String(index + 5).padStart(2, '0')}`,
  slaTerms: 'Emergency response within 4 hours.',
  emergencyResponseTime: '4 hours',
  includedServices: ['Preventive service', 'Emergency visit', 'Service report'],
  excludedServices: ['Major spare parts', 'Civil repairs'],
  documents: ['AMC contract', 'Insurance', 'Safety certificate'],
  renewalStatus: index === 2 ? 'DUE_SOON' : 'UPCOMING',
  notes: 'Mock AMC contract.',
}));

export const mockAmcRenewalReminders: AmcRenewalReminder[] = mockAmcContracts.map((contract, index) => ({
  id: `amc-reminder-${index + 1}`,
  contractId: contract.id,
  contractNumber: contract.contractNumber,
  vendorName: contract.vendorName,
  expiryDate: contract.endDate,
  daysRemaining: contract.renewalDueInDays,
  priority: index < 2 ? 'HIGH' : 'MEDIUM',
  status: index === 0 ? 'DUE_SOON' : index === 1 ? 'OVERDUE' : 'UPCOMING',
  responsiblePerson: 'Suresh Patil',
  lastReminderDate: '2026-06-25',
}));
