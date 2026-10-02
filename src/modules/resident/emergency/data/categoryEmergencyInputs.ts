import type { EmergencyType, EmergencySeverity } from '../../../../shared/types/emergency.types';
import type { CreateEmergencyIncidentInput } from '../../../../shared/types/emergency.types';

export interface MedicalEmergencyInput {
  personNeedingHelp: string;
  condition: string;
  needAmbulance: boolean;
  knownConditions?: string;
  medications?: string;
  allergies?: string;
  emergencyContact?: string;
  location: string;
  severity: EmergencySeverity;
  isSeniorCitizen: boolean;
}

export interface FireEmergencyInput {
  fireType: 'SMOKE_SEEN' | 'FIRE_SEEN' | 'BURNING_SMELL' | 'ELECTRICAL_SPARK' | 'GAS_LEAK_SUSPECTED' | 'OTHER';
  location: string;
  isPeopleTrapped: boolean;
  trappedCount?: number;
  severity: EmergencySeverity;
  floor?: string;
  tower?: string;
}

export interface LiftStuckEmergencyInput {
  liftNumber: string;
  numberOfPeopleStuck: number;
  location: string;
  hasSeniorOrDisabled: boolean;
  severity: EmergencySeverity;
  tower?: string;
  floor?: string;
}

export interface SecurityThreatInput {
  threatType: 'SUSPICIOUS_PERSON' | 'UNAUTHORIZED_ENTRY' | 'FIGHT_OR_VIOLENCE' | 'THEFT_SUSPECTED' | 'HARASSMENT' | 'UNKNOWN_VEHICLE' | 'OTHER';
  location: string;
  description: string;
  suspectDescription?: string;
  vehicleDetails?: string;
  severity: EmergencySeverity;
  isOngoing: boolean;
}

export interface WaterEmergencyInput {
  location: string;
  waterType: 'MAJOR_PIPE_BURST' | 'FLOODING' | 'TANK_OVERFLOW' | 'CRITICAL_SUPPLY_ISSUE' | 'SEWAGE_BACKUP' | 'OTHER';
  affectedAreas: string[];
  severity: EmergencySeverity;
  isElectricalRisk: boolean;
  estimatedVolume?: string;
}

export interface ElectricalEmergencyInput {
  location: string;
  electricalType: 'POWER_OUTAGE' | 'SPARKING' | 'UNSAFE_EQUIPMENT' | 'WATER_ELECTRICAL_INTERACTION' | 'TRANSFORMER_ISSUE' | 'OTHER';
  affectedAreas: string[];
  severity: EmergencySeverity;
  isLifeSafetyRisk: boolean;
  equipmentDetails?: string;
}

export function createMedicalEmergencyInput(input: MedicalEmergencyInput): CreateEmergencyIncidentInput {
  return {
    emergencyType: 'MEDICAL',
    severity: input.severity,
    location: input.location,
    description: `Medical emergency for ${input.personNeedingHelp}: ${input.condition}`,
    isSeniorCitizen: input.isSeniorCitizen,
    needAmbulance: input.needAmbulance,
    needVolunteer: true,
    notifyFamily: true,
    isPrivate: true,
    personNeedingHelp: input.personNeedingHelp,
  };
}

export function createFireEmergencyInput(input: FireEmergencyInput): CreateEmergencyIncidentInput {
  return {
    emergencyType: 'FIRE',
    severity: input.severity,
    location: input.location,
    description: `Fire emergency: ${input.fireType.replace('_', ' ').toLowerCase()}${input.isPeopleTrapped ? ` - ${input.trappedCount || 'Multiple'} people trapped` : ''}`,
    isSeniorCitizen: false,
    needAmbulance: input.isPeopleTrapped,
    needVolunteer: true,
    notifyFamily: true,
    isPrivate: false,
    fireType: input.fireType,
    isPeopleTrapped: input.isPeopleTrapped,
  };
}

