import React from "react";
import { ScrollView, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { RoleHero } from "./RoleHero";
import { HeroMetrics } from "./MetricCapsule";
import { QuickActionRail, type QuickActionItem } from "./QuickActionRail";
import { ActivityFeed, type ActivityItem } from "./ActivityFeed";
import { SectionHeader } from "./SectionHeader";
import type { AppIconName } from "../../shared/icons/icon.types";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createViewBackgroundColorStyle } from "./styles/CommandCenter.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export interface CommandMetric {
    icon: AppIconName;
    label: string;
    value: string | number;
    detail?: string;
}
export interface CommandCenterProps {
    role: string;
    title: string;
    subtitle: string;
    contextItems?: string[];
    metrics?: CommandMetric[];
    actions?: QuickActionItem[];
    feedTitle?: string;
    feedItems?: ActivityItem[];
    emptyTitle?: string;
    emptySubtitle?: string;
    children?: React.ReactNode;
    testID?: string;
}
export function CommandCenter({ role, title, subtitle, contextItems, metrics = [], actions = [], feedTitle = getActiveUiLiteral("m_9ef7d438ce5b"), feedItems = [], emptyTitle, emptySubtitle, children, testID, }: CommandCenterProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]} {...includeWhenPresent("testID", testID)}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces>
        
        <RoleHero role={role} title={title} subtitle={subtitle} {...includeWhenPresent("contextItems", contextItems)}>
          {metrics.length > 0 && <HeroMetrics metrics={metrics}/>}
        </RoleHero>

        
        <View style={styles.body}>
          
          {actions.length > 0 && (<Animated.View entering={FadeInDown.delay(100).duration(350)}>
              <SectionHeader title={localizedUiText.m_2cc2b6f7f200}/>
              <View style={styles.sectionGap}/>
              <QuickActionRail actions={actions}/>
            </Animated.View>)}

          
          {children}

          
          <ActivityFeed title={feedTitle} items={feedItems} {...includeWhenPresent("emptyTitle", emptyTitle)} {...includeWhenPresent("emptySubtitle", emptySubtitle)}/>
        </View>
      </ScrollView>
    </View>);
}

