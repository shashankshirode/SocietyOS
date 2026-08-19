import type { EmergencyContact } from '../../../../shared/types/emergency.types';

export type EmergencyContactDto = Partial<EmergencyContact> & Pick<EmergencyContact, 'id'>;

