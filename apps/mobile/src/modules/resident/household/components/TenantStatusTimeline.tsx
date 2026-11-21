import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusBadge } from "../../../../shared/components/StatusBadge";
import { useMessages } from "../../../../shared/constants/useMessages";
import type { TenantStatusTimelineItem } from "../data/residentHousehold.types";
import { t } from "./householdComponentUtils";
import { formatDateTime } from "../../../../shared/utils/formatters";
import { styles } from "../styles/components/TenantStatusTimeline.styles";
type TenantStatusTimelineProps = {
    timeline: TenantStatusTimelineItem[];
};
export function TenantStatusTimeline({ timeline }: TenantStatusTimelineProps) {
    const messages = useMessages();
    return (<View style={styles.container}>
      <SafeText variant="bodyStrong" color="primary">{t(messages, 'resident.tenant.status.timelineTitle')}</SafeText>
      {timeline.map((item, index) => (<View key={`${item.status}-${item.occurredAt}-${index}`} style={styles.row}>
          <View style={styles.line}/>
          <View style={styles.content}>
            <StatusBadge label={t(messages, `resident.tenant.status.labels.${item.status}`)} type={item.status === 'BLOCKED' ? 'danger' : 'info'}/>
            <SafeText variant="tiny" color="muted">{formatDateTime(item.occurredAt)}</SafeText>
            <SafeText variant="caption" color="primary">{t(messages, item.nextActionKey)}</SafeText>
            {item.blockingReasonKey ? (<SafeText variant="tiny" color="danger">{t(messages, item.blockingReasonKey)}</SafeText>) : null}
          </View>
        </View>))}
    </View>);
}

