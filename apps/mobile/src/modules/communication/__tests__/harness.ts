import type {
  CommunicationActor,
  ResidentDirectoryEntry,
  ResidentOccupancyRole,
  ResidentPrivacySettings,
  TraceContext,
} from '../domain/types';
import type { AppRole } from '../../../core/permissions/permission.types';
import type { CommunicationPorts } from '../application/ports';
import { createInMemoryCommunicationRepository } from '../infrastructure/inMemoryCommunicationRepository';
import { createDirectoryService } from '../application/directoryService';
import { createContactRequestService } from '../application/contactRequestService';
import { createMessageService } from '../application/messageService';
import { createModerationService } from '../application/moderationService';
import { createNoticeService } from '../application/noticeService';

export const SOCIETY_ID = 'society-1';
export const START_INSTANT = new Date('2026-09-01T09:00:00.000Z');

export function buildTrace(correlationId: string): TraceContext {
  return { correlationId, causationId: undefined };
}

export function buildActor(
  userId: string,
  role: AppRole,
  overrides: { readonly societyId?: string; readonly sessionAgeMs?: number } = {},
): CommunicationActor {
  const societyId = overrides.societyId ?? SOCIETY_ID;
  const sessionAgeMs = overrides.sessionAgeMs ?? 60 * 1000;
  return {
    userId,
    role,
    actorType: role.startsWith('RESIDENT') ? 'RESIDENT_OWNER' : 'SOCIETY_ADMIN',
    societyId,
    sessionId: `session-${userId}`,
    authenticatedAt: new Date(START_INSTANT.getTime() - sessionAgeMs).toISOString(),
  };
}

export function buildEntry(
  residentProfileId: string,
  userId: string,
  options: {
    readonly unitId?: string;
    readonly flatNumber?: string;
    readonly towerOrWing?: string;
    readonly floorLabel?: string;
    readonly occupancyRole?: ResidentOccupancyRole;
    readonly occupancyStatus?: ResidentDirectoryEntry['occupancyStatus'];
    readonly visibilityStatus?: ResidentDirectoryEntry['visibilityStatus'];
    readonly groupInvitesAllowed?: boolean;
    readonly isSelf?: boolean;
  } = {},
): ResidentDirectoryEntry {
  const towerOrWing = options.towerOrWing ?? 'A';
  const flatNumber = options.flatNumber ?? `${towerOrWing}-101`;
  return {
    id: `entry-${residentProfileId}`,
    scope: {
      societyId: SOCIETY_ID,
      owningEntityType: 'RESIDENT_DIRECTORY_ENTRY',
      owningEntityId: residentProfileId,
    },
    societyId: SOCIETY_ID,
    residentProfileId,
    userId,
    unitId: options.unitId ?? `unit-${flatNumber}`,
    flatNumber,
    towerOrWing,
    floorLabel: options.floorLabel ?? '1',
    floorSortOrder: 1,
    occupancyRole: options.occupancyRole ?? 'OWNER',
    occupancyStatus: options.occupancyStatus ?? 'ACTIVE',
    displayName: `Resident ${residentProfileId}`,
    maskedFlatNumber: `${towerOrWing}-•••`,
    visibilityStatus: options.visibilityStatus ?? 'VISIBLE',
    contactRequestsAllowed: true,
    groupInvitesAllowed: options.groupInvitesAllowed ?? true,
    isAdult: true,
    isSelf: options.isSelf ?? false,
    isBlocked: false,
    isFormerResident: (options.occupancyStatus ?? 'ACTIVE') === 'MOVED_OUT',
    createdAtIso: START_INSTANT.toISOString(),
    updatedAtIso: START_INSTANT.toISOString(),
    revision: { revision: 1, revisionToken: 'rev-1' },
  };
}

export function buildPrivacy(
  residentProfileId: string,
  overrides: Partial<ResidentPrivacySettings> = {},
): ResidentPrivacySettings {
  return {
    residentProfileId,
    societyId: SOCIETY_ID,
    allowDirectoryListing: true,
    showFlatNumber: true,
    showDisplayName: true,
    allowFirstContact: true,
    allowGroupInvite: true,
    allowCommitteeContact: false,
    sameTowerOnly: false,
    allowModerationEvidenceSharing: false,
    updatedAtIso: START_INSTANT.toISOString(),
    revision: { revision: 1, revisionToken: 'rev-1' },
    ...overrides,
  };
}

export type CommunicationHarness = {
  readonly repository: ReturnType<typeof createInMemoryCommunicationRepository>;
  readonly ports: CommunicationPorts;
  readonly directory: ReturnType<typeof createDirectoryService>;
  readonly contactRequests: ReturnType<typeof createContactRequestService>;
  readonly messages: ReturnType<typeof createMessageService>;
  readonly moderation: ReturnType<typeof createModerationService>;
  readonly notices: ReturnType<typeof createNoticeService>;
  readonly advanceTo: (instant: Date) => void;
};

export function createHarness(): CommunicationHarness {
  const repository = createInMemoryCommunicationRepository(START_INSTANT);
  const ports: CommunicationPorts = {
    clock: repository.clock,
    directoryEntries: repository.directoryEntries,
    privacySettings: repository.privacySettings,
    blocks: repository.blocks,
    contactRequests: repository.contactRequests,
    contactAcceptance: repository.contactAcceptance,
    channels: repository.channels,
    channelMemberships: repository.channelMemberships,
    messages: repository.messages,
    readReceipts: repository.readReceipts,
    unreadSummaries: repository.unreadSummaries,
    messageDeliveryAttempts: repository.messageDeliveryAttempts,
    queuedMessages: repository.queuedMessages,
    moderationCases: repository.moderationCases,
    moderationEvidence: repository.moderationEvidence,
    moderationAccessGrants: repository.moderationAccessGrants,
    moderationAudit: repository.moderationAudit,
    notices: repository.notices,
    noticeRevisions: repository.noticeRevisions,
    noticeAudiences: repository.noticeAudiences,
    noticeRecipients: repository.noticeRecipients,
    noticeDeliveryAttempts: repository.noticeDeliveryAttempts,
    noticeAcknowledgements: repository.noticeAcknowledgements,
    audit: repository.audit,
    idempotency: repository.idempotency,
    notificationProviders: [],
    realtime: repository.realtime,
  };
  return {
    repository,
    ports,
    directory: createDirectoryService(ports),
    contactRequests: createContactRequestService(ports),
    messages: createMessageService(ports),
    moderation: createModerationService(ports),
    notices: createNoticeService(ports),
    advanceTo: (instant: Date): void => {
      repository.advanceClockTo(instant);
    },
  };
}

export function seedResident(
  harness: CommunicationHarness,
  residentProfileId: string,
  userId: string,
  options: Parameters<typeof buildEntry>[2] = {},
  privacyOverrides: Partial<ResidentPrivacySettings> = {},
): ResidentDirectoryEntry {
  const entry = buildEntry(residentProfileId, userId, options);
  harness.repository.directoryEntries.insert(entry);
  harness.repository.privacySettings.upsert(
    buildPrivacy(residentProfileId, privacyOverrides),
  );
  return entry;
}
