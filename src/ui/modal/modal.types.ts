import type React from 'react';

export type ModalVisibilityState = 'closed' | 'opening' | 'open' | 'closing';

export type ModalTone = 'primary' | 'success' | 'warning' | 'danger' | 'info';

export type ModalPresentation =
  | 'dialog'
  | 'bottomSheet'
  | 'actionSheet'
  | 'confirm'
  | 'status'
  | 'loading'
  | 'formSheet';

export type MessageValue = string | number;
export type MessageValues = Readonly<Record<string, MessageValue>>;

export interface ModalAction {
  id: string;
  labelKey: string;
  labelValues?: MessageValues;
  tone?: ModalTone;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabelKey?: string;
  onPress?: () => void;
}

export interface AppModalRequest {
  id?: string;
  presentation?: ModalPresentation;
  titleKey: string;
  titleValues?: MessageValues;
  messageKey?: string;
  messageValues?: MessageValues;
  tone?: ModalTone;
  dismissible?: boolean;
  actions?: readonly ModalAction[];
  content?: React.ReactNode;
  onDismiss?: () => void;
}

export interface AppModalController {
  show: (request: AppModalRequest) => string;
  hide: (id?: string) => void;
  hideAll: () => void;
}
