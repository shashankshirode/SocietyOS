import { View, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusPill } from "../../../../shared/components/StatusPill";
import { SurfaceCard } from "../../../../shared/components/SurfaceCard";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import type { ResidentDomesticHelpProfile } from "../data/domesticHelp.types";
import { useMessages } from "../../../../shared/constants/useMessages";
import { imageAssets } from "../../../../shared/theme/imageAssets";
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
    const isInside = profile.accessStatus === 'active';
    const avatarUrl = profile.service.toLowerCase().includes('cook')
      ? imageAssets.avatars.cook
      : profile.service.toLowerCase().includes('driver')
      ? imageAssets.avatars.driver
      : imageAssets.avatars.maid;

    return (
      <SurfaceCard {...includeWhenPresent("onPress", onPress)} testID={`domestic-help-${profile.id}`}>
        <View style={styles.row}>
          <View style={{ position: 'relative' }}>
            <Image source={{ uri: avatarUrl }} style={{ width: 46, height: 46, borderRadius: 23 }} />
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: isInside ? colors.success : colors.textSecondary,
                borderWidth: 2,
                borderColor: '#FFF',
              }}
            />
          </View>
          <View style={styles.copy}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <SafeText variant="title">{profile.name}</SafeText>
              <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
            </View>
            <SafeText variant="caption" color="secondary">
              {profile.service} • ⭐ 4.8 (12 reviews)
            </SafeText>
            <SafeText variant="caption" color="muted">
              {isInside ? '🟢 Inside Society (Tower B Gate)' : '⚪ Currently Outside'}
            </SafeText>
          </View>
          <StatusPill label={accessLabel} tone={profile.accessStatus === 'active' ? 'success' : 'warning'}/>
        </View>
      </SurfaceCard>
    );
}


