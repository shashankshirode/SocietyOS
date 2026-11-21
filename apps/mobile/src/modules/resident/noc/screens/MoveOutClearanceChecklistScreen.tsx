import { AppAlert } from "../../../../ui/modal/AppAlert";
import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ResidentStatusSummary } from "../../../../ui/patterns/ResidentStatusSummary";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { useMoveOutClearance } from "../data/useMoveOutClearance";
import type { MoveOutClearanceChecklistScreenProps } from "../../../../app/navigation/navigation.types";
import type { ClearanceChecklistItem } from "../../../../shared/types/moveOut.types";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle } from "../styles/screens/MoveOutClearanceChecklistScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function MoveOutClearanceChecklistScreen({ navigation, route }: MoveOutClearanceChecklistScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { moveOutRequestId } = route.params;
    const { data = [] } = useMoveOutClearance(moveOutRequestId);
    const [checklist, setChecklist] = useState(data);
    React.useEffect(() => {
        if (data && data.length > 0) {
            setChecklist(data);
        }
    }, [data]);
    const pendingItemsCount = checklist.filter((item) => item.status !== 'CLEARED' && item.status !== 'OVERRIDDEN').length;
    const isReadyForNoc = pendingItemsCount === 0;
    const handleSimulateProgress = () => {
        const index = checklist.findIndex((item) => item.status !== 'CLEARED' && item.status !== 'OVERRIDDEN');
        if (index === -1) {
            AppAlert.alert(String(localizedUiText.m_303259701f5b), String(localizedUiText.m_40ade09ee36c));
            return;
        }
        setChecklist((prev) => prev.map((item, idx) => {
            if (idx === index) {
                return {
                    ...item,
                    status: 'CLEARED',
                };
            }
            return item;
        }));
        AppAlert.alert(String(localizedUiText.m_29d46a6ee546), String(localizedUiText.m_ea567f874346));
    };
    const handleGenerateNoc = () => {
        if (!isReadyForNoc) {
            AppAlert.alert(String(localizedUiText.m_f3b78d8f7ab4), String(localizedUiText.m_8e2d7270d625));
            return;
        }
        navigation.navigate('NocCertificate', { certificateId: 'cert-noc-002' });
    };
    const mappedItems = checklist.map((item: ClearanceChecklistItem) => ({
        id: item.id,
        label: item.title,
        status: item.status,
        isCompleted: item.status === 'CLEARED' || item.status === 'OVERRIDDEN',
    }));
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_ef25e848fc32}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="shield-checkmark-outline" size={44} color={theme.accent}/>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)} align="center">{localizedUiText.m_f161571c5aa2}</SafeText>
          <SafeText variant="caption" color="secondary" align="center">{localizedUiText.m_74da4fc3d696}</SafeText>
        </View>

        <ResidentStatusSummary title={localizedUiText.m_3aa4330d6c30} items={mappedItems}/>

        <View style={styles.actions}>
          <AppButton title={localizedUiText.m_0ba58123fd79} variant="secondary" onPress={handleSimulateProgress} iconLeft={<Ionicons name="refresh-outline" size={18} color={theme.accent}/>}/>

          <AppButton title={localizedUiText.m_7a26a3fb9340} onPress={handleGenerateNoc} disabled={!isReadyForNoc} iconLeft={<Ionicons name="ribbon-outline" size={18} color="#FFFFFF"/>}/>
        </View>
      </ScrollView>
    </View>);
}
export default MoveOutClearanceChecklistScreen;

