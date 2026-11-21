import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FacilityStackParamList } from '../../../../app/navigation/navigation.types';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { FacilityDiscoveryView } from '../components/FacilityDiscoveryView';
import { performBackNavigation } from '../../../../shared/navigation/performBackNavigation';

type Props = NativeStackScreenProps<FacilityStackParamList, 'FacilityHome'>;

export function FacilityHomeScreen({ navigation }: Props) {
  const { activeContext } = useActiveResidentHome();
  return (
    <FacilityDiscoveryView
      onBack={() => performBackNavigation(navigation, { currentRouteName: 'FacilityHome' })}
      onOpenBookings={() => navigation.navigate('MyFacilityBookings', { unitId: activeContext.unitId })}
      onOpenFacility={(facilityId) => navigation.navigate('FacilityDetail', { facilityId })}
    />
  );
}
