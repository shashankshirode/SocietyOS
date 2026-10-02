export type KnowledgeSourceType =
  | 'DOCUMENT_VAULT'
  | 'BYLAWS'
  | 'POLICY'
  | 'NOTICE'
  | 'MEETING_MINUTES'
  | 'RESOLUTION'
  | 'POLICY_DOCUMENT'
  | 'RULES'
  | 'GUIDELINES'
  | 'PROCEDURE'
  | 'FAQ'
  | 'MANUAL'
  | 'HANDBOOK'
  | 'CIRCULAR'
  | 'ORDINANCE'
  | 'REGULATION'
  | 'STATUTE'
  | 'ACT'
  | 'RULE'
  | 'FORM'
  | 'TEMPLATE'
  | 'CHECKLIST'
  | 'PROCESS'
  | 'WORKFLOW'
  | 'SOP'
  | 'MANUAL_ENTRY'
  | 'EXTERNAL_API'
  | 'WEB_SCRAPE'
  | 'MUNICIPAL_FEED'
  | 'GOVERNMENT_PORTAL'
  | 'REGULATORY_BODY'
  | 'UTILITY_PROVIDER'
  | 'WEATHER_PROVIDER'
  | 'TRAFFIC_PROVIDER'
  | 'NEWS_FEED'
  | 'SOCIAL_MEDIA'
  | 'RESIDENT_REPORT'
  | 'GUARD_REPORT'
  | 'STAFF_REPORT'
  | 'VENDOR_REPORT'
  | 'AUDIT_REPORT'
  | 'INSPECTION_REPORT'
  | 'INCIDENT_REPORT'
  | 'MAINTENANCE_LOG'
  | 'WORK_ORDER'
  | 'AMC_RECORD'
  | 'ASSET_REGISTER'
  | 'VENDOR_CONTRACT'
  | 'VENDOR_INVOICE'
  | 'SLA_REPORT'
  | 'KPI_REPORT'
  | 'AUDIT_TRAIL'
  | 'COMPLIANCE_REPORT'
  | 'FINANCIAL_REPORT'
  | 'BUDGET'
  | 'FORECAST'
  | 'PLAN'
  | 'STRATEGY'
  | 'ROADMAP'
  | 'ARCHITECTURE'
  | 'DESIGN'
  | 'SPECIFICATION'
  | 'REQUIREMENT'
  | 'TEST_PLAN'
  | 'TEST_CASE'
  | 'TEST_RESULT'
  | 'BUG_REPORT'
  | 'FEATURE_REQUEST'
  | 'CHANGE_REQUEST'
  | 'INCIDENT_REPORT'
  | 'PROBLEM_RECORD'
  | 'CHANGE_RECORD'
  | 'RELEASE_NOTE'
  | 'DEPLOYMENT_LOG'
  | 'BUILD_LOG'
  | 'TEST_LOG'
  | 'ACCESS_LOG'
  | 'AUDIT_LOG'
  | 'SECURITY_LOG'
  | 'ERROR_LOG'
  | 'DEBUG_LOG'
  | 'PERFORMANCE_LOG'
  | 'METRICS_LOG'
  | 'USAGE_LOG'
  | 'ACTIVITY_LOG'
  | 'EVENT_LOG'
  | 'ALERT_LOG'
  | 'NOTIFICATION_LOG'
  | 'MESSAGE_LOG'
  | 'CHAT_LOG'
  | 'CALL_LOG'
  | 'VIDEO_LOG'
  | 'AUDIO_LOG'
  | 'IMAGE_LOG'
  | 'DOCUMENT_LOG'
  | 'FILE_LOG'
  | 'DATA_LOG'
  | 'STATE_LOG'
  | 'CONFIG_LOG'
  | 'DEPLOYMENT_LOG'
  | 'MIGRATION_LOG'
  | 'BACKUP_LOG'
  | 'RESTORE_LOG'
  | 'ARCHIVE_LOG'
  | 'PURGE_LOG'
  | 'RETENTION_LOG'
  | 'DISPOSAL_LOG'
  | 'DESTRUCTION_LOG'
  | 'WIPE_LOG'
  | 'ERASURE_LOG'
  | 'SANITIZATION_LOG';

export type KnowledgeSourceStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ACTIVE'
  | 'ARCHIVED'
  | 'SUPERSEDED'
  | 'EXPIRED'
  | 'WITHDRAWN'
  | 'REVOKED'
  | 'REJECTED'
  | 'DEPRECATED'
  | 'OBSOLETE'
  | 'INACTIVE'
  | 'DISABLED'
  | 'PENDING_DELETION'
  | 'SCHEDULED_FOR_DELETION'
  | 'MARKED_FOR_DELETION'
  | 'PENDING_PURGE'
  | 'SCHEDULED_FOR_PURGE'
  | 'MARKED_FOR_PURGE'
  | 'PENDING_ANONYMIZATION'
  | 'SCHEDULED_FOR_ANONYMIZATION'
  | 'MARKED_FOR_ANONYMIZATION'
  | 'PENDING_ARCHIVAL'
  | 'SCHEDULED_FOR_ARCHIVAL'
  | 'MARKED_FOR_ARCHIVAL'
  | 'PENDING_RESTORATION'
  | 'SCHEDULED_FOR_RESTORATION'
  | 'MARKED_FOR_RESTORATION'
  | 'PENDING_RECOVERY'
  | 'SCHEDULED_FOR_RECOVERY'
  | 'MARKED_FOR_RECOVERY';

