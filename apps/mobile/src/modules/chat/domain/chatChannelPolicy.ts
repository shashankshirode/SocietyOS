import type {
  ChannelAssignmentValidation,
  ChatChannelCode,
  ChatChannelDefinition,
  ChatChannelMembership,
  RecommendedChannelAssignment,
  RequestedChannelAssignment,
  StaffRoleCode,
} from './chat.types';

const recommendations: Readonly<Record<StaffRoleCode, readonly RecommendedChannelAssignment[]>> = {
  securityGuard: [{ channelCode: 'securityGate', recommendedAccessLevel: 'member', isRequired: true }],
  securitySupervisor: [
    { channelCode: 'securityGate', recommendedAccessLevel: 'member', isRequired: true },
    { channelCode: 'securityDesk', recommendedAccessLevel: 'moderator', isRequired: false },
  ],
  treasurer: [
    { channelCode: 'accounts', recommendedAccessLevel: 'channelManager', isRequired: true },
    { channelCode: 'societyOffice', recommendedAccessLevel: 'member', isRequired: false },
  ],
  accountant: [{ channelCode: 'accounts', recommendedAccessLevel: 'member', isRequired: true }],
  facilityManager: [
    { channelCode: 'facilityHelpdesk', recommendedAccessLevel: 'channelManager', isRequired: true },
    { channelCode: 'securityDesk', recommendedAccessLevel: 'member', isRequired: false },
    { channelCode: 'societyOffice', recommendedAccessLevel: 'member', isRequired: false },
  ],
  facilityExecutive: [{ channelCode: 'facilityHelpdesk', recommendedAccessLevel: 'member', isRequired: true }],
  secretary: [
    { channelCode: 'societyOffice', recommendedAccessLevel: 'channelManager', isRequired: true },
    { channelCode: 'accounts', recommendedAccessLevel: 'member', isRequired: false },
  ],
  chairperson: [{ channelCode: 'societyOffice', recommendedAccessLevel: 'channelManager', isRequired: true }],
  committeeMember: [{ channelCode: 'societyOffice', recommendedAccessLevel: 'member', isRequired: false }],
  societyManager: [
    { channelCode: 'societyOffice', recommendedAccessLevel: 'channelManager', isRequired: true },
    { channelCode: 'facilityHelpdesk', recommendedAccessLevel: 'moderator', isRequired: false },
    { channelCode: 'securityDesk', recommendedAccessLevel: 'moderator', isRequired: false },
  ],
  officeExecutive: [{ channelCode: 'societyOffice', recommendedAccessLevel: 'member', isRequired: true }],
};

const eligibleCodes: Readonly<Record<StaffRoleCode, readonly ChatChannelCode[]>> = {
  securityGuard: ['securityGate'],
  securitySupervisor: ['securityGate', 'securityDesk'],
  treasurer: ['accounts', 'societyOffice'],
  accountant: ['accounts'],
  facilityManager: ['facilityHelpdesk', 'securityDesk', 'societyOffice'],
  facilityExecutive: ['facilityHelpdesk'],
  secretary: ['societyOffice', 'accounts'],
  chairperson: ['societyOffice'],
  committeeMember: ['societyOffice', 'accounts'],
  societyManager: ['societyOffice', 'facilityHelpdesk', 'securityDesk'],
  officeExecutive: ['societyOffice'],
};

export function getRecommendedChannelAssignments(
  roleCode: StaffRoleCode,
): readonly RecommendedChannelAssignment[] {
  return recommendations[roleCode];
}

export function canRoleJoinChannel(roleCode: StaffRoleCode, channelCode: ChatChannelCode): boolean {
  return eligibleCodes[roleCode].includes(channelCode);
}

export function validateChannelAssignments(input: {
  roleCode: StaffRoleCode;
  channels: readonly ChatChannelDefinition[];
  assignments: readonly RequestedChannelAssignment[];
  existingMemberships: readonly ChatChannelMembership[];
  hasGateOperationalAssignment: boolean;
}): ChannelAssignmentValidation[] {
  const results: ChannelAssignmentValidation[] = [];
  const requestedIds = new Set<string>();
  const channelById = new Map(input.channels.map((channel) => [channel.channelId, channel]));

  input.assignments.forEach((assignment) => {
    const channel = channelById.get(assignment.channelId);
    if (!channel?.isEnabled) results.push({ valid: false, code: 'channelDisabled', channelId: assignment.channelId });
    if (requestedIds.has(assignment.channelId)) {
      results.push({ valid: false, code: 'duplicateMembership', channelId: assignment.channelId });
    }
    requestedIds.add(assignment.channelId);
    if (channel && !canRoleJoinChannel(input.roleCode, channel.code)) {
      results.push({ valid: false, code: 'roleNotEligible', channelId: assignment.channelId });
    }
    if (
      input.existingMemberships.some((membership) =>
        membership.channelId === assignment.channelId && membership.status === 'active')
    ) {
      results.push({ valid: false, code: 'duplicateMembership', channelId: assignment.channelId });
    }
    if (channel?.code === 'securityGate' && !input.hasGateOperationalAssignment) {
      results.push({ valid: false, code: 'gateAssignmentRequired', channelId: assignment.channelId });
    }
  });

  const requiredCodes = recommendations[input.roleCode]
    .filter((recommendation) => recommendation.isRequired)
    .map((recommendation) => recommendation.channelCode);
  requiredCodes.forEach((requiredCode) => {
    const requiredChannel = input.channels.find((channel) => channel.code === requiredCode && channel.isEnabled);
    if (requiredChannel && !input.assignments.some((assignment) => assignment.channelId === requiredChannel.channelId)) {
      results.push({ valid: false, code: 'channelRequired', channelId: requiredChannel.channelId });
    }
  });

  return results.length > 0 ? results : [{ valid: true }];
}
