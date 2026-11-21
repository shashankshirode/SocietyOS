import React from 'react';
import { useMessages } from '../../messages';
import { ConfirmModal } from '../modal';

export interface ResidentActionConfirmationProps {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ResidentActionConfirmation({
  visible,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading = false,
}: ResidentActionConfirmationProps) {
  const messages = useMessages();
  return (
    <ConfirmModal
      visible={visible}
      title={title}
      message={description}
      confirmLabel={confirmLabel ?? messages.actions.primaryActionLabel}
      cancelLabel={cancelLabel ?? messages.actions.secondaryActionLabel}
      loading={loading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
