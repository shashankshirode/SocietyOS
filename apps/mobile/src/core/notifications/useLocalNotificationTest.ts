import { useState, useCallback } from 'react';
import { scheduleLocalTestNotification } from './notificationService';
import { getErrorMessage } from '../errors/getErrorMessage';

export function useLocalNotificationTest() {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerTest = useCallback(async () => {
    setIsSending(true);
    setError(null);
    try {
      await scheduleLocalTestNotification();
      return { success: true };
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Failed to trigger local notification test');
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSending(false);
    }
  }, []);

  return {
    triggerTest,
    isSending,
    error,
  };
}
