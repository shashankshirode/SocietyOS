import React, { useState, useEffect } from "react";
import { View, KeyboardAvoidingView, Platform, useWindowDimensions, Keyboard, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useResponsiveLayout } from "../../../../shared/layout/useResponsiveLayout";
import { ResidenceVisualPanel } from "./ResidenceVisualPanel";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createKeyboardAvoidingViewBackgroundColorStyle } from "../styles/components/ResidentAccessShell.styles";
interface ResidentAccessShellProps {
    children: React.ReactNode;
    isPhoneValid?: boolean;
}
export function ResidentAccessShell({ children, isPhoneValid = false, }: ResidentAccessShellProps) {
    const insets = useSafeAreaInsets();
    const { colors } = useAppTheme();
    const { isTablet } = useResponsiveLayout();
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const getInitialVisualHeight = () => {
        const topInset = Math.max(insets.top, 20);
        if (screenHeight < 680)
            return 250 + topInset;
        if (screenHeight < 840)
            return 290 + topInset;
        return 320 + topInset;
    };
    const initialHeight = getInitialVisualHeight();
    const visualHeight = useSharedValue(initialHeight);
    useEffect(() => {
        const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setIsKeyboardVisible(true));
        const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setIsKeyboardVisible(false));
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);
    useEffect(() => {
        visualHeight.value = withTiming(isKeyboardVisible ? 120 : initialHeight, { duration: 220 });
    }, [isKeyboardVisible, visualHeight, initialHeight]);
    const animatedVisualAreaStyle = useAnimatedStyle(() => {
        return {
            height: visualHeight.value,
        };
    });
    const isLandscape = isTablet && screenWidth > screenHeight;
    if (isLandscape) {
        return (<View style={[styles.mainContainer, createViewBackgroundColorStyle(colors.background)]}>
        <View style={styles.landscapeSplitLayout}>
          
          <View style={styles.leftVisualContainer}>
            <ResidenceVisualPanel isKeyboardActive={false} isPhoneValid={isPhoneValid}/>
          </View>

          
          <View style={[styles.rightFormContainer, createViewBackgroundColorStyle2(colors.surface)]}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <View style={styles.tabletInnerWrapper}>
                {children}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>);
    }
    if (isTablet) {
        return (<View style={[styles.mainContainer, createViewBackgroundColorStyle3(colors.background)]}>
        <View style={styles.tabletPortraitLayout}>
          
          <View style={[styles.tabletPortraitVisual, styles.viewMaxHeight]}>
            <ResidenceVisualPanel isKeyboardActive={isKeyboardVisible} isPhoneValid={isPhoneValid}/>
          </View>
          
          <View style={styles.tabletPortraitForm}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <View style={styles.tabletInnerWrapper}>
                {children}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>);
    }
    return (<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.mainContainer, createKeyboardAvoidingViewBackgroundColorStyle(colors.background)]}>
      <View style={styles.phoneLayout}>
        <Animated.View style={[styles.phoneVisualArea, animatedVisualAreaStyle]}>
          <ResidenceVisualPanel isKeyboardActive={isKeyboardVisible} isPhoneValid={isPhoneValid}/>
        </Animated.View>
        
        
        <View style={styles.phoneFormArea}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>);
}

