import type { SafetyInstruction } from '../types/safety.types';

export const mockSafetyInstructions: SafetyInstruction[] = [
  {
    id: 'inst-001',
    category: 'MEDICAL',
    title: 'Medical Emergency Protocol',
    steps: [
      'Assess the situation and ensure the environment is safe for the patient.',
      'Trigger the society SOS alert or call the Security Main Gate immediately.',
      'Provide clear information: Flat number, patient name, and key symptom (e.g., chest pain, unconsciousness).',
      'Ask security to guide the ambulance and call any resident doctor volunteers.',
      'Keep the patient calm and do not administer oral medication unless prescribed.'
    ],
    emergencyNumbers: [
      { label: 'Security Gate', number: '98200*****' },
      { label: 'Society Office', number: '99333*****' },
      { label: 'Nearest Hospital (Life Care)', number: '0253-222****' }
    ],
    audience: 'ALL',
    lastUpdatedAt: '2026-06-01T12:00:00Z',
  },
  {
    id: 'inst-002',
    category: 'FIRE',
    title: 'Fire & Smoke Evacuation',
    steps: [
      'If you see fire or thick smoke, sound the nearest manual fire alarm call point.',
      'Trigger the society Fire Alert to warn all tower residents.',
      'Evacuate immediately using the staircases. NEVER use the elevators/lifts.',
      'Help children, senior citizens, and pets down the stairs.',
      'Assemble at the designated Safe Assembly Point (Main Lawn).'
    ],
    emergencyNumbers: [
      { label: 'Fire Station', number: '101' },
      { label: 'Security Gate', number: '98200*****' }
    ],
    audience: 'ALL',
    lastUpdatedAt: '2026-06-01T12:00:00Z',
  },
  {
    id: 'inst-003',
    category: 'LIFT',
    title: 'Lift Stuck Emergency Actions',
    steps: [
      'Stay calm. The lift cabin is ventilated and will not run out of oxygen.',
      'Press and hold the yellow/red Alarm button inside the lift cabin for 5 seconds.',
      'Use the intercom phone or your mobile to trigger a Lift Stuck alert in the app.',
      'Provide the lift number (marked above the door) and floor level.',
      'Wait for the security guard or lift technician to manually rescue you. Do not try to pry the doors open.'
    ],
    emergencyNumbers: [
      { label: 'Lift Tech Support (Otis)', number: '1800-****-****' },
      { label: 'Security Gate', number: '98200*****' }
    ],
    audience: 'ALL',
    lastUpdatedAt: '2026-06-01T12:00:00Z',
  }
];
export type { SafetyInstruction };
