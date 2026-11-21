export enum DevelopmentDiagnosticCode {
  MissingMessage = 'MISSING_MESSAGE',
}

export type DevelopmentDiagnostic = {
  code: DevelopmentDiagnosticCode;
  detail: string;
  timestamp: string;
};

type DevelopmentDiagnosticListener = (diagnostic: DevelopmentDiagnostic) => void;

const listeners = new Set<DevelopmentDiagnosticListener>();
const diagnostics: DevelopmentDiagnostic[] = [];
const maximumDiagnosticCount = 100;

export function reportDevelopmentDiagnostic(
  code: DevelopmentDiagnosticCode,
  detail: string,
): void {
  if (!__DEV__) return;
  const diagnostic = { code, detail, timestamp: new Date().toISOString() };
  diagnostics.push(diagnostic);
  if (diagnostics.length > maximumDiagnosticCount) diagnostics.shift();
  listeners.forEach((listener) => listener(diagnostic));
}

export function subscribeToDevelopmentDiagnostics(
  listener: DevelopmentDiagnosticListener,
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getDevelopmentDiagnostics(): readonly DevelopmentDiagnostic[] {
  return diagnostics;
}