export function createLiftStuckEmergencyInput(input: LiftStuckEmergencyInput): CreateEmergencyIncidentInput {
  return {
    emergencyType: 'LIFT_STUCK',
    severity: input.severity,
    location: input.location,
    description: `Lift ${input.liftNumber} stuck with ${input.numberOfPeopleStuck} people${input.hasSeniorOrDisabled ? ' (senior/disabled present)' : ''}`,
    isSeniorCitizen: input.hasSeniorOrDisabled,
    needAmbulance: false,
    needVolunteer: true,
    notifyFamily: true,
    isPrivate: false,
    liftNumber: input.liftNumber,
    numberOfPeopleStuck: input.numberOfPeopleStuck,
  };
}

export function createSecurityThreatInput(input: SecurityThreatInput): CreateEmergencyIncidentInput {
  return {
    emergencyType: 'SECURITY_THREAT',
    severity: input.severity,
    location: input.location,
    description: `Security threat: ${input.threatType.replace('_', ' ').toLowerCase()} - ${input.description}`,
    isSeniorCitizen: false,
    needAmbulance: false,
    needVolunteer: false,
    notifyFamily: false,
    isPrivate: false,
    threatType: input.threatType,
  };
}

export function createWaterEmergencyInput(input: WaterEmergencyInput): CreateEmergencyIncidentInput {
  return {
    emergencyType: 'WATER',
    severity: input.severity,
    location: input.location,
    description: `Water emergency: ${input.waterType.replace('_', ' ').toLowerCase()} affecting ${input.affectedAreas.join(', ')}`,
    isSeniorCitizen: false,
    needAmbulance: false,
    needVolunteer: true,
    notifyFamily: true,
    isPrivate: false,
  };
}

export function createElectricalEmergencyInput(input: ElectricalEmergencyInput): CreateEmergencyIncidentInput {
  return {
    emergencyType: 'ELECTRICAL',
    severity: input.severity,
    location: input.location,
    description: `Electrical emergency: ${input.electricalType.replace('_', ' ').toLowerCase()} affecting ${input.affectedAreas.join(', ')}`,
    isSeniorCitizen: false,
    needAmbulance: false,
    needVolunteer: true,
    notifyFamily: true,
    isPrivate: false,
  };
}

export type CategoryEmergencyInput = 
  | { type: 'MEDICAL'; input: MedicalEmergencyInput }
  | { type: 'FIRE'; input: FireEmergencyInput }
  | { type: 'LIFT_STUCK'; input: LiftStuckEmergencyInput }
  | { type: 'SECURITY_THREAT'; input: SecurityThreatInput }
  | { type: 'WATER'; input: WaterEmergencyInput }
  | { type: 'ELECTRICAL'; input: ElectricalEmergencyInput };

export function createCategoryEmergencyInput(categoryInput: CategoryEmergencyInput): CreateEmergencyIncidentInput {
  switch (categoryInput.type) {
    case 'MEDICAL':
      return createMedicalEmergencyInput(categoryInput.input);
    case 'FIRE':
      return createFireEmergencyInput(categoryInput.input);
    case 'LIFT_STUCK':
      return createLiftStuckEmergencyInput(categoryInput.input);
    case 'SECURITY_THREAT':
      return createSecurityThreatInput(categoryInput.input);
    case 'WATER':
      return createWaterEmergencyInput(categoryInput.input);
    case 'ELECTRICAL':
      return createElectricalEmergencyInput(categoryInput.input);
  }
}

