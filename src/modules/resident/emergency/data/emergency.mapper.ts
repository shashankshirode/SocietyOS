import type { EmergencyContact } from '../../../../shared/types/emergency.types';
import type { EmergencyContactDto } from './emergency.dto';

export function mapEmergencyContactDtoToDomain(dto: EmergencyContactDto): EmergencyContact {
  return {
    id: dto.id,
    name: dto.name ?? '',
    phone: dto.phone ?? '',
    role: dto.role ?? '',
    iconName: dto.iconName ?? 'call',
    available24x7: dto.available24x7 ?? false,
  };
}

