import React, { useCallback } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from "@react-navigation/native";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { AppBar } from "../components/AppBar";
import { Layout } from "./Layout";
import { colors, getColors } from "../tokens/premium-colors";
import { performBackNavigation } from "../../shared/navigation/performBackNavigation";
import type { Absent } from "../../shared/types/absence.types";
export type ScreenEdge = "top" | "bottom" | "left" | "right";
export type LayoutVariant = "default" | "scroll" | "modal" | "fullscreen";
export interface ScreenProps {
  title: string;
  subtitle?: string | Absent;
  showBackButton?: boolean | Absent;
  backAction?: (() => void) | Absent;
  onBack?: (() => void) | Absent;
  rightActions?: React.ReactNode | Absent;
  showAppBar?: boolean | Absent;
  titleKey?: string | Absent;
  subtitleKey?: string | Absent;
  children: React.ReactNode;
  variant?: LayoutVariant | Absent;
  style?: ViewStyle | Absent;
  contentStyle?: ViewStyle | Absent;
  edges?: ScreenEdge[] | Absent;
}
export function Screen({
  title,
  subtitle,
  showBackButton = true,
  backAction,
  onBack,
  rightActions,
  showAppBar = true,
  titleKey,
  subtitleKey,
  children,
  variant = "scroll",
  style,
  contentStyle,
  edges = ["bottom"],
}: ScreenProps) {
  const { dark } = useAppTheme();
  const navigation = useNavigation<{ canGoBack?: () => boolean; goBack?: () => void; navigate?: (name: string, params?: object) => void }>();
  let currentRouteName: string | Absent = undefined;
  try {
    const route = useRoute<RouteProp<Record<string, object | undefined>, string>>();
    currentRouteName = route?.name;
  } catch {
    currentRouteName = undefined;
  }
  const effectiveBackAction = onBack ?? backAction;
  const handleBackPress = useCallback(() => {
    performBackNavigation(navigation, {
      customHandler: effectiveBackAction,
      currentRouteName,
    });
  }, [navigation, effectiveBackAction, currentRouteName]);
  const screenTitle = titleKey ? titleKey : title;
  const screenSubtitle = subtitleKey ? subtitleKey : subtitle;
  const appBar = React.useMemo(() => {
    if (!showAppBar) return null;
    return (
      <AppBar
        title={screenTitle}
        {...(screenSubtitle ? { subtitle: screenSubtitle } : {})}
        showBackButton={showBackButton}
        onBackPress={handleBackPress}
        rightActions={rightActions}
      />
    );
  }, [
    showAppBar,
    screenTitle,
    screenSubtitle,
    showBackButton,
    handleBackPress,
    rightActions,
  ]);
  const layoutContent = (
    <>
      {appBar}
      <Layout
        variant={variant}
        edges={edges}
        style={style}
        contentStyle={contentStyle}
      >
        {children}
      </Layout>
    </>
  );
  return layoutContent;
}
