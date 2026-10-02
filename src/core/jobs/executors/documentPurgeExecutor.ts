import type { JobExecutor, JobExecution, JobResult, JobPorts } from '../job.types';
import type { DocumentRecord } from '../../../modules/resident/documents/vault/domain/types/document.types';
import type { VaultPorts } from '../../../modules/resident/documents/vault/application/ports';
import { activeHolds, retentionGate } from '../../../modules/resident/documents/vault/domain/stateMachines/retentionStateMachine';
import type { LegalHold } from '../../../modules/resident/documents/vault/domain/types/retention.types';

export class DocumentPurgeExecutor implements JobExecutor {
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
    const candidates = documents.filter(
      (doc) =>
        (doc.retentionLifecycle === 'DISPOSED' || doc.retentionLifecycle === 'ANONYMISED') &&
        doc.currentVersionId,
    );

    let processedCount = 0;
    let succeededCount = 0;
    let failedCount = 0;
    const details: Record<string, unknown> = {
      purged: [] as string[],
      anonymised: [] as string[],
      skipped: [] as string[],
      errors: [] as string[],
    };

    for (const doc of candidates.slice(0, 50)) {
      try {
        processedCount++;

        const holds = await vaultPorts.legalHolds.listByDocument(doc.id);
        const activeHoldList = activeHolds(holds, doc.id);

        if (activeHoldList.length > 0) {
          (details.skipped as string[]).push(`${doc.id}: active legal holds`);
          succeededCount++;
          continue;
        }

        if (doc.retentionLifecycle === 'DISPOSED') {
          const version = await vaultPorts.versions.read(doc.currentVersionId);
          if (version?.objectDigestRef) {
            const deleted = await vaultPorts.objects.delete(version.objectDigestRef);
            if (!deleted) {
              failedCount++;
              (details.errors as string[]).push(`${doc.id}: object deletion failed`);
              continue;
            }
          }
          (details.purged as string[]).push(doc.id);
        } else if (doc.retentionLifecycle === 'ANONYMISED') {
          (details.anonymised as string[]).push(doc.id);
        }

        succeededCount++;
      } catch (error) {
        failedCount++;
        (details.errors as string[]).push(`${doc.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
}

export function createDocumentPurgeExecutor(): JobExecutor {
  return new DocumentPurgeExecutor();
}