import { AppAlert } from "../../../../ui/modal/AppAlert";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { useBlockedResidents, useUnblockResident } from "../data/useBlockedResidents";
import type { BlockedResidentsScreenProps } from "../../../../app/navigation/navigation.types";
import type { BlockedResidentInfo } from "../../../../shared/types/privacy.types";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { styles } from "../styles/screens/BlockedResidentsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
export function BlockedResidentsScreen({ navigation }: BlockedResidentsScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: blocked = [], isLoading, error, refetch } = useBlockedResidents();
    const { submit: unblock, isSubmitting } = useUnblockResident();
    const handleUnblock = (item: BlockedResidentInfo) => {
        AppAlert.alert(String(localizedUiText.m_f6b19c14152f), formatUiLiteral(String(localizedUiText.m_5f45771aebc0), [item.blockedResidentName, item.blockedFlat]), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_712da63171e0),
                onPress: async () => {
                    const res = await unblock(item.blockedResidentId);
                    if (res.ok) {
                        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_d56ff64eadff));
                        refetch();
                    }
                },
            },
        ]);
    };
    if (isLoading)
        return <LoadingState />;
    if (error) {
        return (<ErrorState title={localizedUiText.m_e5b11968d829} message={localizedUiText.m_0d02b5f77889} onRetry={refetch}/>);
    }
    const renderItem = ({ item, index }: {
        item: BlockedResidentInfo;
        index: number;
    }) => {
        return (<Animated.View entering={FadeInLeft.delay(index * 30).duration(350)}>
        <AppCard style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.avatar}>
              <Ionicons name="ban-outline" size={18} color={Colors.danger}/>
            </View>

            <View style={styles.details}>
              <Text style={styles.nameText}>{item.blockedResidentName}</Text>
              <Text style={styles.flatText}>{localizedUiText.m_9285cedcf26a}{item.blockedFlat}{" " + localizedUiText.m_cff2366df6a6 + " "}{formatResidentDate(item.blockedDate)}
              </Text>
              {item.reason && <Text style={styles.reasonText}>{localizedUiText.m_3425d1086921 + " "}{item.reason}</Text>}
            </View>

            <Pressable style={styles.unblockBtn} onPress={() => handleUnblock(item)} disabled={isSubmitting}>
              <Text style={styles.unblockText}>{localizedUiText.m_712da63171e0}</Text>
            </Pressable>
          </View>
        </AppCard>
      </Animated.View>);
    };
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_54322cdbfe87} showBack onBack={() => navigation.goBack()}/>
      <FlatList data={blocked} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ListEmptyComponent={<EmptyState title={localizedUiText.m_e48d2800810f} description={localizedUiText.m_b71e3b80dbb8} iconName="ban-outline"/>}/>
    </SafeAreaView>);
}
export default BlockedResidentsScreen;

