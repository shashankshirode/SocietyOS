import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useMessages } from '../../../../shared/constants/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import type { ResidentChatMessageStatus } from '../data/residentChat.types';

type ChatStatusTicksProps = {
  status: ResidentChatMessageStatus;
};

const STATUS_ICONS: Record<ResidentChatMessageStatus, keyof typeof Ionicons.glyphMap> = {
  queued: 'time-outline',
  sending: 'time-outline',
  sent: 'checkmark',
  delivered: 'checkmark-done',
  seen: 'checkmark-done',
  failed: 'alert-circle',
};

export function ChatStatusTicks({ status }: ChatStatusTicksProps) {
  const { colors } = useAppTheme();
  const messages = useMessages();
  const color = status === 'failed' ? colors.danger : status === 'seen' ? colors.primary : colors.textMuted;

  return (
    <Ionicons
      name={STATUS_ICONS[status]}
      size={15}
      color={color}
      accessibilityLabel={messages.resident.chat.status[status]}
    />
  );
}
