import {
  DocumentSearchRequest,
  DocumentSearchResult,
  DocumentChunk,
  DocumentSearchFilter,
  validateSearchQuery,
  sanitizeSearchQuery,
} from './documentSearch.types';
import { aiOrchestrationService } from '../../../aiServices/core/services';

const mockDocumentStore: Map<string, DocumentChunk[]> = new Map();

function initializeMockDocuments(): void {
  const docs: DocumentChunk[] = [
    {
      documentId: 'doc-fire-noc-2025',
      chunkId: 'chunk-1',
      content: 'Fire NOC Certificate for Society OS Residency. Certificate Number: FNC-2025-001. Valid from 2025-01-01 to 2026-12-31. Issued by Mumbai Fire Brigade. Society Address: Tower A, B, C, Sector 10, Navi Mumbai.',
      pageNumber: 1,
      metadata: {
        title: 'Fire NOC Certificate 2025-2026',
        category: 'COMPLIANCE',
        uploadedBy: 'Facility Manager',
        uploadedAt: '2025-01-15T10:00:00Z',
        tags: ['fire', 'noc', 'certificate', 'compliance'],
        societyId: 'soc-canonical-01',
        accessLevel: 'RESIDENTS',
      },
    },
    {
      documentId: 'doc-lift-amc-2025',
      chunkId: 'chunk-1',
      content: 'Lift Annual Maintenance Contract. Vendor: Otis Elevators. Contract Period: 2025-04-01 to 2026-03-31. Coverage: 8 lifts across Towers A, B, C. Quarterly service schedule. Emergency response time: 2 hours.',
      pageNumber: 1,
      metadata: {
        title: 'Lift AMC 2025-2026',
        category: 'AMC',
        uploadedBy: 'Facility Manager',
        uploadedAt: '2025-04-01T09:00:00Z',
        tags: ['lift', 'amc', 'maintenance', 'otis'],
        societyId: 'soc-canonical-01',
        accessLevel: 'STAFF',
      },
    },
    {
      documentId: 'doc-water-policy-2025',
      chunkId: 'chunk-1',
      content: 'Water Management Policy. Municipal supply: 6 AM - 10 AM daily. Borewell backup: 10 AM - 6 PM. Tanker requests: Submit 24 hours in advance. Water meters read on 1st of each month. Conservation guidelines attached.',
      pageNumber: 1,
      metadata: {
        title: 'Water Management Policy 2025',
        category: 'UTILITY',
        uploadedBy: 'Facility Manager',
        uploadedAt: '2025-02-01T11:00:00Z',
        tags: ['water', 'policy', 'municipal', 'borewell', 'tanker'],
        societyId: 'soc-canonical-01',
        accessLevel: 'RESIDENTS',
      },
    },
  ];

  mockDocumentStore.set('soc-canonical-01', docs);
}

initializeMockDocuments();

function getAuthorizedDocuments(
  societyId: string,
  userRole: string,
  includeRestricted: boolean
): DocumentChunk[] {
  const docs = mockDocumentStore.get(societyId) || [];
  const allowedLevels: Record<string, string[]> = {
    RESIDENT: ['PUBLIC', 'RESIDENTS'],
    STAFF: ['PUBLIC', 'RESIDENTS', 'STAFF'],
    FACILITY_MANAGER: ['PUBLIC', 'RESIDENTS', 'STAFF', 'ADMIN'],
    SUPER_ADMIN: ['PUBLIC', 'RESIDENTS', 'STAFF', 'ADMIN', 'RESTRICTED'],
  };

  const userLevels = allowedLevels[userRole] || ['PUBLIC'];

  return docs.filter(doc =>
    userLevels.includes(doc.metadata.accessLevel) ||
    (includeRestricted && userRole === 'SUPER_ADMIN')
  );
}

function searchDocuments(
  documents: DocumentChunk[],
  query: string,
  filters: DocumentSearchFilter,
  maxResults: number
): DocumentChunk[] {
  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  const scored = documents.map(doc => {
    let score = 0;
    const content = doc.content.toLowerCase();
    const title = doc.metadata.title.toLowerCase();
    const tags = doc.metadata.tags.map(t => t.toLowerCase());

    for (const term of queryTerms) {
      if (title.includes(term)) score += 10;
      if (content.includes(term)) score += 5;
      if (tags.some(t => t.includes(term))) score += 3;
    }

    if (filters.documentTypes && !filters.documentTypes.includes(doc.metadata.category)) {
      score = -1;
    }
    if (filters.categories && !filters.categories.includes(doc.metadata.category)) {
      score = -1;
    }
    if (filters.tags && !filters.tags.some(t => doc.metadata.tags.includes(t))) {
      score = -1;
    }
    if (filters.dateRange) {
      const docDate = new Date(doc.metadata.uploadedAt);
      const from = new Date(filters.dateRange.from);
      const to = new Date(filters.dateRange.to);
      if (docDate < from || docDate > to) score = -1;
    }

    return { doc, score };
  })
  .filter(r => r.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, maxResults)
  .map(r => r.doc);
}

