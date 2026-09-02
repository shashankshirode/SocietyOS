import { useMemo } from 'react';
import { View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '../../../../app/navigation/navigation.types';
import { useMessages } from '../../../../shared/constants/useMessages';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { ScreenErrorState } from '../../../../ui/states/ScreenErrorState';
import { ScreenLoadingState } from '../../../../ui/states/ScreenLoadingState';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useResidentRoleNavigation } from '../../navigation/useResidentRoleNavigation';
import { ResidencePulseExpanded } from '../components/ResidencePulseExpanded';
import { createResidencePulseSignals } from '../data/pulseSignal.model';
import { useResidentDashboard } from '../hooks/useResidentDashboard';
import { createRootStyle, styles } from '../styles/screens/ResidentActivityScreen.styles';
import { SocietyExperienceFrame } from '../../experience/SocietyExperienceFrame';

type Props = BottomTabScreenProps<RootTabParamList, 'ActivityTab'>;

function formatAmount(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function ResidentActivityScreen({ navigation }: Props) {
  const { semantic } = useAppTheme();
  const messages = useMessages();
  const { activeContext } = useActiveResidentHome();
  const { canPerformAction } = useResidentRoleNavigation();
  const { data: dashboard, error, isLoading, refetch } = useResidentDashboard();
  const pulseSignals = useMemo(() => dashboard ? createResidencePulseSignals(dashboard) : [], [dashboard]);
  const copy = messages.resident.dashboard.homeExperience;

  if (isLoading && !dashboard && !error) {
    return <SocietyExperienceFrame><ScreenLoadingState message={copy.loading} /></SocietyExperienceFrame>;
  }
  if (error || !dashboard) {
    return <SocietyExperienceFrame><ScreenErrorState title={copy.errorTitle} message={copy.errorDescription} onRetry={refetch} /></SocietyExperienceFrame>;
  }

  const billDue = dashboard.maintenancePayment.status !== 'paid' && canPerformAction('maintenance');

  return (
    <SocietyExperienceFrame>
      <View style={[styles.root, createRootStyle(semantic.surface.inverse)]}>
      <ResidencePulseExpanded
        visible
        presentation="screen"
        unitLabel={activeContext.displayUnitName}
        signals={pulseSignals}
        billAmountLabel={formatAmount(dashboard.maintenancePayment.totalOutstanding ?? dashboard.maintenancePayment.billAmount)}
        billDue={billDue}
        onClose={() => navigation.navigate('HomeTab', { screen: 'ResidentHome' })}
        onPay={() => navigation.navigate('BillTab', { screen: 'BillList' })}
      />
      </View>
    </SocietyExperienceFrame>
  );
}

export default ResidentActivityScreen;
