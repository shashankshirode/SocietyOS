import type { IntegrationRecord, NotificationChannelRecord } from '../types/platformSupport.types';

export const mockIntegrations: IntegrationRecord[] = [
  { id: 'int-001', integrationName: 'Payment Gateway', category: 'Payments', status: 'FUTURE_PLACEHOLDER', provider: 'Razorpay', failureCountPlaceholder: 0, affectedSocietiesPlaceholder: 0, notes: 'Will be enabled when real payments go live' },
  { id: 'int-002', integrationName: 'Push Notifications', category: 'Notifications', status: 'CONFIGURED', provider: 'Expo Push', failureCountPlaceholder: 3, affectedSocietiesPlaceholder: 2, lastChecked: '2026-06-30T10:00:00Z' },
  { id: 'int-003', integrationName: 'SMS Provider', category: 'Notifications', status: 'DEGRADED', provider: 'MSG91', failureCountPlaceholder: 12, affectedSocietiesPlaceholder: 5, lastChecked: '2026-06-30T11:00:00Z', notes: 'Delivery delays reported' },
  { id: 'int-004', integrationName: 'Email Provider', category: 'Notifications', status: 'HEALTHY', provider: 'SES', failureCountPlaceholder: 0, affectedSocietiesPlaceholder: 0, lastChecked: '2026-06-30T10:30:00Z' },
  { id: 'int-005', integrationName: 'WhatsApp Provider', category: 'Notifications', status: 'FUTURE_PLACEHOLDER', failureCountPlaceholder: 0, affectedSocietiesPlaceholder: 0, notes: 'WhatsApp Business API integration planned' },
  { id: 'int-006', integrationName: 'Biometric Connector', category: 'Hardware', status: 'FUTURE_PLACEHOLDER', failureCountPlaceholder: 0, affectedSocietiesPlaceholder: 0 },
  { id: 'int-007', integrationName: 'RFID System', category: 'Hardware', status: 'FUTURE_PLACEHOLDER', failureCountPlaceholder: 0, affectedSocietiesPlaceholder: 0 },
  { id: 'int-008', integrationName: 'ANPR Camera', category: 'Hardware', status: 'FUTURE_PLACEHOLDER', failureCountPlaceholder: 0, affectedSocietiesPlaceholder: 0 },
  { id: 'int-009', integrationName: 'CCTV Integration', category: 'Hardware', status: 'FUTURE_PLACEHOLDER', failureCountPlaceholder: 0, affectedSocietiesPlaceholder: 0 },
  { id: 'int-010', integrationName: 'Smart Meters', category: 'IoT', status: 'FUTURE_PLACEHOLDER', failureCountPlaceholder: 0, affectedSocietiesPlaceholder: 0 },
  { id: 'int-011', integrationName: 'EV Charging', category: 'IoT', status: 'FUTURE_PLACEHOLDER', failureCountPlaceholder: 0, affectedSocietiesPlaceholder: 0 },
  { id: 'int-012', integrationName: 'File Storage', category: 'Infrastructure', status: 'HEALTHY', provider: 'S3', failureCountPlaceholder: 0, affectedSocietiesPlaceholder: 0, lastChecked: '2026-06-30T10:00:00Z' },
];

export const mockNotificationChannels: NotificationChannelRecord[] = [
  { id: 'nc-001', channelName: 'Push Notifications', providerPlaceholder: 'Expo Push', status: 'CONFIGURED', lastTest: '2026-06-30T09:00:00Z', failureCountPlaceholder: 3, affectedSocietiesPlaceholder: 2 },
  { id: 'nc-002', channelName: 'SMS', providerPlaceholder: 'MSG91', status: 'DEGRADED', lastTest: '2026-06-30T10:00:00Z', failureCountPlaceholder: 12, affectedSocietiesPlaceholder: 5 },
  { id: 'nc-003', channelName: 'Email', providerPlaceholder: 'Amazon SES', status: 'HEALTHY', lastTest: '2026-06-30T10:30:00Z', failureCountPlaceholder: 0, affectedSocietiesPlaceholder: 0 },
  { id: 'nc-004', channelName: 'WhatsApp', providerPlaceholder: 'Not configured', status: 'FUTURE_PLACEHOLDER', failureCountPlaceholder: 0, affectedSocietiesPlaceholder: 0 },
  { id: 'nc-005', channelName: 'In-App Notifications', providerPlaceholder: 'Built-in', status: 'HEALTHY', lastTest: '2026-06-30T10:00:00Z', failureCountPlaceholder: 0, affectedSocietiesPlaceholder: 0 },
];
