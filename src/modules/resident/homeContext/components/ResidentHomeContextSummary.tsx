import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { ResidentHomeContextCard } from "./ResidentHomeContextCard";
import type { ResidentHomeContext } from "../data/residentHomeContext.types";
import { styles, createSafeTextColorStyle } from "../styles/components/ResidentHomeContextSummary.styles";
export function ResidentHomeContextSummary({ contexts, activeHomeContextId, switchingHomeContextId, onSelectContext, }: {
    contexts: ResidentHomeContext[];
    activeHomeContextId: string;
    switchingHomeContextId: string | null;
    onSelectContext: (ctx: ResidentHomeContext) => void;
}) {
    const { colors } = useAppTheme();
    const grouped = contexts.reduce<Record<string, {
        name: string;
        items: ResidentHomeContext[];
    }>>((acc, item) => {
        const group = acc[item.societyId] ?? { name: item.societyName, items: [] };
        group.items.push(item);
        acc[item.societyId] = group;
        return acc;
    }, {});
    return (<View style={styles.container}>
      {Object.entries(grouped).map(([societyId, group]) => (<View key={societyId} style={styles.group}>
          <SafeText variant="bodyStrong" style={[styles.societyTitle, createSafeTextColorStyle(colors.textSecondary)]}>
            {group.name}
          </SafeText>
          {group.items.map((ctx) => (<ResidentHomeContextCard key={ctx.homeContextId} context={ctx} isActive={activeHomeContextId === ctx.homeContextId} isSwitching={switchingHomeContextId === ctx.homeContextId} isInteractionDisabled={switchingHomeContextId !== null && switchingHomeContextId !== ctx.homeContextId} onPress={() => onSelectContext(ctx)}/>))}
        </View>))}
    </View>);
}
export default ResidentHomeContextSummary;

