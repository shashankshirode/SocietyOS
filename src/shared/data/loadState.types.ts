


export type LoadState =
  | 'loading'
  | 'success'
  | 'empty'
  | 'restricted'
  | 'missingPrerequisite'
  | 'error'
  | 'refreshing';


export type ScreenLoadState = {
  state: LoadState;
  messageKey?: string;
  canRetry?: boolean;
};



export function loadingState(): ScreenLoadState {
  return { state: 'loading' };
}

export function successState(): ScreenLoadState {
  return { state: 'success' };
}

export function emptyState(messageKey: string): ScreenLoadState {
  return { state: 'empty', messageKey };
}

export function restrictedState(messageKey: string): ScreenLoadState {
  return { state: 'restricted', messageKey };
}

export function missingPrerequisiteState(messageKey: string): ScreenLoadState {
  return { state: 'missingPrerequisite', messageKey };
}

export function errorState(messageKey: string, canRetry = true): ScreenLoadState {
  return { state: 'error', messageKey, canRetry };
}

export function refreshingState(): ScreenLoadState {
  return { state: 'refreshing' };
}
