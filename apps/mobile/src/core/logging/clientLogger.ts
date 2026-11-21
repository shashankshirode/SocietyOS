import type { Absent } from "../../shared/types/absence.types";
type LogMetadata = Record<string, string | number | boolean | Absent>;
function write(level: 'info' | 'warn' | 'error', message: string, metadata?: LogMetadata) {
    if (metadata) {
        console[level](`[SocietyOS] ${message}`, metadata);
        return;
    }
    console[level](`[SocietyOS] ${message}`);
}
export const clientLogger = {
    info: (message: string, metadata?: LogMetadata) => write('info', message, metadata),
    warn: (message: string, metadata?: LogMetadata) => write('warn', message, metadata),
    error: (message: string, metadata?: LogMetadata) => write('error', message, metadata),
};

