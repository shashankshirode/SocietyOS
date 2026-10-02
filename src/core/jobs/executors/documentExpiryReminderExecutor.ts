import type { JobExecutor, JobExecution, JobResult, JobPorts } from '../job.types';
import type { DocumentRecord } from '../../../modules/resident/documents/vault/domain/types/document.types';
import type { VaultPorts } from '../../../modules/resident/documents/vault/application/ports';
import { isExpiringWithin } from '../../../modules/resident/documents/vault/domain/stateMachines/versionStateMachine';

const REMINDER_RULES = [
  { days: 30, ruleId: 'REMINDER_30D' },
  { days: 15, ruleId: 'REMINDER_15D' },
  { days: 7, ruleId: 'REMINDER_7D' },
  { days: 1, ruleId: 'REMINDER_1D' },
];

export class DocumentExpiryReminderExecutor implements JobExecutor {
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
        doc.expiryLifecycle === 'NOT_EXPIRED' &&
        doc.storageLifecycle === 'AVAILABLE' &&
        doc.expiresAt,
    );

    let processedCount = 0;
    let succeededCount = 0;
    let failedCount = 0;
    let remindersSent = 0;
    const details: Record<string, unknown> = {
      reminders: [] as string[],
      skipped: [] as string[],
      errors: [] as string[],
    };

    for (const doc of candidates) {
      try {
        processedCount++;

        if (!doc.expiresAt) continue;

        for (const rule of REMINDER_RULES) {
          const expiring = isExpiringWithin(doc, vaultPorts.clock, rule.days);
          if (!expiring) continue;

          const dedupeKey = `reminder-${doc.id}-v${doc.currentVersionNumber}-${rule.ruleId}-${doc.expiresAt}`;
          const alreadySent = await this.checkReminderSent(ports, dedupeKey);
          if (alreadySent) {
            (details.skipped as string[]).push(`${doc.id}-${rule.ruleId}: already sent`);
            continue;
          }

          await this.sendReminder(ports, doc, rule, dedupeKey, execution.correlationId);
          await this.markReminderSent(ports, dedupeKey);
          remindersSent++;
          (details.reminders as string[]).push(`${doc.id}-${rule.ruleId}`);
          succeededCount++;
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
      details: {
        ...details,
        remindersSent,
      },
    };
  }

  private async checkReminderSent(ports: JobPorts, dedupeKey: string): Promise<boolean> {
    const executions = await ports.executions.list({
      jobType: 'DOCUMENT_EXPIRY_REMINDER',
      limit: 1000,
    });
    return executions.some((e) => e.payload.dedupeKey === dedupeKey && e.status === 'SUCCEEDED');
  }

  private async sendReminder(
    ports: JobPorts,
    doc: DocumentRecord,
    rule: { days: number; ruleId: string },
    dedupeKey: string,
    correlationId: string,
  ): Promise<void> {
    const notificationPort = ports.notifications;
    if (notificationPort?.notifyVerificationDecided) {
      notificationPort.notifyVerificationDecided({
        documentId: doc.id,
        societyId: 'society-001',
        decidedBy: 'SYSTEM',
        decision: `EXPIRY_REMINDER_${rule.ruleId}`,
      });
    }

    const reminderExecution = {
      id: `reminder-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      jobId: 'DOCUMENT_EXPIRY_REMINDER',
      jobType: 'DOCUMENT_EXPIRY_REMINDER' as const,
      status: 'SUCCEEDED' as const,
      scheduledAt: new Date().toISOString(),
      attempt: 1,
      maxRetries: 0,
      payload: { dedupeKey, documentId: doc.id, ruleId: rule.ruleId, daysUntilExpiry: rule.days },
      correlationId,
    };
    await ports.executions.insert(reminderExecution);
  }

  private async markReminderSent(ports: JobPorts, dedupeKey: string): Promise<void> {
    // Reminder is marked via the reminderExecution record above
  }
}

export function createDocumentExpiryReminderExecutor(): JobExecutor {
  return new DocumentExpiryReminderExecutor();
}