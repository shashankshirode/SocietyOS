import type { ValidationResult } from '../../../../shared/validators/common.validators';
import { isRequired, minLength } from '../../../../shared/validators/common.validators';

export type NocFormField = 'nocType' | 'reason' | 'flat' | 'requiredDate';

export interface NocValidationData {
  nocType: string;
  reason: string;
  flat: string;
  requiredDate: string;
}

export function validateNocRequest(data: NocValidationData): ValidationResult<NocFormField> {
  const fieldErrors: Partial<Record<NocFormField, string>> = {};

  if (!isRequired(data.nocType)) {
    fieldErrors.nocType = 'NOC classification type is required';
  }

  if (!isRequired(data.reason)) {
    fieldErrors.reason = 'Detailed reason description is required';
  } else if (!minLength(data.reason, 15)) {
    fieldErrors.reason = 'Please explain the reason in detail (minimum 15 characters)';
  }

  if (!isRequired(data.flat)) {
    fieldErrors.flat = 'Flat number is required';
  }

  if (!isRequired(data.requiredDate)) {
    fieldErrors.requiredDate = 'NOC delivery deadline date is required';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.requiredDate.trim())) {
    fieldErrors.requiredDate = 'Use format YYYY-MM-DD (e.g. 2026-07-15)';
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}
