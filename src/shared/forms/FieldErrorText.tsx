import { View } from "react-native";
import { AppText } from "../components/AppText";
import { AppIcon } from "../icons/AppIcon";
import { useAppTheme } from "../theme/useAppTheme";
import { styles } from "./styles/FieldErrorText.styles";
export interface FieldErrorTextProps {
    error?: string;
    testID?: string;
}
export function FieldErrorText({ error, testID }: FieldErrorTextProps) {
    const { colors } = useAppTheme();
    if (!error)
        return null;
    return (<View testID={testID} style={styles.container}>
      <AppIcon name="error" size={14} color={colors.danger}/>
      <AppText variant="formError" tone="danger" style={styles.text}>
        {error}
      </AppText>
    </View>);
}
export default FieldErrorText;

