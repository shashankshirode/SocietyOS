import type { CctvCamera } from '../types/cctv.types';
import { getRequiredItem } from "../utils/requiredItem";
export const mockCctvCameras: CctvCamera[] = Array.from({ length: 12 }, (_, i) => ({
    id: `dev-${String(i + 16).padStart(3, '0')}`,
    name: `CCTV Camera ${i + 1}`,
    deviceCode: `CCTV-DEV-${1020 + i}`,
    location: getRequiredItem(['Main Gate', 'Basement 1', 'Basement 2', 'A Wing Lobby', 'B Wing Lobby', 'Clubhouse', 'Playground'], i % 7, "cctvCameras.mock.ts"),
    coverageArea: 'All entrance and exit vectors',
    status: getRequiredItem((['ONLINE', 'ONLINE', 'ONLINE', 'OFFLINE', 'ERROR', 'MAINTENANCE'] as const), i % 6, "cctvCameras.mock.ts"),
    recordingEnabled: i % 4 !== 0,
    accessLevel: getRequiredItem((['SECURITY_ONLY', 'FACILITY_AND_SECURITY', 'ADMIN_APPROVAL_REQUIRED', 'EMERGENCY_ONLY', 'DISABLED'] as const), i % 5, "cctvCameras.mock.ts"),
    lastHealthCheck: new Date().toISOString(),
}));

