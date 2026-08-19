import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import { t } from "../../household/components/householdComponentUtils";
import type { VisitorExitPolicy } from "../data/visitorExitPolicy.types";
import { addMinutesToIso } from "../utils/visitorExitPolicyResolver";
import { formatVisitorExitTime } from "./visitorExitFormatters";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createViewBackgroundColorBorderColorStyle } from "../styles/components/VisitorExpectedExitSelector.styles";
export interface VisitorExpectedExitSelectorProps {
    expectedEntryAtIso: string;
    selectedExpectedExitAtIso?: string;
    policy: VisitorExitPolicy;
    onSelectExpectedExit: (expectedExitAtIso: string) => void;
    error?: string;
}
const durationOptions = [30, 60, 120, 180, 240, 480] as const;
export function VisitorExpectedExitSelector({ expectedEntryAtIso, selectedExpectedExitAtIso, policy, onSelectExpectedExit, error, }: VisitorExpectedExitSelectorProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const defaultExitIso = addMinutesToIso(expectedEntryAtIso, policy.defaultExpectedDurationMinutes);
    const currentExitIso = selectedExpectedExitAtIso ?? defaultExitIso;
    return (<View style={styles.container}>
      <View style={styles.header}>
        <SafeText variant="caption" style={createSafeTextColorStyle(theme.textSecondary)}>
          {t(messages, 'visitor.exitAssurance.expectedExitTime')}
        </SafeText>
        <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(theme.textPrimary)}>
          {formatVisitorExitTime(currentExitIso)}
        </SafeText>
      </View>
      {policy.residentCanOverrideExitTime || policy.expectedExitSelectionRequired ? (<WrapRow gap={8}>
          {durationOptions.map((minutes) => {
                const optionIso = addMinutesToIso(expectedEntryAtIso, minutes);
                const selected = optionIso === currentExitIso;
                return (<PressableScale key={minutes} onPress={() => onSelectExpectedExit(optionIso)}>
                <View style={[
                        styles.chip,
                        createViewBackgroundColorBorderColorStyle(selected ? theme.accent : theme.surface, selected ? 'transparent' : theme.border),
                    ]}>
                  <SafeText variant="tiny" style={createSafeTextColorStyle3(selected ? '#FFFFFF' : theme.textPrimary)}>
                    {t(messages, 'visitor.exitAssurance.minutesLabel', minutes)}
                  </SafeText>
                </View>
              </PressableScale>);
            })}
        </WrapRow>) : null}
      {error ? (<SafeText variant="tiny" style={createSafeTextColorStyle4(theme.danger)}>
          {error}
        </SafeText>) : null}
    </View>);
}

