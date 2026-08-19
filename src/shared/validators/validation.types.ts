export type ValidationResult<TField extends string> = {
  isValid: boolean;
  fieldErrors: Partial<Record<TField, string>>;
};
