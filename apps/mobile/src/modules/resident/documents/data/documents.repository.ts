import { resolveDataSource } from '../../../../core/dataSource/dataSourceResolver';
import { DocumentsMockSource } from './documents.mockSource';
import { DocumentsApiSource } from './documents.apiSource';
import type { Absent } from "../../../../shared/types/absence.types";
type DocumentParams = JsonObject | Absent;
const mockSource = new DocumentsMockSource();
const apiSource = new DocumentsApiSource();
function getActiveSource() {
    return resolveDataSource('residentDocuments').isApi ? apiSource : mockSource;
}
export class DocumentsRepository {
    static async createDocumentMetadata(params?: DocumentParams) {
        return getActiveSource().createDocumentMetadata(params);
    }
    static async listDocumentsByCategory(params?: DocumentParams) {
        return getActiveSource().listDocumentsByCategory(params);
    }
    static async listDocumentAccessLogs(params?: DocumentParams) {
        return getActiveSource().listDocumentAccessLogs(params);
    }
    static async createDocumentAccessLog(params?: DocumentParams) {
        return getActiveSource().createDocumentAccessLog(params);
    }
    static async listDocumentVersions(params?: DocumentParams) {
        return getActiveSource().listDocumentVersions(params);
    }
    static async requestDocumentAccess(params?: DocumentParams) {
        return getActiveSource().requestDocumentAccess(params);
    }
}

