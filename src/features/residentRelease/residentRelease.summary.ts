import { residentBlueprintVersion, residentReleaseRegistry } from './residentRelease.registry';
import type { ResidentImplementationStatus, ResidentReleaseSummary } from './residentRelease.types';

function count(status: ResidentImplementationStatus): number {
  return residentReleaseRegistry.filter((capability) => capability.implementationStatus === status).length;
}

export function getResidentReleaseSummary(): ResidentReleaseSummary {
  const complete = count('complete');
  const partial = count('partial');
  const missing = count('missing');
  const broken = count('broken');
  const featureFlagged = count('featureFlagged');
  return {
    blueprintVersion: residentBlueprintVersion,
    total: residentReleaseRegistry.length,
    complete,
    partial,
    missing,
    broken,
    featureFlagged,
    releaseCandidateReady: partial === 0 && missing === 0 && broken === 0 && complete + featureFlagged === residentReleaseRegistry.length,
  };
}
