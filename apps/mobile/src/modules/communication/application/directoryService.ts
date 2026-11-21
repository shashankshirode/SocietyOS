import type { Absent } from '../../../shared/types/absence.types';
import type { AppRole } from '../../../core/permissions/permission.types';
import type {
  CommunicationActor,
  DeniedDecision,
  DeniedTransition,
  CommunicationErrorCode,
  CommunicationOutcome,
  CommunicationScope,
  DirectorySearchResult,
  ResidentDirectoryEntry,
  ResidentOccupancyRole,
  ResidentPrivacySettings,
  TraceContext,
} from '../domain/types';
import { deniedOutcome, deniedOutcomeFromViolation, nextRevision } from '../domain/types';
import {
  evaluateActionPermission,
  evaluateContactPermission,
  evaluateDirectoryVisibility,
  evaluateOccupancyEligible,
  evaluateSessionFreshness,
  evaluateTenantBoundary,
  isCommitteeRole,
} from '../domain/guards/authorizationGuard';
import type { CommunicationPorts } from './ports';

const MAXIMUM_SESSION_AGE_MS = 60 * 60 * 1000;
const MAXIMUM_DIRECTORY_LIMIT = 200;
const MASKED_FLAT_SUFFIX = '•••';
const MASKED_DISPLAY_NAME = 'Resident';

export type DirectorySearchRequest = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly searchTerm: string;
  readonly towerFilter: string | Absent;
  readonly occupancyFilter: readonly ResidentOccupancyRole[];
  readonly limit: number;
  readonly trace: TraceContext;
};

export type DirectoryProfileRequest = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly residentProfileId: string;
  readonly trace: TraceContext;
};

export type PrivacyUpdateRequest = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly residentProfileId: string;
  readonly allowDirectoryListing: boolean;
  readonly showFlatNumber: boolean;
  readonly showDisplayName: boolean;
  readonly allowFirstContact: boolean;
  readonly allowGroupInvite: boolean;
  readonly allowCommitteeContact: boolean;
  readonly sameTowerOnly: boolean;
  readonly allowModerationEvidenceSharing: boolean;
  readonly trace: TraceContext;
};

export type DirectoryService = {
  readonly search: (request: DirectorySearchRequest) => Promise<CommunicationOutcome<DirectorySearchResult>>;
  readonly getProfile: (request: DirectoryProfileRequest) => Promise<CommunicationOutcome<ResidentDirectoryEntry>>;
  readonly getPrivacySettings: (
    societyId: string,
    residentProfileId: string,
  ) => ResidentPrivacySettings;
  readonly updatePrivacySettings: (
    request: PrivacyUpdateRequest,
  ) => Promise<CommunicationOutcome<ResidentPrivacySettings>>;
  readonly toPublicProjection: (entry: ResidentDirectoryEntry) => ResidentDirectoryEntry;
};

function deny(code: CommunicationErrorCode, message: string): CommunicationOutcome<never> {
  return { ok: false, code, message };
}

function denyDecision(decision: DeniedDecision): CommunicationOutcome<never> {
  return deniedOutcome(decision);
}

function denyTransition(transition: DeniedTransition): CommunicationOutcome<never> {
  return deniedOutcomeFromViolation(transition.violation);
}

