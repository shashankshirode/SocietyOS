import React, { useState, useCallback } from "react";
import { ScrollView, View, Pressable } from "react-native";
import Animated, { FadeInRight, FadeOutLeft, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { SafeText } from "../../shared/components/SafeText";
import { AppIconBubble } from "../../shared/icons/AppIconBubble";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { getRequiredItem } from "../../shared/utils/requiredItem";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBorderTopColorStyle, createPressableBorderColorStyle, createPressableBackgroundColorStyle } from "./styles/StepperFlow.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
export interface StepperStep {
    id: string;
    title: string;
    description?: string;
    content: React.ReactNode;
}
interface StepperFlowProps {
    steps: StepperStep[];
    title?: string;
    onComplete?: () => void;
    onCancel?: () => void;
    completeLabel?: string;
    testID?: string;
}
function StepIndicator({ index, total, currentIndex }: {
    index: number;
    total: number;
    currentIndex: number;
}) {
    const { colors } = useAppTheme();
    const isActive = index === currentIndex;
    const isCompleted = index < currentIndex;
    return (<View style={styles.stepDotWrapper}>
      <View style={[
            styles.stepDot,
            createViewBackgroundColorBorderColorStyle(isActive ? colors.primary : isCompleted ? colors.success : colors.surfaceElevated, isActive ? colors.primary : isCompleted ? colors.success : colors.border),
        ]}>
        {isCompleted ? (<SafeText variant="tiny" style={styles.safeTextColorFontSizeFontWeight}>✓</SafeText>) : (<SafeText variant="tiny" style={createSafeTextColorStyle(isActive ? '#FFFFFF' : colors.textMuted)}>{index + 1}</SafeText>)}
      </View>
      {index < total - 1 && (<View style={[styles.stepLine, createViewBackgroundColorStyle(isCompleted ? colors.success : colors.border)]}/>)}
    </View>);
}
export function StepperFlow({ steps, title, onComplete, onCancel, completeLabel = 'Submit', testID }: StepperFlowProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentStep = getRequiredItem(steps, currentIndex, "StepperFlow.tsx");
    const isLast = currentIndex === steps.length - 1;
    const isFirst = currentIndex === 0;
    const nextScale = useSharedValue(1);
    const nextAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: nextScale.value }],
    }));
    const goNext = useCallback(() => {
        if (isLast) {
            onComplete?.();
        }
        else {
            setCurrentIndex((i) => i + 1);
        }
    }, [isLast, onComplete]);
    const goBack = useCallback(() => {
        if (isFirst) {
            onCancel?.();
        }
        else {
            setCurrentIndex((i) => i - 1);
        }
    }, [isFirst, onCancel]);
    return (<View style={[styles.root, createViewBackgroundColorStyle2(colors.background)]} testID={testID}>
      
      {title && (<View style={styles.headerArea}>
          <SafeText variant="h3" color="primary">{title}</SafeText>
          <SafeText variant="caption" color="muted">{localizedUiText.m_8e6a6cca7aae + " "}{currentIndex + 1}{" " + localizedUiText.m_28391d3bc64e + " "}{steps.length}</SafeText>
        </View>)}

      
      <View style={styles.indicatorRow}>
        {steps.map((_, i) => (<StepIndicator key={i} index={i} total={steps.length} currentIndex={currentIndex}/>))}
      </View>

      
      <View style={styles.stepTitleArea}>
        <SafeText variant="h3" color="primary">{currentStep.title}</SafeText>
        {currentStep.description && <SafeText variant="caption" color="muted">{currentStep.description}</SafeText>}
      </View>

      
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View key={currentStep.id} entering={FadeInRight.duration(300)} exiting={FadeOutLeft.duration(200)}>
          {currentStep.content}
        </Animated.View>
      </ScrollView>

      
      <View style={[styles.footer, createViewBorderTopColorStyle(colors.border)]}>
        <Pressable onPress={goBack} style={[styles.footerBtn, styles.backBtn, createPressableBorderColorStyle(colors.border)]}>
          <SafeText variant="body" color="secondary" style={styles.safeTextFontWeight}>
            {isFirst ? localizedUiText.m_19766ed6ccb2 : localizedUiText.m_76900f1bfd16}
          </SafeText>
        </Pressable>
        <Animated.View style={[nextAnimatedStyle, styles.animatedViewFlex]}>
          <Pressable onPress={goNext} onPressIn={() => { nextScale.value = withSpring(0.96); }} onPressOut={() => { nextScale.value = withSpring(1); }} style={[styles.footerBtn, styles.nextBtn, createPressableBackgroundColorStyle(colors.primary)]}>
            <SafeText variant="body" style={styles.safeTextColorFontWeight}>
              {isLast ? completeLabel : localizedUiText.m_31fbef162594}
            </SafeText>
            {!isLast && <AppIconBubble name="forward" size={18} iconSize={10} color="#FFFFFF" backgroundColor="transparent"/>}
          </Pressable>
        </Animated.View>
      </View>
    </View>);
}

