import type { BoomBarrierDevice } from '../types/gateHardware.types';
import { getRequiredItem } from "../utils/requiredItem";
export const mockBoomBarriers: BoomBarrierDevice[] = Array.from({ length: 5 }, (_, i) => ({
    id: `dev-${String(i + 11).padStart(3, '0')}`,
    name: `Boom Barrier ${i + 1}`,
    deviceCode: `BB-DEV-${1010 + i}`,
    location: getRequiredItem(['Main Gate In', 'Main Gate Out', 'Service Gate In', 'Service Gate Out', 'Basement Gate'], i, "boomBarriers.mock.ts"),
    status: getRequiredItem((['CLOSED', 'OPEN', 'ERROR', 'OFFLINE', 'MANUAL_OVERRIDE'] as const), i, "boomBarriers.mock.ts"),
    lastOpenTime: new Date(Date.now() - (i * 10 * 60 * 1000)).toISOString(),
    lastCloseTime: new Date(Date.now() - (i * 11 * 60 * 1000)).toISOString(),
    deniedCount: i * 2,
}));

