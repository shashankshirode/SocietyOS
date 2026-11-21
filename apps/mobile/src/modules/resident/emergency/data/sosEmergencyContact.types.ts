





import type { SosType, EmergencyNotificationChannel } from './sosResponsePlan.types';




export type EmergencyContactCategory =
  | 'familyMember'
  | 'trustedResident'
  | 'externalContact'
  | 'serviceProvider'
  | 'medicalProfessional';


export type EmergencyContactRelationshipType =
  | 'spouse'
  | 'parent'
  | 'child'
  | 'sibling'
  | 'inLaw'
  | 'grandparent'
  | 'grandchild'
  | 'cousin'
  | 'friend'
  | 'neighbour'
  | 'colleague'
  | 'familyDoctor'
  | 'caretaker'
  | 'driver'
  | 'other';




export type EmergencyContactConsentStatus =
  | 'pending'
  | 'granted'
  | 'declined'
  | 'revoked';




export interface SosEmergencyContact {
  readonly id: string;
  readonly residenceId: string;
  readonly societyId: string;
  readonly displayName: string;
  readonly category: EmergencyContactCategory;
  readonly relationship: EmergencyContactRelationshipType;
  readonly phoneNumber: string;
  readonly phoneMasked: string;
  readonly email?: string;
  readonly residentReferenceId?: string; 
  readonly preferredChannels: EmergencyNotificationChannel[];
  readonly active: boolean;
  readonly verified: boolean;
  readonly consentStatus: EmergencyContactConsentStatus;
  readonly priority: number; 
  readonly availableForSosTypes: SosType[];
  readonly notes?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}



export interface CreateSosEmergencyContactInput {
  readonly displayName: string;
  readonly category: EmergencyContactCategory;
  readonly relationship: EmergencyContactRelationshipType;
  readonly phoneNumber: string;
  readonly email?: string;
  readonly residentReferenceId?: string;
  readonly preferredChannels: EmergencyNotificationChannel[];
  readonly priority: number;
  readonly availableForSosTypes: SosType[];
  readonly notes?: string;
}

export interface UpdateSosEmergencyContactInput {
  readonly displayName?: string;
  readonly category?: EmergencyContactCategory;
  readonly relationship?: EmergencyContactRelationshipType;
  readonly phoneNumber?: string;
  readonly email?: string;
  readonly preferredChannels?: EmergencyNotificationChannel[];
  readonly priority?: number;
  readonly availableForSosTypes?: SosType[];
  readonly active?: boolean;
  readonly notes?: string;
}



export type TrustedContactInvitationStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'expired'
  | 'cancelled';


export interface TrustedContactInvitation {
  readonly id: string;
  readonly residenceId: string;
  readonly societyId: string;
  readonly requestorResidentId: string;
  readonly requestorName: string;
  readonly requestorUnit: string;
  readonly recipientResidentId: string;
  readonly recipientName: string;
  readonly recipientUnit: string;
  readonly sosTypesRequested: SosType[];
  readonly reason?: string;
  readonly status: TrustedContactInvitationStatus;
  readonly createdAt: string;
  readonly respondedAt?: string;
  readonly expiresAt: string;
}

export interface CreateTrustedContactInvitationInput {
  readonly recipientResidentId: string;
  readonly sosTypesRequested: SosType[];
  readonly reason?: string;
}
