import { useState } from 'react';
import type { RegisterStaffInput, StaffProfile } from '../../../shared/types/staff.types';
import { staffAttendanceRepository } from './staffAttendance.repository';

export function useRegisterStaff() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<StaffProfile | null>(null);

  const register = async (input: RegisterStaffInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await staffAttendanceRepository.registerStaff(input);
      setData(result);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Registration failed');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { register, isSubmitting, error, data };
}
