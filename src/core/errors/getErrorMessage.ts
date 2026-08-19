export function getErrorMessage<Value>(error: Value, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
