import { useEffect, useState, useCallback } from 'react';
import type { NotificationPermissionStatus } from './notification.types';
import { requestNotificationPermission } from './notificationService';
import { getErrorMessage } from '../errors/getErrorMessage';
import type { Absent } from "../../shared/types/absence.types";
export function useNotificationPermission() {
    const [status, setStatus] = useState<NotificationPermissionStatus>('unknown');
    const [expoPushToken, setExpoPushToken] = useState<string | Absent>(undefined);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const askPermission = useCallback(async () => {
        setLoading(true);
        try {
            const result = await requestNotificationPermission();
            setStatus(result.status);
            setExpoPushToken(result.expoPushToken);
            setMessage(result.message);
            return result;
        }
        catch (err) {
            const errorMessage = getErrorMessage(err, 'Error requesting notification permission');
            setStatus('error');
            setMessage(errorMessage);
            return { status: 'error' as const, message: errorMessage };
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        askPermission();
    }, [askPermission]);
    return {
        status,
        expoPushToken,
        message,
        loading,
        askPermission,
    };
}

