export type ResidentScenarioId =
  | 'happyPath'
  | 'validationFailure'
  | 'permissionFailure'
  | 'featureDisabled'
  | 'emptyState'
  | 'loadingState'
  | 'networkFailure'
  | 'retry'
  | 'offlineState'
  | 'duplicateAction'
  | 'rapidRepeatedTap'
  | 'residenceSwitchDuringRequest'
  | 'staleResponse'
  | 'longText'
  | 'largeFont'
  | 'darkMode'
  | 'smallPhone'
  | 'tabletPortrait'
  | 'tabletLandscape'
  | 'android'
  | 'ios';

export const residentRequiredScenarioMatrix: readonly ResidentScenarioId[] = [
  'happyPath',
  'validationFailure',
  'permissionFailure',
  'featureDisabled',
  'emptyState',
  'loadingState',
  'networkFailure',
  'retry',
  'offlineState',
  'duplicateAction',
  'rapidRepeatedTap',
  'residenceSwitchDuringRequest',
  'staleResponse',
  'longText',
  'largeFont',
  'darkMode',
  'smallPhone',
  'tabletPortrait',
  'tabletLandscape',
  'android',
  'ios',
];
