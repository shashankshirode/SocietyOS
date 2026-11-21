import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { usePollDetail } from "../data/usePollDetail";
import { useSubmitPollVote } from "../data/useSubmitPollVote";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { useActiveResidentHome } from "../../homeContext/hooks/useActiveResidentHome";
import type { SubmitPollVoteScreenProps } from "../../../../app/navigation/navigation.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2, createViewBackgroundColorBorderColorStyle3, createViewPaddingBottomBorderTopColorStyle } from "../styles/screens/SubmitPollVoteScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function SubmitPollVoteScreen({ navigation, route }: SubmitPollVoteScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const { pollId } = route.params;
    const { activeContext } = useActiveResidentHome();
    const { data: poll, isLoading, error, refetch } = usePollDetail(pollId);
    const [selected, setSelected] = useState<string[]>([]);
    const { submit, isSubmitting } = useSubmitPollVote();
    if (isLoading)
        return <LoadingState message={localizedUiText.m_c1205a2184aa} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!poll)
        return <ErrorState message={localizedUiText.m_2bcc07bf9752} onRetry={refetch}/>;
    const isOpen = poll.status === 'OPEN' || poll.status === 'ACTIVE';
    const isOwner = activeContext.residentRole === 'owner' || activeContext.residentRole === 'coOwner';
    const eligible = poll.eligibility !== 'OWNERS_ONLY' || isOwner;
    const canVote = isOpen && eligible && poll.myVoteStatus !== 'VOTED';
    const toggleOption = (optId: string) => {
        setSelected((current) => {
            if (poll.questionType !== 'MULTI_CHOICE')
                return [optId];
            return current.includes(optId)
                ? current.filter((selectedId) => selectedId !== optId)
                : [...current, optId];
        });
    };
    const handleSubmit = async () => {
        if (!canVote || isSubmitting)
            return;
        if (selected.length === 0) {
            AppAlert.alert(String(localizedUiText.m_b45229a19f20), String(localizedUiText.m_e04bfa524fa5));
            return;
        }
        const res = await submit({ pollId, selectedOptionIds: selected });
        if (res.ok) {
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_dd879724ccbc), [
                { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.goBack() },
            ]);
        }
        else
            AppAlert.alert(String(localizedUiText.m_54d3ba987722), res.error.message);
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_b9833bdbd0cb}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>
            {poll.title}
          </SafeText>
          <SafeText variant="caption" color="secondary">
            {poll.description}
          </SafeText>
        </View>

        {!canVote ? (<View style={[styles.card, createViewBackgroundColorBorderColorStyle2(theme.surface, theme.border)]}>
            <SafeText variant="caption" color="secondary">
              {poll.myVoteStatus === 'VOTED'
                ? localizedUiText.m_41a1e2facfb4 : !eligible
                ? localizedUiText.m_fc99b31f1f2d : localizedUiText.m_a8e4baf9e731}
            </SafeText>
          </View>) : null}

        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(theme.textPrimary)}>{localizedUiText.m_d88604eca1c2}</SafeText>
          <View style={styles.list}>
            {canVote ? poll.options.map((opt) => {
            const isSelected = selected.includes(opt.id);
            return (<Pressable key={opt.id} onPress={() => toggleOption(opt.id)}>
                  <View style={[
                    styles.optionRow,
                    createViewBackgroundColorBorderColorStyle3(isSelected ? theme.accentSoft : theme.surface, isSelected ? theme.accent : theme.border),
                ]}>
                    <Ionicons name={isSelected ? 'radio-button-on' : 'radio-button-off'} size={20} color={isSelected ? theme.accent : theme.textSecondary}/>
                    <SafeText variant="caption" style={createSafeTextColorStyle3(theme.textPrimary)}>
                      {opt.label}
                    </SafeText>
                  </View>
                </Pressable>);
        }) : null}
          </View>
        </View>
      </ScrollView>

      
      <View style={[styles.bottomBar, createViewPaddingBottomBorderTopColorStyle(insets.bottom + 12, theme.border)]}>
        <AppButton title={localizedUiText.m_fbad31b2837a} onPress={handleSubmit} loading={isSubmitting} disabled={!canVote || selected.length === 0 || isSubmitting} iconLeft={<Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF"/>}/>
      </View>
    </View>);
}
export default SubmitPollVoteScreen;

