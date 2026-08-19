export type AutomationPreview = {
  id: string;
  title: string;
  input: string;
  output: string;
  confidence: number;
  safetyNote: string;
};

export type AutomationAuditLogEntry = {
  id: string;
  automationName: string;
  actorName: string;
  action: string;
  createdAt: string;
};
