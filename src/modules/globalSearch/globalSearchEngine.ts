import {
  SearchEntityType,
  SearchQuery,
  SearchResult,
  SearchResponse,
  SearchFacet,
  SearchSuggestion,
  SearchIndexConfig,
  SearchPermission,
  PrivacyFilter,
  DEFAULT_SEARCH_INDEX_CONFIGS,
  PRIVACY_FILTERS,
} from './globalSearch.types';

export type {
  SearchQuery,
  SearchResponse,
  SearchResult,
  SearchSuggestion,
  SearchEntityType,
  SearchFacet,
  SearchPermission,
} from './globalSearch.types';
import { apiClient } from '../../core/api/apiClient';
import { apiEndpoints } from '../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../core/audit';
import type { JsonObject } from '../../core/api/api.types';

interface IndexedDocument {
  id: string;
  entityType: SearchEntityType;
  title: string;
  content: string;
  data: JsonObject;
  permissions: string[];
  indexedAt: string;
}

class GlobalSearchEngine {
  private indexes: Map<SearchEntityType, IndexedDocument[]> = new Map();
  private indexConfigs: Map<SearchEntityType, SearchIndexConfig> = new Map();
  private privacyFilters: PrivacyFilter[] = PRIVACY_FILTERS;
  private listeners: Array<(response: SearchResponse) => void> = [];
  private isIndexing = false;

