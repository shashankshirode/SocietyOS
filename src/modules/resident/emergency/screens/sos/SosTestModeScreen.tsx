import { useState, useCallback } from "react";
import { View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { SafeText } from "../../../../../shared/components/SafeText";
import { useMessages } from "../../../../../shared/constants/useMessages";
import { useSosResidenceContext } from "../../hooks/useSosResidenceContext";
import { useSosRecipientResolution } from "../../hooks/useSosRecipientResolution";
import type { SosType, SosRecipientResolutionResult } from "../../data/sosResponsePlan.types";
import { SOS_TYPE_DEFINITIONS } from "../../data/sosTypeDefinitions";
import { SosRecipientRow } from "../../components/sos/SosRecipientRow";
import type { SosResponsePlanStackParamList } from "../../../../../app/navigation/navigation.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createScrollViewBackgroundColorStyle, createSafeTextColorStyle4, createPressableBackgroundColorBorderColorStyle, createPressableOpacityStyle, createSafeTextColorStyle5, createPressableBorderColorStyle } from "../../styles/screens/sos/SosTestModeScreen.styles";
import { formatUiLiteral } from "../../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SosResponsePlanStackParamList, 'SosTestMode'>;
export function SosTestModeScreen({ navigation }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const context = useSosResidenceContext();
    const { resolve, isResolving } = useSosRecipientResolution(context);
    const testMsg = messages.resident?.emergency?.sosTest ?? {};
    const [selectedType, setSelectedType] = useState<SosType | null>(null);
    const [result, setResult] = useState<SosRecipientResolutionResult | null>(null);
    const handleTest = useCallback(async () => {
        if (!selectedType)
            return;
        try {
            const resolution = await resolve(selectedType);
            setResult(resolution);
        }
        catch { }
    }, [selectedType, resolve]);
    return (<ScrollView style={[styles.container, createScrollViewBackgroundColorStyle(colors.background)]} contentContainerStyle={styles.content}>
      
      <View style={[styles.banner, styles.viewBackgroundColorBorderColor]}>
        <Ionicons name="flask" size={20} color="#6366F1"/>
        <SafeText variant="caption" style={[styles.bannerText, styles.safeTextColor2]}>
          {testMsg?.testOnly ?? localizedUiText.m_fa1c3c1732eb}
        </SafeText>
      </View>

      
      <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle4(colors.textPrimary)]}>
        {testMsg?.selectType ?? localizedUiText.m_973fdf46d0ba}
      </SafeText>
      <View style={styles.typeGrid}>
        {SOS_TYPE_DEFINITIONS.map((def) => {
            const isSelected = selectedType === def.sosType;
            const typeTitle = messages.resident?.emergency?.sosSettings?.types?.[def.sosType]?.title ?? def.sosType;
            return (<Pressable key={def.sosType} onPress={() => { setSelectedType(def.sosType); setResult(null); }} style={[
                    styles.typeCard,
                    createPressableBackgroundColorBorderColorStyle(isSelected ? def.color + '15' : colors.surface, isSelected ? def.color : colors.border),
                ]} accessibilityRole="button" accessibilityLabel={formatUiLiteral(localizedUiText.m_85263001908b, [typeTitle])}>
              <Ionicons name={def.icon as keyof typeof Ionicons.glyphMap} size={24} color={isSelected ? def.color : colors.textSecondary}/>
              <SafeText variant="tiny" style={createSafeTextColorStyle(isSelected ? def.color : colors.textSecondary)}>
                {typeTitle}
              </SafeText>
            </Pressable>);
        })}
      </View>

      {selectedType && !result && (<Pressable onPress={handleTest} disabled={isResolving} style={[styles.testButton, createPressableOpacityStyle(isResolving ? 0.6 : 1)]} accessibilityRole="button" accessibilityLabel={localizedUiText.m_6864c1db6e94}>
          {isResolving ? (<ActivityIndicator color="#FFFFFF"/>) : (<>
              <Ionicons name="play" size={18} color="#FFFFFF"/>
              <SafeText variant="bodyStrong" style={styles.testButtonText}>
                {testMsg?.runTest ?? localizedUiText.m_f3c5e08fb592}
              </SafeText>
            </>)}
        </Pressable>)}

      {result && (<View style={styles.resultSection}>
          <View style={[styles.resultHeader, styles.viewBackgroundColorBorderColor2]}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981"/>
            <SafeText variant="bodyStrong" style={[styles.resultTitle, styles.safeTextColor3]}>
              {testMsg?.testCompleted ?? localizedUiText.m_7478f5375ddc}
            </SafeText>
          </View>

          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle5(colors.textPrimary)]}>
            {testMsg?.wouldNotify ?? localizedUiText.m_cb5cc332e2a2}
          </SafeText>

          {result.resolvedRecipients.map((recipient) => (<SosRecipientRow key={recipient.recipientId} rule={{
                    recipientId: recipient.recipientId,
                    recipientType: recipient.recipientType,
                    recipientDisplayName: recipient.displayName,
                    source: recipient.source,
                    mandatory: recipient.mandatory,
                    enabled: true,
                    escalationOrder: recipient.escalationOrder,
                    notifyImmediately: recipient.notifyImmediately,
                    escalationDelaySeconds: recipient.escalationDelaySeconds,
                    notificationChannels: recipient.channels,
                }}/>))}

          <SafeText variant="caption" style={createSafeTextColorStyle2(colors.textSecondary)}>
            {(testMsg?.recipientCount ?? getActiveUiLiteral("m_6ed50959898d")).replace('{count}', String(result.resolvedRecipients.length))}
          </SafeText>

          {result.warnings.length > 0 && (<View style={[styles.warningCard, styles.viewBackgroundColorBorderColor3]}>
              <SafeText variant="caption" style={styles.safeTextColorFontWeight}>
                {testMsg?.warningsFound ?? localizedUiText.m_223b49bff77f}
              </SafeText>
              {result.warnings.map((w, idx) => (<SafeText key={`warning-${w.code}-${idx}`} variant="tiny" style={styles.safeTextColor}>
                  • {messages.resident?.emergency?.sosSettings?.warnings?.[w.code] ?? w.code}
                </SafeText>))}
            </View>)}

          {result.warnings.length === 0 && (<SafeText variant="caption" style={styles.safeTextColorTextAlignFontWeight}>
              {testMsg?.noIssues ?? localizedUiText.m_abe396d7cb0d}
            </SafeText>)}

          <Pressable onPress={() => { setResult(null); setSelectedType(null); }} style={[styles.resetButton, createPressableBorderColorStyle(colors.border)]}>
            <SafeText variant="caption" style={createSafeTextColorStyle3(colors.textSecondary)}>{localizedUiText.m_e0f0f22ee967}</SafeText>
          </Pressable>
        </View>)}
    </ScrollView>);
}

