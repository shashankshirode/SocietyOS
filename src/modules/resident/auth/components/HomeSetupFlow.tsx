import React from "react";
import { ScrollView, View } from "react-native";
import { AppText } from "../../../../shared/components/AppText";
import { AppButton } from "../../../../shared/components/AppButton";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useResponsiveLayout } from "../../../../shared/layout/useResponsiveLayout";
import { HomeSetupProgress } from "./HomeSetupProgress";
import { styles, createAppTextColorStyle, createAppTextColorStyle2, createViewBackgroundColorStyle, createViewBackgroundColorBorderTopColorStyle } from "../styles/components/HomeSetupFlow.styles";
interface HomeSetupFlowProps {
    title: string;
    subtitle: string;
    currentStepIndex: number;
    totalSteps: number;
    children: React.ReactNode;
    primaryLabel: string;
    onPrimaryPress: () => void;
    primaryDisabled?: boolean;
    primaryLoading?: boolean;
    secondaryLabel?: string;
    onSecondaryPress?: () => void;
    skipLabel?: string;
    onSkipPress?: () => void;
}
export function HomeSetupFlow({ title, subtitle, currentStepIndex, totalSteps, children, primaryLabel, onPrimaryPress, primaryDisabled = false, primaryLoading = false, secondaryLabel, onSecondaryPress, skipLabel, onSkipPress, }: HomeSetupFlowProps) {
    const { colors } = useAppTheme();
    const { isTablet } = useResponsiveLayout();
    return (<View style={[styles.outer, createViewBackgroundColorStyle(colors.background)]}>
      <View style={[styles.wrapper, isTablet && styles.tabletContainer]}>
        
        <HomeSetupProgress current={currentStepIndex + 1} total={totalSteps}/>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <AppText variant="h2" style={createAppTextColorStyle(colors.textPrimary)}>
              {title}
            </AppText>
            <AppText variant="body" style={createAppTextColorStyle2(colors.textSecondary)}>
              {subtitle}
            </AppText>
          </View>

          <View style={styles.body}>{children}</View>
        </ScrollView>

        
        <View style={[styles.footer, createViewBackgroundColorBorderTopColorStyle(colors.surface, colors.border)]}>
          <View style={styles.btnRow}>
            {secondaryLabel && onSecondaryPress && (<AppButton title={secondaryLabel} variant="outline" onPress={onSecondaryPress} disabled={primaryLoading} style={styles.flexBtn}/>)}
            <AppButton title={primaryLabel} onPress={onPrimaryPress} loading={primaryLoading} disabled={primaryDisabled} style={styles.flexBtn}/>
          </View>
          {skipLabel && onSkipPress && (<AppButton title={skipLabel} variant="ghost" onPress={onSkipPress} disabled={primaryLoading} style={styles.skipBtn}/>)}
        </View>
      </View>
    </View>);
}

