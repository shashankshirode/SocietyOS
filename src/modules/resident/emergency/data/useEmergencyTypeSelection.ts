import { EmergencyType } from '../../../../shared/types/emergency.types';

export function useEmergencyTypeSelection() {
  const emergencyTypes: { type: EmergencyType; title: string; description: string; urgency: string }[] = [
    { type: 'SOS', title: 'General SOS', description: 'Trigger immediate guard and family alerts', urgency: 'CRITICAL' },
    { type: 'MEDICAL', title: 'Medical Emergency', description: 'Requires doctor, nurse, or ambulance', urgency: 'CRITICAL' },
    { type: 'FIRE', title: 'Fire / Smoke Alert', description: 'Fire evacuation and alarm trigger', urgency: 'CRITICAL' },
    { type: 'LIFT_STUCK', title: 'Lift Stuck', description: 'Trapped inside elevator cab', urgency: 'HIGH' },
    { type: 'SECURITY_THREAT', title: 'Security Threat', description: 'Intruders, fight, or theft suspected', urgency: 'HIGH' },
    { type: 'ACCIDENT', title: 'Accident / Injury', description: 'Falls, fractures, or physical injuries', urgency: 'MEDIUM' },
    { type: 'SENIOR_HELP', title: 'Senior Citizen Help', description: 'Non-critical assistance for elderly', urgency: 'MEDIUM' },
  ];
  return { emergencyTypes };
}
