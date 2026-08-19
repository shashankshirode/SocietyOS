import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppBottomSheet } from "../../../../ui/bottomSheet";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import type { ActivityModule, HomeActivityItem } from "../data/dashboard.types";
import { styles, createPressableBackgroundColorStyle, createPressableBackgroundColorBorderColorOpacityStyle, createViewBackgroundColorStyle } from "../styles/components/ActivityOverviewSheet.styles";
const moduleIcons: Record<ActivityModule, keyof typeof Ionicons.glyphMap> = {
    visitor: 'people-outline',
    billing: 'receipt-outline',
    complaint: 'chatbox-ellipses-outline',
    notice: 'megaphone-outline',
    document: 'folder-open-outline',
    facility: 'calendar-outline',
    emergency: 'alert-circle-outline',
    residentConnect: 'chatbubbles-outline',
};
type ActivityOverviewSheetProps = {
    visible: boolean;
    title: string;
    closeLabel: string;
    activities: HomeActivityItem[];
    onClose: () => void;
    onActivityPress: (id: string) => void;
};
export function ActivityOverviewSheet({ visible, title, closeLabel, activities, onClose, onActivityPress, }: ActivityOverviewSheetProps) {
    const { colors } = useAppTheme();
    return (<AppBottomSheet visible={visible} onClose={onClose} testID="activity-overview-sheet" header={(<View style={styles.header}>
          <SafeText variant="title" color="primary" style={styles.headerTitle}>{title}</SafeText>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel={closeLabel} style={[styles.closeButton, createPressableBackgroundColorStyle(colors.surfaceMuted)]}>
            <Ionicons name="close" size={20} color={colors.textPrimary}/>
          </Pressable>
        </View>)}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activities.map((activity, index) => (<React.Fragment key={activity.id}>
            {activity.dateGroupLabel !== activities[index - 1]?.dateGroupLabel ? (<SafeText variant="tiny" color="muted" style={styles.dateGroup}>
                {activity.dateGroupLabel}
              </SafeText>) : null}
            <Pressable accessibilityRole="button" onPress={() => {
                onClose();
                onActivityPress(activity.id);
            }} style={({ pressed }) => [
                styles.row,
                createPressableBackgroundColorBorderColorOpacityStyle(colors.surface, colors.border, pressed ? 0.82 : 1),
            ]}>
              <View style={[styles.icon, createViewBackgroundColorStyle(colors.surfaceElevated)]}> 
                <Ionicons name={moduleIcons[activity.module]} size={18} color={colors.primary}/>
              </View>
              <View style={styles.copy}>
                <SafeText variant="caption" color="primary">{activity.title}</SafeText>
                <SafeText variant="tiny" color="secondary">{activity.description}</SafeText>
                <SafeText variant="tiny" color="muted">{activity.timestampLabel}</SafeText>
              </View>
            </Pressable>
          </React.Fragment>))}
      </ScrollView>
    </AppBottomSheet>);
}

