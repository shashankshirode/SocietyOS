import type { IntegrationHealthRow } from '../types/hardware.types';

export const mockIntegrationHealth: IntegrationHealthRow[] = [
  { category: 'Gate Hardware', status: 'HEALTHY', deviceCount: 15, onlineCount: 14, errorCount: 0, lastSync: new Date().toISOString(), riskLevel: 'LOW', recommendedAction: 'No actions required.' },
  { category: 'RFID Access', status: 'HEALTHY', deviceCount: 10, onlineCount: 10, errorCount: 0, lastSync: new Date().toISOString(), riskLevel: 'LOW', recommendedAction: 'No actions required.' },
  { category: 'ANPR Cameras', status: 'DEGRADED', deviceCount: 6, onlineCount: 5, errorCount: 1, lastSync: new Date().toISOString(), riskLevel: 'MEDIUM', recommendedAction: 'Review camera 3 alignment.' },
  { category: 'Boom Barriers', status: 'HEALTHY', deviceCount: 5, onlineCount: 5, errorCount: 0, lastSync: new Date().toISOString(), riskLevel: 'LOW', recommendedAction: 'No actions required.' },
  { category: 'CCTV Cameras', status: 'DEGRADED', deviceCount: 12, onlineCount: 10, errorCount: 2, lastSync: new Date().toISOString(), riskLevel: 'MEDIUM', recommendedAction: 'Address offline cameras in Basement 1.' },
  { category: 'Biometric Attendance', status: 'HEALTHY', deviceCount: 4, onlineCount: 4, errorCount: 0, lastSync: new Date().toISOString(), riskLevel: 'LOW', recommendedAction: 'No actions required.' },
  { category: 'Smart Meters', status: 'HEALTHY', deviceCount: 15, onlineCount: 15, errorCount: 0, lastSync: new Date().toISOString(), riskLevel: 'LOW', recommendedAction: 'No actions required.' },
  { category: 'EV Charging', status: 'DEGRADED', deviceCount: 6, onlineCount: 5, errorCount: 1, lastSync: new Date().toISOString(), riskLevel: 'MEDIUM', recommendedAction: 'Inspect charger 4 faulted state.' },
];
