import { View } from "react-native";
import { AppButton, type ButtonVariant } from "../../shared/components/AppButton";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles } from "./styles/ModalFooter.styles";
interface ModalAction {
    label: string;
    onPress: () => void;
    variant?: ButtonVariant;
    loading?: boolean;
    disabled?: boolean;
    accessibilityLabel?: string;
}
interface ModalFooterProps {
    primaryAction?: ModalAction;
    secondaryAction?: ModalAction;
    dangerAction?: ModalAction;
}
export function ModalFooter({ primaryAction, secondaryAction, dangerAction, }: ModalFooterProps) {
    const action = dangerAction || primaryAction;
    return (<View style={styles.container}>
      {secondaryAction && (<AppButton title={secondaryAction.label} onPress={secondaryAction.onPress} variant={secondaryAction.variant || 'outline'} fullWidth {...includeWhenPresent("disabled", secondaryAction.disabled)} {...includeWhenPresent("loading", secondaryAction.loading)} accessibilityLabel={secondaryAction.accessibilityLabel || secondaryAction.label} style={styles.button}/>)}
      {action && (<AppButton title={action.label} onPress={action.onPress} variant={action.variant || (dangerAction ? 'danger' : 'primary')} fullWidth {...includeWhenPresent("disabled", action.disabled)} {...includeWhenPresent("loading", action.loading)} accessibilityLabel={action.accessibilityLabel || action.label} style={styles.button}/>)}
    </View>);
}
export default ModalFooter;

