import { Text, View, ScrollView } from "react-native";
import { useFacilityInspection } from "../../data/useFacilityInspection";
import { StatusBadge } from "../../../../../shared/components/StatusBadge";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { formatResidentDateTime } from "../../../../../core/localization/dateTimeFormatters";
import { styles } from "../../styles/screens/interFlat_screens/FacilityInspectionDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function FacilityInspectionDetailScreen({ route }: InterFlatScreenProps<'FacilityInspectionDetail'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { inspectionId } = route.params;
    const { data, isLoading } = useFacilityInspection(inspectionId);
    if (isLoading || !data) {
        return (<View style={styles.loading}>
        <Text style={styles.loadingText}>{localizedUiText.m_1d7daf57a6b7}</Text>
      </View>);
    }
    const insp = data;
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.title}>{insp.inspectionNumber}</Text>
        <StatusBadge status={insp.status} moduleType="noc"/>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>{localizedUiText.m_f2c830444f4f}</Text>
        <Text style={styles.value}>{insp.issueNumber}</Text>

        <Text style={styles.label}>{localizedUiText.m_d42f656fd09b}</Text>
        <Text style={styles.value}>{insp.assignedToName}</Text>

        <Text style={styles.label}>{localizedUiText.m_b89a7d74935d}</Text>
        <Text style={styles.value}>{formatResidentDateTime(insp.scheduledTime)}</Text>

        {insp.findings && (<>
            <Text style={styles.label}>{localizedUiText.m_775e0a62f523}</Text>
            <Text style={styles.value}>{insp.findings}</Text>

            <Text style={styles.label}>{localizedUiText.m_8a81ead63306}</Text>
            <Text style={styles.value}>{insp.rootCause}</Text>

            <Text style={styles.label}>{localizedUiText.m_376e8588b98f}</Text>
            <Text style={styles.value}>{insp.recommendedAction}</Text>
          </>)}
      </View>

    </ScrollView>);
}

