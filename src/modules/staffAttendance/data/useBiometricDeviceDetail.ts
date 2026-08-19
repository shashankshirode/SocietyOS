import { useState, useEffect, useCallback } from 'react';
import type { BiometricDevice, BiometricMapping } from '../../../shared/types/biometric.types';
import { staffAttendanceRepository } from './staffAttendance.repository';

export function useBiometricDeviceDetail(deviceId: string) {
  const [device, setDevice] = useState<BiometricDevice | null>(null);
  const [mappings, setMappings] = useState<BiometricMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!deviceId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [devDetails, devMappings] = await Promise.all([
        staffAttendanceRepository.getBiometricDeviceDetail(deviceId),
        staffAttendanceRepository.getBiometricMappings(deviceId),
      ]);
      setDevice(devDetails);
      setMappings(devMappings);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [deviceId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { device, mappings, isLoading, error, refetch: fetch };
}
