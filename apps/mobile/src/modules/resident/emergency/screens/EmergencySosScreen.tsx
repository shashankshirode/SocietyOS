import { View } from 'react-native';
import { EmergencyExperience } from '../components/EmergencyExperience';
import { emergencyTheme } from '../theme/emergencyTheme';
import { createBackground, styles } from '../styles/components/EmergencyExperience.styles';

export function EmergencySosScreen({ navigation }: NavigationOnlyScreenProps) {
  return (
    <View style={[styles.screen, createBackground(emergencyTheme.canvas)]}>
      <EmergencyExperience visible onClose={() => navigation.goBack()} />
    </View>
  );
}

export default EmergencySosScreen;
