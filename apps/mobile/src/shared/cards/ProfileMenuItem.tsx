import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { AppIcon } from "../icons/AppIcon";
import { AppIconName } from "../icons/icon.types";
import { SafeTextRow } from "../layout/SafeTextRow";
import { includeWhenPresent } from "../utils/presentProperty";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorStyle2 } from "./styles/ProfileMenuItem.styles";
export type ProfileMenuItemTone = 'default' | 'danger';
export type ProfileMenuItemProps = {
    label: string;
    description?: string;
    iconName: AppIconName;
    onPress: () => void;
    tone?: ProfileMenuItemTone;
    showChevron?: boolean;
    style?: StyleProp<ViewStyle>;
};
export function ProfileMenuItem({ label, description, iconName, onPress, tone = 'default', showChevron = true, style, }: ProfileMenuItemProps) {
    const { colors } = useAppTheme();
    const danger = tone === 'danger';
    const leftElement = (<View style={[
            styles.iconCircle,
            createViewBackgroundColorStyle(colors.surfaceSoft),
            danger && createViewBackgroundColorStyle2(colors.dangerSoft),
        ]}>
      <AppIcon name={iconName} size={20} color={danger ? colors.danger : colors.primary}/>
    </View>);
    const rightElement = showChevron ? (<AppIcon name="chevronRight" size={18} color={danger ? colors.danger : colors.textMuted}/>) : undefined;
    return (<Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => [styles.row, pressed && styles.pressed, style]}>
      <SafeTextRow title={label} {...includeWhenPresent("subtitle", description)} left={leftElement} {...includeWhenPresent("right", rightElement)}/>
    </Pressable>);
}
export default ProfileMenuItem;

