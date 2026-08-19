import { EmergencyContact } from '../types/emergency.types';

export const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: 'emg-001',
    name: 'Society Security',
    mobileNumber: '9876500001',
    relationship: 'SECURITY',
    iconName: 'shield-checkmark',
    available24x7: true,
  },
  {
    id: 'emg-002',
    name: 'Fire Brigade',
    mobileNumber: '101',
    relationship: 'FIRE_STATION',
    iconName: 'flame',
    available24x7: true,
  },
  {
    id: 'emg-003',
    name: 'Ambulance',
    mobileNumber: '108',
    relationship: 'HOSPITAL',
    iconName: 'medkit',
    available24x7: true,
  },
  {
    id: 'emg-004',
    name: 'Police',
    mobileNumber: '100',
    relationship: 'POLICE',
    iconName: 'call',
    available24x7: true,
  },
  {
    id: 'emg-005',
    name: 'Society Chairman',
    mobileNumber: '9876500005',
    relationship: 'SECURITY',
    iconName: 'person',
    available24x7: false,
  },
];

export interface EmergencyTypeOption {
  key: string;
  label: string;
  icon: string;
}

export const mockEmergencyTypes: EmergencyTypeOption[] = [
  { key: 'MEDICAL', label: 'Medical Emergency', icon: 'medkit-outline' },
  { key: 'FIRE', label: 'Fire Alert', icon: 'flame-outline' },
  { key: 'LIFT', label: 'Lift Stuck', icon: 'swap-vertical-outline' },
  { key: 'SECURITY', label: 'Security Threat', icon: 'shield-outline' },
  { key: 'ACCIDENT', label: 'Accident / Injury', icon: 'medical-outline' },
  { key: 'SUSPICIOUS', label: 'Suspicious Person', icon: 'eye-outline' },
  { key: 'CHILD_SAFETY', label: 'Child Safety', icon: 'people-outline' },
  { key: 'SENIOR_HELP', label: 'Senior Citizen Help', icon: 'heart-outline' },
  { key: 'OTHER', label: 'Other Support', icon: 'help-circle-outline' },
];
