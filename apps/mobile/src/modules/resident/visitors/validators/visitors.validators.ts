import type { ValidationResult } from '../../../../shared/validators/common.validators';
import { isRequired, isValidIndianMobile } from '../../../../shared/validators/common.validators';
import { Messages } from '../../../../shared/constants/messages';

export type VisitorFormField = 'name' | 'phone' | 'type' | 'expectedDate' | 'expectedTime' | 'purpose';

export interface VisitorValidationData {
  name: string;
  phone: string;
  type: string;
  expectedDate: string;
  expectedTime: string;
  purpose: string;
}

export function validateVisitorForm(data: VisitorValidationData): ValidationResult<VisitorFormField> {
  const fieldErrors: Partial<Record<VisitorFormField, string>> = {};

  if (!isRequired(data.name)) {
    fieldErrors.name = Messages.validation.required(Messages.visitors.formName);
  }

  if (!isRequired(data.phone)) {
    fieldErrors.phone = Messages.validation.required(Messages.visitors.formPhone);
  } else if (!isValidIndianMobile(data.phone)) {
    fieldErrors.phone = Messages.validation.invalidPhone;
  }

  if (!isRequired(data.type)) {
    fieldErrors.type = Messages.validation.selectRequired(Messages.visitors.formType);
  }

  if (!isRequired(data.expectedDate)) {
    fieldErrors.expectedDate = Messages.validation.required(Messages.visitors.formDate);
  }

  if (!isRequired(data.expectedTime)) {
    fieldErrors.expectedTime = Messages.validation.required(Messages.visitors.formTime);
  }

  if (!isRequired(data.purpose)) {
    fieldErrors.purpose = Messages.validation.required(Messages.visitors.formPurpose);
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}
