import type { ValidationResult } from '../../../../shared/validators/common.validators';
import { isRequired, minLength } from '../../../../shared/validators/common.validators';
import { Messages } from '../../../../shared/constants/messages';

export type ComplaintFormField = 'category' | 'title' | 'description' | 'priority' | 'location';

export interface ComplaintValidationData {
  category: string;
  title: string;
  description: string;
  priority: string;
  location: string;
}

export function validateComplaintForm(data: ComplaintValidationData): ValidationResult<ComplaintFormField> {
  const fieldErrors: Partial<Record<ComplaintFormField, string>> = {};

  if (!isRequired(data.category)) {
    fieldErrors.category = Messages.validation.selectRequired(Messages.complaints.formCategory);
  }

  if (!isRequired(data.title)) {
    fieldErrors.title = Messages.validation.required(Messages.complaints.formTitle);
  }

  if (!isRequired(data.description)) {
    fieldErrors.description = Messages.validation.required(Messages.complaints.formDescription);
  } else if (!minLength(data.description, 15)) {
    fieldErrors.description = Messages.validation.minLength(Messages.complaints.formDescription, 15);
  }

  if (!isRequired(data.priority)) {
    fieldErrors.priority = Messages.validation.selectRequired(Messages.complaints.formPriority);
  }

  if (!isRequired(data.location)) {
    fieldErrors.location = Messages.validation.required(Messages.complaints.formLocation);
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}
