import { Text } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createTextColorStyle, createTextColorStyle2 } from "./styles/DataLabel.styles";
interface DataLabelProps {
    text: string;
    required?: boolean;
}
export function DataLabel({ text, required = false }: DataLabelProps) {
    const { colors } = useAppTheme();
    return (<Text style={[styles.label, createTextColorStyle2(colors.textSecondary)]}>
      {text}
      {required && <Text style={createTextColorStyle(colors.danger)}> *</Text>}
    </Text>);
}

