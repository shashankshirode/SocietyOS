import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useState } from "react";
import { View, ScrollView, Pressable, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { useResolutionDetail } from "../data/useResolutionDetail";
import { useCastResolutionVote } from "../data/useCastResolutionVote";
import type { CastResolutionVoteScreenProps } from "../../../../app/navigation/navigation.types";
import type { ResolutionVoteChoice } from "../../../../shared/types/governance.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2, createViewBorderColorStyle, createViewPaddingBottomBorderTopColorStyle } from "../styles/screens/CastResolutionVoteScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function CastResolutionVoteScreen({ navigation, route }: CastResolutionVoteScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const { resolutionId } = route.params;
    const { data: resolution, isLoading } = useResolutionDetail(resolutionId);
    const [selected, setSelected] = useState<ResolutionVoteChoice | null>(null);
    const [consented, setConsented] = useState(false);
    const { submit, isSubmitting } = useCastResolutionVote();
    if (isLoading || !resolution) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        <ResidentPageHeader title={localizedUiText.m_b9833bdbd0cb}/>
      </View>);
    }
    const handleVote = async () => {
        if (!selected) {
            AppAlert.alert(String(localizedUiText.m_b45229a19f20), String(localizedUiText.m_4ba43f99feef));
            return;
        }
        if (!consented) {
            AppAlert.alert(String(localizedUiText.m_1e81a6fa6508), String(localizedUiText.m_9713da293290));
            return;
        }
        const res = await submit({ resolutionId, choice: selected });
        if (res.ok) {
            AppAlert.alert(String(localizedUiText.m_0cb57f91a56c), String(localizedUiText.m_1cd1055fc3aa), [
                { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.goBack() },
            ]);
        }
    };
    const voteOptions: {
        label: string;
        value: ResolutionVoteChoice;
        icon: string;
        color: string;
    }[] = [
        { label: String(localizedUiText.m_3a48f3b8adf8), value: 'FOR', icon: 'checkmark-circle-outline', color: theme.success },
        { label: String(localizedUiText.m_3c78035fe9fe), value: 'AGAINST', icon: 'close-circle-outline', color: theme.danger },
        { label: String(localizedUiText.m_a8857295085b), value: 'ABSTAIN', icon: 'remove-circle-outline', color: theme.textSecondary },
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_2ba6fe68eba7}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
          <SafeText variant="tiny" color="muted">
            {resolution.resolutionNumber}
          </SafeText>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>
            {resolution.title}
          </SafeText>
          <SafeText variant="caption" color="secondary">
            {resolution.description}
          </SafeText>
        </View>

        
        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(theme.textPrimary)}>{localizedUiText.m_e1962ba8574c}</SafeText>
          <View style={styles.list}>
            {voteOptions.map((opt) => {
            const isSelected = selected === opt.value;
            return (<Pressable key={opt.value} onPress={() => setSelected(opt.value)}>
                  <View style={[
                    styles.optionRow,
                    createViewBackgroundColorBorderColorStyle2(isSelected ? theme.accentSoft : theme.surface, isSelected ? theme.accent : theme.border),
                ]}>
                    <Ionicons name={opt.icon as keyof typeof Ionicons.glyphMap} size={20} color={isSelected ? theme.accent : theme.textSecondary}/>
                    <SafeText variant="caption" style={createSafeTextColorStyle3(theme.textPrimary)}>
                      {opt.label}
                    </SafeText>
                  </View>
                </Pressable>);
        })}
          </View>
        </View>

        
        <View style={[styles.switchRow, createViewBorderColorStyle(theme.border)]}>
          <View style={styles.switchText}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle4(theme.textPrimary)}>{localizedUiText.m_bfcaf8038d60}</SafeText>
            <SafeText variant="tiny" style={createSafeTextColorStyle5(theme.textSecondary)}>{localizedUiText.m_15dc4bd62a1f}</SafeText>
          </View>
          <Switch value={consented} onValueChange={setConsented} trackColor={{ false: theme.border, true: theme.accent }}/>
        </View>
      </ScrollView>

      
      <View style={[styles.bottomBar, createViewPaddingBottomBorderTopColorStyle(insets.bottom + 12, theme.border)]}>
        <AppButton title={localizedUiText.m_5c3281b44172} onPress={handleVote} loading={isSubmitting} iconLeft={<Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF"/>}/>
      </View>
    </View>);
}
export default CastResolutionVoteScreen;

