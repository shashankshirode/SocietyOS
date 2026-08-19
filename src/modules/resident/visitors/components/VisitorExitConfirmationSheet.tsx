import React from 'react';
import { ActionSheetModal } from '../../../../ui/modal/ActionSheetModal';
import { useMessages } from '../../../../shared/constants/useMessages';
import { t } from '../../household/components/householdComponentUtils';

export interface VisitorExitConfirmationSheetProps {
  visible: boolean;
  onConfirmLeft: () => void;
  onStillInside: () => void;
  onExtendTime: () => void;
  onContactSecurity: () => void;
  onClose: () => void;
}

export function VisitorExitConfirmationSheet({
  visible,
  onConfirmLeft,
  onStillInside,
  onExtendTime,
  onContactSecurity,
  onClose,
}: VisitorExitConfirmationSheetProps) {
  const messages = useMessages();

  return (
    <ActionSheetModal
      visible={visible}
      title={t(messages, 'visitor.exitAssurance.exitNotConfirmed')}
      onClose={onClose}
      actions={[
        {
          label: t(messages, 'visitor.exitAssurance.confirmLeft'),
          onPress: onConfirmLeft,
          accessibilityLabel: t(messages, 'visitor.accessibility.confirmVisitorLeft'),
        },
        {
          label: t(messages, 'visitor.exitAssurance.stillInside'),
          onPress: onStillInside,
        },
        {
          label: t(messages, 'visitor.exitAssurance.extendTime'),
          onPress: onExtendTime,
          accessibilityLabel: t(messages, 'visitor.accessibility.extendVisitorExitTime'),
        },
        {
          label: t(messages, 'visitor.exitAssurance.contactSecurity'),
          onPress: onContactSecurity,
        },
      ]}
    />
  );
}
