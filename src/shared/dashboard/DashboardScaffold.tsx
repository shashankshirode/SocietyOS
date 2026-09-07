import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { AppIconName } from "../icons/icon.types";
import type { AppImageKey } from "../media/appImages";
import { FeatureActionGrid } from "../components/FeatureActionGrid";
import { EmptyStatePanel } from "../components/EmptyStatePanel";
import { RoleHeroHeader } from "../components/RoleHeroHeader";
import { EntityListItem } from "../components/EntityListItem";
import { SafeText } from "../components/SafeText";
import { StaggeredList } from "../motion/StaggeredList";
import { useAppTheme } from "../theme/useAppTheme";
import { includeWhenPresent } from "../utils/presentProperty";
import { styles, createSafeAreaViewBackgroundColorStyle } from "./styles/DashboardScaffold.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../localization/activeUiLiteral";
export type EliteDashboardMetric = {
    id: string;
    label: string;
    value: string | number;
    detail?: string;
    icon?: AppIconName;
};
export type EliteDashboardAction = {
    id: string;
    label: string;
    description: string;
    icon: AppIconName;
    onPress: () => void;
    badge?: string;
};
export type EliteDashboardFeedItem = {
    id: string;
    title: string;
    subtitle: string;
    status?: string;
};
type DashboardScaffoldProps = {
    eyebrow: string;
    title: string;
    subtitle: string;
    heroImage: AppImageKey;
    heroIcon?: AppIconName;
    metrics: EliteDashboardMetric[];
    actions: EliteDashboardAction[];
    feedTitle: string;
    feedItems: EliteDashboardFeedItem[];
    emptyTitle?: string;
    emptyMessage?: string;
    testID?: string;
};
export function DashboardScaffold({ eyebrow, title, subtitle, heroImage, heroIcon, metrics, actions, feedTitle, feedItems, emptyTitle = getActiveUiLiteral("m_422ff9c6bd3e"), emptyMessage = getActiveUiLiteral("m_fd8632007fc0"), testID, }: DashboardScaffoldProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    return (<SafeAreaView style={[styles.safe, createSafeAreaViewBackgroundColorStyle(colors.background)]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} {...includeWhenPresent("testID", testID)}>
        <RoleHeroHeader title={title} subtitle={`${eyebrow} · ${subtitle}`} visual={heroImage} {...includeWhenPresent("icon", heroIcon)} metrics={metrics}/>

        <View style={styles.sectionHeader}>
          <SafeText variant="title">{localizedUiText.m_1810407f5ab7}</SafeText>
        </View>
        <FeatureActionGrid actions={actions.map((action) => ({
            id: action.id,
            title: action.label,
            description: action.description,
            icon: action.icon,
            onPress: action.onPress,
            ...includeWhenPresent("badge", action.badge)
        }))}/>

        <View style={styles.sectionHeader}>
          <SafeText variant="title">{feedTitle}</SafeText>
        </View>
        {feedItems.length === 0 ? (<EmptyStatePanel title={emptyTitle} description={emptyMessage}/>) : (<StaggeredList data={feedItems} keyExtractor={(item) => item.id} renderItem={(item) => (<EntityListItem title={item.title} subtitle={item.subtitle} {...includeWhenPresent("status", item.status)} icon="audit"/>)}/>)}
      </ScrollView>
    </SafeAreaView>);
}

