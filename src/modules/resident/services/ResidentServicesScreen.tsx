import { useMemo } from 'react';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootTabParamList } from '../../../app/navigation/navigation.types';
import type { ResidentCapabilityId } from '../../../features/residentCapabilities/models/ResidentCapability';
import { useResidentCapabilityAvailability } from '../../../features/residentCapabilities/useResidentCapabilityAvailability';
import { SafeText } from '../../../shared/components/SafeText';
import { useMessages } from '../../../shared/constants/useMessages';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useActiveResidentHome } from '../homeContext/hooks/useActiveResidentHome';
import { useResidentDashboard } from '../dashboard/hooks/useResidentDashboard';
import { SocietyExperienceFrame } from '../experience/SocietyExperienceFrame';
import { resolveResidentTabBarObstruction } from '../navigation/useResidentTabBarLayout';
import { getAppPlatform } from '../../../shared/platform';
import { createContentStyle, createRootStyle, createSurfaceStyle, createTextStyle, styles, } from './styles/ResidentServicesScreen.styles';
type Props = BottomTabScreenProps<RootTabParamList, 'ServicesTab'>;
type Command = {
    id: string;
    capability: ResidentCapabilityId;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    primary?: boolean;
};
function formatAmount(amount: number): string {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}
export function ResidentServicesScreen({ navigation }: Props) {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const bottomObstruction = resolveResidentTabBarObstruction(width, insets.bottom, getAppPlatform());
    const theme = useAppTheme();
    const messages = useMessages();
    const copy = messages.resident.dashboard.commandSurface;
    const { activeContext } = useActiveResidentHome();
    const { canAccessCapability } = useResidentCapabilityAvailability();
    const { data: dashboard } = useResidentDashboard();
    const maintenance = dashboard?.maintenancePayment;
    const maintenanceDescription = maintenance && maintenance.status !== 'paid' && maintenance.dueDateLabel
        ? copy.maintenanceDue(formatAmount(maintenance.totalOutstanding ?? maintenance.billAmount), maintenance.dueDateLabel)
        : copy.maintenanceDescription;
    const commands = useMemo<Command[]>(() => {
        const allCommands: Command[] = [
            { id: 'visitor', capability: 'resident.visitors', title: copy.addVisitor, description: copy.addVisitorDescription, icon: 'person-add', primary: true, onPress: () => navigation.navigate('VisitorTab', { screen: 'CreateVisitorPass' }) },
            { id: 'delivery', capability: 'resident.visitors', title: copy.pickupDelivery, description: copy.pickupDeliveryDescription, icon: 'cube-outline', onPress: () => navigation.navigate('VisitorTab', { screen: 'CreateVisitorPass' }) },
            { id: 'issue', capability: 'resident.complaints', title: copy.raiseIssue, description: copy.raiseIssueDescription, icon: 'construct-outline', onPress: () => navigation.navigate('ComplaintTab', { screen: 'CreateComplaint' }) },
            { id: 'facility', capability: 'resident.facilities', title: copy.facility, description: copy.facilityDescription, icon: 'football-outline', onPress: () => navigation.navigate('HomeTab', { screen: 'FacilityStack', params: { screen: 'FacilityList' } }) },
            { id: 'maintenance', capability: 'resident.billing', title: copy.maintenance, description: maintenanceDescription, icon: 'wallet-outline', onPress: () => navigation.navigate('BillTab', { screen: 'BillList' }) },
            { id: 'documents', capability: 'resident.documents', title: copy.documents, description: copy.documentsDescription, icon: 'folder-open-outline', onPress: () => navigation.navigate('HomeTab', { screen: 'DocumentVaultHome' }) },
            { id: 'household', capability: 'resident.household', title: copy.household, description: copy.householdDescription, icon: 'people-outline', onPress: () => navigation.navigate('HomeTab', { screen: 'HouseholdOverview' }) },
            { id: 'parking', capability: 'resident.parking', title: copy.parking, description: copy.parkingDescription, icon: 'car-outline', onPress: () => navigation.navigate('HomeTab', { screen: 'ParkingStack', params: { screen: 'ParkingHome', params: { unitId: activeContext.unitId } } }) },
            { id: 'community', capability: 'resident.community', title: copy.community, description: copy.communityDescription, icon: 'people-circle-outline', onPress: () => navigation.navigate('CommunityTab', { screen: 'CommunityHome' }) },
            { id: 'messages', capability: 'resident.chat', title: copy.messages, description: copy.messagesDescription, icon: 'chatbubbles-outline', onPress: () => navigation.navigate('ChatTab', { screen: 'ChatHome' }) },
            { id: 'emergency', capability: 'resident.emergency', title: copy.emergency, description: copy.emergencyDescription, icon: 'alert-circle-outline', onPress: () => navigation.navigate('HomeTab', { screen: 'EmergencySos' }) },
        ];
        const filtered = allCommands.filter((command) => canAccessCapability(command.capability));
        return filtered.length > 0 ? filtered : allCommands.slice(0, 7);
    }, [activeContext.unitId, canAccessCapability, copy, maintenanceDescription, navigation]);
    return (<SocietyExperienceFrame>
      <View style={[styles.root, createRootStyle(theme.semantic.surface.canvas)]}>
        <ScrollView contentContainerStyle={[styles.content, createContentStyle(0, bottomObstruction)]} showsVerticalScrollIndicator={false}>
          
          <View style={styles.heading}>
            <SafeText variant="tiny" style={[styles.eyebrow, createTextStyle(theme.semantic.accent.moss)]}>
              {copy.eyebrow}
            </SafeText>
            <SafeText variant="h1" color="primary" style={{ fontSize: 26, fontWeight: '700', lineHeight: 32 }}>
              {copy.title}
            </SafeText>
            <SafeText variant="body" color="secondary" style={{ fontSize: 15, lineHeight: 22 }}>
              {copy.description}
            </SafeText>
          </View>

          
          <View style={[styles.commandSurface, createSurfaceStyle(theme.semantic.surface.raised, theme.semantic.border.subtle)]}>
            {commands.map((command, index) => (<View key={command.id}>
                <Pressable onPress={command.onPress} accessibilityRole="button" accessibilityLabel={`${command.title}. ${command.description}`} style={[
                styles.commandRow,
                command.primary && styles.primaryCommand,
                command.primary && createSurfaceStyle(theme.semantic.surface.soft),
            ]}>
                  <View style={[styles.commandIcon, createSurfaceStyle(command.primary ? theme.semantic.accent.moss : theme.semantic.surface.soft)]}>
                    <Ionicons name={command.icon} size={22} color={command.primary ? theme.semantic.text.inverse : theme.semantic.accent.moss}/>
                  </View>
                  <View style={styles.commandCopy}>
                    <SafeText variant="bodyStrong" color="primary" style={{ fontSize: 16, fontWeight: '700' }}>
                      {command.title}
                    </SafeText>
                    <SafeText variant="caption" color="secondary" style={{ fontSize: 13, lineHeight: 18 }}>
                      {command.description}
                    </SafeText>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.semantic.text.tertiary}/>
                </Pressable>
                {!command.primary && index < commands.length - 1 ? (<View style={[styles.divider, createSurfaceStyle(theme.semantic.border.subtle)]}/>) : null}
              </View>))}
          </View>
        </ScrollView>
      </View>
    </SocietyExperienceFrame>);
}
export default ResidentServicesScreen;

