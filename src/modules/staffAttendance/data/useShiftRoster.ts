import { useMemo } from 'react';
import { useShifts } from './useShifts';

export function useShiftRoster() {
  const shifts = useShifts();

  return useMemo(
    () => ({
      ...shifts,
      rosterSummary: {
        morning: shifts.data.filter((shift) => shift.shiftName.toLowerCase().includes('morning')).length,
        evening: shifts.data.filter((shift) => shift.shiftName.toLowerCase().includes('evening')).length,
        night: shifts.data.filter((shift) => shift.shiftName.toLowerCase().includes('night')).length,
      },
    }),
    [shifts]
  );
}
