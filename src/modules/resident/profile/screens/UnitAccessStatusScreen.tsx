import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { WarningBanner } from "../../../../shared/feedback/WarningBanner";
import { StatusBadge, getResidentAccessBadgeType } from "../../../../shared/components/StatusBadge";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { useUnitAccessStatus } from "../hooks/useUnitAccessStatus";
import type { UnitAccessStatusScreenProps } from "../../../../app/navigation/navigation.types";
import { formatResidentDateTime } from "../../../../core/localization/dateTimeFormatters";
import { styles } from "../styles/screens/UnitAccessStatusScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function UnitAccessStatusScreen({ navigation, route }: UnitAccessStatusScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { unitId } = route.params;
    const { data, isLoading, error, refetch } = useUnitAccessStatus(unitId);
    const accessInfo = data;
    if (isLoading)
        return <LoadingState />;
    if (error || !accessInfo) {
        return (<ErrorState title={localizedUiText.m_d9a4fdf9e6a6} message={localizedUiText.m_88d53508bea6} onRetry={refetch}/>);
    }
    const getCapabilityIcon = (cap: string) => {
        switch (cap) {
            case 'APP_LOGIN': return 'phone-portrait-outline';
            case 'VISITOR_APPROVAL': return 'notifications-outline';
            case 'GATE_PASS': return 'qr-code-outline';
            case 'VEHICLE_ACCESS': return 'car-outline';
            case 'FACILITY_BOOKING': return 'calendar-outline';
            case 'DOCUMENT_ACCESS': return 'folder-outline';
            case 'RESIDENT_CONNECT': return 'people-outline';
            default: return 'ellipse-outline';
        }
    };
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_d57d8cd04fca} showBack onBack={() => navigation.goBack()}/>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        
        <Animated.View entering={FadeInUp.duration(400)}>
          <WarningBanner message={localizedUiText.m_aec6946b0d1e} type="warning" style={styles.bannerMargin}/>
        </Animated.View>

        
        <Animated.View entering={FadeInUp.delay(100).duration(450)}>
          <AppCard style={styles.statusHeaderCard}>
            <View style={styles.statusRow}>
              <View>
                <Text style={styles.residentName}>{accessInfo.residentName}</Text>
                <Text style={styles.residentSub}>
                  {accessInfo.residentType}{localizedUiText.m_dde313974b31}</Text>
              </View>
              <StatusBadge label={accessInfo.accessStatus} type={getResidentAccessBadgeType(accessInfo.accessStatus)}/>
            </View>

            <View style={styles.divider}/>

            <View style={styles.auditRow}>
              <Text style={styles.auditLabel}>{localizedUiText.m_51370b6443ee}</Text>
              <Text style={styles.auditVal} numberOfLines={1}>
                {formatResidentDateTime(accessInfo.lastModifiedDate)}{" " + localizedUiText.m_a7e2d26e8d15 + " "}{accessInfo.lastModifiedBy}
              </Text>
            </View>
          </AppCard>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(150).duration(450)}>
          <Text style={styles.sectionHeader}>{localizedUiText.m_1ac0b4791518}</Text>
          {accessInfo.capabilities.map((item) => {
            return (<AppCard key={item.capability} style={styles.capabilityCard}>
                <View style={styles.capRow}>
                  <View style={styles.capIconCircle}>
                    <Ionicons name={getCapabilityIcon(item.capability)} size={20} color={Colors.primary}/>
                  </View>

                  <View style={styles.capDetails}>
                    <Text style={styles.capLabel}>{item.label}</Text>
                    <Text style={styles.capDesc}>{item.description}</Text>
                  </View>

                  <View style={[styles.switchCircle, item.isAllowed && styles.switchCircleActive]} accessibilityLabel={`${item.label}: ${item.isAllowed ? localizedUiText.m_eabc01f12ec3 : localizedUiText.m_a26075ed2e78}`}>
                    <View style={[styles.switchKnob, item.isAllowed && styles.switchKnobActive]}/>
                  </View>
                </View>
              </AppCard>);
        })}
        </Animated.View>

        <View style={styles.bottomSpacer}/>
      </ScrollView>
    </SafeAreaView>);
}

