import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { styles } from "../styles/components/HouseholdSectionHeader.styles";
type HouseholdSectionHeaderProps = {
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onActionPress?: () => void;
};
export function HouseholdSectionHeader({ title, subtitle, actionLabel, onActionPress }: HouseholdSectionHeaderProps) {
    return (<View style={styles.row}>
      <View style={styles.textWrap}>
        <SafeText variant="bodyStrong" color="primary">{title}</SafeText>
        {subtitle ? <SafeText variant="caption" color="secondary">{subtitle}</SafeText> : null}
      </View>
      {actionLabel ? (<SafeText variant="caption" color="primary" onPress={onActionPress} style={styles.safeTextTextDecorationLine}>
          {actionLabel}
        </SafeText>) : null}
    </View>);
}

