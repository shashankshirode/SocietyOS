import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import type { ChatSenderSnapshot } from "../../../chat/domain/chat.types";
import { styles, createSafeTextColorStyle } from "../styles/components/StaffSenderAttribution.styles";
type Props = {
    sender: ChatSenderSnapshot;
};
export function StaffSenderAttribution({ sender }: Props) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const role = sender.roleTitleAtSend || messages.resident.chat.sender.teamMember;
    const detail = [role, sender.gateNameAtSend].filter(Boolean).join(' · ');
    const label = messages.resident.chat.sender.attribution(sender.displayNameAtSend, detail);
    return (<View style={styles.container} accessible accessibilityLabel={messages.resident.chat.accessibility.senderAttribution(sender.displayNameAtSend, detail)}>
      <SafeText variant="tiny" numberOfLines={2} style={createSafeTextColorStyle(colors.primary)}>
        {label}
      </SafeText>
    </View>);
}