export const documentSearchService = {
  async searchDocuments(
    request: DocumentSearchRequest,
    userRole: string
  ): Promise<DocumentSearchResult> {
    const validation = validateSearchQuery(request.query);
    if (!validation.valid) {
      throw new Error(`Invalid query: ${validation.errors.join(', ')}`);
    }

    const sanitizedQuery = sanitizeSearchQuery(request.query);

    const aiCommand = {
      capability: 'DOCUMENT_SEARCH' as const,
      input: {
        query: sanitizedQuery,
        filters: request.filters,
        maxResults: request.maxResults || 10,
      },
      societyId: request.societyId,
      requestedBy: request.requestedBy,
      priority: 'NORMAL',
      timeoutMs: 30000,
    };

    const authorizedDocs = getAuthorizedDocuments(request.societyId, userRole, request.includeRestricted);
    const relevantDocs = searchDocuments(authorizedDocs, sanitizedQuery, request.filters || {}, request.maxResults || 10);

    const aiResponse = await aiOrchestrationService.requestAnalysis(aiCommand);

    const answerOutput = aiResponse.primaryOutput as any;
    const result: DocumentSearchResult = {
      requestId: aiResponse.requestId,
      query: request.query,
      answer: answerOutput.answer,
      answerType: answerOutput.answerType,
      confidence: answerOutput.confidence,
      confidenceBand: answerOutput.confidenceBand,
      sourceReferences: answerOutput.sourceReferences || this.buildSourceReferences(relevantDocs),
      modelVersion: aiResponse.modelVersion,
      templateVersion: aiResponse.templateVersion,
      source: aiResponse.source,
      warnings: [...(aiResponse.warnings || []), ...this.validateAnswer(answerOutput.answer, answerOutput.answerType)],
      requiresReview: aiResponse.status === 'REQUIRES_REVIEW' || aiResponse.confidence < 0.6,
      processingTimeMs: aiResponse.processingTimeMs,
      completedAt: aiResponse.completedAt,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return result;
  },

  buildSourceReferences(docs: DocumentChunk[]): Array<{
    type: 'SOURCE_DOCUMENT' | 'REPORT_METRIC' | 'HISTORICAL_DATA' | 'ENTITY_REFERENCE';
    entityId: string;
    entityType: string;
    documentId?: string;
    pageNumber?: number;
    chunkId?: string;
    asOf: string;
    excerpt?: string;
    relevanceScore: number;
  }> {
    return docs.map((doc, index) => ({
      type: 'SOURCE_DOCUMENT' as const,
      entityId: doc.documentId,
      entityType: 'DOCUMENT',
      documentId: doc.documentId,
      pageNumber: doc.pageNumber,
      chunkId: doc.chunkId,
      asOf: doc.metadata.uploadedAt,
      excerpt: doc.content.substring(0, 200),
      relevanceScore: Math.max(0.9 - index * 0.1, 0.1),
    }));
  },

  validateAnswer(answer: string, answerType: string): string[] {
    const warnings: string[] = [];

    if (answerType === 'FOUND_IN_SOURCE' && answer.toLowerCase().includes('not found')) {
      warnings.push('ANSWER_MISMATCH: Answer claims "not found" but type is FOUND_IN_SOURCE');
    }

    if (answerType === 'NOT_FOUND' && !answer.toLowerCase().includes('not found') && !answer.toLowerCase().includes('cannot find')) {
      warnings.push('ANSWER_MISMATCH: Type is NOT_FOUND but answer does not reflect this');
    }

    const hallucinationMarkers = [
      'according to the document',
      'the document states',
      'as per the record',
    ];
    const hasCitation = hallucinationMarkers.some(m => answer.toLowerCase().includes(m));
    if (answerType === 'FOUND_IN_SOURCE' && !hasCitation && answer.length > 100) {
      warnings.push('POTENTIAL_HALLUCINATION: Answer claims source but lacks citation markers');
    }

    return warnings;
  },

  getAuthorizedDocuments(societyId: string, userRole: string, includeRestricted: boolean): DocumentChunk[] {
    return getAuthorizedDocuments(societyId, userRole, includeRestricted);
  },

  searchLocal(
    query: string,
    filters: DocumentSearchFilter,
    maxResults: number,
    societyId: string,
    userRole: string
  ): DocumentChunk[] {
    const docs = getAuthorizedDocuments(societyId, userRole, false);
    return searchDocuments(docs, query, filters, maxResults);
  },
};