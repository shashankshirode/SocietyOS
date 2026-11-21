export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
}

export function validateUnitScopeInput(input: unknown): ValidationResult {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {
      isValid: false,
      errors: ['Input must be a valid unit scope object.'],
    };
  }

  const errors: string[] = [];
  const obj = input as Record<string, unknown>;

  if (typeof obj.societyId !== 'string' || !obj.societyId.trim()) {
    errors.push('societyId is required.');
  }
  if (typeof obj.unitId !== 'string' || !obj.unitId.trim()) {
    errors.push('unitId is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateOccupancyInput(input: unknown): ValidationResult {
  return validateUnitScopeInput(input);
}

export function validateOccupancyRecord(input: unknown): ValidationResult {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {
      isValid: false,
      errors: ['Input must be a valid occupancy record object.'],
    };
  }

  const errors: string[] = [];
  const obj = input as Record<string, unknown>;

  if (typeof obj.id !== 'string' || !obj.id.trim()) {
    errors.push('id is required.');
  }
  if (typeof obj.unitId !== 'string' || !obj.unitId.trim()) {
    errors.push('unitId is required.');
  }
  if (typeof obj.occupantName !== 'string' || !obj.occupantName.trim()) {
    errors.push('occupantName is required.');
  }

  const allowedOccupantTypes = ['OWNER', 'TENANT', 'FAMILY_MEMBER', 'CO_OWNER'];
  if (typeof obj.occupantType !== 'string' || !allowedOccupantTypes.includes(obj.occupantType)) {
    errors.push('occupantType must be one of: OWNER, TENANT, FAMILY_MEMBER, CO_OWNER.');
  }

  if (typeof obj.documentStatus !== 'string' || !obj.documentStatus.trim()) {
    errors.push('documentStatus is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
