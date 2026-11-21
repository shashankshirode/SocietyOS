import { View } from "react-native";
import { SafeText } from "../../shared/components/SafeText";
import { useMessages } from "../../shared/constants/useMessages";
import { t } from "../../modules/resident/household/components/householdComponentUtils";
import type { PrerequisiteCheck } from "../../shared/prerequisites";
import { PrerequisiteStepCard } from "./PrerequisiteStepCard";
import { styles } from "./styles/PrerequisiteChecklist.styles";
export interface PrerequisiteChecklistProps {
    checks: PrerequisiteCheck[];
    titleMessageKey?: string;
}
export function PrerequisiteChecklist({ checks, titleMessageKey = 'resident.prerequisites.checklistTitle', }: PrerequisiteChecklistProps) {
    const messages = useMessages();
    return (<View style={styles.container} testID="prerequisite-checklist">
      <SafeText variant="title" color="primary" numberOfLines={2}>
        {t(messages, titleMessageKey)}
      </SafeText>
      <View style={styles.list}>
        {checks.map((check) => (<PrerequisiteStepCard key={check.id} check={check}/>))}
      </View>
    </View>);
}