export type KnowledgeEligibility =
  | 'SEARCHABLE'
  | 'AI_READABLE'
  | 'SEMANTIC_SEARCHABLE'
  | 'VECTOR_SEARCHABLE'
  | 'KEYWORD_SEARCHABLE'
  | 'FULL_TEXT_SEARCHABLE'
  | 'METADATA_SEARCHABLE'
  | 'FILTERABLE'
  | 'SORTABLE'
  | 'FACETABLE'
  | 'AGGREGATABLE'
  | 'EXPORTABLE'
  | 'DOWNLOADABLE'
  | 'PRINTABLE'
  | 'SHAREABLE'
  | 'EMBEDDABLE'
  | 'LINKABLE'
  | 'REFERENCEABLE'
  | 'CITABLE'
  | 'ATTRIBUTABLE'
  | 'VERIFIABLE'
  | 'AUDITABLE'
  | 'TRACEABLE'
  | 'REPRODUCIBLE'
  | 'VALIDATABLE';

export type KnowledgeSource = {
  sourceId: string;
  societyId: string;
  sourceType: KnowledgeSourceType;
  title: string;
  description?: string;
  category: string;
  subCategory?: string;
  tags: string[];
  status: KnowledgeSourceStatus;
  eligibility: KnowledgeEligibility[];
  version: string;
  versionHistory: KnowledgeVersion[];
  effectiveFrom: string;
  effectiveTo?: string;
  supersededBy?: string;
  supersedes?: string;
  documentId?: string;
  documentVersionId?: string;
  documentChunkIds?: string[];
  authorId: string;
  authorRole: string;
  approverId?: string;
  approverRole?: string;
  approvedAt?: string;
  publishedAt?: string;
  archivedAt?: string;
  supersededAt?: string;
  expiredAt?: string;
  supersededByVersion?: string;
  supersedesVersion?: string;
  visibility: 'PUBLIC_TO_SOCIETY' | 'RESIDENT_SCOPE' | 'HOUSEHOLD_SCOPE' | 'ADMIN_OPERATIONAL' | 'FINANCIAL_SENSITIVE' | 'SECURITY_SENSITIVE' | 'DOCUMENT_SENSITIVE' | 'STAFF_SENSITIVE' | 'PRIVATE_COMMUNICATION' | 'RESTRICTED';
  accessRoles: string[];
  accessUnits?: string[];
  accessTowers?: string[];
  accessHouseholds?: string[];
  sensitivityClassification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'TOP_SECRET';
  retentionPolicy: {
    retentionDays: number;
    archiveAfterDays?: number;
    deleteAfterDays?: number;
    legalHold?: boolean;
    legalHoldReason?: string;
    legalHoldExpiry?: string;
  };
  metadata: {
    language: string;
    locale: string;
    encoding: string;
    format: string;
    mimeType: string;
    sizeBytes: number;
    pageCount?: number;
    wordCount?: number;
    characterCount?: number;
    lineCount?: number;
    paragraphCount?: number;
    sectionCount?: number;
    chapterCount?: number;
    tableCount?: number;
    figureCount?: number;
    imageCount?: number;
    chartCount?: number;
    diagramCount?: number;
    codeBlockCount?: number;
    formulaCount?: number;
    referenceCount?: number;
    citationCount?: number;
    footnoteCount?: number;
    endnoteCount?: number;
    appendixCount?: number;
    indexCount?: number;
    glossaryCount?: number;
    bibliographyCount?: number;
    annexCount?: number;
    attachmentCount?: number;
    embeddedObjectCount?: number;
    hyperlinkCount?: number;
    crossReferenceCount?: number;
    internalLinkCount?: number;
    externalLinkCount?: number;
    bookmarkCount?: number;
    headingCount?: number;
    listCount?: number;
    tableCount?: number;
    formCount?: number;
    fieldCount?: number;
    inputCount?: number;
    buttonCount?: number;
    linkCount?: number;
    imageCount?: number;
    videoCount?: number;
    audioCount?: number;
    embeddedObjectCount?: number;
  };
  checksum: string;
  checksumAlgorithm: 'SHA256' | 'SHA512' | 'MD5' | 'SHA1' | 'BLAKE2' | 'BLAKE3';
  embeddingModel?: string;
  embeddingVersion?: string;
  chunkIds?: string[];
  chunkCount?: number;
  totalChunks?: number;
  embeddingChecksum?: string;
  indexingStatus: 'PENDING' | 'QUEUED' | 'PROCESSING' | 'INDEXING' | 'INDEXED' | 'FAILED' | 'PARTIAL' | 'RETRYING' | 'SKIPPED' | 'CANCELLED' | 'BLOCKED' | 'PAUSED' | 'REQUIRES_REVIEW' | 'REQUIRES_APPROVAL' | 'REQUIRES_MANUAL_INTERVENTION';
  indexedAt?: string;
  indexedBy?: string;
  indexingAttempts: number;
  lastIndexedAt?: string;
  lastIndexingError?: string;
  nextIndexAttemptAt?: string;
  searchIndexId?: string;
  vectorIndexId?: string;
  vectorIndexVersion?: string;
  embeddingModelVersion?: string;
  embeddingDimensions?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
  deletedAt?: string;
  deletedBy?: string;
  deletionReason?: string;
};

export type KnowledgeVersion = {
  versionId: string;
  sourceId: string;
  version: string;
  versionNumber: number;
  changelog: string;
  changedBy: string;
  changedAt: string;
  changeType: 'MINOR' | 'MAJOR' | 'PATCH' | 'HOTFIX' | 'SECURITY' | 'FEATURE' | 'BUGFIX' | 'DOCS' | 'REFACTOR' | 'STYLE' | 'TEST' | 'CHORE' | 'BUILD' | 'CI' | 'REVERT' | 'MERGE' | 'SQUASH' | 'REBASE' | 'CHERRY_PICK' | 'AMEND' | 'REBASE' | 'INTERACTIVE' | 'AUTO' | 'MANUAL';
  previousVersionId?: string;
  changedSections: string[];
  changeSummary: string;
  impactAssessment: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  migrationRequired: boolean;
  migrationNotes?: string;
  rollbackPossible: boolean;
  rollbackVersionId?: string;
  approvedBy?: string;
  approvedAt?: string;
  deployedAt?: string;
  deployedBy?: string;
  rollbackAt?: string;
  rolledBackBy?: string;
  rollbackReason?: string;
};

