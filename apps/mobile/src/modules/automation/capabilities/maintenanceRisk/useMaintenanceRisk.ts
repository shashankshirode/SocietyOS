import { useState } from 'react';
import { maintenanceRiskService } from './maintenanceRiskService';
import type { MaintenanceRiskRequest, MaintenanceRiskResult } from './maintenanceRisk.types';

export function useMaintenanceRisk() {
  const [isAssessing, setIsAssessing] = useState(false);
  const [lastAssessment, setLastAssessment] = useState<MaintenanceRiskResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const assessRisk = async (request: MaintenanceRiskRequest): Promise<MaintenanceRiskResult | null> => {
    setIsAssessing(true);
    setError(null);

    try {
      const result = await maintenanceRiskService.assessRisk(request);
      setLastAssessment(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Risk assessment failed';
      setError(message);
      return null;
    } finally {
      setIsAssessing(false);
    }
  };

  const getDeterministicAssessment = async (request: MaintenanceRiskRequest): Promise<MaintenanceRiskResult | null> => {
    setIsAssessing(true);
    setError(null);

    try {
      const result = maintenanceRiskService.getDeterministicRisk(request);
      setLastAssessment(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Deterministic assessment failed';
      setError(message);
      return null;
    } finally {
      setIsAssessing(false);
    }
  };

  const clearAssessment = () => {
    setLastAssessment(null);
    setError(null);
  };

  return {
    assessRisk,
    getDeterministicAssessment,
    isAssessing,
    lastAssessment,
    error,
    clearAssessment,
  };
}