import * as React from 'react';
import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function usePlatformUserLookup() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const result = useRepositoryResult(() => superAdminRepository.searchUsers(searchQuery), [searchQuery]);
  return { ...result, searchQuery, setSearchQuery };
}
