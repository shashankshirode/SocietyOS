import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { StatusBadge, getPoliceVerificationBadgeType, getDuesClearanceStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { useTenantHistory } from "../hooks/useTenantHistory";
import type { TenantHistoryScreenProps } from "../../../../app/navigation/navigation.types";
import type { ResidentHistoryRecord } from "../../../../shared/types/ownerTenant.types";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { styles } from "../styles/screens/TenantHistoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
export function TenantHistoryScreen({ navigation, route }: TenantHistoryScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { unitId } = route.params;
    const { data: tenants = [], isLoading, error, refetch } = useTenantHistory(unitId);
    if (isLoading)
        return <LoadingState />;
    if (error) {
        return (<ErrorState title={localizedUiText.m_c80378767783} message={localizedUiText.m_e75356f79752} onRetry={refetch}/>);
    }
    const renderTenantItem = ({ item, index }: {
        item: ResidentHistoryRecord;
        index: number;
    }) => {
        return (<Animated.View entering={FadeInLeft.delay(index * 40).duration(400)}>
        <AppCard style={styles.tenantCard} onPress={() => navigation.navigate('PreviousResidentDetail', {
                unitId,
                residentHistoryId: item.id,
                residentHistoryType: 'TENANT',
            })}>
          <View style={styles.cardRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="people-outline" size={20} color={Colors.primary}/>
            </View>

            <View style={styles.details}>
              <Text style={styles.tenantName}>{item.name}</Text>
              <Text style={styles.periodText}>{localizedUiText.m_c0e1e390f58f}{formatResidentDate(item.occupancyStartDate)}{" " + localizedUiText.m_663ea1bfffe5 + " "}{formatResidentDate(item.occupancyEndDate)} ({item.agreementPeriod || '—'})
              </Text>
              <View style={styles.pvBadgeRow}>
                <Text style={styles.pvLabel}>{localizedUiText.m_b3fca9e3c47f}</Text>
                <StatusBadge label={item.policeVerificationStatus} type={getPoliceVerificationBadgeType(item.policeVerificationStatus)} style={styles.badgeInline}/>
              </View>
            </View>

            <View style={styles.rightCol}>
              <StatusBadge label={formatUiLiteral(localizedUiText.m_7661510eb8d9, [item.duesClearanceStatus])} type={getDuesClearanceStatusBadgeType(item.duesClearanceStatus)} style={styles.badge}/>
              <Text style={styles.revokedText}>{localizedUiText.m_c7fd2a72b15a}</Text>
            </View>
          </View>
        </AppCard>
      </Animated.View>);
    };
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_cfb1b86e264d} showBack onBack={() => navigation.goBack()}/>
      <FlatList data={tenants} renderItem={renderTenantItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ListEmptyComponent={<EmptyState title={localizedUiText.m_77f1fe4051b9} description={localizedUiText.m_71873b588b63} iconName="receipt-outline"/>}/>
    </SafeAreaView>);
}

