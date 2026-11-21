import React from 'react';
import { SocietyReturnControl } from '../../modules/resident/experience/EdgeReturn';

interface BackNavigationButtonProps {
  onPress: () => void;
  lightContrast?: boolean;
}

export function BackNavigationButton({ onPress }: BackNavigationButtonProps) {
  return <SocietyReturnControl onPress={onPress} />;
}

export default BackNavigationButton;
