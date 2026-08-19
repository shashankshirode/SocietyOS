import { useRepositoryMutation, useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { reportsRepository } from '../data/reports.repository';

export function useFinancialReports() {
  return useRepositoryResult(() => reportsRepository.getReports(), []);
}

export function useGenerateReport() {
  return useRepositoryMutation(({ name, month }: { name: string; month: string }) =>
    reportsRepository.generateReport(name, month)
  );
}
