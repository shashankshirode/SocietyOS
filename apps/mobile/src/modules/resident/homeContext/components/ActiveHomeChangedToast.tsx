import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { styles, createViewBackgroundColorStyle } from "../styles/components/ActiveHomeChangedToast.styles";
export function ActiveHomeChangedToast({ message, type, }: {
    message: string;
    type: 'success' | 'error';
}) {
    const isSuccess = type === 'success';
    const bg = isSuccess ? '#10B981' : '#EF4444';
    const icon = isSuccess ? 'checkmark-circle-outline' : 'alert-circle-outline';
    return (<View style={[styles.container, createViewBackgroundColorStyle(bg)]} testID="toast-message-container">
      <Ionicons name={icon} size={20} color="#FFFFFF"/>
      <SafeText variant="body" style={styles.text}>
        {message}
      </SafeText>
    </View>);
}
export default ActiveHomeChangedToast;

