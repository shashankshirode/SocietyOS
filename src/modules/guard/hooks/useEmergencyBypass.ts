import { useState, useCallback } from 'react';
import { emergencyBypassService } from '../services/emergencyBypassService';
import type { EmergencyType } from '../../../shared/types/visitorPhase8.types';

export function useEmergencyBypass() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBypass = useCallback(async (payload: {
    gateId: string;
    emergencyType: EmergencyType;
    emergencyDescription: string;
    visitorName: string;
    visitorPhone?: string;
    visitorType: 'EMERGENCY';
    flatNumber: string;
    vehicleRegistration?: string;
    vehicleType?: 'CAR' | 'BIKE' | 'SCOOTER' | 'AUTO_RICKSHAW' | 'TRUCK' | 'TEMPO' | 'VAN' | 'OTHER';
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  }) => {
    try {
      const result = await emergencyBypassService.createEmergencyBypass(
        payload,
        'guard-id',
        'Guard',
        'society-123'
      );
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  const getHistory = useCallback(async (societyId: string, dateFrom?: string, dateTo?: string) => {
    try {
      const history = await emergencyBypassService.getEmergencyBypassHistory(societyId, dateFrom, dateTo);
      return history;
    } catch (error) {
      throw error;
    }
  }, []);

  const getStats = useCallback(async (societyId: string) => {
    try {
      const stats = await emergencyBypassService.getEmergencyBypassStats(societyId);
      return stats;
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    createBypass,
    getHistory,
    getStats,
  };
}