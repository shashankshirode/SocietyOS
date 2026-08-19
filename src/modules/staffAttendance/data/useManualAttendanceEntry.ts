import { useState } from 'react';
import type { ManualAttendanceInput, AttendancePunch } from '../../../shared/types/attendance.types';
import { staffAttendanceRepository } from './staffAttendance.repository';

export function useManualAttendanceEntry() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<AttendancePunch | null>(null);

  const enter = async (input: ManualAttendanceInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await staffAttendanceRepository.createManualAttendance(input);
      setData(result);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Entry failed');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { enter, isSubmitting, error, data };
}
