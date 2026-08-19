import { StyleProp, TextInput, View, ViewStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../theme";
import { styles } from "./styles/SearchBar.styles";
type SearchBarProps = {
    value: string;
    onChangeText: (value: string) => void;
    placeholder?: string;
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
};
export function SearchBar({ value, onChangeText, placeholder = 'Search', accessibilityLabel = 'Search', style, }: SearchBarProps) {
    return (<View style={[styles.container, style]}>
      <Ionicons name="search-outline" size={18} color={Colors.textMuted}/>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={Colors.textMuted} accessibilityLabel={accessibilityLabel} clearButtonMode="while-editing" style={styles.input}/>
    </View>);
}
export default SearchBar;

