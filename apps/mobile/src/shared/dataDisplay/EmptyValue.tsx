import { Text } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { resolveEmptyLabel, type EmptyValueContext } from "./dataDisplay.utils";
import { styles, createTextColorStyle } from "./styles/EmptyValue.styles";
interface EmptyValueProps {
    context?: EmptyValueContext;
    label?: string;
}
export function EmptyValue({ context = 'generic', label }: EmptyValueProps) {
    const { colors } = useAppTheme();
    const text = label || resolveEmptyLabel(context);
    return (<Text style={[styles.text, createTextColorStyle(colors.textMuted)]} accessibilityLabel={text}>
      {text}
    </Text>);
}

