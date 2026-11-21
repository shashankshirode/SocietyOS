export interface ResidentProfileInfo {
  id: string;
  name: string;
  role: 'OWNER' | 'TENANT' | 'FAMILY';
  email: string;
  phone: string;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  policeVerified: boolean;
  activeAgreementFile?: string;
  vehiclesCount: number;
  accessStatus: 'ACTIVE' | 'SUSPENDED';
}