export type KnowledgeChunk = {
  chunkId: string;
  sourceId: string;
  sourceVersionId: string;
  chunkIndex: number;
  totalChunks: number;
  content: string;
  sanitizedContent: string;
  contentHash: string;
  contentHashAlgorithm: 'SHA256' | 'SHA512' | 'MD5' | 'SHA1' | 'BLAKE2' | 'BLAKE3';
  startPosition: number;
  endPosition: number;
  startLine?: number;
  endLine?: number;
  startPage?: number;
  endPage?: number;
  sectionTitle?: string;
  sectionPath?: string;
  sectionLevel?: number;
  parentChunkId?: string;
  childChunkIds: string[];
  siblingChunkIds: string[];
  metadata: {
    language: string;
    locale: string;
    encoding: string;
    tokenCount: number;
    wordCount: number;
    characterCount: number;
    sentenceCount: number;
    paragraphCount: number;
    headingCount: number;
    listCount: number;
    tableCount: number;
    codeBlockCount: number;
    formulaCount: number;
    referenceCount: number;
    citationCount: number;
    footnoteCount: number;
    endnoteCount?: number;
    headingLevel?: number;
    headingPath?: string;
    breadcrumbPath?: string;
    tags: string[];
    entities: string[];
    keywords: string[];
    topics: string[];
    categories: string[];
    sentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    sentimentScore?: number;
    readabilityScore?: number;
    complexityScore?: number;
    technicalityScore?: number;
    domainSpecificity?: number;
  };
  embedding?: number[];
  embeddingModel?: string;
  embeddingVersion?: string;
  embeddingDimensions?: number;
  embeddingChecksum?: string;
  embeddingChecksumAlgorithm?: 'SHA256' | 'SHA512' | 'MD5' | 'SHA1' | 'BLAKE2' | 'BLAKE3';
  vectorIndexId?: string;
  vectorIndexVersion?: string;
  vectorIndexedAt?: string;
  vectorIndexedBy?: string;
  vectorIndexingStatus: 'PENDING' | 'QUEUED' | 'PROCESSING' | 'INDEXED' | 'FAILED' | 'PARTIAL' | 'RETRYING' | 'SKIPPED' | 'CANCELLED' | 'BLOCKED' | 'PAUSED' | 'REQUIRES_REVIEW';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
  deletedAt?: string;
  deletedBy?: string;
  deletionReason?: string;
  retentionExpiresAt?: string;
};

export type KnowledgeSearchRequest = {
  query: string;
  queryType: 'SEMANTIC' | 'KEYWORD' | 'HYBRID' | 'FULL_TEXT' | 'METADATA' | 'FILTERED' | 'FACETED' | 'AGGREGATED' | 'AGGREGATE' | 'ANALYTICAL' | 'ANALYTICS' | 'REPORTING' | 'DASHBOARD' | 'VISUALIZATION' | 'EXPORT' | 'EXPORT_CSV' | 'EXPORT_JSON' | 'EXPORT_PDF' | 'EXPORT_EXCEL' | 'EXPORT_XLSX' | 'EXPORT_XLS' | 'EXPORT_ODS' | 'EXPORT_ODT' | 'EXPORT_RTF' | 'EXPORT_TXT' | 'EXPORT_MD' | 'EXPORT_HTML' | 'EXPORT_XML' | 'EXPORT_YAML' | 'EXPORT_TOML' | 'EXPORT_INI' | 'EXPORT_CFG' | 'EXPORT_CONF' | 'EXPORT_PROPERTIES' | 'EXPORT_ENV' | 'EXPORT_YML' | 'EXPORT_YAML';
  filters?: {
    sourceTypes?: KnowledgeSourceType[];
    categories?: string[];
    tags?: string[];
    statuses?: KnowledgeSourceStatus[];
    eligibility?: KnowledgeEligibility[];
    dateRange?: { from: string; to: string };
    effectiveDateRange?: { from: string; to: string };
    versionRange?: { from: string; to: string };
    authors?: string[];
    approvers?: string[];
    societies?: string[];
    units?: string[];
    towers?: string[];
    households?: string[];
    roles?: string[];
    sensitivity?: string[];
    accessRoles?: string[];
    languages?: string[];
    locales?: string[];
    formats?: string[];
    mimeTypes?: string[];
    tags?: string[];
    entities?: string[];
    keywords?: string[];
    topics?: string[];
    categories?: string[];
  };
  sortBy?: 'relevance' | 'date' | 'title' | 'version' | 'relevanceScore' | 'popularity' | 'usageCount' | 'rating' | 'recency' | 'freshness' | 'popularity' | 'authority' | 'credibility' | 'reliability' | 'accuracy' | 'completeness' | 'freshness' | 'recency';
  sortOrder?: 'ASC' | 'DESC';
  pagination?: {
    page: number;
    pageSize: number;
    cursor?: string;
    offset?: number;
    limit?: number;
  };
  options?: {
    includeChunks?: boolean;
    includeMetadata?: boolean;
    includeEmbeddings?: boolean;
    includeVectorScores?: boolean;
    includeSourceReferences?: boolean;
    includeVersionHistory?: boolean;
    includeSuperseded?: boolean;
    includeExpired?: boolean;
    includeArchived?: boolean;
    includeDrafts?: boolean;
    includePending?: boolean;
    includeRestricted?: boolean;
    includePrivate?: boolean;
    includeConfidential?: boolean;
    includeRestrictedAccess?: boolean;
    minRelevanceScore?: number;
    maxResults?: number;
    timeoutMs?: number;
    useCache?: boolean;
    cacheTtlSeconds?: number;
    bypassCache?: boolean;
    forceRefresh?: boolean;
  };
};

