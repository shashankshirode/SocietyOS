const permissionLabels: Readonly<Record<string, string>> = {
  'resident.community': 'Community',
  'resident.billing': 'Maintenance',
  'resident.billing.pay': 'Pay maintenance',
  'resident.documents': 'Documents',
  'resident.documents.request': 'Request certificates',
  'resident.visitors': 'Visitor access',
  'resident.facilities': 'Facilities',
  'resident.complaints': 'Issues & help',
  'resident.governance': 'Society governance',
  'resident.emergency': 'Emergency help',
  DOCUMENT_VIEW_RESTRICTED: 'Residence documents',
  OWNER_TENANT_VIEW_RESTRICTED_DOCS: 'Residence history',
  INTER_FLAT_RESOLUTION_PARTY: 'Issue resolution',
  ELECTION_MANAGE: 'Election management',
};

export function getResidentPermissionLabel(permission: string): string | null {
  return permissionLabels[permission] ?? null;
}
