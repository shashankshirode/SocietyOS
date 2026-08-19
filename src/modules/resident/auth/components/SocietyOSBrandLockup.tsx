import { useEffect, useState } from "react";
import { View, AccessibilityInfo } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from "react-native-reanimated";
import { AppText } from "../../../../shared/components/AppText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { authMessages } from "../messages/auth.messages";
import { styles, createAnimatedViewBorderColorStyle, createAnimatedViewBorderColorStyle2, createAnimatedViewBackgroundColorStyle, createAppTextColorStyle, createAppTextColorStyle2 } from "../styles/components/SocietyOSBrandLockup.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export type SocietyOSBrandVariant = 'hero' | 'compact' | 'navigation' | 'loading' | 'monochrome';
interface SocietyOSBrandLockupProps {
    variant: SocietyOSBrandVariant;
    showTagline?: boolean;
    animated?: boolean;
    accessibilityLabel: string;
    isPhoneValid?: boolean;
}
export function SocietyOSBrandLockup({ variant, showTagline = true, animated = true, accessibilityLabel, isPhoneValid = false, }: SocietyOSBrandLockupProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const [reducedMotion, setReducedMotion] = useState(false);
    const shieldScale = useSharedValue(animated ? 0.7 : 1);
    const shieldOpacity = useSharedValue(animated ? 0 : 1);
    const doorwayOpacity = useSharedValue(animated ? 0 : 1);
    const textOpacity = useSharedValue(animated ? 0 : 1);
    const textTranslate = useSharedValue(animated ? 10 : 0);
    const pulseOpacity = useSharedValue(animated ? 0 : 1);
    const pulseScale = useSharedValue(1);
    useEffect(() => {
        AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
            setReducedMotion(enabled);
            if (enabled) {
                shieldScale.value = 1;
                shieldOpacity.value = 1;
                doorwayOpacity.value = 1;
                textOpacity.value = 1;
                textTranslate.value = 0;
                pulseOpacity.value = 1;
            }
        });
    }, [doorwayOpacity, pulseOpacity, shieldOpacity, shieldScale, textOpacity, textTranslate]);
    useEffect(() => {
        if (animated && !reducedMotion) {
            shieldScale.value = withTiming(1, { duration: 300 });
            shieldOpacity.value = withTiming(1, { duration: 300 });
            doorwayOpacity.value = withDelay(200, withTiming(1, { duration: 250 }));
            textOpacity.value = withDelay(350, withTiming(1, { duration: 300 }));
            textTranslate.value = withDelay(350, withTiming(0, { duration: 300 }));
            pulseOpacity.value = withDelay(500, withTiming(1, { duration: 200 }));
        }
    }, [animated, doorwayOpacity, pulseOpacity, reducedMotion, shieldOpacity, shieldScale, textOpacity, textTranslate]);
    useEffect(() => {
        if (isPhoneValid) {
            pulseScale.value = 1;
            pulseScale.value = withTiming(2.2, { duration: 800 }, () => {
                pulseScale.value = 1;
            });
        }
    }, [isPhoneValid, pulseScale]);
    const shieldAnimStyle = useAnimatedStyle(() => {
        return {
            opacity: shieldOpacity.value,
            transform: [{ scale: shieldScale.value }],
        };
    });
    const doorwayAnimStyle = useAnimatedStyle(() => {
        return {
            opacity: doorwayOpacity.value,
        };
    });
    const textAnimStyle = useAnimatedStyle(() => {
        return {
            opacity: textOpacity.value,
            transform: [{ translateY: textTranslate.value }],
        };
    });
    const pulseAnimStyle = useAnimatedStyle(() => {
        return {
            opacity: pulseOpacity.value,
            transform: [{ scale: pulseScale.value }],
        };
    });
    const isHero = variant === 'hero';
    const sizeClass = isHero ? styles.heroSize : styles.compactSize;
    const wordmarkColor = variant === 'monochrome'
        ? colors.textPrimary
        : '#ffffff';
    const osAccentColor = variant === 'monochrome'
        ? colors.primary
        : '#00F0FF';
    return (<View style={[styles.container, isHero ? styles.heroLayout : styles.compactLayout]} accessibilityLabel={accessibilityLabel} accessibilityRole="summary">
      <View style={styles.brandRow}>
        
        <Animated.View style={[
            styles.customShield,
            sizeClass,
            shieldAnimStyle,
            createAnimatedViewBorderColorStyle(wordmarkColor),
        ]}>
          
          <Animated.View style={[
            styles.doorwaySpace,
            doorwayAnimStyle,
            createAnimatedViewBorderColorStyle2(wordmarkColor),
        ]}/>
          
          <Animated.View style={[
            styles.accessDot,
            pulseAnimStyle,
            createAnimatedViewBackgroundColorStyle(isPhoneValid ? '#10B981' : '#00F0FF'),
        ]}/>
        </Animated.View>

        
        <Animated.View style={[styles.wordmarkRow, textAnimStyle]}>
          <AppText style={[styles.wordmarkBase, isHero ? styles.heroText : styles.compactText, createAppTextColorStyle(wordmarkColor)]}>{localizedUiText.m_d5acfd8330f5}</AppText>
          <AppText style={[styles.wordmarkOS, isHero ? styles.heroText : styles.compactText, createAppTextColorStyle2(osAccentColor)]}>{localizedUiText.m_343d012d58b2}</AppText>
        </Animated.View>
      </View>

      {isHero && showTagline && (<Animated.View style={[styles.taglineBlock, textAnimStyle]}>
          <AppText variant="body" style={styles.tagline}>
            {authMessages.brandStatement}
          </AppText>
          <AppText variant="caption" style={styles.trustLine}>
            {authMessages.brandTrust}
          </AppText>
        </Animated.View>)}
    </View>);
}

