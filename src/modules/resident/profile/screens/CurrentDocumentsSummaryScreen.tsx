import { FlatList, ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { WarningBanner } from "../../../../shared/feedback/WarningBanner";
import { StatusBadge, getDocumentStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { getDocumentCategoryLabel } from "../../../../shared/utils/formatters";
import { useUnitDocuments } from "../hooks/useUnitDocuments";
import type { CurrentDocumentsSummaryScreenProps } from "../../../../app/navigation/navigation.types";
import type { UnitDocumentSummary } from "../../../../shared/types/ownerTenant.types";
import { styles } from "../styles/screens/CurrentDocumentsSummaryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function CurrentDocumentsSummaryScreen({ navigation }: CurrentDocumentsSummaryScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: documents = [], isLoading, error, refetch } = useUnitDocuments('unit-a-1204');
    const renderDocItem = ({ item, index }: {
        item: UnitDocumentSummary;
        index: number;
    }) => {
        return (<Animated.View entering={FadeInLeft.delay(index * 45).duration(400)}>
        <AppCard style={styles.docCard} onPress={() => navigation.navigate('DocumentDetail', { documentId: item.id })}>
          <View style={styles.cardRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="document-text-outline" size={20} color={Colors.primary}/>
            </View>

            <View style={styles.details}>
              <Text style={styles.docTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.categoryLabel}>{getDocumentCategoryLabel(item.category)}</Text>
              <Text style={styles.expiryLabel}>{localizedUiText.m_76f30c5f6e06 + " "}{item.expiry}</Text>
            </View>

            <StatusBadge label={item.status} type={getDocumentStatusBadgeType(item.status)} style={styles.badge}/>
          </View>
        </AppCard>
      </Animated.View>);
    };
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_af9e135b750d} showBack onBack={() => navigation.goBack()}/>
      <View style={styles.mainContainer}>
        <WarningBanner message={localizedUiText.m_ecd48ac7cca3} type="info" style={styles.banner}/>

        {isLoading ? (<View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary}/>
          </View>) : error ? (<ErrorState message={error.message} onRetry={refetch}/>) : (<FlatList data={documents} renderItem={renderDocItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ListEmptyComponent={<EmptyState title={localizedUiText.m_ebef92cda18b} description={localizedUiText.m_95f5e9a52db4} iconName="folder-open-outline"/>}/>)}
      </View>
    </SafeAreaView>);
}

