import type { DeviceLocationMapping } from '../types/hardware.types';
import { getRequiredItem } from "../utils/requiredItem";
export const mockDeviceLocationMappings: DeviceLocationMapping[] = Array.from({ length: 15 }, (_, i) => ({
    id: `dlm-${String(i + 1).padStart(3, '0')}`,
    deviceId: `dev-${String(i + 1).padStart(3, '0')}`,
    deviceName: `Device ${i + 1}`,
    location: getRequiredItem(['Main Gate', 'Service Gate', 'Basement Gate', 'Parking B1', 'Parking B2', 'A Wing Lobby', 'B Wing Lobby', 'C Wing Lobby', 'Meter Room', 'EV Charging Zone'], i % 10, "deviceLocationMappings.mock.ts"),
    accessZone: `Zone ${i % 3 + 1}`,
    responsibleRole: getRequiredItem(['FACILITY_MANAGER', 'SECURITY_SUPERVISOR', 'SOCIETY_ADMIN'], i % 3, "deviceLocationMappings.mock.ts"),
    visibilityRules: 'Strictly role-gated access',
}));

