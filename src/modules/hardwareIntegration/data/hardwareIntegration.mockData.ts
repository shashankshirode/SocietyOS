export type HardwareReadinessRecord = {
  id: string;
  title: string;
  readinessStatus: 'FRONTEND_READY_INTEGRATION_REQUIRED' | 'FRONTEND_READY_BACKEND_REQUIRED';
  summary: string;
  nextStep: string;
};

export type IntegrationHealthLogRecord = {
  id: string;
  integrationName: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  timestamp: string;
  detail: string;
};

export const rfidIntegrationReadinessMockData: HardwareReadinessRecord[] = [
  { id: 'rfid-int-1', title: 'RFID tag mapping readiness', readinessStatus: 'FRONTEND_READY_INTEGRATION_REQUIRED', summary: 'Tag assignment, masked tag display and audit trail UI are ready.', nextStep: 'Connect RFID controller API and webhook events.' },
];
export const anprIntegrationReadinessMockData: HardwareReadinessRecord[] = [
  { id: 'anpr-int-1', title: 'ANPR vehicle recognition readiness', readinessStatus: 'FRONTEND_READY_INTEGRATION_REQUIRED', summary: 'Vehicle match review, confidence display and audit warning are ready.', nextStep: 'Connect ANPR camera feed processor.' },
];
export const boomBarrierReadinessMockData: HardwareReadinessRecord[] = [
  { id: 'boom-int-1', title: 'Boom barrier automation readiness', readinessStatus: 'FRONTEND_READY_INTEGRATION_REQUIRED', summary: 'Manual override placeholder and gate automation status screens are ready.', nextStep: 'Connect approved barrier control API.' },
];
export const cctvAccessReadinessMockData: HardwareReadinessRecord[] = [
  { id: 'cctv-int-1', title: 'Restricted CCTV access readiness', readinessStatus: 'FRONTEND_READY_INTEGRATION_REQUIRED', summary: 'Access request, privacy notice and audit requirement UI are ready.', nextStep: 'Connect CCTV VMS permission workflow.' },
];
export const smartMeterReadinessMockData: HardwareReadinessRecord[] = [
  { id: 'meter-int-1', title: 'Smart meter reading readiness', readinessStatus: 'FRONTEND_READY_INTEGRATION_REQUIRED', summary: 'Manual-first readings, import placeholder and billing readiness screens are ready.', nextStep: 'Connect meter ingestion API.' },
];
export const evChargingReadinessMockData: HardwareReadinessRecord[] = [
  { id: 'ev-int-1', title: 'EV charging readiness', readinessStatus: 'FRONTEND_READY_INTEGRATION_REQUIRED', summary: 'EV slot/session placeholder and billing support UI are ready.', nextStep: 'Connect charger OCPP/session provider.' },
];
export const integrationHealthLogsMockData: IntegrationHealthLogRecord[] = [
  { id: 'ihl-1', integrationName: 'RFID Controller', status: 'WARNING', timestamp: '2026-07-05T09:30:00Z', detail: 'Mock heartbeat delayed by 3 minutes.' },
  { id: 'ihl-2', integrationName: 'Smart Meter Import', status: 'SUCCESS', timestamp: '2026-07-05T08:00:00Z', detail: 'Manual import placeholder validated.' },
];
