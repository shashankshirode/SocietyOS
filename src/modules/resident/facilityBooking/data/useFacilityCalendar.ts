import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { facilityRepository } from './facility.repository';

export function useFacilityCalendar(date: string) {
  return useRepositoryResult(() => facilityRepository.getFacilityCalendar(date), [date]);
}
