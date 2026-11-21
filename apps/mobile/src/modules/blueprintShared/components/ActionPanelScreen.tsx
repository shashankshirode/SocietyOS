import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { AppButton } from "../../../shared/components/AppButton";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/components/ActionPanelScreen.styles";
export type ActionPanelRow = {
    id: string;
    title: string;
    subtitle: string;
    status?: string;
    metric?: string;
};
type ActionPanelScreenProps = {
    title: string;
    subtitle: string;
    rows: ActionPanelRow[];
    actionTitle: string;
    actionMessage: string | null;
    onAction: () => void;
    onBack?: () => void;
};
export function ActionPanelScreen({ title, subtitle, rows, actionTitle, actionMessage, onAction, onBack }: ActionPanelScreenProps) {
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ResponsivePageHeader title={title} subtitle={subtitle} {...includeWhenPresent("onBack", onBack)}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          {rows.map((row) => (<View key={row.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{row.title}</Text>
                {row.status ? <StatusBadge status={row.status} moduleType="platform"/> : null}
              </View>
              <Text style={styles.subtitle}>{row.subtitle}</Text>
              {row.metric ? <Text style={styles.metric}>{row.metric}</Text> : null}
            </View>))}
          <AppButton title={actionTitle} onPress={onAction} fullWidth/>
          {actionMessage ? <Text style={styles.success}>{actionMessage}</Text> : null}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

