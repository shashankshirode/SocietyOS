import { useState, useCallback } from 'react';
import { visitorExitService } from '../services/visitorExitService';
import type { Visitor } from '../../../shared/types/visitorPhase8.types';

export function useVisitorExit() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordExit = useCallback(async (
    visitorId: string,
    gateId: string,
    gateName: string,
    guardId: string,
    guardName: string,
    vehicleRegistration?: string
  ) => {
    try {
      const result = await visitorExitService.recordExit(
        visitorId,
        gateId,
        gateName,
        guardId,
        'Guard',
        vehicleRegistration
      );
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  const getExitHistory = useCallback(async (visitorId: string) => {
    try {
      const history = await visitorExitService.getExitHistory(visitorId);
      return history;
    } catch (error) {
      throw error;
    }
  }, []);

  const getCurrentlyInside = useCallback(async (societyId: string) => {
    try {
      const inside = await visitorExitService.getCurrentlyInside(societyId);
      return inside;
    } catch (error) {
      throw error;
    }
  }, []);

  const notifyExit = useCallback(async (visitorId: string, exitTime: string) => {
    try {
      await visitorExitService.notifyResidentOfExit(visitorId, exitTime);
    } catch (error) {
      // Silent fail for notifications
    }
  }, []);

  const getOverdueVisitors = useCallback(async (societyId: string) => {
    try {
      const overdue = await visitorExitService.getOverdueVisitors(societyId);
      return overdue;
    } catch (error) {
      throw error;
    }
  }, []);

  const notifyOverdue = useCallback(async (visitorId: string) => {
    try {
      await visitorExitService.notifyResidentOfOverdue(visitorId);
    } catch (error) {
      // Silent fail for notifications
    }
  }, []);

  return {
    recordExit,
    getExitHistory,
    getCurrentlyInside,
    notifyExit,
    getOverdueVisitors,
    notifyOverdue,
  };
}