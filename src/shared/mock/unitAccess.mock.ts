import type { UnitAccessStatusInfo } from '../types/unitAccess.types';

export const mockUnitAccessStatus: UnitAccessStatusInfo = {
  unitId: 'unit-a-1204',
  residentId: 'resident-001',
  residentName: 'Shashank Shirode',
  residentType: 'OWNER',
  accessStatus: 'ACTIVE',
  capabilities: [
    {
      capability: 'APP_LOGIN',
      label: 'Application Login Portal',
      description: 'Allows authorization to download app, check billing, and log complaints.',
      isAllowed: true,
    },
    {
      capability: 'VISITOR_APPROVAL',
      label: 'Interactive Visitor Approval',
      description: 'Allows interactive push-notification requests to approve or deny incoming visits.',
      isAllowed: true,
    },
    {
      capability: 'GATE_PASS',
      label: 'Digital QR Gate Passes',
      description: 'Allows generating visitor passes, cabs, and delivery entry authorizations.',
      isAllowed: true,
    },
    {
      capability: 'VEHICLE_ACCESS',
      label: 'RFID Sticker Gate Access',
      description: 'Enables automatic boom-barrier lift logs at gate entrances using RFID stickers.',
      isAllowed: true,
    },
    {
      capability: 'FACILITY_BOOKING',
      label: 'Clubhouse Facility Booking',
      description: 'Allows booking community halls, sports slots, and gym check-ins.',
      isAllowed: true,
    },
    {
      capability: 'DOCUMENT_ACCESS',
      label: 'Digital Document Vault Logs',
      description: 'Enables upload and download permissions for verification files.',
      isAllowed: true,
    },
    {
      capability: 'RESIDENT_CONNECT',
      label: 'Resident Directory & Board',
      description: 'Enables visibility in directory listing and posting messages on bulletin boards.',
      isAllowed: true,
    },
  ],
  lastModifiedDate: '2026-06-29 11:20 AM',
  lastModifiedBy: 'Society Admin System',
};

export const mockRevokedAccessStatus: UnitAccessStatusInfo = {
  unitId: 'unit-a-1204',
  residentId: 'tenant-001',
  residentName: 'Rahul Deshmukh',
  residentType: 'TENANT',
  accessStatus: 'REVOKED',
  capabilities: [
    {
      capability: 'APP_LOGIN',
      label: 'Application Login Portal',
      description: 'Allows authorization to download app, check billing, and log complaints.',
      isAllowed: false,
    },
    {
      capability: 'VISITOR_APPROVAL',
      label: 'Interactive Visitor Approval',
      description: 'Allows interactive push-notification requests to approve or deny incoming visits.',
      isAllowed: false,
    },
    {
      capability: 'GATE_PASS',
      label: 'Digital QR Gate Passes',
      description: 'Allows generating visitor passes, cabs, and delivery entry authorizations.',
      isAllowed: false,
    },
    {
      capability: 'VEHICLE_ACCESS',
      label: 'RFID Sticker Gate Access',
      description: 'Enables automatic boom-barrier lift logs at gate entrances using RFID stickers.',
      isAllowed: false,
    },
    {
      capability: 'FACILITY_BOOKING',
      label: 'Clubhouse Facility Booking',
      description: 'Allows booking community halls, sports slots, and gym check-ins.',
      isAllowed: false,
    },
    {
      capability: 'DOCUMENT_ACCESS',
      label: 'Digital Document Vault Logs',
      description: 'Enables upload and download permissions for verification files.',
      isAllowed: false,
    },
    {
      capability: 'RESIDENT_CONNECT',
      label: 'Resident Directory & Board',
      description: 'Enables visibility in directory listing and posting messages on bulletin boards.',
      isAllowed: false,
    },
  ],
  lastModifiedDate: '2026-06-30 00:00 AM (Scheduled)',
  lastModifiedBy: 'Society Auto-Revocation Engine',
  warningNote: 'This tenant profile is queued for access revocation post move-out completion.',
};
