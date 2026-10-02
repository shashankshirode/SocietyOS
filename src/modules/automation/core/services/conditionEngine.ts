import { AutomationCondition, AutomationConditionOperator, AutomationConditionEvaluation } from '../types';

export class ConditionEngine {
  evaluateConditions(
    conditions: AutomationCondition[],
    payload: Record<string, unknown>
  ): AutomationConditionEvaluation[] {
    return conditions.map(condition => this.evaluateCondition(condition, payload));
  }

  evaluateCondition(
    condition: AutomationCondition,
    payload: Record<string, unknown>
  ): AutomationConditionEvaluation {
    const actualValue = this.getFieldValue(payload, condition.field);
    const expectedValue = condition.value;
    let passed = false;

    try {
      switch (condition.operator) {
        case 'EQUALS':
          passed = this.deepEqual(actualValue, expectedValue);
          break;
        case 'NOT_EQUALS':
          passed = !this.deepEqual(actualValue, expectedValue);
          break;
        case 'GREATER_THAN':
          passed = this.compareValues(actualValue, expectedValue) > 0;
          break;
        case 'GREATER_THAN_OR_EQUALS':
          passed = this.compareValues(actualValue, expectedValue) >= 0;
          break;
        case 'LESS_THAN':
          passed = this.compareValues(actualValue, expectedValue) < 0;
          break;
        case 'LESS_THAN_OR_EQUALS':
          passed = this.compareValues(actualValue, expectedValue) <= 0;
          break;
        case 'IN':
          passed = Array.isArray(expectedValue) &&
            expectedValue.some(v => this.deepEqual(v, actualValue));
          break;
        case 'NOT_IN':
          passed = !Array.isArray(expectedValue) ||
            !expectedValue.some(v => this.deepEqual(v, actualValue));
          break;
        case 'EXISTS':
          passed = actualValue !== undefined && actualValue !== null;
          break;
        case 'NOT_EXISTS':
          passed = actualValue === undefined || actualValue === null;
          break;
        case 'CONTAINS':
          passed = String(actualValue).includes(String(expectedValue));
          break;
        case 'NOT_CONTAINS':
          passed = !String(actualValue).includes(String(expectedValue));
          break;
        default:
          passed = false;
      }
    } catch (error) {
      console.error('[ConditionEngine] Evaluation error:', error);
      passed = false;
    }

    return {
      conditionId: condition.id,
      field: condition.field,
      operator: condition.operator,
      expectedValue,
      actualValue,
      passed,
      evaluatedAt: new Date().toISOString(),
    };
  }

  evaluateAllPassed(evaluations: AutomationConditionEvaluation[]): boolean {
    return evaluations.every(e => e.passed);
  }

  getFieldValue(obj: Record<string, unknown>, path: string): unknown {
    if (!path || !obj) return undefined;
    return path.split('.').reduce((current: any, key: string) => {
      if (current === null || current === undefined) return undefined;
      return current[key];
    }, obj);
  }

  compareValues(actual: unknown, expected: unknown): number {
    if (typeof actual === 'number' && typeof expected === 'number') {
      return actual - expected;
    }
    if (typeof actual === 'string' && typeof expected === 'string') {
      return actual.localeCompare(expected);
    }
    if (actual instanceof Date && expected instanceof Date) {
      return actual.getTime() - expected.getTime();
    }
    if (typeof actual === 'string' && expected instanceof Date) {
      return new Date(actual).getTime() - expected.getTime();
    }
    if (actual instanceof Date && typeof expected === 'string') {
      return actual.getTime() - new Date(expected).getTime();
    }
    return String(actual).localeCompare(String(expected));
  }

  deepEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (a === null || b === null) return a === b;
    if (typeof a !== 'object' || typeof b !== 'object') return a === b;
    if (Array.isArray(a) !== Array.isArray(b)) return false;

    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);
    if (keysA.length !== keysB.length) return false;

    return keysA.every(key => this.deepEqual((a as any)[key], (b as any)[key]));
  }

  createSnapshot(
    conditions: AutomationCondition[],
    payload: Record<string, unknown>
  ): Record<string, unknown> {
    const snapshot: Record<string, unknown> = {};
    conditions.forEach(c => {
      snapshot[c.field] = this.getFieldValue(payload, c.field);
    });
    return snapshot;
  }
}

export const conditionEngine = new ConditionEngine();