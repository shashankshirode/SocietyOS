import { useMemo } from 'react';
import { residentReleaseChecklist } from '../data/residentReleaseChecklist';
import { validateResidentReleaseReadiness } from '../data/residentReleaseValidator';
import type { ResidentReleaseReadinessSummary } from '../data/residentReleaseChecklist.types';

export function useResidentReleaseReadiness(): ResidentReleaseReadinessSummary {
  return useMemo(
    () => validateResidentReleaseReadiness(residentReleaseChecklist),
    []
  );
}

