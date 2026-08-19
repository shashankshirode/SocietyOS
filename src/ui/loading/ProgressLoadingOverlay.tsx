import { ActivityIndicator, Text, View } from "react-native";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { AppModal } from "../modal";
import { styles, createViewBackgroundColorStyle, createTextColorStyle } from "./styles/ProgressLoadingOverlay.styles";
interface ProgressLoadingOverlayProps {
    visible: boolean;
    message?: string;
}
export function ProgressLoadingOverlay({ visible, message, }: ProgressLoadingOverlayProps) {
    const { colors } = useAppTheme();
    if (!visible)
        return null;
    return (<AppModal visible={visible} onClose={() => undefined} preventDismiss centered showDragHandle={false}>
      <View style={styles.overlay}>
        <View style={[styles.card, createViewBackgroundColorStyle(colors.surface)]}>
          <ActivityIndicator size="large" color={colors.primary}/>
          {message && (<Text style={[styles.message, createTextColorStyle(colors.textPrimary)]}>{message}</Text>)}
        </View>
      </View>
    </AppModal>);
}
export default ProgressLoadingOverlay;