export function createDirectoryService(ports: CommunicationPorts): DirectoryService {
  const { clock, directoryEntries, privacySettings, blocks } = ports;

  function privacyFor(
    societyId: string,
    residentProfileId: string,
  ): ResidentPrivacySettings {
    const existing = privacySettings.read(societyId, residentProfileId);
    if (existing !== undefined) {
      return existing;
    }
    return {
      residentProfileId,
      societyId,
      allowDirectoryListing: false,
      showFlatNumber: false,
      showDisplayName: false,
      allowFirstContact: false,
      allowGroupInvite: false,
      allowCommitteeContact: true,
      sameTowerOnly: false,
      allowModerationEvidenceSharing: false,
      updatedAtIso: clock.now().toISOString(),
      revision: { revision: 0, revisionToken: 'initial' },
    };
  }

  function isBlockedBetween(
    societyId: string,
    viewerUserId: string,
    subjectUserId: string,
  ): boolean {
    return blocks
      .listByUser(societyId, viewerUserId)
      .some(
        (block) =>
          (block.blockedUserId === subjectUserId &&
            block.blockingUserId === viewerUserId) ||
          (block.blockingUserId === subjectUserId &&
            block.blockedUserId === viewerUserId),
      );
  }

  function project(
    entry: ResidentDirectoryEntry,
    privacy: ResidentPrivacySettings,
    viewerRole: AppRole,
  ): ResidentDirectoryEntry {
    const committee = isCommitteeRole(viewerRole);
    const showFlat = privacy.showFlatNumber || committee;
    const showName = privacy.showDisplayName || committee;
    return {
      ...entry,
      flatNumber: showFlat ? entry.flatNumber : entry.maskedFlatNumber,
      displayName: showName ? entry.displayName : MASKED_DISPLAY_NAME,
    };
  }

  function enrich(
    societyId: string,
    viewerUserId: string,
    entry: ResidentDirectoryEntry,
  ): ResidentDirectoryEntry {
    return {
      ...entry,
      isSelf: entry.userId === viewerUserId,
      isBlocked: isBlockedBetween(societyId, viewerUserId, entry.userId),
    };
  }

  function viewerEntryFor(
    societyId: string,
    userId: string,
  ): ResidentDirectoryEntry | Absent {
    return directoryEntries.readByUserId(societyId, userId);
  }

  async function search(
    request: DirectorySearchRequest,
  ): Promise<CommunicationOutcome<DirectorySearchResult>> {
    if (request.actor.societyId !== request.societyId) {
      return deny('CROSS_SOCIETY_BLOCKED', 'scope.societyId');
    }
    const session = evaluateSessionFreshness(
      request.actor.authenticatedAt,
      clock,
      MAXIMUM_SESSION_AGE_MS,
    );
    if (!session.allowed) {
      return denyDecision(session);
    }
    const permission = evaluateActionPermission(request.actor.role, 'DIRECTORY_SEARCH');
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    const viewer = viewerEntryFor(request.societyId, request.actor.userId);
    if (viewer === undefined) {
      return deny('ACTOR_NOT_AUTHENTICATED', 'actor.userId');
    }

    const normalizedTerm = request.searchTerm.trim().toLowerCase();
    const effectiveLimit = Math.min(
      Math.max(request.limit, 1),
      MAXIMUM_DIRECTORY_LIMIT,
    );
    const candidates = directoryEntries.listBySociety(request.societyId);

    const visible: ResidentDirectoryEntry[] = [];
    for (const candidate of candidates) {
      if (candidate.occupancyStatus !== 'ACTIVE') {
        continue;
      }
      if (request.towerFilter !== undefined && candidate.towerOrWing !== request.towerFilter) {
        continue;
      }
      if (
        request.occupancyFilter.length > 0 &&
        !request.occupancyFilter.includes(candidate.occupancyRole)
      ) {
        continue;
      }
      if (normalizedTerm.length > 0) {
        const haystack =
          `${candidate.displayName} ${candidate.flatNumber} ${candidate.towerOrWing} ${candidate.floorLabel}`.toLowerCase();
        if (!haystack.includes(normalizedTerm)) {
          continue;
        }
      }
      const subjectPrivacy = privacyFor(request.societyId, candidate.residentProfileId);
      const entry = enrich(request.societyId, request.actor.userId, candidate);
      if (entry.isSelf) {
        visible.push(project(entry, subjectPrivacy, request.actor.role));
        continue;
      }
      const decision = evaluateDirectoryVisibility(
        viewer,
        request.actor.userId,
        request.actor.role,
        entry,
        subjectPrivacy,
      );
      if (decision.allowed) {
        visible.push(project(entry, subjectPrivacy, request.actor.role));
      }
    }

    const truncated = visible.length > effectiveLimit;
    return {
      ok: true,
      value: {
        entries: truncated ? visible.slice(0, effectiveLimit) : visible,
        total: visible.length,
        truncated,
      },
      warnings: [],
    };
  }

  async function getProfile(
    request: DirectoryProfileRequest,
  ): Promise<CommunicationOutcome<ResidentDirectoryEntry>> {
    if (request.actor.societyId !== request.societyId) {
      return deny('CROSS_SOCIETY_BLOCKED', 'scope.societyId');
    }
    const permission = evaluateActionPermission(
      request.actor.role,
      'DIRECTORY_VIEW_PROFILE',
    );
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    const entry = directoryEntries.readByResidentProfileId(
      request.societyId,
      request.residentProfileId,
    );
    if (entry === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'directoryEntry');
    }
    const viewer = viewerEntryFor(request.societyId, request.actor.userId);
    if (viewer === undefined) {
      return deny('ACTOR_NOT_AUTHENTICATED', 'actor.userId');
    }
    const subjectPrivacy = privacyFor(request.societyId, entry.residentProfileId);
    const enriched = enrich(request.societyId, request.actor.userId, entry);
    if (!enriched.isSelf) {
      const decision = evaluateDirectoryVisibility(
        viewer,
        request.actor.userId,
        request.actor.role,
        enriched,
        subjectPrivacy,
      );
      if (!decision.allowed) {
        return denyDecision(decision);
      }
    }
    return {
      ok: true,
      value: project(enriched, subjectPrivacy, request.actor.role),
      warnings: [],
    };
  }

  function getPrivacySettings(
    societyId: string,
    residentProfileId: string,
  ): ResidentPrivacySettings {
    return privacyFor(societyId, residentProfileId);
  }

  async function updatePrivacySettings(
    request: PrivacyUpdateRequest,
  ): Promise<CommunicationOutcome<ResidentPrivacySettings>> {
    const tenant = evaluateTenantBoundary(request.actor.societyId, request.societyId);
    if (!tenant.allowed) {
      return denyDecision(tenant);
    }
    const owner = directoryEntries.readByResidentProfileId(
      request.societyId,
      request.residentProfileId,
    );
    if (owner === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'privacy.residentProfileId');
    }
    if (owner.userId !== request.actor.userId) {
      return deny('IDOR_BLOCKED', 'privacy.residentProfileId');
    }
    const current = privacyFor(request.societyId, request.residentProfileId);
    const next: ResidentPrivacySettings = {
      residentProfileId: request.residentProfileId,
      societyId: request.societyId,
      allowDirectoryListing: request.allowDirectoryListing,
      showFlatNumber: request.showFlatNumber,
      showDisplayName: request.showDisplayName,
      allowFirstContact: request.allowFirstContact,
      allowGroupInvite: request.allowGroupInvite,
      allowCommitteeContact: request.allowCommitteeContact,
      sameTowerOnly: request.sameTowerOnly,
      allowModerationEvidenceSharing: request.allowModerationEvidenceSharing,
      updatedAtIso: clock.now().toISOString(),
      revision: nextRevision(current.revision),
    };
    privacySettings.upsert(next);
    return { ok: true, value: next, warnings: [] };
  }

  function toPublicProjection(entry: ResidentDirectoryEntry): ResidentDirectoryEntry {
    return {
      ...entry,
      flatNumber: entry.maskedFlatNumber,
      displayName: MASKED_DISPLAY_NAME,
    };
  }

  return {
    search,
    getProfile,
    getPrivacySettings,
    updatePrivacySettings,
    toPublicProjection,
  };
}
