import { useResidentRoleCapabilities } from '../profile/hooks/useResidentRoleCapabilities';
import type { ResidentRoleCapability } from '../profile/data/residentRoleCapabilities.types';

export function useResidentRoleNavigation() {
  const profile = useResidentRoleCapabilities();

  const canNavigate = (screenName: string): boolean => {
    
    const capability = profile.capabilities.find((cap) =>
      cap.requiredRoutes.includes(screenName)
    );
    
    return capability ? capability.enabled : true;
  };

  const canPerformAction = (actionKey: ResidentRoleCapability['key']): boolean => {
    const capability = profile.capabilities.find((cap) => cap.key === actionKey);
    return capability ? capability.enabled : true;
  };

  return {
    canNavigate,
    canPerformAction,
    role: profile.role,
  };
}
