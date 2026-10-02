import { createJobScheduler } from '../../../../../core/jobs/job.scheduler';
import { createTemporaryAllocationExpiryExecutor } from './executors/temporaryAllocationExpiryExecutor';
import { createVisitorParkingExpiryExecutor } from './executors/visitorParkingExpiryExecutor';
import { createViolationRepeatOffenceExecutor } from './executors/violationRepeatOffenceExecutor';
import type { JobDefinition, JobPorts, JobType } from '../../../../../core/jobs/job.types';

export const PARKING_JOB_TYPES: JobType[] = [
  'PARKING_TEMPORARY_ALLOCATION_EXPIRY',
  'PARKING_VISITOR_PARKING_EXPIRY',
  'PARKING_VIOLATION_REPEAT_OFFENCE',
];

export const PARKING_JOB_DEFINITIONS: JobDefinition[] = [
  {
    id: 'job-parking-temporary-expiry',
    type: 'PARKING_TEMPORARY_ALLOCATION_EXPIRY',
    name: 'Temporary Allocation Expiry Processor',
    description: 'Processes expired temporary parking allocations and releases capacity',
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
    id: 'job-parking-visitor-expiry',
    type: 'PARKING_VISITOR_PARKING_EXPIRY',
    name: 'Visitor Parking Expiry Processor',
    description: 'Processes expired visitor parking passes',
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
    id: 'job-parking-violation-repeat',
    type: 'PARKING_VIOLATION_REPEAT_OFFENCE',
    name: 'Violation Repeat Offence Processor',
    description: 'Evaluates repeat parking offences and escalates',
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
];

export async function registerParkingJobs(ports: JobPorts): Promise<void> {
  const scheduler = createJobScheduler(ports, { workerId: 'parking-worker-1' });

  scheduler.registerExecutor('PARKING_TEMPORARY_ALLOCATION_EXPIRY', { execute: async (e, p) => (await import('./executors/temporaryAllocationExpiryExecutor')).createTemporaryAllocationExpiryExecutor().execute(e, p) });
  scheduler.registerExecutor('PARKING_VISITOR_PARKING_EXPIRY', { execute: async (e, p) => (await import('./executors/visitorParkingExpiryExecutor')).createVisitorParkingExpiryExecutor().execute(e, p) });
  scheduler.registerExecutor('PARKING_VIOLATION_REPEAT_OFFENCE', { execute: async (e, p) => (await import('./executors/violationRepeatOffenceExecutor')).createViolationRepeatOffenceExecutor().execute(e, p) });

  for (const def of PARKING_JOB_DEFINITIONS) {
    await scheduler.registerJob(def);
  }

  await scheduler.start();
}

export function getParkingJobTypes(): JobType[] {
  return PARKING_JOB_TYPES;
}

export function getParkingJobDefinitions(): JobDefinition[] {
  return PARKING_JOB_DEFINITIONS;
}