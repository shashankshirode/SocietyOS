import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { SafeText } from "../../../shared/components/SafeText";
import { useMessages } from "../../../shared/constants/useMessages";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import type { ChatChannelMembership } from "../../chat/domain/chat.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createTextInputBorderColorColorStyle, createTextInputBorderColorColorStyle2, createPressableBorderColorStyle } from "../styles/components/MembershipDateEditor.styles";
export function MembershipDateEditor({ membership, onSave }: {
    membership: ChatChannelMembership;
    onSave: (validFromIso: string, validUntilIso?: string) => Promise<void>;
}) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const [validFrom, setValidFrom] = useState(membership.validFromIso.slice(0, 10));
    const [validUntil, setValidUntil] = useState(membership.validUntilIso?.slice(0, 10) ?? '');
    return (<View style={styles.root}>
      <View style={styles.field}><SafeText variant="tiny" style={createSafeTextColorStyle(colors.textMuted)}>{messages.chat.membership.effectiveDate}</SafeText><TextInput accessibilityLabel={messages.chat.membership.effectiveDate} value={validFrom} onChangeText={setValidFrom} placeholder={messages.chat.membership.dateFormat} placeholderTextColor={colors.inputPlaceholder} style={[styles.input, createTextInputBorderColorColorStyle(colors.border, colors.inputText)]}/></View>
      <View style={styles.field}><SafeText variant="tiny" style={createSafeTextColorStyle2(colors.textMuted)}>{messages.chat.membership.expiryDate}</SafeText><TextInput accessibilityLabel={messages.chat.membership.expiryDate} value={validUntil} onChangeText={setValidUntil} placeholder={messages.chat.membership.noExpiry} placeholderTextColor={colors.inputPlaceholder} style={[styles.input, createTextInputBorderColorColorStyle2(colors.border, colors.inputText)]}/></View>
      <Pressable accessibilityRole="button" onPress={() => void onSave(`${validFrom}T00:00:00.000Z`, validUntil ? `${validUntil}T23:59:59.999Z` : undefined)} style={[styles.button, createPressableBorderColorStyle(colors.primary)]}><SafeText variant="tiny" style={createSafeTextColorStyle3(colors.primary)}>{messages.chat.membership.saveDates}</SafeText></Pressable>
    </View>);
}

