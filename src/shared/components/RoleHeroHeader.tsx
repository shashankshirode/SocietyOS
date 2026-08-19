import { View } from "react-native";
import type { AppIconName } from "../icons/icon.types";
import type { AppVisualKey } from "../media/appVisuals";
import { ImagePanel } from "../media/ImagePanel";
import { ResponsiveGrid } from "../layout/ResponsiveGrid";
import { Spacing } from "../theme/spacing";
import { InsightMetricTile } from "./InsightMetricTile";
import { includeWhenPresent } from "../utils/presentProperty";
import { styles } from "./styles/RoleHeroHeader.styles";
type RoleHeroHeaderProps = {
    title: string;
    subtitle: string;
    visual?: AppVisualKey;
    icon?: AppIconName;
    metrics?: {
        id: string;
        label: string;
        value: string | number;
        icon?: AppIconName;
    }[];
};
export function RoleHeroHeader({ title, subtitle, visual = 'residentHero', icon, metrics = [] }: RoleHeroHeaderProps) {
    return (<View style={styles.container}>
      <ImagePanel visual={visual} title={title} subtitle={subtitle} {...includeWhenPresent("icon", icon)}/>
      {metrics.length > 0 ? (<ResponsiveGrid columnsPhone={1} columnsTablet={2} columnsDesktop={3} gap={Spacing.md}>
          {metrics.map(({ id, ...metric }) => <InsightMetricTile key={id} {...metric}/>)}
        </ResponsiveGrid>) : null}
    </View>);
}

