import type { Absent } from "../../shared/types/absence.types";
type LogLevel = 'debug' | 'info' | 'warn' | 'error';
const sensitiveKeyPattern = /(token|mobile|phone|email|aadhaar|pan|gst|rfid|password|document|payment|card|upi|chat|message)/i;
function sanitize(value: JsonValue | Absent): JsonValue | Absent {
    if (Array.isArray(value)) {
        return value.map((entry) => sanitize(entry) ?? null);
    }
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, entry]) => [
            key,
            sensitiveKeyPattern.test(key) ? '[REDACTED]' : sanitize(entry),
        ]));
    }
    return value;
}
function write(level: LogLevel, message: string, meta?: JsonObject) {
    if (process.env.NODE_ENV === 'production') {
        return;
    }
    const payload = meta ? sanitize(meta) : undefined;
    const target = level === 'debug' ? 'log' : level;
    console[target](`[${level}] ${message}`, payload ?? '');
}
export const safeLog = {
    debug: (message: string, meta?: JsonObject) => write('debug', message, meta),
    info: (message: string, meta?: JsonObject) => write('info', message, meta),
    warn: (message: string, meta?: JsonObject) => write('warn', message, meta),
    error: (message: string, meta?: JsonObject) => write('error', message, meta),
};

