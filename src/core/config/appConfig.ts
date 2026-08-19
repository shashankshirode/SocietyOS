import { DATA_SOURCE_MODE } from './dataSourceMode';
import type { Absent } from "../../shared/types/absence.types";
function resolveRequestTimeout(value: string | Absent): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 15000;
}
const apiVersion = process.env.EXPO_PUBLIC_API_VERSION ?? 'v1';
const apiOrigin = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
export const appConfig = {
    apiBaseUrl: `${apiOrigin.replace(/\/$/, '')}/api/${apiVersion}`,
    apiVersion,
    dataSourceMode: DATA_SOURCE_MODE,
    requestTimeoutMs: resolveRequestTimeout(process.env.EXPO_PUBLIC_REQUEST_TIMEOUT),
    clientApp: 'society-os-mobile',
    clientVersion: '0.1.0',
} as const;

