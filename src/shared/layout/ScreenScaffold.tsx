import React from "react";
import { KeyboardAvoidingView, ScrollView, View, ViewStyle, useWindowDimensions } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { useAppTheme } from "../theme/useAppTheme";
import { getPlatformKeyboardConfig } from "../platform/platformKeyboard";
import { styles, createSafeAreaViewBackgroundColorStyle } from "./styles/ScreenScaffold.styles";
export interface ScreenScaffoldProps {
    children: React.ReactNode;
    scroll?: boolean;
    keyboardAvoiding?: boolean;
    edges?: Edge[];
    style?: ViewStyle;
    contentStyle?: ViewStyle;
    testID?: string;
}
export function ScreenScaffold({ children, scroll = false, keyboardAvoiding = false, edges = ['top', 'left', 'right'], style, contentStyle, testID, }: ScreenScaffoldProps) {
    const { colors } = useAppTheme();
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const keyboardConfig = getPlatformKeyboardConfig();
    const content = scroll ? (<ScrollView style={styles.flex} contentContainerStyle={[
            styles.scrollContent,
            isTablet ? styles.tabletPadding : styles.phonePadding,
            contentStyle,
        ]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>) : (<View style={[
            styles.flex,
            isTablet ? styles.tabletPadding : styles.phonePadding,
            contentStyle,
        ]}>
      {children}
    </View>);
    const body = keyboardAvoiding ? (<KeyboardAvoidingView style={styles.flex} behavior={keyboardConfig.behavior} keyboardVerticalOffset={keyboardConfig.keyboardVerticalOffset}>
      {content}
    </KeyboardAvoidingView>) : (content);
    return (<SafeAreaView testID={testID} edges={edges} style={[
            styles.safeArea,
            createSafeAreaViewBackgroundColorStyle(colors.background),
            style,
        ]}>
      <View style={styles.responsiveWrapper}>
        <View style={[
            styles.container,
            isTablet && styles.tabletContainer,
        ]}>
          {body}
        </View>
      </View>
    </SafeAreaView>);
}
export default ScreenScaffold;

