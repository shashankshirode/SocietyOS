import { useState, useCallback } from 'react';
import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { SocietyService } from '../services/societyService';
import type { ValidationResult, ValidationCheck } from '../data/societyProperty.types';

export function useSocietyValidation() {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback(async (societyId: string) => {
    setIsValidating(true);
    try {
      const result = await SocietyService.validateSociety(societyId);
      setValidationResult(result);
      return result;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearValidation = useCallback(() => {
    setValidationResult(null);
  }, []);

  return {
    validationResult,
    isValidating,
    validate,
    clearValidation,
  };
}

export function useSocietyActivation() {
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);

  const activate = useCallback(async (societyId: string, activatedBy: string) => {
    setIsActivating(true);
    setActivationError(null);
    try {
      const result = await SocietyService.activateSociety({ societyId, confirmValidationPassed: true, activatedBy });
      setIsActivating(false);
      return result;
    } catch (error) {
      setActivationError(error instanceof Error ? error.message : 'Activation failed');
      setIsActivating(false);
      throw error;
    }
  }, []);

  return {
    activate,
    isActivating,
    activationError,
  };
}