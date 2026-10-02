import { useCallback, useState } from 'react';
import { 
  safetyInstructionService, 
  safetyDrillService, 
  testModeService, 
  postIncidentReviewService 
} from '../data/safetyInstructionService';
import type { SafetyInstruction, SafetyDrillRecord, SafetyInstructionCategory, SafetyDrillType, SafetyDrillStatus, CreateSafetyDrillInput, CreatePostIncidentReviewInput, PostIncidentReview } from '../../../../shared/types/safety.types';
import type { EmergencyIncident } from '../../../../shared/types/emergency.types';

export function useSafetyInstructions(category?: SafetyInstructionCategory) {
  const [instructions, setInstructions] = useState<SafetyInstruction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadInstructions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await safetyInstructionService.getInstructions(category);
      setInstructions(data);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to load instructions');
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  const loadForEmergency = useCallback(async (emergencyType: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await safetyInstructionService.getInstructionsForEmergency(emergencyType);
      setInstructions(data);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to load instructions');
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { instructions, loadInstructions, loadForEmergency, isLoading, error };
}

export function useSafetyDrills() {
  const [drills, setDrills] = useState<SafetyDrillRecord[]>([]);
  const [upcoming, setUpcoming] = useState<SafetyDrillRecord[]>([]);
  const [past, setPast] = useState<SafetyDrillRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadDrills = useCallback(async (filters?: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await safetyDrillService.getDrills(filters);
      setDrills(data);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to load drills');
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUpcoming = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await safetyDrillService.getUpcomingDrills();
      setUpcoming(data);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to load upcoming drills');
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPast = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await safetyDrillService.getPastDrills();
      setPast(data);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to load past drills');
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDrill = useCallback(async (input: CreateSafetyDrillInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const newDrill = await safetyDrillService.createDrill(input);
      setDrills(prev => [newDrill, ...prev]);
      if (newDrill.status === 'PLANNED') {
        setUpcoming(prev => [newDrill, ...prev].sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate)));
      }
      return newDrill;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to create drill');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { 
    drills, 
    upcoming, 
    past, 
    loadDrills, 
    loadUpcoming, 
    loadPast, 
    createDrill, 
    isLoading, 
    error 
  };
}

export function useTestMode() {
  const [isTestMode, setIsTestMode] = useState(false);
  const [testResults, setTestResults] = useState<{ test: true; incidentId: string; message: string }[]>([]);

  const checkTestMode = useCallback(() => {
    const enabled = testModeService.isTestMode();
    setIsTestMode(enabled);
    return enabled;
  }, []);

  const triggerTestSos = useCallback(async (input: { unitId: string; flatNumber: string; tower: string; note?: string }) => {
    if (!testModeService.isTestMode()) {
      throw new Error('TEST_MODE_NOT_ENABLED: Test mode only available in development');
    }
    const result = await testModeService.createTestSos(input);
    setTestResults(prev => [result, ...prev]);
    return result;
  }, []);

  const triggerTestIncident = useCallback(async (input: {
    emergencyType: string;
    severity: string;
    location: string;
    description?: string;
  }) => {
    if (!testModeService.isTestMode()) {
      throw new Error('TEST_MODE_NOT_ENABLED: Test mode only available in development');
    }
    const result = await testModeService.createTestIncident(input);
    setTestResults(prev => [result, ...prev]);
    return result;
  }, []);

  const getWarning = useCallback(() => {
    return testModeService.getTestModeWarning();
  }, []);

  return { isTestMode, checkTestMode, triggerTestSos, triggerTestIncident, testResults, getWarning };
}

export function usePostIncidentReview(incidentId?: string) {
  const [reviews, setReviews] = useState<PostIncidentReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadReviews = useCallback(async (incidentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await postIncidentReviewService.getReviewsForIncident(incidentId);
      setReviews(data);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to load reviews');
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReview = useCallback(async (input: CreatePostIncidentReviewInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const newReview = await postIncidentReviewService.createReview(input);
      setReviews(prev => [newReview, ...prev]);
      return newReview;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to create review');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateMetrics = useCallback(async (incident: EmergencyIncident) => {
    return postIncidentReviewService.calculateResponseMetrics(incident);
  }, []);

  return { reviews, loadReviews, createReview, calculateMetrics, isLoading, error };
}