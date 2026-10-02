import { createJobScheduler } from '../../../../../core/jobs/job.scheduler';
import { createFacilityHoldExpiryExecutor } from './executors/facilityHoldExpiryExecutor';
import { createFacilityNoShowExecutor } from './executors/facilityNoShowExecutor';
import { createFacilityWaitlistOfferExpiryExecutor } from './executors/facilityWaitlistOfferExpiryExecutor';
import { createFacilityWaitlistPromotionExecutor } from './executors/facilityWaitlistPromotionExecutor';
import type { JobDefinition, JobPorts, JobType } from '../../../../../core/jobs/job.types';

export const FACILITY_JOB_TYPES: JobType[] = [
  'FACILITY_HOLD_EXPIRY',
  'FACILITY_NO_SHOW_PROCESSING',
  'FACILITY_WAITLIST_OFFER_EXPIRY',
  'FACILITY_WAITLIST_PROMOTION',
];

export const FACILITY_JOB_DEFINITIONS: JobDefinition[] = [
  {
    id: 'job-facility-hold-expiry',
    type: 'FACILITY_HOLD_EXPIRY',
    name: 'Facility Hold Expiry Processor',
    description: 'Processes expired facility booking holds and releases capacity',
    schedule: { kind: 'INTERVAL', intervalMs: 5 * 60 * 1000 },
    payload: {},
    societyId: 'society-001',
    priority: 'NORMAL',
    maxRetries: 3,
    retryDelayMs: 10000,
    timeoutMs: 60000,
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'SYSTEM',
  },
  {
    id: 'job-facility-no-show-processing',
    type: 'FACILITY_NO_SHOW_PROCESSING',
    name: 'Facility No-Show Processor',
    description: 'Processes no-shows for confirmed facility bookings',
    schedule: { kind: 'INTERVAL', intervalMs: 15 * 60 * 1000 },
    payload: {},
    societyId: 'society-001',
    priority: 'HIGH',
    maxRetries: 3,
    retryDelayMs: 30000,
    timeoutMs: 120000,
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'SYSTEM',
  },
  {
    id: 'job-facility-waitlist-offer-expiry',
    type: 'FACILITY_WAITLIST_OFFER_EXPIRY',
    name: 'Facility Waitlist Offer Expiry',
    description: 'Processes expired waitlist offers and promotes next candidates',
    schedule: { kind: 'INTERVAL', intervalMs: 5 * 60 * 1000 },
    payload: {},
    societyId: 'society-001',
    priority: 'NORMAL',
    maxRetries: 3,
    retryDelayMs: 10000,
    timeoutMs: 60000,
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'SYSTEM',
  },
  {
    id: 'job-facility-waitlist-promotion',
    type: 'FACILITY_WAITLIST_PROMOTION',
    name: 'Facility Waitlist Promotion',
    description: 'Promotes waitlisted residents when slots become available',
    schedule: { kind: 'INTERVAL', intervalMs: 10 * 60 * 1000 },
    payload: {},
    societyId: 'society-001',
    priority: 'NORMAL',
    maxRetries: 3,
    retryDelayMs: 10000,
    timeoutMs: 60000,
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'SYSTEM',
  },
];

export async function registerFacilityJobs(ports: JobPorts): Promise<void> {
  const scheduler = createJobScheduler(ports, { workerId: 'facility-worker-1' });

  scheduler.registerExecutor('FACILITY_HOLD_EXPIRY', { execute: async (e, p) => (await import('./executors/facilityHoldExpiryExecutor')).createFacilityHoldExpiryExecutor().execute(e, p) });
  scheduler.registerExecutor('FACILITY_NO_SHOW_PROCESSING', { execute: async (e, p) => (await import('./executors/facilityNoShowExecutor')).createFacilityNoShowExecutor().execute(e, p) });
  scheduler.registerExecutor('FACILITY_WAITLIST_OFFER_EXPIRY', { execute: async (e, p) => (await import('./executors/facilityWaitlistOfferExpiryExecutor')).createFacilityWaitlistOfferExpiryExecutor().execute(e, p) });
  scheduler.registerExecutor('FACILITY_WAITLIST_PROMOTION', { execute: async (e, p) => (await import('./executors/facilityWaitlistPromotionExecutor')).createFacilityWaitlistPromotionExecutor().execute(e, p) });

  for (const def of FACILITY_JOB_DEFINITIONS) {
    await scheduler.registerJob(def);
  }

  await scheduler.start();
}

export function getFacilityJobTypes(): JobType[] {
  return FACILITY_JOB_TYPES;
}

export function getFacilityJobDefinitions(): JobDefinition[] {
  return FACILITY_JOB_DEFINITIONS;
}