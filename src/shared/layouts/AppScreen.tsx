import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleProp, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ResponsiveContainer } from "./ResponsiveContainer";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createSafeAreaViewBackgroundColorStyle } from "./styles/AppScreen.styles";
type AppScreenProps = {
    children: React.ReactNode;
    scroll?: boolean;
    keyboardAvoiding?: boolean;
    headerVariant?: 'default' | 'dashboard';
    edges?: ('top' | 'bottom' | 'left' | 'right')[];
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    testID?: string;
};
export function AppScreen({ children, scroll = false, keyboardAvoiding = false, headerVariant = 'default', edges = [], style, contentStyle, testID, }: AppScreenProps) {
    const { colors } = useAppTheme();
    const screenBackground = colors.background;
    const content = scroll ? (<ScrollView style={styles.flex} contentContainerStyle={[styles.scrollContent, contentStyle]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>) : (<View style={[styles.flex, contentStyle]}>{children}</View>);
    const body = keyboardAvoiding ? (<KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {content}
    </KeyboardAvoidingView>) : content;
    return (<SafeAreaView style={[styles.safeArea, createSafeAreaViewBackgroundColorStyle(screenBackground), style]} edges={edges} testID={testID}>
      <ResponsiveContainer>{body}</ResponsiveContainer>
    </SafeAreaView>);
}
export default AppScreen;

