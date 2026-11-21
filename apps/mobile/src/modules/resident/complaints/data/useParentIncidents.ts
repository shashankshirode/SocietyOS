import { useState, useEffect, useCallback, useRef } from 'react';
import { parentIncidentEngine } from './parentIncidentEngine';
import type { ParentIncident, Complaint, CorrelationCandidate, CorrelationRule, CorrelationResult } from './parentIncident.types';

export function useParentIncidents() {
  const [parentIncidents, setParentIncidents] = useState<ParentIncident[]>([]);
  const [candidates, setCandidates] = useState<CorrelationCandidate[]>([]);
  const [currentParent, setCurrentParent] = useState<ParentIncident | null>(null);
  const [childComplaints, setChildComplaints] = useState<Complaint[]>([]);
  const [rules, setRules] = useState<CorrelationRule[]>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setParentIncidents(parentIncidentEngine.getParentIncidents());
    setCandidates(parentIncidentEngine.getCandidates());
    setRules(Array.from(parentIncidentEngine['correlationRules'].values()));

    unsubscribeRef.current = parentIncidentEngine.onUpdate((incident, type) => {
      if (type === 'candidate') {
        setCandidates(parentIncidentEngine.getCandidates());
      } else if (incident) {
        setParentIncidents(parentIncidentEngine.getParentIncidents());
        if (currentParent?.id === incident.id) {
          setCurrentParent(incident);
          setChildComplaints(parentIncidentEngine.getComplaintsByParent(incident.id));
        }
      }
    });

    return () => {
      unsubscribeRef.current?.();
    };
  }, [currentParent?.id]);

  const loadParent = useCallback(async (parentId: string) => {
    const parent = parentIncidentEngine.getParentIncident(parentId);
    if (parent) {
      setCurrentParent(parent);
      setChildComplaints(parentIncidentEngine.getComplaintsByParent(parentId));
    }
    return parent;
  }, []);

  const confirmCandidate = useCallback(async (candidateId: string, adminId: string) => {
    return parentIncidentEngine.confirmCandidate(candidateId, adminId);
  }, []);

  const rejectCandidate = useCallback(async (candidateId: string, adminId: string) => {
    return parentIncidentEngine.rejectCandidate(candidateId, adminId);
  }, []);

  const resolveParent = useCallback(async (parentId: string, adminId: string, rootCause: string, resolutionSummary: string) => {
    return parentIncidentEngine.resolveParentIncident(parentId, adminId, rootCause, resolutionSummary);
  }, []);

  const closeParent = useCallback(async (parentId: string, adminId: string) => {
    return parentIncidentEngine.closeParentIncident(parentId, adminId);
  }, []);

  const registerComplaint = useCallback((complaint: Complaint) => {
    parentIncidentEngine.registerComplaint(complaint);
  }, []);

  return {
    parentIncidents,
    candidates,
    currentParent,
    childComplaints,
    rules,
    loadParent,
    confirmCandidate,
    rejectCandidate,
    resolveParent,
    closeParent,
    registerComplaint,
  };
}

export function useParentIncident(parentId: string | null) {
  const [parent, setParent] = useState<ParentIncident | null>(null);
  const [children, setChildren] = useState<Complaint[]>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!parentId) return;

    const parentData = parentIncidentEngine.getParentIncident(parentId);
    if (parentData) {
      setParent(parentData);
      setChildren(parentIncidentEngine.getComplaintsByParent(parentId));
    }

    unsubscribeRef.current = parentIncidentEngine.onUpdate((incident, type) => {
      if (incident && incident.id === parentId) {
        setParent(incident);
        setChildren(parentIncidentEngine.getComplaintsByParent(parentId));
      }
    });

    return () => {
      unsubscribeRef.current?.();
    };
  }, [parentId]);

  return { parent, children };
}