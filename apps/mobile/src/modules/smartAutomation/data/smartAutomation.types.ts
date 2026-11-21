export interface AutomationController {
  id: string;
  name: string;
  deviceType: 'WATER_MOTOR' | 'STREET_LIGHT' | 'GATE_SENSORS';
  status: 'ACTIVE' | 'INACTIVE';
  lastRunTime: string;
}
