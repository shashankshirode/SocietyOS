import { FlatList, Text, View, ActivityIndicator } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { usePendingApprovals } from "../data/usePendingApprovals";
import { useApprovalAction } from "../data/useApprovalAction";
import type { AdminApproval } from "../../../shared/types/admin.types";
import { styles, createTextColorStyle } from "../styles/screens/PendingApprovalsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
export function PendingApprovalsScreen({ navigation }: {
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: approvals = [], isLoading, error, refetch } = usePendingApprovals();
    const { execute, isSubmitting } = useApprovalAction();
    const handleAction = async (action: 'approve' | 'reject', item: AdminApproval) => {
        AppAlert.alert(formatUiLiteral(String(localizedUiText.m_a76c44df8205), [action === 'approve' ? String(localizedUiText.m_6007acbe30b2) : String(localizedUiText.m_ab604a360777)]), formatUiLiteral(String(localizedUiText.m_d8ca6faabc62), [action, item.unitNumber]), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_eebdd24a77d9),
                style: action === 'reject' ? 'destructive' : 'default',
                onPress: async () => {
                    await execute(action, item.id);
                    AppAlert.alert(String(localizedUiText.m_c88a0b907419), formatUiLiteral(String(localizedUiText.m_f5a723a3d15f), [action]));
                    refetch();
                },
            },
        ]);
    };
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return Colors.danger;
            case 'HIGH': return Colors.warning;
            default: return Colors.primary;
        }
    };
    const renderApprovalItem = ({ item, index }: {
        item: AdminApproval;
        index: number;
    }) => (<Animated.View entering={FadeInLeft.delay(index * 30).duration(300)}>
      <AppCard style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.appNum}>{item.approvalNumber}</Text>
          <Text style={[styles.priority, createTextColorStyle(getPriorityColor(item.priority))]}>{item.priority}</Text>
        </View>
        
        <Text style={styles.typeLabel}>{item.type.replace('_', ' ')}</Text>
        <Text style={styles.desc}>{item.summary}</Text>
        
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{localizedUiText.m_5704b7c3727f + " "}{item.requestedBy} ({item.requestedByRole})</Text>
          <Text style={styles.metaText}>{localizedUiText.m_9311e5cc88d5 + " "}{item.unitNumber} ({item.wing})</Text>
        </View>

        <View style={styles.buttonRow}>
          <AppButton title={localizedUiText.m_ab604a360777} variant="danger" compact onPress={() => handleAction('reject', item)} disabled={isSubmitting} style={styles.appButtonFlex}/>
          <AppButton title={localizedUiText.m_6007acbe30b2} variant="primary" compact onPress={() => handleAction('approve', item)} disabled={isSubmitting} style={styles.appButtonFlex2}/>
        </View>
      </AppCard>
    </Animated.View>);
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_495aae902643} showBack onBack={navigation.goBack}/>

      {isLoading ? (<View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary}/>
        </View>) : error ? (<EmptyState title={localizedUiText.m_a7e04dec5f64} description={error.message} iconName="alert-circle-outline"/>) : approvals.length === 0 ? (<EmptyState title={localizedUiText.m_261de9be5f4a} description={localizedUiText.m_e8fe02926c7c} iconName="checkmark-circle-outline"/>) : (<FlatList data={approvals} renderItem={renderApprovalItem} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}/>)}
    </SafeAreaView>);
}

