import type { Absent } from '../../../../shared/types/absence.types';
import type { CommunicationScope, Revision } from './primitives';

export type ResidentOccupancyRole = 'OWNER' | 'TENANT' | 'FAMILY' | 'AUTHORIZED_OCCUPANT' | 'FORMER';

export type OccupancyStatus = 'ACTIVE' | 'INACTIVE' | 'MOVED_OUT' | 'SUSPENDED';

export type DirectoryVisibilityStatus = 'VISIBLE' | 'RESTRICTED' | 'HIDDEN';

export type DirectoryEntryScope = 'SOCIETY_DIRECTORY' | 'TOWER_DIRECTORY' | 'FLOOR_DIRECTORY' | 'UNIT_ONLY';

export type ResidentPrivacySettings = {
  readonly residentProfileId: string;
  readonly societyId: string;
  readonly allowDirectoryListing: boolean;
  readonly showFlatNumber: boolean;
  readonly showDisplayName: boolean;
  readonly allowFirstContact: boolean;
  readonly allowGroupInvite: boolean;
  readonly allowCommitteeContact: boolean;
  readonly sameTowerOnly: boolean;
  readonly allowModerationEvidenceSharing: boolean;
  readonly updatedAtIso: string;
  readonly revision: Revision;
};

export type ResidentDirectoryEntry = {
  readonly id: string;
  readonly scope: CommunicationScope;
  readonly societyId: string;
  readonly residentProfileId: string;
  readonly userId: string;
  readonly unitId: string;
  readonly flatNumber: string;
  readonly towerOrWing: string;
  readonly floorLabel: string;
  readonly floorSortOrder: number;
  readonly occupancyRole: ResidentOccupancyRole;
  readonly occupancyStatus: OccupancyStatus;
  readonly displayName: string;
  readonly maskedFlatNumber: string;
  readonly visibilityStatus: DirectoryVisibilityStatus;
  readonly contactRequestsAllowed: boolean;
  readonly groupInvitesAllowed: boolean;
  readonly isAdult: boolean;
  readonly isSelf: boolean;
  readonly isBlocked: boolean;
  readonly isFormerResident: boolean;
  readonly createdAtIso: string;
  readonly updatedAtIso: string;
  readonly revision: Revision;
};

export type ResidentDirectoryQuery = {
  readonly societyId: string;
  readonly viewerUserId: string;
  readonly searchTerm: string;
  readonly towerFilter: string | Absent;
  readonly occupancyFilter: readonly ResidentOccupancyRole[];
  readonly includeCommitteeOrphans: boolean;
  readonly limit: number;
};

export type ResidentBlock = {
  readonly id: string;
  readonly scope: CommunicationScope;
  readonly societyId: string;
  readonly blockingUserId: string;
  readonly blockingResidentProfileId: string;
  readonly blockedUserId: string;
  readonly blockedResidentProfileId: string;
  readonly reason: string | Absent;
  readonly createdAtIso: string;
  readonly createdByUserId: string;
  readonly revision: Revision;
};

export type ContactRequestTopic =
  | 'NEIGHBOUR_COORDINATION'
  | 'PARKING'
  | 'MAINTENANCE_IMPACT'
  | 'COMMUNITY_ACTIVITY'
  | 'MISDELIVERED_ITEM'
  | 'OTHER';

export type ContactRequestStatus =
  | 'DRAFT'
  | 'REQUESTED'
  | 'PENDING_CONSENT'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'BLOCKED'
  | 'REPORTED'
  | 'CLOSED';

export type ContactRequestRecord = {
  readonly id: string;
  readonly scope: CommunicationScope;
  readonly societyId: string;
  readonly requesterUserId: string;
  readonly requesterResidentProfileId: string;
  readonly requesterUnitId: string;
  readonly recipientUserId: string;
  readonly recipientResidentProfileId: string;
  readonly recipientUnitId: string;
  readonly subject: string;
  readonly introductoryMessage: string;
  readonly topic: ContactRequestTopic;
  readonly status: ContactRequestStatus;
  readonly channelId: string | Absent;
  readonly createdAtIso: string;
  readonly expiresAtIso: string;
  readonly respondedAtIso: string | Absent;
  readonly responseReason: string | Absent;
  readonly closedAtIso: string | Absent;
  readonly reportedAtIso: string | Absent;
  readonly revision: Revision;
};

export type ContactRequestPair = {
  readonly societyId: string;
  readonly residentProfileIdA: string;
  readonly residentProfileIdB: string;
};

export type DirectorySearchResult = {
  readonly entries: readonly ResidentDirectoryEntry[];
  readonly total: number;
  readonly truncated: boolean;
};
