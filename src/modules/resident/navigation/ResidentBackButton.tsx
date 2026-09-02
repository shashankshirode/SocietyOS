import React from 'react';
import { SocietyReturnControl } from '../experience/EdgeReturn';
import { useMessages } from '../../../shared/constants/useMessages';
import { resolveResidentMessage, type MessageTree } from './ResidentHeaderTitle';
import type { MessageKey } from './residentHeader.types';

export type ResidentBackButtonProps = {
  onPress: () => void;
  tintColor?: string;
  accessibilityLabelKey?: MessageKey;
};

export function ResidentBackButton({
  onPress,
  accessibilityLabelKey = 'accessibility.navigation.goBack',
}: ResidentBackButtonProps) {
  const messages = useMessages();
  const accessibilityLabel = resolveResidentMessage(messages as MessageTree, accessibilityLabelKey);

  return (
    <SocietyReturnControl
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

export default ResidentBackButton;