export type KnowledgeSearchResult = {
  searchId: string;
  query: string;
  queryType: KnowledgeSearchRequest['queryType'];
  totalResults: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
  results: KnowledgeSearchResultItem[];
  facets?: Record<string, Array<{ value: string; count: number }>>;
  suggestions?: string[];
  corrections?: string[];
  relatedQueries?: string[];
  searchTimeMs: number;
  indexVersion: string;
  cacheHit: boolean;
  cacheKey?: string;
  cacheTtlSeconds?: number;
  warnings?: string[];
  errors?: string[];
};

export type KnowledgeSearchResultItem = {
  sourceId: string;
  sourceType: KnowledgeSourceType;
  version: string;
  title: string;
  description?: string;
  snippet?: string;
  highlightedSnippet?: string;
  relevanceScore: number;
  confidence: number;
  sourceType: KnowledgeSourceType;
  sourceTitle: string;
  sourceCategory: string;
  sourceStatus: KnowledgeSourceStatus;
  sourceEligibility: KnowledgeEligibility[];
  sourceVisibility: KnowledgeSource['visibility'];
  sourceSensitivity: KnowledgeSource['sensitivityClassification'];
  effectiveFrom: string;
  effectiveTo?: string;
  supersededBy?: string;
  supersedes?: string;
  version: string;
  versionNumber: number;
  versionHistory?: KnowledgeVersion[];
  authorId: string;
  authorRole: string;
  approverId?: string;
  approverRole?: string;
  approvedAt?: string;
  publishedAt?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  metadata: KnowledgeSource['metadata'];
  chunks?: KnowledgeChunk[];
  chunkMatches?: Array<{
    chunkId: string;
    snippet: string;
    highlightedSnippet: string;
    relevanceScore: number;
    confidence: number;
    position: number;
    sectionTitle?: string;
    sectionPath?: string;
  }>;
  relevanceScore: number;
  confidence: number;
  sourceReferences: Array<{
    type: 'SOURCE_DOCUMENT' | 'REPORT_METRIC' | 'HISTORICAL_DATA' | 'ENTITY_REFERENCE' | 'EXTERNAL_API';
    entityId: string;
    entityType: string;
    documentId?: string;
    pageNumber?: number;
    chunkId?: string;
    asOf: string;
    excerpt?: string;
    relevanceScore: number;
  }>;
  deepLink?: string;
  permissionChecked: boolean;
  accessGranted: boolean;
  accessDeniedReason?: string;
};

export type KnowledgeRetrievalRequest = {
  query: KnowledgeSearchRequest;
  actorContext: {
    actorId: string;
    societyId: string;
    unitId?: string;
    householdId?: string;
    role: string;
    capabilities: string[];
    permissions: string[];
  };
  intent: {
    type: 'QUERY' | 'ANSWER' | 'SUMMARY' | 'EXPLANATION' | 'LOOKUP' | 'VERIFY' | 'COMPARE' | 'ANALYZE' | 'SYNTHESIZE' | 'EXTRACT' | 'TRANSFORM' | 'TRANSLATE' | 'SUMMARIZE' | 'CLASSIFY' | 'CATEGORIZE' | 'EXTRACT' | 'IDENTIFY' | 'DETECT' | 'MATCH' | 'FIND' | 'SEARCH' | 'LOOKUP' | 'QUERY' | 'ASK' | 'ANSWER' | 'EXPLAIN' | 'DESCRIBE' | 'DEFINE' | 'LIST' | 'ENUMERATE' | 'COUNT' | 'CALCULATE' | 'COMPUTE' | 'AGGREGATE' | 'SUM' | 'AVERAGE' | 'MIN' | 'MAX' | 'MEDIAN' | 'MODE' | 'STDDEV' | 'VARIANCE' | 'PERCENTILE' | 'QUANTILE' | 'RANK' | 'SORT' | 'FILTER' | 'GROUP' | 'PIVOT' | 'TRANSPOSE' | 'MERGE' | 'JOIN' | 'UNION' | 'INTERSECT' | 'DIFFERENCE' | 'EXCEPT' | 'SYMMETRIC_DIFFERENCE' | 'CARTESIAN_PRODUCT' | 'CROSS_JOIN' | 'INNER_JOIN' | 'LEFT_JOIN' | 'RIGHT_JOIN' | 'FULL_JOIN' | 'NATURAL_JOIN' | 'SELF_JOIN' | 'CROSS_APPLY' | 'OUTER_APPLY';
  };
  outputFormat: 'STRUCTURED' | 'NATURAL_LANGUAGE' | 'BOTH';
  citationRequired: boolean;
  maxSources?: number;
  maxTokens?: number;
  timeoutMs?: number;
  requireGrounding?: boolean;
  minConfidence?: number;
};

export type KnowledgeRetrievalResult = {
  requestId: string;
  query: string;
  intent: KnowledgeRetrievalRequest['intent'];
  answer: string;
  answerType: 'FACTUAL' | 'SUMMARY' | 'EXPLANATION' | 'RECOMMENDATION' | 'FORECAST' | 'DRAFT' | 'UNAVAILABLE' | 'NEEDS_CLARIFICATION';
  confidence: number;
  confidenceBand: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';
  sources: Array<{
    sourceId: string;
    sourceType: string;
    sourceVersion: string;
    documentId?: string;
    documentVersion?: string;
    chunkId?: string;
    pageNumber?: number;
    sectionTitle?: string;
    sectionPath?: string;
    excerpt: string;
    asOf: string;
    version: string;
    relevanceScore: number;
    confidence: number;
    permissionChecked: boolean;
    accessGranted: boolean;
    accessDeniedReason?: string;
  }>;
  warnings: string[];
  dataFreshness: string;
  modelVersion: string;
  templateVersion: string;
  processingTimeMs: number;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  confidenceBand: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';
  warnings: string[];
  completedAt: string;
  expiresAt?: string;
};

