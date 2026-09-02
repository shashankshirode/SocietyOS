import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, View } from 'react-native';
import { SafeText } from '../../../shared/components/SafeText';
import { useAuthSession } from '../../../core/auth/useAuthSession';
import { useMessages } from '../../../shared/constants/useMessages';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { societyIdentityTokens } from '../../../shared/theme/societyTheme';
import { useSocietyExperience } from './SocietyExperienceContext';
import { createBackgroundStyle, createBorderStyle, createColorStyle, styles } from './styles/SocietyAmbientChrome.styles';

export type IdentityOrbProps = {
  imageUri?: string;
  loading?: boolean;
  offlineCached?: boolean;
};

export function resolveIdentityInitials(name?: string): string {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) return 'SO';
  if (parts.length === 1) return (parts[0]?.slice(0, 2) ?? 'SO').toUpperCase();
  return `${parts[0]?.[0] ?? ''}${parts[parts.length - 1]?.[0] ?? ''}`.toUpperCase();
}

export function IdentityOrb({ imageUri, loading = false, offlineCached = false }: IdentityOrbProps) {
  const theme = useAppTheme();
  const tokens = societyIdentityTokens[theme.dark ? 'dark' : 'light'];
  const messages = useMessages();
  const { session } = useAuthSession();
  const { openIdentityCenter } = useSocietyExperience();
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => setImageFailed(false), [imageUri]);
  const showImage = Boolean(imageUri && !imageFailed && !loading);

  return (
    <Pressable testID="resident-identity-orb" onPress={openIdentityCenter} accessibilityRole="button" accessibilityLabel={messages.resident.experience.ambient.openIdentityCenter} style={[styles.identityOrb, createBackgroundStyle(tokens.background), createBorderStyle(tokens.border)]}>
      {loading ? <ActivityIndicator size="small" color={tokens.foreground} /> : null}
      {showImage ? <Image source={{ uri: imageUri }} style={styles.identityImage} onError={() => setImageFailed(true)} accessibilityIgnoresInvertColors /> : null}
      {!loading && !showImage ? <SafeText variant="caption" style={[styles.identityInitials, createColorStyle(tokens.foreground)]}>{resolveIdentityInitials(session?.name)}</SafeText> : null}
      {offlineCached ? <View style={[styles.identityCached, createBackgroundStyle(tokens.cachedIndicator)]} /> : null}
    </Pressable>
  );
}
