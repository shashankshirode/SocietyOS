import * as mockData from './documents.mockData';
import type { Absent } from "../../../../shared/types/absence.types";
type DocumentParams = JsonObject | Absent;
export class DocumentsMockSource {
    async createDocumentMetadata(_params?: DocumentParams) {
        return mockData.documentUploadMockData;
    }
    async listDocumentsByCategory(_params?: DocumentParams) {
        return mockData.categorizedDocumentsMockData;
    }
    async listDocumentAccessLogs(_params?: DocumentParams) {
        return mockData.documentAccessLogMockData;
    }
    async createDocumentAccessLog(_params?: DocumentParams) {
        return mockData.documentAccessLogMockData[0];
    }
    async listDocumentVersions(_params?: DocumentParams) {
        return mockData.documentVersionHistoryMockData;
    }
    async requestDocumentAccess(_params?: DocumentParams) {
        return mockData.restrictedDocumentAccessMockData;
    }
}

