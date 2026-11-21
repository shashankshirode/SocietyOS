import { Text, View } from "react-native";
import { AppButton } from "../../../../shared/components/AppButton";
import { ResidentDisplayName } from "../../../../ui/typography/ResidentDisplayName";
import { styles } from "../styles/components/ServiceMarketplacePanel.styles";
export type ServiceMarketplacePanelRow = {
    id: string;
    title: string;
    detail: string;
    meta: string;
};
type Props = {
    rows: ServiceMarketplacePanelRow[];
    actionLabel: string;
    onAction: () => void;
    actionMessage: string | null;
};
export function ServiceMarketplacePanel({ rows, actionLabel, onAction, actionMessage }: Props) {
    return (<View style={styles.container}>
      {rows.map((row) => (<View key={row.id} style={styles.card}>
          <ResidentDisplayName displayName={row.title} style={styles.title}/>
          <Text style={styles.detail}>{row.detail}</Text>
          <Text style={styles.meta}>{row.meta}</Text>
        </View>))}
      <AppButton title={actionLabel} onPress={onAction} fullWidth/>
      {actionMessage ? <Text style={styles.success}>{actionMessage}</Text> : null}
    </View>);
}

