






export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-'
  | 'unknown';


export interface EmergencyAssistanceMember {
  readonly id: string;
  readonly name: string;
  readonly relationship: string;
  readonly assistanceType: 'senior' | 'minor' | 'mobilitySupport' | 'medicalCondition';
  readonly age?: number;
  readonly medicalNotes?: string;
  readonly bloodGroup?: BloodGroup;
  readonly preferredHospital?: string;
  readonly allergies?: string;
}


export interface EmergencyPetInfo {
  readonly petType: 'dog' | 'cat' | 'bird' | 'fish' | 'other';
  readonly name?: string;
  readonly count: number;
  readonly specialInstructions?: string;
}


export interface TemporaryEmergencyInstruction {
  readonly id: string;
  readonly instruction: string;
  readonly validFrom: string;
  readonly validUntil: string;
  readonly isActive: boolean;
}


export interface EmergencyProfile {
  readonly id: string;
  readonly residenceId: string;
  readonly societyId: string;

  
  readonly primaryContactName: string;
  readonly primaryContactPhone: string;

  
  readonly secondaryContactName?: string;
  readonly secondaryContactPhone?: string;

  
  readonly assistanceMembers: EmergencyAssistanceMember[];

  
  readonly accessInstructions?: string; 
  readonly floorNumber?: number;
  readonly hasBalconyAccess?: boolean;
  readonly hasAlternateExit?: boolean;

  
  readonly familyDoctorName?: string;
  readonly familyDoctorPhone?: string;
  readonly preferredHospital?: string;
  readonly medicalEquipmentAtHome?: string; 

  
  readonly pets: EmergencyPetInfo[];

  
  readonly temporaryInstructions: TemporaryEmergencyInstruction[];

  
  readonly createdAt: string;
  readonly updatedAt: string;
}



export interface UpdateEmergencyProfileInput {
  readonly primaryContactName?: string;
  readonly primaryContactPhone?: string;
  readonly secondaryContactName?: string;
  readonly secondaryContactPhone?: string;
  readonly assistanceMembers?: EmergencyAssistanceMember[];
  readonly accessInstructions?: string;
  readonly floorNumber?: number;
  readonly hasBalconyAccess?: boolean;
  readonly hasAlternateExit?: boolean;
  readonly familyDoctorName?: string;
  readonly familyDoctorPhone?: string;
  readonly preferredHospital?: string;
  readonly medicalEquipmentAtHome?: string;
  readonly pets?: EmergencyPetInfo[];
}

export interface CreateTemporaryInstructionInput {
  readonly instruction: string;
  readonly validFrom: string;
  readonly validUntil: string;
}
