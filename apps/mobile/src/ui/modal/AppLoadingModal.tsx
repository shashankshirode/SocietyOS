import { ActivityIndicator, Text, View } from "react-native";
import { useMessages } from "../../messages";
import { resolveMessage } from "../../messages/resolveMessage";
import { useAppTheme } from "../../shared/theme";
import { AppModal } from "./AppModal";
import type { MessageValues } from "./modal.types";
import { styles, createTextColorStyle } from "./styles/AppLoadingModal.styles";
export interface AppLoadingModalProps {
    visible: boolean;
    messageKey?: string;
    messageValues?: MessageValues;
}
export function AppLoadingModal({ visible, messageKey = 'common.loading', messageValues, }: AppLoadingModalProps) {
    const messages = useMessages();
    const { colors } = useAppTheme();
    return (<AppModal visible={visible} onClose={() => undefined} centered preventDismiss showDragHandle={false}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={colors.primary}/>
        <Text style={[styles.message, createTextColorStyle(colors.textPrimary)]}>
          {resolveMessage(messages, messageKey, messageValues)}
        </Text>
      </View>
    </AppModal>);
}

