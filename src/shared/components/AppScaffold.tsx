import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ContentContainer } from "../layout/ContentContainer";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createSafeAreaViewBackgroundColorStyle } from "./styles/AppScaffold.styles";
type AppScaffoldProps = {
    children: React.ReactNode;
    scroll?: boolean;
    footer?: React.ReactNode;
};
export function AppScaffold({ children, scroll = true, footer }: AppScaffoldProps) {
    const { colors } = useAppTheme();
    const content = <ContentContainer style={styles.content}>{children}</ContentContainer>;
    return (<SafeAreaView style={[styles.safe, createSafeAreaViewBackgroundColorStyle(colors.background)]} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
        {footer}
      </KeyboardAvoidingView>
    </SafeAreaView>);
}

