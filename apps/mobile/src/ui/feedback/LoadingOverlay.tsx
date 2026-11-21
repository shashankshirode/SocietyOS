import { View } from "react-native";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { AppActivityIndicator } from "./AppActivityIndicator";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles } from "./styles/LoadingOverlay.styles";
export interface LoadingOverlayProps {
    visible: boolean;
    label?: string;
    absolute?: boolean;
}
export function LoadingOverlay({ visible, label, absolute = true }: LoadingOverlayProps) {
    const { colors } = useAppTheme();
    if (!visible)
        return null;
    return (<View style={[
            absolute ? styles.absolute : styles.relative,
            styles.viewBackgroundColor,
        ]} pointerEvents="auto">
      <AppActivityIndicator size="large" color={colors.primary} {...includeWhenPresent("label", label)}/>
    </View>);
}
export default LoadingOverlay;