export type KnowledgeIndexConfig = {
  indexName: string;
  indexVersion: string;
  societyId: string;
  embeddingModel: string;
  embeddingVersion: string;
  embeddingDimensions: number;
  chunkingStrategy: 'FIXED_SIZE' | 'SEMANTIC' | 'RECURSIVE' | 'DOCUMENT_AWARE' | 'SECTION_AWARE' | 'HEADING_AWARE' | 'SENTENCE_AWARE' | 'PARAGRAPH_AWARE' | 'TOKEN_AWARE' | 'WORD_AWARE' | 'CHARACTER_AWARE' | 'BYTE_AWARE';
  chunkSize: number;
  chunkOverlap: number;
  maxChunkSize: number;
  minChunkSize: number;
  chunkOverlapStrategy: 'FIXED' | 'PROPORTIONAL' | 'ADAPTIVE' | 'SEMANTIC' | 'CONTEXTUAL' | 'OVERLAP_AWARE' | 'CONTEXT_AWARE' | 'SEMANTIC_AWARE' | 'STRUCTURAL' | 'HIERARCHICAL';
  embeddingModel: string;
  embeddingVersion: string;
  embeddingDimensions: number;
  embeddingBatchSize: number;
  embeddingMaxTokens: number;
  embeddingTimeoutMs: number;
  embeddingRetries: number;
  embeddingTimeoutMs: number;
  embeddingProvider: string;
  embeddingApiKey?: string;
  embeddingEndpoint?: string;
  embeddingModelVersion?: string;
  vectorIndexType: 'FLAT' | 'IVF_FLAT' | 'IVF_SQ8' | 'IVF_PQ' | 'HNSW' | 'ANNOY' | 'NGT' | 'SPTAG' | 'FAISS' | 'MILVUS' | 'WEAVIATE' | 'PINECONE' | 'QDRANT' | 'CHROMA' | 'LANCEDB' | 'TANTIVY' | 'MEILISEARCH' | 'TYPESENSE' | 'SONAR' | 'VESPA' | 'ELASTICSEARCH' | 'OPENSEARCH' | 'SOLR' | 'LUCENE' | 'WHOOSH' | 'XAPIAN' | 'ZETTA' | 'ROCKSDB' | 'LEVELDB' | 'SQLITE' | 'DUCKDB' | 'POSTGRESQL' | 'MYSQL' | 'MARIADB' | 'COCKROACHDB' | 'TIDB' | 'OCEANBASE' | 'POLARDB' | 'GAUSSDB' | 'KINGBASE' | 'HIGO' | 'DAMENG' | 'SEQUOIADB' | 'GBASE' | 'KUNLUN' | 'SHENTONG' | 'OTHER';
  vectorIndexConfig: Record<string, any>;
  indexingSchedule: 'REALTIME' | 'BATCH' | 'INCREMENTAL' | 'FULL' | 'INCREMENTAL_DAILY' | 'INCREMENTAL_HOURLY' | 'INCREMENTAL_MINUTELY' | 'SCHEDULED_DAILY' | 'SCHEDULED_HOURLY' | 'SCHEDULED_WEEKLY' | 'SCHEDULED_MONTHLY' | 'ON_DEMAND' | 'MANUAL' | 'TRIGGERED' | 'EVENT_DRIVEN' | 'WEBHOOK_DRIVEN' | 'SCHEDULE_DRIVEN' | 'CRON_DRIVEN' | 'TIMER_DRIVEN' | 'EVENT_DRIVEN' | 'WEBHOOK_DRIVEN';
  scheduleExpression?: string;
  timezone: string;
  retryPolicy: {
    maxRetries: number;
    retryDelayMs: number;
    backoffMultiplier: number;
    maxRetryDelayMs: number;
    retryableErrors: string[];
    nonRetryableErrors: string[];
  };
  indexingScope: 'ALL' | 'NEW_ONLY' | 'UPDATED_ONLY' | 'CHANGED_ONLY' | 'MODIFIED_ONLY' | 'NEW_AND_UPDATED' | 'ACTIVE_ONLY' | 'PUBLISHED_ONLY' | 'APPROVED_ONLY' | 'EFFECTIVE_ONLY' | 'CURRENT_ONLY' | 'LATEST_ONLY' | 'LATEST_VERSION_ONLY' | 'NON_SUPERSEDED_ONLY' | 'NON_EXPIRED_ONLY' | 'NON_ARCHIVED_ONLY' | 'NON_DRAFT_ONLY' | 'NON_PENDING_ONLY';
  filters: {
    sourceTypes?: string[];
    categories?: string[];
    tags?: string[];
    statuses?: string[];
    eligibilities?: string[];
    visibility?: string[];
    sensitivity?: string[];
    languages?: string[];
    locales?: string[];
    formats?: string[];
    mimeTypes?: string[];
    societies?: string[];
    authors?: string[];
    approvers?: string[];
    dateRange?: { from: string; to: string };
  };
  qualityThresholds: {
    minContentLength: number;
    maxContentLength: number;
    minChunkSize: number;
    maxChunkSize: number;
    minTokenCount: number;
    maxTokenCount: number;
    minConfidence: number;
    maxConfidence: number;
    minRelevance: number;
    maxRelevance: number;
    minFreshness: number;
    maxFreshness: number;
    minQualityScore: number;
    maxQualityScore: number;
  };
  deduplication: {
    enabled: boolean;
    strategy: 'EXACT_MATCH' | 'FUZZY_MATCH' | 'SEMANTIC_MATCH' | 'CONTENT_HASH' | 'SEMANTIC_HASH' | 'FUZZY_HASH' | 'MINHASH' | 'SIMHASH' | 'LSH' | 'BLOOM_FILTER' | 'COUNT_MIN_SKETCH' | 'HYPERLOGLOG' | 'CMS' | 'KMV' | 'BOTTOM_K' | 'ADAPTIVE' | 'ADAPTIVE_K' | 'ADAPTIVE_KMV' | 'ADAPTIVE_SIMHASH' | 'ADAPTIVE_LSH' | 'ADAPTIVE_BLOOM' | 'ADAPTIVE_COUNT_MIN' | 'ADAPTIVE_HYPERLOGLOG' | 'ADAPTIVE_CMS' | 'ADAPTIVE_KMV' | 'ADAPTIVE_BOTTOM_K';
    threshold: number;
    windowSize?: number;
    hashFunction?: 'MD5' | 'SHA1' | 'SHA256' | 'SHA512' | 'BLAKE2' | 'BLAKE3' | 'XXHASH' | 'XXHASH3' | 'XXHASH64' | 'XXHASH128' | 'MURMUR3' | 'MURMUR3_32' | 'MURMUR3_64' | 'MURMUR3_128' | 'FARM' | 'FARM32' | 'FARM64' | 'SEAHASH' | 'SEAHASH32' | 'SEAHASH64' | 'XXHASH3' | 'XXHASH128';
    salt?: string;
  };
  sanitization: {
    enabled: boolean;
    rules: Array<{
      pattern: string;
      replacement: string;
      flags?: string;
      type: 'REGEX' | 'EXACT' | 'PREFIX' | 'SUFFIX' | 'CONTAINS' | 'STARTS_WITH' | 'ENDS_WITH' | 'MATCHES' | 'NOT_MATCHES';
    }>;
    piiDetection: boolean;
    piiAction: 'REDACT' | 'MASK' | 'HASH' | 'TOKENIZE' | 'REMOVE' | 'REPLACE' | 'ENCRYPT' | 'HASH' | 'SALT' | 'PEPPER';
    secretDetection: boolean;
    secretAction: 'REDACT' | 'MASK' | 'HASH' | 'TOKENIZE' | 'REMOVE' | 'REPLACE' | 'ENCRYPT' | 'HASH' | 'SALT' | 'PEPPER';
    piiPatterns: string[];
    secretPatterns: string[];
  };
  privacy: {
    excludeKyc: boolean;
    excludePrivateChats: boolean;
    excludeCctv: boolean;
    excludeBiometric: boolean;
    excludeStaffSensitive: boolean;
    excludeFinancialSensitive: boolean;
    excludeSecuritySensitive: boolean;
    excludeDocumentSensitive: boolean;
    excludeRestricted: boolean;
    excludePrivate: boolean;
    excludeConfidential: boolean;
    excludeTopSecret: boolean;
  };
  versioning: {
    enabled: boolean;
    maxVersions: number;
    retentionDays: number;
    archiveOldVersions: boolean;
    purgeDeletedVersions: boolean;
    purgeIntervalDays: number;
    versionHashAlgorithm: 'SHA256' | 'SHA512' | 'MD5' | 'SHA1' | 'BLAKE2' | 'BLAKE3' | 'SHA3_256' | 'SHA3_512' | 'KECCAK256' | 'KECCAK512' | 'BLAKE2B' | 'BLAKE2S' | 'BLAKE3' | 'SHA3' | 'KECCAK' | 'RIPEMD160' | 'RIPEMD256' | 'RIPEMD320' | 'WHIRLPOOL' | 'SM3' | 'STREEBOG' | 'BLAKE2' | 'BLAKE2B' | 'BLAKE2S';
    versionHashAlgorithm: 'SHA256' | 'SHA512' | 'MD5' | 'SHA1' | 'BLAKE2' | 'BLAKE3' | 'SHA3_256' | 'SHA3_512' | 'KECCAK256' | 'KECCAK512' | 'BLAKE2B' | 'BLAKE2S' | 'BLAKE3' | 'SHA3' | 'KECCAK' | 'RIPEMD160' | 'RIPEMD256' | 'RIPEMD320' | 'WHIRLPOOL' | 'SM3' | 'STREEBOG' | 'BLAKE2' | 'BLAKE2B' | 'BLAKE2S';
  };
  reindexPolicy: {
    triggerOnVersionChange: boolean;
    triggerOnStatusChange: boolean;
    triggerOnContentChange: boolean;
    triggerOnMetadataChange: boolean;
    triggerOnPermissionChange: boolean;
    triggerOnVisibilityChange: boolean;
    triggerOnSensitivityChange: boolean;
    triggerOnRetentionChange: boolean;
    triggerOnLegalHoldChange: boolean;
    triggerOnSchedule: boolean;
    scheduleExpression?: string;
    timezone?: string;
  };
  monitoring: {
    enabled: boolean;
    metricsIntervalSeconds: number;
    alertThresholds: {
      indexingLagMs: number;
      indexingErrorRate: number;
      indexingLagAlertThreshold: number;
      indexingErrorRateAlertThreshold: number;
      queueDepthAlertThreshold: number;
      memoryUsageAlertThreshold: number;
      cpuUsageAlertThreshold: number;
      diskUsageAlertThreshold: number;
      networkUsageAlertThreshold: number;
    };
    dashboards: string[];
    alerts: string[];
    logs: string[];
  };
};

