import { View } from "react-native";
import { SafeText } from "../../../shared/components/SafeText";
import { useMessages } from "../../../shared/constants/useMessages";
import { resolveResidentMessage, type MessageTree } from "./ResidentHeaderTitle";
import type { MessageKey } from "./residentHeader.types";
import { styles, createViewBackgroundColorStyle, createSafeTextColorStyle } from "./styles/ResidentHeaderRoleBadge.styles";
export type ResidentHeaderRoleBadgeProps = {
    roleLabelKey: MessageKey;
    textColor: string;
    backgroundColor: string;
};
export function ResidentHeaderRoleBadge({ roleLabelKey, textColor, backgroundColor, }: ResidentHeaderRoleBadgeProps) {
    const messages = useMessages();
    const roleLabel = resolveResidentMessage(messages as MessageTree, roleLabelKey);
    return (<View style={[styles.badge, createViewBackgroundColorStyle(backgroundColor)]}>
      <SafeText variant="tiny" numberOfLines={2} maxFontSizeMultiplier={1.4} style={[styles.label, createSafeTextColorStyle(textColor)]}> 
        {roleLabel}
      </SafeText>
    </View>);
}

