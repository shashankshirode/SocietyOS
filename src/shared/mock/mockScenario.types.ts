export type MockScenarioKind =
  | 'normal'
  | 'loading'
  | 'refreshing'
  | 'empty'
  | 'error'
  | 'success'
  | 'submitting'
  | 'permissionRestricted'
  | 'featureDisabled'
  | 'longContent'
  | 'tablet'
  | 'darkMode'
  | 'edgeCase';

export type MessageKey = string;

export interface PageScenario<TData> {
  id: string;
  kind: MockScenarioKind;
  titleMessageKey: MessageKey;
  descriptionMessageKey: MessageKey;
  data: TData;
  delayMs?: number;
  errorCode?: string;
}
