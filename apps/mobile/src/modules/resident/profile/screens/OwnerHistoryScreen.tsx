import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { StatusBadge, getDuesClearanceStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { useOwnerHistory } from "../hooks/useOwnerHistory";
import type { OwnerHistoryScreenProps } from "../../../../app/navigation/navigation.types";
import type { ResidentHistoryRecord } from "../../../../shared/types/ownerTenant.types";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { styles } from "../styles/screens/OwnerHistoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
export function OwnerHistoryScreen({ navigation, route }: OwnerHistoryScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { unitId } = route.params;
    const { data: owners = [], isLoading, error, refetch } = useOwnerHistory(unitId);
    if (isLoading)
        return <LoadingState />;
    if (error) {
        return (<ErrorState title={localizedUiText.m_c80378767783} message={localizedUiText.m_e380fb727882} onRetry={refetch}/>);
    }
    const renderOwnerItem = ({ item, index }: {
        item: ResidentHistoryRecord;
        index: number;
    }) => {
        return (<Animated.View entering={FadeInLeft.delay(index * 40).duration(400)}>
        <AppCard style={styles.ownerCard} onPress={() => navigation.navigate('PreviousResidentDetail', {
                unitId,
                residentHistoryId: item.id,
                residentHistoryType: 'OWNER',
            })}>
          <View style={styles.cardRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="key-outline" size={20} color={Colors.primary}/>
            </View>

            <View style={styles.details}>
              <Text style={styles.ownerName}>{item.name}</Text>
              <Text style={styles.periodText}>{localizedUiText.m_d4ba2180987a}{formatResidentDate(item.occupancyStartDate)}{" " + localizedUiText.m_663ea1bfffe5 + " "}{formatResidentDate(item.occupancyEndDate)}
              </Text>
              <Text style={styles.reasonText}>{localizedUiText.m_3425d1086921}{item.transferReason}{" " + localizedUiText.m_c9105e996e63 + " "}{item.transferReferenceMasked}
              </Text>
            </View>

            <View style={styles.rightCol}>
              <StatusBadge label={formatUiLiteral(localizedUiText.m_7661510eb8d9, [item.duesClearanceStatus])} type={getDuesClearanceStatusBadgeType(item.duesClearanceStatus)} style={styles.badge}/>
              <Text style={styles.docsText}>{item.documentsCount}{" " + localizedUiText.m_9b16b44d0e0a}</Text>
            </View>
          </View>
        </AppCard>
      </Animated.View>);
    };
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_ff93d41c00d7} showBack onBack={() => navigation.goBack()}/>
      <FlatList data={owners} renderItem={renderOwnerItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ListEmptyComponent={<EmptyState title={localizedUiText.m_fc29472400b4} description={localizedUiText.m_d0ca7e49ab0c} iconName="journal-outline"/>}/>
    </SafeAreaView>);
}

