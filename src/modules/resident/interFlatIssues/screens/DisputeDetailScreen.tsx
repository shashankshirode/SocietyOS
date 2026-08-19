import React from 'react';
import { InterFlatIssueDetailScreen } from './interFlat_screens/InterFlatIssueDetailScreen';
import type { InterFlatScreenProps } from '../../../../app/navigation/navigation.types';

export function DisputeDetailScreen(props: InterFlatScreenProps<'InterFlatIssueDetail'>) {
  return <InterFlatIssueDetailScreen {...props} />;
}
