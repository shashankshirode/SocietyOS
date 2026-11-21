const residenceBase = '/v1/resident/residences';

export const residenceAccessEndpoints = {
  list: residenceBase,
  detail: (residenceAccessId: string) => `${residenceBase}/${residenceAccessId}`,
  eligibility: (residenceAccessId: string) => `${residenceBase}/${residenceAccessId}/eligibility`,
  requirements: (residenceAccessId: string) => `${residenceBase}/${residenceAccessId}/requirements`,
  documents: (residenceAccessId: string) => `${residenceBase}/${residenceAccessId}/documents`,
  document: (residenceAccessId: string, documentId: string) => `${residenceBase}/${residenceAccessId}/documents/${documentId}`,
  submit: (residenceAccessId: string) => `${residenceBase}/${residenceAccessId}/submit`,
  reminders: (residenceAccessId: string) => `${residenceBase}/${residenceAccessId}/reminders`,
  ownerConsent: (residenceAccessId: string) => `${residenceBase}/${residenceAccessId}/owner-consent`,
  resubmit: (residenceAccessId: string) => `${residenceBase}/${residenceAccessId}/resubmit`,
  appeals: (residenceAccessId: string) => `${residenceBase}/${residenceAccessId}/appeals`,
  reactivation: (residenceAccessId: string) => `${residenceBase}/${residenceAccessId}/reactivation`,
  suspensionResolution: (residenceAccessId: string) => `${residenceBase}/${residenceAccessId}/suspension-resolution`,
  timeline: (residenceAccessId: string) => `${residenceBase}/${residenceAccessId}/timeline`,
  decisions: (residenceAccessId: string) => `${residenceBase}/${residenceAccessId}/decisions`,
  link: `${residenceBase}/link`,
  activate: (residenceAccessId: string) => `${residenceBase}/${residenceAccessId}/activate`,
  withdraw: (residenceAccessId: string) => `${residenceBase}/${residenceAccessId}/withdraw`,
} as const;
