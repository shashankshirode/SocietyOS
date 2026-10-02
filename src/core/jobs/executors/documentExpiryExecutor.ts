import type { JobExecutor, JobExecution, JobResult, JobPorts } from '../job.types';
import type { DocumentRecord, StorageLifecycleState } from '../../../modules/resident/documents/vault/domain/types/document.types';
import type { VaultPorts } from '../../../modules/resident/documents/vault/application/ports';
import { resolveExpiryState } from '../../../modules/resident/documents/vault/domain/stateMachines/retentionStateMachine';
import { evaluateActionPermission } from '../../../modules/resident/documents/vault/domain/guards/authorizationGuard';

const WARNING_WINDOW_DAYS = 30;
const BATCH_SIZE = 100;

export class DocumentExpiryExecutor implements JobExecutor {
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
      (doc) => doc.expiryLifecycle !== 'NOT_APPLICABLE' && doc.storageLifecycle === 'AVAILABLE',
    );

    let processedCount = 0;
    let succeededCount = 0;
    let failedCount = 0;
    const details: Record<string, unknown> = {
      expired: [],
      expiringSoon: [],
      errors: [],
    };

    for (const doc of candidates.slice(0, BATCH_SIZE)) {
      try {
        processedCount++;
        const newState = resolveExpiryState(doc, vaultPorts.clock, WARNING_WINDOW_DAYS);
        if (newState !== doc.expiryLifecycle) {
          const updated: DocumentRecord = {
            ...doc,
            expiryLifecycle: newState,
            updatedAt: new Date().toISOString(),
            revision: { revision: doc.revision.revision + 1, revisionToken: `rev-${doc.id}-${doc.revision.revision + 1}` },
          };
          const saved = vaultPorts.documents.update(updated, doc.revision.revision);
          if (!saved) {
            failedCount++;
            (details.errors as string[]).push(`Concurrent modification for ${doc.id}`);
            continue;
          }
          succeededCount++;

          if (newState === 'EXPIRED') {
            (details.expired as string[]).push(doc.id);
          } else if (newState === 'EXPIRING_SOON') {
            (details.expiringSoon as string[]).push(doc.id);
          }
        }
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
      metrics: {
        totalCandidates: candidates.length,
        expiredCount: (details.expired as string[]).length,
        expiringSoonCount: (details.expiringSoon as string[]).length,
      },
    };
  }
}

export function createDocumentExpiryExecutor(): JobExecutor {
  return new DocumentExpiryExecutor();
}