

export type ResidentRole = 'OWNER' | 'TENANT' | 'FAMILY_MEMBER';

export interface ResidentProfile {
  id: string;
  name: string;
  role: ResidentRole;
  societyName: string;
  tower: string;
  flatNumber: string;
  city: string;
  memberSince: string;
  phone?: string;
  email?: string;
}
