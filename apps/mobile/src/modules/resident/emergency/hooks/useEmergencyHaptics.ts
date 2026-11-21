import { triggerOptionalHaptic } from '../../../../shared/platform/platformHaptics';

const emergencyHaptics = {
  triggerSelection: () => triggerOptionalHaptic('selection'),
  triggerSuccess: () => triggerOptionalHaptic('success'),
  triggerWarning: () => triggerOptionalHaptic('warning'),
  triggerError: () => triggerOptionalHaptic('error'),
};

export function useEmergencyHaptics() {
  return emergencyHaptics;
}
