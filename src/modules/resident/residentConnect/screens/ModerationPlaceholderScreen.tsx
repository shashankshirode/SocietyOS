import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { WarningBanner } from "../../../../shared/feedback/WarningBanner";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { StatusBadge, getModerationStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { useModerationReports } from "../data/useReportResidentConnect";
import type { ModerationPlaceholderScreenProps } from "../../../../app/navigation/navigation.types";
import type { ModerationReport } from "../../../../shared/types/privacy.types";
import { styles } from "../styles/screens/ModerationPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function ModerationPlaceholderScreen({ navigation }: ModerationPlaceholderScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: reports = [], isLoading, error, refetch } = useModerationReports();
    if (isLoading)
        return <LoadingState />;
    if (error) {
        return (<ErrorState title={localizedUiText.m_db04faec6019} message={localizedUiText.m_f3edb8a1ec67} onRetry={refetch}/>);
    }
    const renderItem = ({ item, index }: {
        item: ModerationReport;
        index: number;
    }) => {
        return (<Animated.View entering={FadeInLeft.delay(index * 30).duration(350)}>
        <AppCard style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.reportId}>{localizedUiText.m_0aa92f540df7 + " "}{item.id}</Text>
              <Text style={styles.targetLabel}>{localizedUiText.m_890d34fffcde + " "}{item.targetType} ({item.targetId})</Text>
            </View>
            <StatusBadge label={item.status} type={getModerationStatusBadgeType(item.status)}/>
          </View>

          <View style={styles.divider}/>

          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>{localizedUiText.m_b330d6701b55}</Text>
            <Text style={styles.fieldVal}>{item.category.replace(/_/g, ' ')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>{localizedUiText.m_21f1b0113218}</Text>
            <Text style={styles.fieldVal}>{item.reportedBy}{" " + localizedUiText.m_2751f1c13321 + " "}{item.reportedFlat})</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.fieldLabel}>{localizedUiText.m_25aabb9218f5}</Text>
            <Text style={styles.fieldVal}>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.fieldLabel}>{localizedUiText.m_0314d5622cff}</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>

          {item.messageContext && (<View style={styles.contextBox}>
              <Text style={[styles.fieldLabel, styles.textColor]}>{localizedUiText.m_787b78cd86d1}</Text>
              <Text style={styles.contextText}>{`"${item.messageContext}"`}</Text>
            </View>)}
        </AppCard>
      </Animated.View>);
    };
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_9f31ba451d4c} showBack onBack={() => navigation.goBack()}/>
      <FlatList data={reports} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ListHeaderComponent={<WarningBanner message={localizedUiText.m_ea3cfffbb409} type="info" style={styles.bannerMargin}/>} ListEmptyComponent={<EmptyState title={localizedUiText.m_796289e58dfa} description={localizedUiText.m_1a4c65a7fba8} iconName="checkmark-shield-outline"/>}/>
    </SafeAreaView>);
}
export default ModerationPlaceholderScreen;

