export function validateAutomationPreviewInput(input: string): string | null {
  if (!input.trim()) return 'Input is required.';
  if (input.trim().length < 8) return 'Input must include enough detail for a useful preview.';
  return null;
}
