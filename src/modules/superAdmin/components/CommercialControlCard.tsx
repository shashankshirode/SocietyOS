import { Text, View } from "react-native";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { HiddenCommercialControl } from "../../../shared/types/platformCommercial.types";
import { styles } from "../styles/components/CommercialControlCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface CommercialControlCardProps {
    control: HiddenCommercialControl;
    onPress: () => void;
}
export function CommercialControlCard({ control, onPress }: CommercialControlCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{control.societyName}</Text>
        <StatusBadge status={control.subscriptionStatus} moduleType="platform"/>
      </View>

      <View style={styles.grid}>
        <View style={styles.col}>
          <Text style={styles.label}>{localizedUiText.m_fa8ed0bdabdd}</Text>
          <StatusBadge status={control.planCode} moduleType="platform" style={styles.badge}/>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>{localizedUiText.m_90c29fed578a}</Text>
          <StatusBadge status={control.billingMode} moduleType="platform" style={styles.badge}/>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>{localizedUiText.m_6ef6845e6947}</Text>
          <Text style={styles.value}>{control.freeLaunchStatus ? localizedUiText.m_85a39ab345d6 : localizedUiText.m_1ea442a134b2}</Text>
        </View>
      </View>

      {control.commercialNotes && (<View style={styles.notesBox}>
          <Text style={styles.notesText} numberOfLines={2}>{localizedUiText.m_1150f05446e4}{control.commercialNotes}
          </Text>
        </View>)}
    </AppCard>);
}

