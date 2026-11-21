import { Text, View } from "react-native";
import { AppBadge } from "../../../shared/components/AppBadge";
import { AppCard } from "../../../shared/cards/AppCard";
import { UserAvatar } from "../../../shared/components/UserAvatar";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { styles, createTextColorStyle, createTextColorStyle2, createTextColorStyle3 } from "../styles/components/ProfileHeaderCard.styles";
type ProfileHeaderCardProps = {
    name: string;
    roleLabel: string;
    subtitle: string;
    meta?: string;
};
export function ProfileHeaderCard({ name, roleLabel, subtitle, meta, }: ProfileHeaderCardProps) {
    const { colors } = useAppTheme();
    return (<AppCard style={styles.card}>
      <View style={styles.row}>
        <UserAvatar name={name} size={64}/>
        <View style={styles.content}>
          <Text style={[styles.name, createTextColorStyle(colors.textPrimary)]}>{name}</Text>
          <Text style={[styles.subtitle, createTextColorStyle2(colors.textSecondary)]}>{subtitle}</Text>
          {meta ? <Text style={[styles.meta, createTextColorStyle3(colors.textMuted)]}>{meta}</Text> : null}
          <AppBadge label={roleLabel} tone="primary" style={styles.badge}/>
        </View>
      </View>
    </AppCard>);
}
export default ProfileHeaderCard;

