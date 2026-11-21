import React from 'react';
import { InterFlatHomeScreen } from './interFlat_screens/InterFlatHomeScreen';
import type { InterFlatScreenProps } from '../../../../app/navigation/navigation.types';

export function InterFlatDisputesScreen(props: InterFlatScreenProps<'InterFlatHome'>) {
  return <InterFlatHomeScreen {...props} />;
}