export type KnowledgeIndexJob = {
  jobId: string;
  indexId: string;
  jobType: 'FULL_REINDEX' | 'INCREMENTAL' | 'INCREMENTAL_UPDATE' | 'INCREMENTAL_DELETE' | 'PARTIAL_REINDEX' | 'SELECTIVE_REINDEX' | 'SCHEMA_MIGRATION' | 'VERSION_MIGRATION' | 'SCHEMA_UPGRADE' | 'VERSION_UPGRADE' | 'SCHEMA_DOWNGRADE' | 'VERSION_DOWNGRADE' | 'SCHEMA_MIGRATION' | 'VERSION_MIGRATION' | 'REINDEX' | 'REBUILD' | 'OPTIMIZE' | 'COMPACT' | 'MERGE' | 'SPLIT' | 'SHARD' | 'RESHARD' | 'REBALANCE' | 'REPARTITION' | 'COALESCE' | 'DEFRAGMENT' | 'OPTIMIZE' | 'VACUUM' | 'ANALYZE' | 'STATISTICS' | 'REFRESH' | 'REBUILD_INDEX' | 'REBUILD_STATS' | 'REBUILD_FTS' | 'REBUILD_VECTOR' | 'REBUILD_BM25' | 'REBUILD_INVERTED' | 'REBUILD_FULLTEXT' | 'REBUILD_TRIE' | 'REBUILD_SUFFIX_ARRAY' | 'REBUILD_SUFFIX_TREE' | 'REBUILD_B_TREE' | 'REBUILD_HASH' | 'REBUILD_LSM' | 'REBUILD_ROCKSDB' | 'REBUILD_LEVELDB' | 'REBUILD_SQLITE' | 'REBUILD_DUCKDB' | 'REBUILD_POSTGRES' | 'REBUILD_MYSQL' | 'REBUILD_MARIADB' | 'REBUILD_COCKROACHDB' | 'REBUILD_TIDB' | 'REBUILD_OCEANBASE' | 'REBUILD_POLARDB' | 'REBUILD_GAUSSDB' | 'REBUILD_KINGBASE' | 'REBUILD_HIGO' | 'REBUILD_DAMENG' | 'REBUILD_SEQUOIADB' | 'REBUILD_GBASE' | 'REBUILD_KUNLUN' | 'REBUILD_SHENTONG' | 'REBUILD_OTHER';
  status: 'QUEUED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'RETRYING' | 'PARTIAL' | 'PARTIAL_SUCCESS' | 'PARTIAL_FAILURE' | 'TIMEOUT' | 'CANCELLED' | 'RETRYING' | 'WAITING' | 'SCHEDULED' | 'PENDING' | 'READY' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'RETRYING' | 'PARTIAL' | 'PARTIAL_SUCCESS' | 'PARTIAL_FAILURE' | 'TIMEOUT' | 'CANCELLED';
  triggeredBy: 'SCHEDULE' | 'MANUAL' | 'EVENT' | 'WEBHOOK' | 'API' | 'USER' | 'SYSTEM' | 'AUTO' | 'RETRY' | 'REPLAY' | 'RECOVERY' | 'RECOVERY_REPLAY' | 'RECOVERY_RETRY' | 'FAILOVER' | 'FAILOVER_REPLAY' | 'FAILOVER_RETRY' | 'FAILOVER_RECOVERY' | 'FAILOVER_RECOVERY_REPLAY' | 'FAILOVER_RECOVERY_RETRY' | 'DISASTER_RECOVERY' | 'DISASTER_RECOVERY_REPLAY' | 'DISASTER_RECOVERY_RETRY' | 'BACKUP_RESTORE' | 'BACKUP_RESTORE_REPLAY' | 'BACKUP_RESTORE_RETRY' | 'POINT_IN_TIME_RECOVERY' | 'POINT_IN_TIME_RECOVERY_REPLAY' | 'POINT_IN_TIME_RECOVERY_RETRY';
  triggeredAt: string;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  progress: number;
  totalItems: number;
  processedItems: number;
  successfulItems: number;
  failedItems: number;
  skippedItems: number;
  retryCount: number;
  maxRetries: number;
  error?: string;
  errorDetails?: string;
  logs: string[];
  metrics: {
    itemsPerSecond: number;
    avgProcessingTimeMs: number;
    avgLatencyMs: number;
    throughputItemsPerSecond: number;
    throughputBytesPerSecond: number;
    memoryUsageMb: number;
    cpuUsagePercent: number;
    diskUsageMb: number;
    networkUsageMbps: number;
  };
  errorDetails?: string;
  logs: string[];
  checkpoint?: string;
  resumeFrom?: string;
  retryFrom?: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  cancelledAt?: string;
  pausedAt?: string;
  resumedAt?: string;
  scheduledAt?: string;
  queuedAt?: string;
  dequeuedAt?: string;
  processingAt?: string;
  waitingAt?: string;
  retryingAt?: string;
  recoveringAt?: string;
  recoveringCompletedAt?: string;
  failedPermanentlyAt?: string;
  cancelledAt?: string;
  abortedAt?: string;
  timedOutAt?: string;
  retryLimitReachedAt?: string;
  partialSuccessAt?: string;
  partialFailureAt?: string;
  completedSuccessfullyAt?: string;
  completedWithErrorsAt?: string;
  completedWithWarningsAt?: string;
  completedWithInfoAt?: string;
  completedWithDebugAt?: string;
  completedWithTraceAt?: string;
  completedWithProfileAt?: string;
  completedWithCoverageAt?: string;
  completedWithMetricsAt?: string;
  completedWithLogsAt?: string;
  completedWithArtifactsAt?: string;
  completedWithReportsAt?: string;
  completedWithDashboardsAt?: string;
  completedWithAlertsAt?: string;
  completedWithNotificationsAt?: string;
  completedWithEmailsAt?: string;
  completedWithSlackAt?: string;
  completedWithWebhooksAt?: string;
  completedWithIntegrationsAt?: string;
  completedWithExportsAt?: string;
  completedWithImportsAt?: string;
  completedWithMigrationsAt?: string;
  completedWithTransformationsAt?: string;
  completedWithValidationsAt?: string;
  completedWithTestsAt?: string;
  completedWithAuditsAt?: string;
  completedWithComplianceAt?: string;
  completedWithSecurityAt?: string;
  completedWithPrivacyAt?: string;
  completedWithComplianceAt?: string;
  completedWithGovernanceAt?: string;
  completedWithRiskAt?: string;
  completedWithQualityAt?: string;
  completedWithPerformanceAt?: string;
  completedWithScalabilityAt?: string;
  completedWithReliabilityAt?: string;
  completedWithAvailabilityAt?: string;
  completedWithDurabilityAt?: string;
  completedWithIntegrityAt?: string;
  completedWithConsistencyAt?: string;
  completedWithAccuracyAt?: string;
  completedWithPrecisionAt?: string;
  completedWithRecallAt?: number;
  completedWithF1At?: number;
  completedWithAccuracyAt?: number;
  completedWithPrecisionAt?: number;
  completedWithRecallAt?: number;
  completedWithF1At?: number;
  completedWithAccuracyAt?: number;
};

