import { AutomationRule, AutomationCooldown, AutomationSuppression, AutomationSuppressionReason } from '../types';

interface CooldownEntry {
  key: string;
  ruleId: string;
  executedAt: string;
  expiresAt: string;
}

const cooldownStore: Map<string, CooldownEntry> = new Map();

function generateCooldownKey(rule: AutomationRule, payload: Record<string, unknown>): string {
  if (rule.cooldown.dedupeKey) {
    const keyParts = rule.cooldown.dedupeKey.split('.').map(path =>
      path.split('.').reduce((obj: any, key: string) => obj?.[key], payload)
    );
    return `cooldown:${rule.id}:${keyParts.join(':')}`;
  }
  return `cooldown:${rule.id}:default`;
}

function generateDedupeKey(rule: AutomationRule, triggerEventId: string, triggerEventPayload: Record<string, unknown>): string {
  if (rule.cooldown.dedupeKey) {
    const keyParts = rule.cooldown.dedupeKey.split('.').map(path =>
      path.split('.').reduce((obj: any, key: string) => obj?.[key], triggerEventPayload)
    );
    return `dedupe:${rule.id}:${keyParts.join(':')}:${triggerEventId}`;
  }
  return `dedupe:${rule.id}:${triggerEventId}`;
}

export const suppressionService = {
  checkSuppression(rule: AutomationRule, triggerEventPayload: Record<string, unknown>, triggerEventId: string): {
    suppressed: boolean;
    reason: AutomationSuppressionReason;
    detail: string;
    expiresAt?: string;
  } {
    if (rule.status === 'PAUSED') {
      return {
        suppressed: true,
        reason: 'RULE_PAUSED',
        detail: rule.suppression.reason || 'Rule is paused',
        expiresAt: rule.suppression.until,
      };
    }

    if (rule.status === 'DISABLED') {
      return {
        suppressed: true,
        reason: 'RULE_DISABLED',
        detail: rule.suppression.reason || 'Rule is disabled',
      };
    }

    if (rule.cooldown.enabled) {
      const cooldownKey = generateCooldownKey(rule, triggerEventPayload);
      const entry = cooldownStore.get(cooldownKey);
      if (entry && new Date(entry.expiresAt) > new Date()) {
        return {
          suppressed: true,
          reason: 'COOLDOWN_ACTIVE',
          detail: `Cooldown active until ${entry.expiresAt}`,
          expiresAt: entry.expiresAt,
        };
      }
    }

    const dedupeKey = generateDedupeKey(rule, triggerEventId, triggerEventPayload);
    if (cooldownStore.has(dedupeKey)) {
      return {
        suppressed: true,
        reason: 'DEDUPE_WINDOW',
        detail: 'Duplicate event within deduplication window',
      };
    }

    return { suppressed: false, reason: 'RULE_PAUSED', detail: '' };
  },

  recordExecution(rule: AutomationRule, triggerEventId: string, triggerEventPayload: Record<string, unknown>): void {
    if (rule.cooldown.enabled) {
      const cooldownKey = generateCooldownKey(rule, triggerEventPayload);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + rule.cooldown.windowMinutes * 60 * 1000);
      cooldownStore.set(cooldownKey, {
        key: cooldownKey,
        ruleId: rule.id,
        executedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      });

      const dedupeKey = generateDedupeKey(rule, triggerEventId, triggerEventPayload);
      const dedupeExpiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      cooldownStore.set(dedupeKey, {
        key: dedupeKey,
        ruleId: rule.id,
        executedAt: now.toISOString(),
        expiresAt: dedupeExpiresAt.toISOString(),
      });
    }
  },

  clearSuppression(ruleId: string): void {
    const keysToDelete: string[] = [];
    cooldownStore.forEach((entry, key) => {
      if (entry.ruleId === ruleId) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => cooldownStore.delete(key));
  },

  getActiveCooldowns(ruleId: string): CooldownEntry[] {
    const now = new Date();
    const entries: CooldownEntry[] = [];
    cooldownStore.forEach(entry => {
      if (entry.ruleId === ruleId && new Date(entry.expiresAt) > now) {
        entries.push(entry);
      }
    });
    return entries;
  },

  isInCooldown(rule: AutomationRule, payload: Record<string, unknown>): boolean {
    if (!rule.cooldown.enabled) return false;
    const cooldownKey = generateCooldownKey(rule, payload);
    const entry = cooldownStore.get(cooldownKey);
    if (!entry) return false;
    return new Date(entry.expiresAt) > new Date();
  },

  getCooldownRemaining(rule: AutomationRule, payload: Record<string, unknown>): number {
    if (!rule.cooldown.enabled) return 0;
    const cooldownKey = generateCooldownKey(rule, payload);
    const entry = cooldownStore.get(cooldownKey);
    if (!entry) return 0;
    const remaining = new Date(entry.expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000));
  },

  cleanupExpired(): void {
    const now = new Date();
    const keysToDelete: string[] = [];
    cooldownStore.forEach((entry, key) => {
      if (new Date(entry.expiresAt) <= now) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => cooldownStore.delete(key));
  },

  getAllCooldowns(): CooldownEntry[] {
    return Array.from(cooldownStore.values());
  },
};