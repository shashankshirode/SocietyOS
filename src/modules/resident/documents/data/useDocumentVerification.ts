import { useState, useEffect, useCallback, useRef } from 'react';
import { documentVerificationService } from './documentVerificationService';
import type {
  VerificationCase,
  DocumentCategory,
  VerificationChecklist,
  VerificationDecision,
  SignatureMethod,
  DigitalSignature,
  ResubmissionRequest,
} from './documentVerification.types';

export function useDocumentVerification() {
  const [pendingCases, setPendingCases] = useState<VerificationCase[]>([]);
  const [currentCase, setCurrentCase] = useState<VerificationCase | null>(null);
  const [checklist, setChecklist] = useState<VerificationChecklist | null>(null);
  const [signatures, setSignatures] = useState<DigitalSignature[]>([]);
  const [resubmissionRequests, setResubmissionRequests] = useState<ResubmissionRequest[]>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    loadPendingCases();
    unsubscribeRef.current = documentVerificationService.onCaseUpdate((updatedCase) => {
      setPendingCases(prev => {
        const idx = prev.findIndex(c => c.id === updatedCase.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = updatedCase;
          return next;
        }
        return [...prev, updatedCase];
      });
      if (currentCase?.id === updatedCase.id) {
        setCurrentCase(updatedCase);
      }
    });
    return () => {
      unsubscribeRef.current?.();
    };
  }, [currentCase?.id]);

  const loadPendingCases = useCallback(async (adminId?: string) => {
    const cases = await documentVerificationService.getPendingVerificationCases(adminId ?? 'admin-001');
    setPendingCases(cases);
  }, []);

  const loadCase = useCallback(async (caseId: string) => {
    const case_ = await documentVerificationService.getVerificationCase(caseId);
    if (case_) {
      setCurrentCase(case_);
      setChecklist(documentVerificationService.getChecklist(case_.category));
    }
    return case_;
  }, []);

  const createCase = useCallback(async (
    documentId: string,
    documentVersion: number,
    category: DocumentCategory,
    submittedBy: string
  ) => {
    return documentVerificationService.createVerificationCase(documentId, documentVersion, category, submittedBy);
  }, []);

  const reviewCase = useCallback(async (
    caseId: string,
    adminId: string,
    decision: VerificationDecision,
    reason?: string,
    completedItems?: string[]
  ) => {
    return documentVerificationService.reviewVerificationCase(caseId, adminId, decision, reason, completedItems);
  }, []);

  const signCase = useCallback(async (
    caseId: string,
    adminId: string,
    signatureMethod: SignatureMethod,
    certificateId?: string
  ) => {
    return documentVerificationService.signVerificationCase(caseId, adminId, signatureMethod, certificateId);
  }, []);

  const requestResubmission = useCallback(async (
    caseId: string,
    residentId: string,
    reason: string
  ) => {
    return documentVerificationService.requestResubmission(caseId, residentId, reason);
  }, []);

  const submitResubmission = useCallback(async (requestId: string, documentId: string) => {
    return documentVerificationService.submitResubmission(requestId, documentId);
  }, []);

  const validateSignature = useCallback(async (signatureId: string) => {
    return documentVerificationService.validateSignature(signatureId);
  }, []);

  return {
    pendingCases,
    currentCase,
    checklist,
    signatures,
    resubmissionRequests,
    loadPendingCases,
    loadCase,
    createCase,
    reviewCase,
    signCase,
    requestResubmission,
    submitResubmission,
    validateSignature,
  };
}

export function useVerificationCase(caseId: string | null) {
  const [case_, setCase] = useState<VerificationCase | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!caseId) return;

    documentVerificationService.getVerificationCase(caseId).then(setCase);

    unsubscribeRef.current = documentVerificationService.onCaseUpdate((updatedCase) => {
      if (updatedCase.id === caseId) {
        setCase(updatedCase);
      }
    });

    return () => {
      unsubscribeRef.current?.();
    };
  }, [caseId]);

  return case_;
}