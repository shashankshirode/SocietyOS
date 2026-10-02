export type AdminRole = 'SOCIETY_ADMIN' | 'CHAIRPERSON' | 'SECRETARY' | 'TREASURER' | 'COMMITTEE_MEMBER';

export type AdminInvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED' | 'USED';

export interface SocietyAdminInvitation {
  id: string;
  societyId: string;
  societyName: string;
  name: string;
  email: string;
  mobile: string;
  role: AdminRole;
  status: AdminInvitationStatus;
  token: string;
  expiresAt: string;
  createdAt: string;
  invitedBy: string;
  acceptedAt?: string;
}

export interface CreateAdminInvitationRequest {
  societyId: string;
  name: string;
  email: string;
  mobile: string;
  role: AdminRole;
  invitedBy: string;
}

export interface AdminInvitationListFilters {
  societyId: string;
  status?: AdminInvitationStatus;
}

export interface AdminInvitationDetail extends SocietyAdminInvitation {
  societyName: string;
}