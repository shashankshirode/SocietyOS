import { View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { SocietyReturnControl } from "../../../modules/resident/experience/EdgeReturn";
import { residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import { styles } from "../styles/components/ResidenceAccessPageHeader.styles";

interface ResidenceAccessPageHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly onBack: () => void;
}

export function ResidenceAccessPageHeader({ title, subtitle, onBack }: ResidenceAccessPageHeaderProps) {
  return (
    <View style={styles.header}>
      <SocietyReturnControl
        onPress={onBack}
        accessibilityLabel={residenceAccessMessages.common.back}
      />
      <View style={styles.title}>
        <AppText variant="h2" weight="800">
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="bodySmall" tone="secondary">
            {subtitle}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

