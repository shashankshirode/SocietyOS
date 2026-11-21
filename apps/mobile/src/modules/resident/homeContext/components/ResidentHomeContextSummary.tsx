import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { ResidentHomeContextCard } from "./ResidentHomeContextCard";
import type { ResidentHomeContext } from "../data/residentHomeContext.types";
import { styles, createSafeTextColorStyle } from "../styles/components/ResidentHomeContextSummary.styles";
import { useMessages } from "../../../../shared/constants/useMessages";
export function ResidentHomeContextSummary({ contexts, activeHomeContextId, switchingHomeContextId, onSelectContext, }: {
    contexts: ResidentHomeContext[];
    activeHomeContextId: string;
    switchingHomeContextId: string | null;
    onSelectContext: (ctx: ResidentHomeContext) => void;
}) {
    const { colors } = useAppTheme();
    const copy = useMessages().resident.homeContext;
    const ordered = [...contexts].sort((left, right) => Number(right.homeContextId === activeHomeContextId) - Number(left.homeContextId === activeHomeContextId));
    return (<View style={styles.container}>
      <SafeText variant="tiny" style={[styles.societyTitle, createSafeTextColorStyle(colors.success)]}>{copy.currentHome}</SafeText>
      {ordered.map((ctx, index) => (<View key={ctx.homeContextId} style={index === 1 ? styles.otherHomesStart : undefined}>
          {index === 1 ? <SafeText variant="tiny" style={[styles.otherHomesLabel, createSafeTextColorStyle(colors.textMuted)]}>{copy.otherHomes}</SafeText> : null}
          <ResidentHomeContextCard context={ctx} isActive={activeHomeContextId === ctx.homeContextId} isSwitching={switchingHomeContextId === ctx.homeContextId} isInteractionDisabled={switchingHomeContextId !== null && switchingHomeContextId !== ctx.homeContextId} onPress={() => onSelectContext(ctx)}/>
        </View>))}
    </View>);
}
export default ResidentHomeContextSummary;
