import type { HardwareDevice } from '../types/hardware.types';
import { getRequiredItem } from "../utils/requiredItem";
export const mockHardwareDevices: HardwareDevice[] = Array.from({ length: 40 }, (_, i) => {
    const types: HardwareDevice['type'][] = [
        'RFID_READER', 'ANPR_CAMERA', 'BOOM_BARRIER', 'CCTV_CAMERA',
        'BIOMETRIC_DEVICE', 'SMART_ELECTRICITY_METER', 'SMART_WATER_METER',
        'SMART_GAS_METER', 'EV_CHARGER', 'IOT_SENSOR'
    ];
    const type = getRequiredItem(types, i % types.length, "hardwareDevices.mock.ts");
    const statuses: HardwareDevice['status'][] = ['ONLINE', 'ONLINE', 'ONLINE', 'OFFLINE', 'ERROR', 'MAINTENANCE'];
    const status = getRequiredItem(statuses, i % statuses.length, "hardwareDevices.mock.ts");
    const modules: HardwareDevice['linkedModule'][] = ['GATE', 'PARKING', 'CCTV', 'ATTENDANCE', 'BILLING', 'EV_CHARGING', 'COMPLIANCE', 'SECURITY', 'OTHER'];
    const linkedModule = getRequiredItem(modules, i % modules.length, "hardwareDevices.mock.ts");
    return {
        id: `dev-${String(i + 1).padStart(3, '0')}`,
        name: `${type.replace('_', ' ')} ${String(i + 1).padStart(2, '0')}`,
        type,
        deviceCode: `HW-DEV-${String(1000 + i)}`,
        vendor: getRequiredItem(['Schneider', 'Siemens', 'Hikvision', 'Dahua', 'Matrix', 'SecureEye'], i % 6, "hardwareDevices.mock.ts"),
        location: getRequiredItem(['Main Gate', 'Service Gate', 'Basement Gate', 'Parking B1', 'Parking B2', 'A Wing Lobby', 'B Wing Lobby', 'C Wing Lobby', 'Meter Room', 'EV Charging Zone'], i % 10, "hardwareDevices.mock.ts"),
        status,
        lastHeartbeat: new Date(Date.now() - (i * 10 * 60 * 1000)).toISOString(),
        lastSync: new Date(Date.now() - (i * 30 * 60 * 1000)).toISOString(),
        linkedModule,
    };
});

