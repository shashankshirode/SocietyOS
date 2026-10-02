import { mockStore } from '../../../core/mockStore/mockStore';
import type { SocietyAdminInvitation, CreateAdminInvitationRequest, AdminInvitationStatus } from '../data/admin.types';
import type { Absent } from "../../../shared/types/absence.types";

export class AdminService {
  static async getAdminInvitations(societyId: string): Promise<SocietyAdminInvitation[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const invitations = mockStore.getState().adminInvitations?.filter((inv) => inv.societyId === societyId) || [];
        resolve(invitations);
      }, 300);
    });
  }

  static async createAdminInvitation(request: CreateAdminInvitationRequest & { societyName?: string }): Promise<SocietyAdminInvitation> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const invitation: SocietyAdminInvitation = {
          id: `admin-inv-${Date.now()}`,
          societyId: request.societyId,
          societyName: request.societyName || '',
          name: request.name,
          email: request.email,
          mobile: request.mobile,
          role: request.role,
          status: 'PENDING',
          token: `admin-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          invitedBy: request.invitedBy,
        };
        mockStore.addAdminInvitation(invitation);
        resolve(invitation);
      }, 400);
    });
  }

  static async acceptAdminInvitation(token: string): Promise<SocietyAdminInvitation | Absent> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const invitations = mockStore.getState().adminInvitations || [];
        const invitation = invitations.find((inv) => inv.token === token);
        if (!invitation) {
          resolve(undefined);
          return;
        }
        if (invitation.status !== 'PENDING') {
          resolve(undefined);
          return;
        }
        if (new Date(invitation.expiresAt) < new Date()) {
          resolve(undefined);
          return;
        }
        const updatedInvitation = { ...invitation, status: 'ACCEPTED' as AdminInvitationStatus, acceptedAt: new Date().toISOString() };
        mockStore.updateAdminInvitation(invitation.id, updatedInvitation);
        resolve(updatedInvitation);
      }, 400);
    });
  }

  static async getAdminInvitationByToken(token: string): Promise<SocietyAdminInvitation | Absent> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const invitations = mockStore.getState().adminInvitations || [];
        const invitation = invitations.find((inv) => inv.token === token);
        resolve(invitation);
      }, 300);
    });
  }

  static async activateAdminAccount(invitation: SocietyAdminInvitation, password: string): Promise<{
    userId: string;
    session: any;
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userId = `admin-${Date.now()}`;
        const session = {
          userId,
          name: invitation.name,
          role: invitation.role,
          societyId: invitation.societyId,
          societyName: invitation.societyName,
          unitId: undefined,
          isMockSession: true,
          token: `mock-token-${userId}`,
          refreshToken: `mock-refresh-${userId}`,
        };
        resolve({ userId, session });
      }, 400);
    });
  }
}