export type KnowledgeIndexCheckpoint = {
  checkpointId: string;
  jobId: string;
  indexId: string;
  checkpointType: 'FULL' | 'INCREMENTAL' | 'DELTA' | 'SNAPSHOT' | 'CHECKPOINT' | 'SNAPSHOT' | 'BACKUP' | 'ARCHIVE' | 'EXPORT' | 'IMPORT' | 'RESTORE' | 'RECOVERY' | 'RECOVERY_POINT' | 'CHECKPOINT' | 'MILESTONE' | 'MILESTONE' | 'VERSION' | 'VERSION' | 'RELEASE' | 'RELEASE' | 'DEPLOYMENT' | 'DEPLOYMENT' | 'ROLLBACK' | 'ROLLBACK' | 'ROLLBACK_POINT' | 'ROLLBACK_POINT' | 'SAVEPOINT' | 'SAVEPOINT' | 'SAVEPOINT' | 'SAVEPOINT' | 'TRANSACTION' | 'TRANSACTION' | 'COMMIT' | 'COMMIT' | 'ROLLBACK' | 'ROLLBACK' | 'SAVEPOINT' | 'SAVEPOINT';
  timestamp: string;
  progress: number;
  processedItems: number;
  totalItems: number;
  data: any;
  metadata: any;
  sizeBytes: number;
  checksum: string;
  checksumAlgorithm: 'SHA256' | 'SHA512' | 'MD5' | 'SHA1' | 'BLAKE2' | 'BLAKE3' | 'SHA3_256' | 'SHA3_512' | 'KECCAK256' | 'KECCAK512' | 'BLAKE2B' | 'BLAKE2S' | 'BLAKE3' | 'SHA3' | 'KECCAK' | 'RIPEMD160' | 'RIPEMD256' | 'RIPEMD320' | 'WHIRLPOOL' | 'SM3' | 'STREEBOG' | 'BLAKE2' | 'BLAKE2B' | 'BLAKE2S';
  compressed: boolean;
  compressionAlgorithm: 'GZIP' | 'DEFLATE' | 'LZ4' | 'ZSTD' | 'LZMA' | 'XZ' | 'BZIP2' | 'BZIP2' | 'GZIP' | 'ZLIB' | 'LZ4' | 'ZSTD' | 'LZMA' | 'XZ' | 'BZIP2' | 'SNAPPY' | 'LZO' | 'QUICKLZ' | 'LZ4' | 'ZSTD' | 'LZMA' | 'XZ' | 'BZIP2' | 'SNAPPY' | 'LZO' | 'QUICKLZ';
  compressionLevel: number;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  compressionRatio: number;
  checksum: string;
  checksumAlgorithm: 'SHA256' | 'SHA512' | 'MD5' | 'SHA1' | 'BLAKE2' | 'BLAKE3' | 'SHA3_256' | 'SHA3_512' | 'KECCAK256' | 'KECCAK512' | 'BLAKE2B' | 'BLAKE2S' | 'BLAKE3' | 'SHA3' | 'KECCAK' | 'RIPEMD160' | 'RIPEMD256' | 'RIPEMD320' | 'WHIRLPOOL' | 'SM3' | 'STREEBOG' | 'BLAKE2' | 'BLAKE2B' | 'BLAKE2S';
  encrypted: boolean;
  encryptionAlgorithm: 'AES-256-GCM' | 'AES-256-CBC' | 'AES-256-CTR' | 'AES-256-GCM' | 'CHACHA20-POLY1305' | 'XCHACHA20-POLY1305' | 'AES-128-GCM' | 'AES-128-CBC' | 'AES-128-CTR' | 'AES-128-GCM' | 'CHACHA20-POLY1305' | 'XCHACHA20-POLY1305';
  encryptionKeyId?: string;
  encryptedBy?: string;
  encryptedAt?: string;
  decryptedBy?: string;
  decryptedAt?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  verificationChecksum: string;
  verificationAlgorithm: 'SHA256' | 'SHA512' | 'MD5' | 'SHA1' | 'BLAKE2' | 'BLAKE3' | 'SHA3_256' | 'SHA3_512' | 'KECCAK256' | 'KECCAK512' | 'BLAKE2B' | 'BLAKE2S' | 'BLAKE3' | 'SHA3' | 'KECCAK' | 'RIPEMD160' | 'RIPEMD256' | 'RIPEMD320' | 'WHIRLPOOL' | 'SM3' | 'STREEBOG' | 'BLAKE2' | 'BLAKE2B' | 'BLAKE2S';
  createdAt: string;
  createdBy: string;
  expiresAt?: string;
  retentionDays: number;
  legalHold: boolean;
  legalHoldReason?: string;
  legalHoldExpiry?: string;
  tags: string[];
  labels: string[];
  annotations: string[];
  notes: string[];
  description: string;
  summary: string;
  details: string;
  metadata: Record<string, any>;
  tags: string[];
  labels: string[];
  annotations: string[];
  notes: string[];
};