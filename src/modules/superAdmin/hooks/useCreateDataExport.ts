import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';
import type { DataExportRequestCreateDto } from '../data/superAdmin.dto';

export function useCreateDataExport() {
  return useRepositoryMutation((input: DataExportRequestCreateDto) => superAdminRepository.createDataExportRequest(input));
}
