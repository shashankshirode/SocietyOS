import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { FacilityStackParamList } from '../../../../app/navigation/navigation.types';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { FacilityDiscoveryView } from '../components/FacilityDiscoveryView';
import { performBackNavigation } from '../../../../shared/navigation/performBackNavigation';

export function FacilityListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FacilityStackParamList>>();
  const { activeContext } = useActiveResidentHome();
  return (
    <FacilityDiscoveryView
      onBack={() => performBackNavigation(navigation, { currentRouteName: 'FacilityList' })}
      onOpenBookings={() => navigation.navigate('MyFacilityBookings', { unitId: activeContext.unitId })}
      onOpenFacility={(facilityId) => navigation.navigate('FacilityDetail', { facilityId })}
    />
  );
}
