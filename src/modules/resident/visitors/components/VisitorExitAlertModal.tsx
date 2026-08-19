import React from 'react';
import { ConfirmModal } from '../../../../ui/modal/ConfirmModal';
import { useMessages } from '../../../../shared/constants/useMessages';
import { t } from '../../household/components/householdComponentUtils';

export interface VisitorExitAlertModalProps {
  visible: boolean;
  visitorName: string;
  onConfirmLeft: () => void;
  onClose: () => void;
}

export function VisitorExitAlertModal({
  visible,
  visitorName,
  onConfirmLeft,
  onClose,
}: VisitorExitAlertModalProps) {
  const messages = useMessages();

  return (
    <ConfirmModal
      visible={visible}
      title={t(messages, 'visitor.exitAssurance.exitNotConfirmed')}
      message={t(messages, 'visitor.exitAssurance.visitorAlertMessage', visitorName)}
      confirmLabel={t(messages, 'visitor.exitAssurance.confirmLeft')}
      cancelLabel={t(messages, 'visitor.exitAssurance.stillInside')}
      tone="warning"
      onConfirm={onConfirmLeft}
      onCancel={onClose}
    />
  );
}
