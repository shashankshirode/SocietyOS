import type { AutomationController } from './smartAutomation.types';

export const mockAutomationControllers: AutomationController[] = [
  {
    id: 'ctrl-1',
    name: 'Tower A Overhead Water Pump',
    deviceType: 'WATER_MOTOR',
    status: 'ACTIVE',
    lastRunTime: '2026-07-05 15:00',
  },
  {
    id: 'ctrl-2',
    name: 'Main Driveway Lights Controller',
    deviceType: 'STREET_LIGHT',
    status: 'INACTIVE',
    lastRunTime: '2026-07-04 19:30',
  },
];