export const SEVERITY_GUIDELINES: Record<EmergencyType, Record<EmergencySeverity, string>> = {
  SOS: {
    LOW: 'General assistance needed',
    MEDIUM: 'Urgent assistance needed',
    HIGH: 'Immediate response required',
    CRITICAL: 'Life-threatening emergency',
  },
  MEDICAL: {
    LOW: 'Minor injury, non-urgent',
    MEDIUM: 'Medical condition requiring attention',
    HIGH: 'Serious medical emergency',
    CRITICAL: 'Life-threatening medical emergency',
  },
  FIRE: {
    LOW: 'Burning smell, no visible fire',
    MEDIUM: 'Smoke seen, small fire',
    HIGH: 'Active fire, spreading',
    CRITICAL: 'Major fire, people trapped',
  },
  LIFT_STUCK: {
    LOW: 'Lift stuck, no one inside',
    MEDIUM: 'Lift stuck, people inside, calm',
    HIGH: 'Lift stuck, people distressed',
    CRITICAL: 'Lift stuck, medical emergency inside',
  },
  SECURITY_THREAT: {
    LOW: 'Suspicious activity observed',
    MEDIUM: 'Unauthorized entry attempt',
    HIGH: 'Active threat, violence',
    CRITICAL: 'Immediate danger to life',
  },
  WATER: {
    LOW: 'Minor leak',
    MEDIUM: 'Significant leak, contained',
    HIGH: 'Major flooding, spreading',
    CRITICAL: 'Catastrophic flooding, electrical risk',
  },
  ELECTRICAL: {
    LOW: 'Minor power issue',
    MEDIUM: 'Equipment sparking, no immediate danger',
    HIGH: 'Power outage affecting critical systems',
    CRITICAL: 'Electrical fire or shock hazard',
  },
  SENIOR_HELP: {
    LOW: 'Check-in reminder',
    MEDIUM: 'Senior requesting assistance',
    HIGH: 'Senior in distress',
    CRITICAL: 'Senior medical emergency',
  },
  ACCIDENT: {
    LOW: 'Minor accident, no injuries',
    MEDIUM: 'Accident with minor injuries',
    HIGH: 'Serious accident',
    CRITICAL: 'Life-threatening accident',
  },
  CHILD_SAFETY: {
    LOW: 'Child wandering',
    MEDIUM: 'Child in unsafe area',
    HIGH: 'Child missing',
    CRITICAL: 'Child in immediate danger',
  },
  PET_EMERGENCY: {
    LOW: 'Pet concern',
    MEDIUM: 'Pet injured',
    HIGH: 'Pet in danger',
    CRITICAL: 'Pet life-threatening emergency',
  },
  OTHER: {
    LOW: 'Low priority',
    MEDIUM: 'Medium priority',
    HIGH: 'High priority',
    CRITICAL: 'Critical priority',
  },
};

export function getSeverityGuideline(emergencyType: EmergencyType, severity: EmergencySeverity): string {
  return SEVERITY_GUIDELINES[emergencyType]?.[severity] ?? SEVERITY_GUIDELINES.OTHER[severity];
}

export const CATEGORY_REQUIRED_FIELDS: Record<EmergencyType, string[]> = {
  SOS: [],
  MEDICAL: ['personNeedingHelp', 'condition', 'needAmbulance', 'location'],
  FIRE: ['fireType', 'location', 'isPeopleTrapped'],
  LIFT_STUCK: ['liftNumber', 'numberOfPeopleStuck', 'location'],
  SECURITY_THREAT: ['threatType', 'location', 'description'],
  WATER: ['waterType', 'location', 'affectedAreas'],
  ELECTRICAL: ['electricalType', 'location', 'affectedAreas'],
  SENIOR_HELP: ['personNeedingHelp', 'location'],
  ACCIDENT: ['location', 'description'],
  CHILD_SAFETY: ['location', 'description'],
  PET_EMERGENCY: ['location', 'description'],
  OTHER: ['location', 'description'],
};

export function validateCategoryInput(emergencyType: EmergencyType, input: CreateEmergencyIncidentInput): { valid: boolean; missingFields: string[] } {
  const required = CATEGORY_REQUIRED_FIELDS[emergencyType] || [];
  const missing = required.filter(field => !input[field as keyof CreateEmergencyIncidentInput]);
  return { valid: missing.length === 0, missingFields: missing };
}