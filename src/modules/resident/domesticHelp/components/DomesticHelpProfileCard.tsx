import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusPill } from "../../../../shared/components/StatusPill";
import { SurfaceCard } from "../../../../shared/components/SurfaceCard";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import type { ResidentDomesticHelpProfile } from "../data/domesticHelp.types";
import { useMessages } from "../../../../shared/constants/useMessages";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createViewBackgroundColorStyle } from "../styles/components/DomesticHelpProfileCard.styles";
type DomesticHelpProfileCardProps = {
    profile: ResidentDomesticHelpProfile;
    onPress?: () => void;
};
export function DomesticHelpProfileCard({ profile, onPress }: DomesticHelpProfileCardProps) {
    const { colors } = useAppTheme();
    const messages = useMessages().resident.domesticHelp;
    const accessLabel = profile.accessStatus === 'active' ? messages.activeAccess : messages.suspendedAccess;
    return (<SurfaceCard {...includeWhenPresent("onPress", onPress)} testID={`domestic-help-${profile.id}`}>
      <View style={styles.row}>
        <View style={[styles.avatar, createViewBackgroundColorStyle(colors.primarySoft)]}>
          <SafeText variant="bodyStrong" color="info" align="center">{profile.photoInitials}</SafeText>
        </View>
        <View style={styles.copy}>
          <SafeText variant="title">{profile.name}</SafeText>
          <SafeText variant="caption" color="secondary">{profile.service}</SafeText>
          <SafeText variant="caption" color="muted">{profile.approvedSchedule}</SafeText>
        </View>
        <StatusPill label={accessLabel} tone={profile.accessStatus === 'active' ? 'success' : 'warning'}/>
      </View>
    </SurfaceCard>);
}

