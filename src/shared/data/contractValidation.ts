import { safeLog } from '../../core/logging/safeLog';

export type ContractValidationResult<TData> =
  | {
      valid: true;
      data: TData;
    }
  | {
      valid: false;
      reasonMessageKey: string;
      recoverable: boolean;
    };

export function validContract<TData>(data: TData): ContractValidationResult<TData> {
  return { valid: true, data };
}

export function invalidContract<TData>(
  reasonMessageKey: string,
  recoverable = true,
): ContractValidationResult<TData> {
  return { valid: false, reasonMessageKey, recoverable };
}

export type FieldValidationError = {
  field: string;
  reason: string;
};

export function requireString(
  obj: JsonObject,
  field: string,
): FieldValidationError | null {
  const value = obj[field];
  if (typeof value !== 'string' || value.trim().length === 0) {
    return { field, reason: `Missing or empty required string field: ${field}` };
  }
  return null;
}

export function requireNumber(
  obj: JsonObject,
  field: string,
): FieldValidationError | null {
  const value = obj[field];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return { field, reason: `Missing or invalid required number field: ${field}` };
  }
  return null;
}

export function requireArray(
  obj: JsonObject,
  field: string,
): FieldValidationError | null {
  const value = obj[field];
  if (!Array.isArray(value)) {
    return { field, reason: `Missing or invalid required array field: ${field}` };
  }
  return null;
}

export function requireEnum(
  obj: JsonObject,
  field: string,
  allowed: readonly string[],
): FieldValidationError | null {
  const value = obj[field];
  if (typeof value !== 'string' || !allowed.includes(value)) {
    return { field, reason: `Invalid enum value for field: ${field}` };
  }
  return null;
}

export function validateFields(
  obj: JsonObject,
  validators: ((obj: JsonObject) => FieldValidationError | null)[],
): FieldValidationError[] {
  const errors: FieldValidationError[] = [];
  for (const validate of validators) {
    const error = validate(obj);
    if (error) {
      errors.push(error);
    }
  }
  return errors;
}

export function validateContract<TData extends JsonObject>(
  data: JsonValue,
  validators: ((obj: JsonObject) => FieldValidationError | null)[],
  errorMessageKey: string,
): ContractValidationResult<TData> {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return invalidContract<TData>(errorMessageKey, false);
  }

  const errors = validateFields(data, validators);

  if (errors.length > 0) {
    if (__DEV__) {
      safeLog.warn('Contract validation failed', {
        errors: errors.map((error) => ({ field: error.field, reason: error.reason })),
      });
    }
    return invalidContract<TData>(errorMessageKey, true);
  }

  return validContract(data as TData);
}
