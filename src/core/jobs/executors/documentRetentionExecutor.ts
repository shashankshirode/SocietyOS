import type { JobExecutor, JobExecution, JobResult, JobPorts } from '../job.types';
import type { DocumentRecord, RetentionLifecycleState } from '../../../modules/resident/documents/vault/domain/types/document.types';
import type { VaultPorts } from '../../../modules/resident/documents/vault/application/ports';
import { activeHolds, assessRetention } from '../../../modules/resident/documents/vault/domain/stateMachines/retentionStateMachine';
import type { RetentionAssessment, RetentionBasis } from '../../../modules/resident/documents/vault/domain/types/retention.types';

export class DocumentRetentionExecutor implements JobExecutor {
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
      (doc) => doc.retentionLifecycle === 'ACTIVE' && doc.retentionPolicy,
    );

    let processedCount = 0;
    let succeededCount = 0;
    let failedCount = 0;
    const details: Record<string, unknown> = {
      archive: [] as string[],
      anonymise: [] as string[],
      purge: [] as string[],
      retain: [] as string[],
      blocked: [] as string[],
      errors: [] as string[],
    };

    for (const doc of candidates.slice(0, 100)) {
      try {
        processedCount++;
        if (!doc.retentionPolicy) continue;

        const holds = await vaultPorts.legalHolds.listByDocument(doc.id);
        const activeHoldList = activeHolds(holds, doc.id);

        const assessment = assessRetention({
          documentId: doc.id,
          retainUntil: doc.retentionPolicy.retainUntil,
          policyId: doc.retentionPolicy.policyId,
          policyVersion: doc.retentionPolicy.policyVersion,
          holds: activeHoldList,
          erasureRequest: undefined,
          evaluatedAt: vaultPorts.clock.now(),
        });

        if (assessment.blockedByHold) {
          (details.blocked as string[]).push(`${doc.id}: holds=${activeHoldList.map((h) => h.id).join(',')}`);
          succeededCount++;
          continue;
        }

        let newState: RetentionLifecycleState = doc.retentionLifecycle;
        switch (assessment.disposition) {
          case 'ARCHIVE':
            newState = 'ARCHIVED';
            (details.archive as string[]).push(doc.id);
            break;
          case 'ANONYMISE':
            newState = 'ANONYMISED';
            (details.anonymise as string[]).push(doc.id);
            break;
          case 'PURGE':
            newState = 'DISPOSED';
            (details.purge as string[]).push(doc.id);
            break;
          case 'RETAIN':
          default:
            newState = 'ACTIVE';
            (details.retain as string[]).push(doc.id);
            break;
        }

        if (newState !== doc.retentionLifecycle) {
          const updated: DocumentRecord = {
            ...doc,
            retentionLifecycle: newState,
            updatedAt: new Date().toISOString(),
            revision: { revision: doc.revision.revision + 1, revisionToken: `rev-${doc.id}-${doc.revision.revision + 1}` },
          };
          const saved = vaultPorts.documents.update(updated, doc.revision.revision);
          if (!saved) {
            failedCount++;
            (details.errors as string[]).push(`Concurrent modification for ${doc.id}`);
            continue;
          }
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

export function createDocumentRetentionExecutor(): JobExecutor {
  return new DocumentRetentionExecutor();
}