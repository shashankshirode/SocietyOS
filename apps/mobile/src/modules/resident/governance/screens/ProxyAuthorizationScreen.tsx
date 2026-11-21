import { useMemo, useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { FormField } from "../../../../ui/forms/FormField";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useActiveResidentHome } from "../../homeContext/hooks/useActiveResidentHome";
import { useProxyAuthorization } from "../hooks/useProxyAuthorization";
import type { ProxyAuthorizationInput } from "../data/governance.dto";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createTextInputColorBackgroundColorBorderColorStyle, createTextInputColorBackgroundColorBorderColorStyle2, createTextInputColorBackgroundColorBorderColorStyle3, createViewBackgroundColorBorderColorStyle2, createViewBackgroundColorBorderColorStyle3 } from "../styles/screens/ProxyAuthorizationScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type ProxyAuthorizationProps = {
    navigation: {
        goBack: () => void;
    };
    route?: {
        params?: {
            meetingId?: string;
        };
    };
};
type ProxyScope = ProxyAuthorizationInput['scope'];
const scopes: {
    id: ProxyScope;
    label: string;
}[] = [
    { id: 'ATTEND_ONLY', get label() {
            return getActiveUiLiteral("m_30ef65d6a62e");
        } },
    { id: 'SPEAK_ON_BEHALF', get label() {
            return getActiveUiLiteral("m_8a995222525e");
        } },
    { id: 'VOTE_ON_RESOLUTIONS', get label() {
            return getActiveUiLiteral("m_3eb063afa1c9");
        } },
    { id: 'FULL_MEETING_PROXY', get label() {
            return getActiveUiLiteral("m_2c9bbf1a9086");
        } },
];
export function ProxyAuthorizationScreen({ navigation, route }: ProxyAuthorizationProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { activeContext } = useActiveResidentHome();
    const meetingId = route?.params?.meetingId ?? '';
    const [proxyName, setProxyName] = useState('');
    const [relation, setRelation] = useState('');
    const [proxyMobile, setProxyMobile] = useState('');
    const [scope, setScope] = useState<ProxyScope>('ATTEND_ONLY');
    const [consent, setConsent] = useState(false);
    const { submit, isSubmitting } = useProxyAuthorization();
    const isOwner = activeContext.residentRole === 'owner' || activeContext.residentRole === 'coOwner';
    const isValid = useMemo(() => Boolean(isOwner && meetingId && proxyName.trim().length >= 3 && relation.trim().length >= 2 && /^\d{10}$/.test(proxyMobile) && consent), [isOwner, meetingId, proxyName, relation, proxyMobile, consent]);
    const handleSubmit = async () => {
        if (!isValid || isSubmitting)
            return;
        const result = await submit({ meetingId, proxyName: proxyName.trim(), relation: relation.trim(), proxyMobile, scope });
        if (!result.ok) {
            AppAlert.alert(String(localizedUiText.m_93a4e956c68f), result.error.message);
            return;
        }
        AppAlert.alert(String(localizedUiText.m_adcf389e21bf), formatUiLiteral(String(localizedUiText.m_5a9999b03ca8), [result.data.proxyName]), [
            { text: String(localizedUiText.m_11a6767d5674), onPress: navigation.goBack },
        ]);
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_b8850d8439c7} showBackButton/>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!isOwner ? (<View style={[styles.notice, createViewBackgroundColorBorderColorStyle(theme.surfaceRaised, theme.border)]}>
            <Ionicons name="lock-closed-outline" size={22} color={theme.warning}/>
            <SafeText variant="caption" color="secondary" style={styles.flexText}>{localizedUiText.m_79e7d2d82767}</SafeText>
          </View>) : null}
        {!meetingId ? (<SafeText variant="caption" style={createSafeTextColorStyle(theme.danger)}>{localizedUiText.m_12ebdefe7fd1}</SafeText>) : null}
        <FormField label={localizedUiText.m_1dacf749bbea} required>
          <TextInput value={proxyName} onChangeText={(value) => setProxyName(value.slice(0, 80))} placeholder={localizedUiText.m_d25010e82650} placeholderTextColor={theme.textSecondary} editable={isOwner} style={[styles.input, createTextInputColorBackgroundColorBorderColorStyle(theme.textPrimary, theme.surface, theme.border)]}/>
        </FormField>
        <FormField label={localizedUiText.m_25490a10d071} required>
          <TextInput value={relation} onChangeText={(value) => setRelation(value.slice(0, 50))} placeholder={localizedUiText.m_e4a07ad65e92} placeholderTextColor={theme.textSecondary} editable={isOwner} style={[styles.input, createTextInputColorBackgroundColorBorderColorStyle2(theme.textPrimary, theme.surface, theme.border)]}/>
        </FormField>
        <FormField label={localizedUiText.m_187e80ba4d8a} required {...includeWhenPresent("errorText", proxyMobile.length > 0 && !/^\d{10}$/.test(proxyMobile) ? getActiveUiLiteral("m_e9e9dd598b35") : undefined)}>
          <TextInput value={proxyMobile} onChangeText={(value) => setProxyMobile(value.replace(/\D/g, '').slice(0, 10))} placeholder={localizedUiText.m_77290962379c} placeholderTextColor={theme.textSecondary} keyboardType="phone-pad" editable={isOwner} style={[styles.input, createTextInputColorBackgroundColorBorderColorStyle3(theme.textPrimary, theme.surface, theme.border)]}/>
        </FormField>
        <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(theme.textPrimary)}>{localizedUiText.m_19607fea7f8b}</SafeText>
        <View style={styles.scopeList}>
          {scopes.map((option) => {
            const selected = scope === option.id;
            return (<Pressable key={option.id} onPress={() => setScope(option.id)} disabled={!isOwner} accessibilityRole="radio" accessibilityState={{ checked: selected }}>
                <View style={[styles.scopeOption, createViewBackgroundColorBorderColorStyle2(selected ? theme.accentSoft : theme.surface, selected ? theme.accent : theme.border)]}>
                  <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={20} color={selected ? theme.accent : theme.textSecondary}/>
                  <SafeText variant="caption" style={createSafeTextColorStyle3(theme.textPrimary)}>{option.label}</SafeText>
                </View>
              </Pressable>);
        })}
        </View>
        <Pressable onPress={() => setConsent((value) => !value)} disabled={!isOwner} accessibilityRole="checkbox" accessibilityState={{ checked: consent }}>
          <View style={[styles.consent, createViewBackgroundColorBorderColorStyle3(theme.surface, consent ? theme.accent : theme.border)]}>
            <Ionicons name={consent ? 'checkbox' : 'square-outline'} size={22} color={consent ? theme.accent : theme.textSecondary}/>
            <SafeText variant="caption" color="secondary" style={styles.flexText}>{localizedUiText.m_fa24acadcf24}</SafeText>
          </View>
        </Pressable>
        <AppButton title={localizedUiText.m_d8fb8bbce36c} onPress={() => void handleSubmit()} disabled={!isValid || isSubmitting} loading={isSubmitting}/>
      </ScrollView>
    </View>);
}

