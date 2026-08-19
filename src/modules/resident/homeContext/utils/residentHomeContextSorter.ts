import type { ResidentHomeContext } from '../data/residentHomeContext.types';

export function sortHomeContexts(contexts: ResidentHomeContext[]): ResidentHomeContext[] {
  return [...contexts].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;

    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;

    const nameA = a.societyName.toLowerCase();
    const nameB = b.societyName.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;

    return a.flatNumber.localeCompare(b.flatNumber, undefined, { numeric: true });
  });
}
