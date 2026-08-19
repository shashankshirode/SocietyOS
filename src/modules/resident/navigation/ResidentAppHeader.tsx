import { useWindowDimensions, View } from "react-native";
import { useNavigation, type NavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ResidentBackButton } from "./ResidentBackButton";
import { ResidentHeaderActions } from "./ResidentHeaderActions";
import { ResidentHeaderBackground } from "./ResidentHeaderBackground";
import { ResidentHeaderRoleBadge } from "./ResidentHeaderRoleBadge";
import { ResidentHeaderTitle } from "./ResidentHeaderTitle";
import { useResidentHeaderTheme } from "./useResidentHeaderTheme";
import type { ResidentAppHeaderProps } from "./residentHeader.types";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import type { RootTabParamList } from "../../../app/navigation/navigation.types";
import { styles, createViewPaddingTopBorderBottomColorStyle } from "./styles/ResidentAppHeader.styles";
export function ResidentAppHeader({ variant, titleKey, subtitleKey, roleLabelKey = 'resident.header.roles.owner', showBackButton, actions, contextLabelKey, onBackPress, includeSafeAreaTop = true, testID = 'resident-header-container', }: ResidentAppHeaderProps) {
    const navigation = useNavigation<NavigationProp<RootTabParamList>>();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const headerTheme = useResidentHeaderTheme(variant, roleLabelKey);
    const isTablet = width >= 768;
    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
            return;
        }
        if (navigation.canGoBack()) {
            navigation.goBack();
            return;
        }
        navigation.navigate('HomeTab', { screen: 'ResidentHome' });
    };
    return (<View testID={testID} style={[
            styles.container,
            createViewPaddingTopBorderBottomColorStyle(includeSafeAreaTop ? insets.top : 0, headerTheme.borderColor),
        ]}>
      <StatusBar style="light" {...includeWhenPresent("backgroundColor", headerTheme.backgroundColors[0])}/>
      <ResidentHeaderBackground theme={headerTheme}/>
      <View style={[styles.contentRow, isTablet ? styles.tabletContentRow : null]}>
        {showBackButton ? (<ResidentBackButton onPress={handleBackPress} tintColor={headerTheme.textColor}/>) : (<View style={styles.backSpacer}/>)}

        <ResidentHeaderTitle titleKey={titleKey} {...includeWhenPresent("subtitleKey", subtitleKey)} {...includeWhenPresent("contextLabelKey", contextLabelKey)} textColor={headerTheme.textColor} mutedTextColor={headerTheme.accentColor}/>

        <View style={styles.rightArea}>
          <ResidentHeaderRoleBadge roleLabelKey={roleLabelKey} textColor={headerTheme.textColor} backgroundColor={headerTheme.surfaceColor}/>
          <ResidentHeaderActions {...includeWhenPresent("actions", actions)} iconColor={headerTheme.textColor} badgeBackgroundColor={headerTheme.accentColor} badgeTextColor={headerTheme.surfaceColor}/>
        </View>
      </View>
    </View>);
}

