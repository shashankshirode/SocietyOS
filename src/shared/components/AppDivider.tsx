import { StyleProp, View, ViewStyle } from "react-native";
import { styles } from "./styles/AppDivider.styles";
type AppDividerProps = {
    style?: StyleProp<ViewStyle>;
};
export function AppDivider({ style }: AppDividerProps) {
    return <View style={[styles.divider, style]}/>;
}
export default AppDivider;

