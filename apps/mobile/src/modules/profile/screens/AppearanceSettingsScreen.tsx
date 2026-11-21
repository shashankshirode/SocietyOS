import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppScreen } from "../../../shared/layouts/AppScreen";
import { AppCard } from "../../../shared/cards/AppCard";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import type { ThemePreference } from "../../../core/theme/themePreference.types";
import { styles, createAppCardBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createTextColorStyle, createTextColorStyle2 } from "../styles/screens/AppearanceSettingsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function AppearanceSettingsScreen({ navigation }: BackOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors, themePreference, setThemePreference } = useAppTheme();
    const options: {
        key: ThemePreference;
        title: string;
        subtitle: string;
        icon: keyof typeof Ionicons.glyphMap;
    }[] = [
        {
            key: 'system',
            title: String(localizedUiText.m_b0459211f9f7),
            subtitle: String(localizedUiText.m_84035c3cc7ca),
            icon: 'settings-outline',
        },
        {
            key: 'light',
            title: String(localizedUiText.m_b4fcfbee4fb9),
            subtitle: String(localizedUiText.m_b5df0e8ad972),
            icon: 'sunny-outline',
        },
        {
            key: 'dark',
            title: String(localizedUiText.m_9b7878aef90b),
            subtitle: String(localizedUiText.m_73ca74c4b0fa),
            icon: 'moon-outline',
        },
    ];
    return (<AppScreen scroll>
      <AppHeader title={localizedUiText.m_3907fa7f8072} showBack onBack={() => navigation.goBack()}/>
      <View style={styles.content}>
        {options.map((opt) => {
            const isSelected = themePreference === opt.key;
            return (<Pressable key={opt.key} onPress={() => setThemePreference(opt.key)} style={({ pressed }) => [
                    styles.optionWrapper,
                    pressed && styles.pressableOpacity
                ]}>
              <AppCard selected={isSelected} variant={isSelected ? 'default' : 'outlined'} style={[
                    styles.card,
                    createAppCardBackgroundColorBorderColorStyle(isSelected ? colors.primarySoft : colors.surface, isSelected ? colors.primary : colors.border)
                ]}>
                <View style={styles.cardContent}>
                  <View style={[styles.iconWrapper, createViewBackgroundColorStyle(isSelected ? colors.primary : colors.backgroundSoft)]}>
                    <Ionicons name={opt.icon} size={20} color={isSelected ? colors.primaryText : colors.textSecondary}/>
                  </View>
                  <View style={styles.textWrapper}>
                    <Text style={[styles.title, createTextColorStyle(colors.textPrimary)]}>{opt.title}</Text>
                    <Text style={[styles.subtitle, createTextColorStyle2(colors.textSecondary)]}>{opt.subtitle}</Text>
                  </View>
                  {isSelected && (<Ionicons name="checkmark-circle" size={22} color={colors.primary} style={styles.checkIcon}/>)}
                </View>
              </AppCard>
            </Pressable>);
        })}
      </View>
    </AppScreen>);
}
export default AppearanceSettingsScreen;

