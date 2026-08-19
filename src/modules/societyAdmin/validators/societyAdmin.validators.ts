import { ValidationResult, isRequired } from '../../../shared/validators/common.validators';

export type NoticeFields = 'title' | 'content';

export function validateNotice(
  title: string,
  content: string
): ValidationResult<NoticeFields> {
  const fieldErrors: Partial<Record<NoticeFields, string>> = {};
  if (!isRequired(title)) {
    fieldErrors.title = 'Title is required';
  }
  if (!isRequired(content)) {
    fieldErrors.content = 'Content is required';
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}
