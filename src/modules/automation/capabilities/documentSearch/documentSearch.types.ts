export type DocumentSearchRequest = {
  query: string;
  filters?: {
    documentTypes?: string[];
    categories?: string[];
    dateRange?: { from: string; to: string };
    tags?: string[];
    uploadedBy?: string[];
  };
  societyId: string;
  requestedBy: string;
  maxResults?: number;
  includeRestricted?: boolean;
};

export type DocumentSearchResult = {
  requestId: string;
  query: string;
  answer: string;
  answerType: 'FOUND_IN_SOURCE' | 'INFERRED' | 'NOT_FOUND';
  confidence: number;
  confidenceBand: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';
  sourceReferences: Array<{
    type: 'SOURCE_DOCUMENT' | 'REPORT_METRIC' | 'HISTORICAL_DATA' | 'ENTITY_REFERENCE';
    entityId: string;
    entityType: string;
    documentId?: string;
    pageNumber?: number;
    chunkId?: string;
    asOf: string;
    excerpt?: string;
    relevanceScore: number;
  }>;
  modelVersion: string;
  templateVersion: number;
  source: 'AI_PROVIDER' | 'RULE_FALLBACK';
  warnings: string[];
  requiresReview: boolean;
  processingTimeMs: number;
  completedAt: string;
  expiresAt?: string;
};

export type DocumentChunk = {
  documentId: string;
  chunkId: string;
  content: string;
  pageNumber?: number;
  metadata: {
    title: string;
    category: string;
    uploadedBy: string;
    uploadedAt: string;
    tags: string[];
    societyId: string;
    accessLevel: 'PUBLIC' | 'RESIDENTS' | 'STAFF' | 'ADMIN' | 'RESTRICTED';
  };
};

export type DocumentSearchFilter = {
  documentTypes?: string[];
  categories?: string[];
  dateRange?: { from: string; to: string };
  tags?: string[];
  uploadedBy?: string[];
  accessLevel?: DocumentChunk['metadata']['accessLevel'][];
};

export function validateSearchQuery(query: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!query || query.trim().length < 3) {
    errors.push('Query must be at least 3 characters');
  }

  if (query.length > 500) {
    errors.push('Query too long (max 500 characters)');
  }

  const injectionPatterns = [
    /ignore\s+(previous|all)\s+(instructions|rules)/i,
    /system\s*:\s*/i,
    /<\s*script\s*>/i,
    /javascript\s*:/i,
    /on\w+\s*=/i,
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(query)) {
      errors.push('Query contains potentially malicious content');
      break;
    }
  }

  return { valid: errors.length === 0, errors };
}

export function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}