export type VolunteerType =
  | 'DOCTOR'
  | 'NURSE'
  | 'FIRST_AID'
  | 'BLOOD_DONOR'
  | 'CAR_AVAILABLE'
  | 'ELDER_SUPPORT'
  | 'PET_RESCUE'
  | 'FIRE_SAFETY_TRAINED'
  | 'DISASTER_VOLUNTEER'
  | 'OTHER';

export type VolunteerAvailability =
  | 'AVAILABLE'
  | 'LIMITED'
  | 'NOT_AVAILABLE'
  | 'ON_CALL_ONLY';

export type VolunteerVerificationStatus =
  | 'NOT_REQUIRED'
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED';

export type VolunteerAlertStatus =
  | 'PENDING'
  | 'AVAILABLE'
  | 'NOT_AVAILABLE'
  | 'REACHED'
  | 'CANCELLED';

export interface EmergencyVolunteer {
  id: string;
  residentId: string;
  name: string;
  volunteerType: VolunteerType;
  availability: VolunteerAvailability;
  tower: string;
  flatNumber: string;
  skillsNote?: string;
  verificationStatus: VolunteerVerificationStatus;
  contactVisibilityConsent: boolean; 
  mobileMasked: string;
  createdAt: string;
}

export interface VolunteerAlert {
  id: string;
  incidentId: string;
  emergencyType: string;
  location: string;
  severity: string;
  volunteerId: string;
  volunteerName: string;
  status: VolunteerAlertStatus;
  alertedAt: string;
  respondedAt?: string;
  responseNote?: string;
}

export interface RegisterVolunteerInput {
  volunteerType: VolunteerType;
  availability: VolunteerAvailability;
  skillsNote?: string;
  contactVisibilityConsent: boolean;
  effectiveFrom?: string;
}
