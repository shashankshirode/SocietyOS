import { useState, useEffect, useCallback, useRef } from 'react';
import { aiClassificationEngine, type AIAnalysisRequest, type AIAnalysisResponse, type AIAnalysisJob, type HumanReview, type AIModelConfig, type AIClassification } from './aiClassificationEngine';

export function useAIClassification() {
  const [models, setModels] = useState<AIModelConfig[]>([]);
  const [currentJob, setCurrentJob] = useState<AIAnalysisJob | null>(null);
  const [history, setHistory] = useState<AIAnalysisJob[]>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setModels(aiClassificationEngine.getModels());

    unsubscribeRef.current = aiClassificationEngine.onJobUpdate((job) => {
      setHistory(prev => {
        const idx = prev.findIndex(j => j.id === job.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = job;
          return next;
        }
        return [job, ...prev];
      });
      setCurrentJob(job);
    });

    return () => {
      unsubscribeRef.current?.();
    };
  }, []);

  const analyze = useCallback(async (request: AIAnalysisRequest) => {
    return aiClassificationEngine.analyze(request);
  }, []);

  const submitReview = useCallback(async (
    analysisId: string,
    reviewerId: string,
    acceptedClassification: AIClassification | null,
    correctedClassification?: AIClassification,
    correctionReason?: string,
    feedback: 'ACCEPTED' | 'CORRECTED' | 'REJECTED' = 'ACCEPTED'
  ) => {
    return aiClassificationEngine.submitHumanReview(analysisId, reviewerId, acceptedClassification, correctedClassification, correctionReason, feedback);
  }, []);

  const getJob = useCallback((jobId: string) => {
    return aiClassificationEngine.getJob(jobId);
  }, []);

  const getJobsByComplaint = useCallback((complaintId: string) => {
    return aiClassificationEngine.getJobsByComplaint(complaintId);
  }, []);

  const getReviewsByComplaint = useCallback((complaintId: string) => {
    return aiClassificationEngine.getReviewsByComplaint(complaintId);
  }, []);

  return {
    models,
    currentJob,
    history,
    analyze,
    submitReview,
    getJob,
    getJobsByComplaint,
    getReviewsByComplaint,
  };
}

export function useAIAnalysisJob(jobId: string | null) {
  const [job, setJob] = useState<AIAnalysisJob | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const jobData = aiClassificationEngine.getJob(jobId);
    if (jobData) setJob(jobData);

    unsubscribeRef.current = aiClassificationEngine.onJobUpdate((updatedJob) => {
      if (updatedJob.id === jobId) {
        setJob(updatedJob);
      }
    });

    return () => {
      unsubscribeRef.current?.();
    };
  }, [jobId]);

  return job;
}