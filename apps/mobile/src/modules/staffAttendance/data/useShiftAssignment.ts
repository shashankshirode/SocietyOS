import { useState } from 'react';
import type { ShiftAssignmentInput, ShiftAssignment } from '../../../shared/types/staff.types';
import { staffAttendanceRepository } from './staffAttendance.repository';

export function useShiftAssignment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ShiftAssignment | null>(null);

  const assign = async (input: ShiftAssignmentInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await staffAttendanceRepository.assignShift(input);
      setData(result);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Assignment failed');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { assign, isSubmitting, error, data };
}
