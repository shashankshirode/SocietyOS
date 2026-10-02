import type { JobExecutor, JobExecution, JobResult, JobPorts } from '../job.types';
import type { VaultPorts } from '../../../modules/resident/documents/vault/application/ports';
import type { DocumentVersionRecord } from '../../../modules/resident/documents/vault/domain/types/document.types';
const ORPHAN_GRACE_PERIOD_MS = 24 * 60 * 60 * 1000;
export class DocumentOrphanCleanupExecutor implements JobExecutor {
    async execute(execution: JobExecution, ports: JobPorts): Promise<JobResult> {
        const vaultPorts = ports.vault;
        if (!vaultPorts) {
            return {
                success: false,
                processedCount: 0,
                succeededCount: 0,
                failedCount: 0,
                details: { error: 'Vault ports not available' },
            };
        }
        const societyId = execution.societyId ?? 'society-001';
        const documents = vaultPorts.documents.list(societyId);
        const versionIds = new Set<string>();
        for (const doc of documents) {
            if (doc.currentVersionId)
                versionIds.add(doc.currentVersionId);
            const versions = await vaultPorts.versions.listByDocument(doc.id);
            for (const v of versions)
                versionIds.add(v.id);
        }
        const objectRefs = new Set<string>();
        for (const doc of documents) {
            const activeVersion = await vaultPorts.versions.read(doc.currentVersionId);
            if (activeVersion?.objectDigestRef)
                objectRefs.add(activeVersion.objectDigestRef);
        }
        const allObjects = await this.listAllObjects(vaultPorts);
        const cutoffTime = Date.now() - ORPHAN_GRACE_PERIOD_MS;
        let processedCount = 0;
        let succeededCount = 0;
        let failedCount = 0;
        const details: Record<string, unknown> = {
            deleted: [] as string[],
            preserved: [] as string[],
            missingObjects: [] as string[],
            errors: [] as string[],
        };
        for (const objRef of allObjects) {
            if (objectRefs.has(objRef)) {
                (details.preserved as string[]).push(objRef);
                continue;
            }
            const metadata = await vaultPorts.objects.read(objRef);
            if (!metadata) {
                (details.missingObjects as string[]).push(objRef);
                continue;
            }
            const createdAt = Date.parse((metadata as any).createdAt ?? '');
            if (!createdAt || createdAt > cutoffTime) {
                (details.preserved as string[]).push(`${objRef}: within grace period`);
                continue;
            }
            try {
                processedCount++;
                const deleted = await vaultPorts.objects.delete(objRef);
                if (deleted) {
                    (details.deleted as string[]).push(objRef);
                    succeededCount++;
                }
                else {
                    failedCount++;
                    (details.errors as string[]).push(`${objRef}: deletion failed`);
                }
            }
            catch (error) {
                failedCount++;
                (details.errors as string[]).push(`${objRef}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        return {
            success: failedCount === 0,
            processedCount,
            succeededCount,
            failedCount,
            details,
        };
    }
    private async listAllObjects(vaultPorts: VaultPorts): Promise<string[]> {
        const documents = vaultPorts.documents.list('society-001');
        const refs: string[] = [];
        for (const doc of documents) {
            const versions = await vaultPorts.versions.listByDocument(doc.id);
            for (const v of versions) {
                if (v.objectDigestRef)
                    refs.push(v.objectDigestRef);
            }
        }
        return refs;
    }
}
export function createDocumentOrphanCleanupExecutor(): JobExecutor {
    return new DocumentOrphanCleanupExecutor();
}