  constructor() {
    Object.entries(DEFAULT_SEARCH_INDEX_CONFIGS).forEach(([key, config]) => {
      this.indexConfigs.set(key as SearchEntityType, config);
      this.indexes.set(key as SearchEntityType, []);
    });
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('global_search_index');
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.entries(parsed).forEach(([entityType, docs]) => {
          this.indexes.set(entityType as SearchEntityType, docs as IndexedDocument[]);
        });
      }
    } catch (error) {
      console.error('[GlobalSearchEngine] Failed to load from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const toStore: Record<string, IndexedDocument[]> = {};
      this.indexes.forEach((docs, entityType) => {
        toStore[entityType] = docs;
      });
      localStorage.setItem('global_search_index', JSON.stringify(toStore));
    } catch (error) {
      console.error('[GlobalSearchEngine] Failed to save to storage:', error);
    }
  }

  async indexEntity(entityType: SearchEntityType, document: IndexedDocument): Promise<void> {
    const existing = this.indexes.get(entityType) ?? [];
    const idx = existing.findIndex(d => d.id === document.id);
    if (idx >= 0) {
      existing[idx] = document;
    } else {
      existing.push(document);
    }
    this.indexes.set(entityType, existing);
    this.saveToStorage();
  }

  async bulkIndex(entityType: SearchEntityType, documents: IndexedDocument[]): Promise<void> {
    this.indexes.set(entityType, documents);
    this.saveToStorage();
  }

  async search<T extends JsonObject = JsonObject>(query: SearchQuery): Promise<SearchResponse<T>> {
    const startTime = Date.now();
    const config = query.entityTypes?.length
      ? query.entityTypes
      : Array.from(this.indexConfigs.keys());

    let allResults: SearchResult[] = [];

    for (const entityType of config) {
      const index = this.indexes.get(entityType) ?? [];
      const indexConfig = this.indexConfigs.get(entityType);

      if (!indexConfig) continue;

      const hasPermission = indexConfig.requiredPermissions.some(p => query.userPermissions.includes(p));
      if (!hasPermission) continue;

      const results = this.searchIndex(index, query, entityType, indexConfig);
      allResults.push(...results);
    }

    allResults.sort((a, b) => b.score - a.score);

    if (query.sortBy) {
      allResults.sort((a, b) => {
        const aVal = a.data[query.sortBy!];
        const bVal = b.data[query.sortBy!];
        if (aVal === undefined && bVal === undefined) return 0;
        if (aVal === undefined) return 1;
        if (bVal === undefined) return -1;
        const cmp = String(aVal).localeCompare(String(bVal));
        return query.sortDirection === 'DESC' ? -cmp : cmp;
      });
    }

    const total = allResults.length;
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const paginated = allResults.slice((page - 1) * pageSize, page * pageSize);

    const filteredResults = paginated.map(result => this.applyPrivacyFilters(result, query));

    const facets = this.generateFacets(allResults, config);
    const suggestions = this.generateSuggestions(query.query, allResults);

    const response: SearchResponse<T> = {
      results: filteredResults as SearchResult<T>[],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      tookMs: Date.now() - startTime,
      query: query.query,
      filters: query.filters ?? {},
      suggestions,
    };

    createAuditEntry({
      actorUserId: query.userId,
      actorType: query.userRole === 'ADMIN' ? 'ADMIN' : 'RESIDENT',
      societyId: query.societyId,
      ...(query.unitId ? { unitId: query.unitId } : {}),
      action: 'GLOBAL_SEARCH',
      entityType: 'SEARCH_QUERY',
      entityId: createIdempotencyKey('search'),
      newState: { query: query.query, resultCount: total, entityTypes: config },
      idempotencyKey: createIdempotencyKey('search'),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    this.notifyListeners(response);
    return response;
  }

  private searchIndex(
    index: IndexedDocument[],
    query: SearchQuery,
    entityType: SearchEntityType,
    config: SearchIndexConfig
  ): SearchResult[] {
    const searchTerms = query.query.toLowerCase().split(/\s+/).filter(t => t.length > 0);

    return index
      .filter(doc => this.matchesFilters(doc, query.filters))
      .map(doc => {
        let score = 0;
        const matchedFields: string[] = [];

        for (const field of config.searchableFields) {
          const value = String(doc.data[field] ?? '').toLowerCase();
          for (const term of searchTerms) {
            if (value.includes(term)) {
              score += 1;
              if (!matchedFields.includes(field)) matchedFields.push(field);
            }
            if (value.startsWith(term)) {
              score += 2;
            }
            if (value === term) {
              score += 5;
            }
          }
        }

        if (score === 0) return null;

        const highlightedFields: Record<string, string> = {};
        for (const field of matchedFields) {
          const value = String(doc.data[field] ?? '');
          let highlighted = value;
          for (const term of searchTerms) {
            const regex = new RegExp(`(${term})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark>$1</mark>');
          }
          highlightedFields[field] = highlighted;
        }

        const snippet = this.generateSnippet(doc, config.searchableFields, searchTerms);

        return {
          id: doc.id,
          entityType,
          title: doc.title,
          snippet,
          score,
          data: doc.data,
          permissions: doc.permissions as ('READ' | 'WRITE' | 'ADMIN')[],
          matchedFields,
          highlightedFields,
        };
      })
      .filter((r): r is SearchResult => r !== null);
  }

  private matchesFilters(doc: IndexedDocument, filters?: SearchQuery['filters']): boolean {
    if (!filters) return true;

    for (const [field, value] of Object.entries(filters)) {
      const docValue = doc.data[field];
      if (docValue === undefined) return false;

      if (Array.isArray(value)) {
        if (typeof docValue !== 'string' && typeof docValue !== 'number') return false;
        if (!value.includes(docValue)) return false;
      } else if (docValue !== value) {
        return false;
      }
    }

    return true;
  }

  private generateSnippet(doc: IndexedDocument, fields: string[], terms: string[]): string {
    const content = fields
      .map(f => String(doc.data[f] ?? ''))
      .join(' ')
      .toLowerCase();

    for (const term of terms) {
      const idx = content.indexOf(term);
      if (idx >= 0) {
        const start = Math.max(0, idx - 50);
        const end = Math.min(content.length, idx + 150);
        let snippet = content.slice(start, end);
        for (const t of terms) {
          snippet = snippet.replace(new RegExp(t, 'gi'), '<mark>$&</mark>');
        }
        return `...${snippet}...`;
      }
    }

    return content.slice(0, 200) + '...';
  }

  private applyPrivacyFilters<T extends SearchResult>(result: T, query: SearchQuery): T {
    const userContext = {
      role: query.userRole,
      permissions: query.userPermissions,
      ...(query.unitId ? { unitId: query.unitId } : {}),
    };

    let filteredData = { ...result.data };

    for (const filter of this.privacyFilters) {
      if (filter.entityType !== result.entityType) continue;
      if (filter.condition && !filter.condition(filteredData, userContext)) continue;

      switch (filter.action) {
        case 'MASK':
          if (filteredData[filter.field]) {
            const value = String(filteredData[filter.field]);
            filteredData[filter.field] = value.slice(0, 2) + '*'.repeat(Math.max(0, value.length - 4)) + value.slice(-2);
          }
          break;
        case 'REMOVE':
          delete filteredData[filter.field];
          break;
        case 'REDACT':
          filteredData[filter.field] = '[REDACTED]';
          break;
      }
    }

    return { ...result, data: filteredData } as T;
  }

  private generateFacets(results: SearchResult[], entityTypes: SearchEntityType[]): SearchFacet[] {
    const facetFields = new Set<string>();

    for (const entityType of entityTypes) {
      const config = this.indexConfigs.get(entityType);
      if (config) {
        config.filterableFields.forEach(f => facetFields.add(f));
      }
    }

    const facets: SearchFacet[] = [];

    for (const field of facetFields) {
      const counts = new Map<string | number, number>();
      for (const result of results) {
        const value = result.data[field];
        if (value !== undefined) {
          const key = String(value);
          counts.set(key, (counts.get(key) ?? 0) + 1);
        }
      }

      if (counts.size > 1 && counts.size < 50) {
        facets.push({
          field,
          values: Array.from(counts.entries())
            .map(([value, count]) => ({ value, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20),
        });
      }
    }

    return facets;
  }

  private generateSuggestions(query: string, results: SearchResult[]): string[] {
    const suggestions = new Set<string>();

    const queryLower = query.toLowerCase();
    for (const result of results.slice(0, 10)) {
      for (const field of result.matchedFields) {
        const value = String(result.data[field] ?? '');
        if (value.toLowerCase().includes(queryLower) && value.length > query.length) {
          suggestions.add(value);
        }
      }
    }

    return Array.from(suggestions).slice(0, 10);
  }

  async getSuggestions(partialQuery: string, societyId: string, userId: string, userRole: string, userPermissions: SearchPermission[]): Promise<SearchSuggestion[]> {
    if (partialQuery.length < 2) return [];

    const query: SearchQuery = {
      query: partialQuery,
      societyId,
      userId,
      userRole,
      userPermissions,
      pageSize: 5,
    };

    const response = await this.search(query);

    return response.results.map(r => ({
      text: r.title,
      type: 'ENTITY' as const,
      entityType: r.entityType,
      entityId: r.id,
    }));
  }

  onSearch(listener: (response: SearchResponse) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx >= 0) this.listeners.splice(idx, 1);
    };
  }

  private notifyListeners(response: SearchResponse): void {
    this.listeners.forEach(l => l(response));
  }
}

export const globalSearchEngine = new GlobalSearchEngine();