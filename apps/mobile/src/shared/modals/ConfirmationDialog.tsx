import React from 'react';
import { useMessages } from '../../messages';
import { ConfirmModal } from '../../ui/modal';

export type ConfirmationDialogTone = 'primary' | 'danger' | 'warning';

export type ConfirmationDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmationDialogTone;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  tone = 'primary',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const messages = useMessages();
  return (
    <ConfirmModal
      visible={visible}
      title={title}
      message={message}
      confirmLabel={confirmLabel ?? messages.common.confirm}
      cancelLabel={cancelLabel ?? messages.common.cancel}
      tone={tone}
      loading={loading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

export default ConfirmationDialog;
