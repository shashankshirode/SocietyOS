import { createRepository } from '../../../core/dataSource/repositoryFactory';
import { settingsMockSource } from './settings.mockSource';
import type { ResidentSettingsRepository } from './settings.repository.contract';
export type { ResidentSettingsRepository } from './settings.repository.contract';

export const settingsRepository = createRepository<
  ResidentSettingsRepository,
  ResidentSettingsRepository
>({
  moduleKey: 'residentSettings',
  mockRepository: settingsMockSource,
  apiRepository: settingsMockSource,
});

export default settingsRepository;
