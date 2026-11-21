import { ValidationResult, isRequired, isPositiveNumber } from '../../../shared/validators/common.validators';

export type BillingCycleFields = 'month' | 'start' | 'end' | 'dueDate';
export type ManualPaymentFields = 'unitNumber' | 'amount' | 'refNum';

export function validateBillingCycle(
  month: string,
  start: string,
  end: string,
  dueDate: string
): ValidationResult<BillingCycleFields> {
  const fieldErrors: Partial<Record<BillingCycleFields, string>> = {};
  if (!isRequired(month)) fieldErrors.month = 'Month is required';
  if (!isRequired(start)) fieldErrors.start = 'Start date is required';
  if (!isRequired(end)) fieldErrors.end = 'End date is required';
  if (!isRequired(dueDate)) fieldErrors.dueDate = 'Due date is required';

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}

export function validateManualPayment(
  unitNumber: string,
  amount: string,
  mode: string,
  refNum: string
): ValidationResult<ManualPaymentFields> {
  const fieldErrors: Partial<Record<ManualPaymentFields, string>> = {};
  if (!isRequired(unitNumber)) {
    fieldErrors.unitNumber = 'Unit number is required';
  }
  if (!isRequired(amount) || !isPositiveNumber(amount)) {
    fieldErrors.amount = 'Valid amount is required';
  }
  if (mode !== 'CASH' && !isRequired(refNum)) {
    fieldErrors.refNum = 'Reference number is required';
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}
