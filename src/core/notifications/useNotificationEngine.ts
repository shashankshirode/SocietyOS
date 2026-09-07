import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationEngine, type NotificationJob, type NotificationRecipient, type NotificationPayload, type NotificationPriority, type DeadLetterEntry } from './index';

export function useNotificationEngine() {
  const [jobs, setJobs] = useState<NotificationJob[]>([]);
  const [dlq, setDlq] = useState<DeadLetterEntry[]>([]);
  const [metrics, setMetrics] = useState(notificationEngine.getMetrics());
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    unsubscribeRef.current = notificationEngine.onJobUpdate((job) => {
      setJobs(prev => {
        const idx = prev.findIndex(j => j.id === job.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = job;
          return next;
        }
        return [...prev, job];
      });
      setMetrics(notificationEngine.getMetrics());
    });

    setDlq(notificationEngine.getDeadLetterQueue());

    return () => {
      unsubscribeRef.current?.();
    };
  }, []);

  const sendNotification = useCallback(async (
    recipient: NotificationRecipient,
    payload: NotificationPayload,
    options?: {
      priority?: NotificationPriority;
      fallbackChain?: ('PUSH' | 'SMS' | 'EMAIL' | 'IN_APP' | 'WEBHOOK')[];
    }
  ) => {
    return notificationEngine.enqueue(recipient, payload, options);
  }, []);

  const retryDlq = useCallback(async (dlqId: string) => {
    const success = await notificationEngine.retryDlqEntry(dlqId);
    if (success) {
      setDlq(notificationEngine.getDeadLetterQueue());
    }
    return success;
  }, []);

  const refreshMetrics = useCallback(() => {
    setMetrics(notificationEngine.getMetrics());
  }, []);

  return {
    jobs,
    dlq,
    metrics,
    sendNotification,
    retryDlq,
    refreshMetrics,
  };
}

export function useNotificationJob(jobId: string | null) {
  const [job, setJob] = useState<NotificationJob | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!jobId) return;

    unsubscribeRef.current = notificationEngine.onJobUpdate((updatedJob) => {
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