import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppModal } from "./AppModal";
import { ModalFooter } from "./ModalFooter";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { modalTokens } from "./modalTokens";
import { Messages } from "../../shared/constants/messages";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createViewBackgroundColorStyle, createTextColorStyle, createTextColorStyle2 } from "./styles/StatusModal.styles";
type StatusType = 'success' | 'error' | 'warning' | 'info';
const STATUS_ICONS: Record<StatusType, keyof typeof Ionicons.glyphMap> = {
    success: 'checkmark-circle',
    error: 'close-circle',
    warning: 'warning',
    info: 'information-circle'
};
interface StatusModalProps {
    visible: boolean;
    type: StatusType;
    title: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
    onClose: () => void;
    onDismiss?: () => void;
}
export function StatusModal({ visible, type, title, message, actionLabel, onAction, onClose, onDismiss, }: StatusModalProps) {
    const { colors } = useAppTheme();
    const colorMap: Record<StatusType, string> = {
        success: colors.success,
        error: colors.danger,
        warning: colors.warning,
        info: colors.info
    };
    const bgMap: Record<StatusType, string> = {
        success: colors.successSoft,
        error: colors.dangerSoft,
        warning: colors.warningSoft,
        info: colors.infoSoft
    };
    return (<AppModal visible={visible} onClose={onClose} {...includeWhenPresent("onDismiss", onDismiss)} centered>
      <View style={styles.body}>
        <View style={[
            styles.iconCircle,
            createViewBackgroundColorStyle(bgMap[type]),
        ]}>
          <Ionicons name={STATUS_ICONS[type]} size={modalTokens.iconSize} color={colorMap[type]}/>
        </View>
        <Text style={[styles.title, createTextColorStyle(colors.textPrimary)]}>{title}</Text>
        {message && (<Text style={[styles.message, createTextColorStyle2(colors.textSecondary)]}>{message}</Text>)}
      </View>
      <ModalFooter primaryAction={{
            label: actionLabel || Messages.common.ok,
            onPress: onAction || onClose,
            accessibilityLabel: Messages.accessibility.modal.confirm
        }}/>
    </AppModal>);
}
export default StatusModal;

