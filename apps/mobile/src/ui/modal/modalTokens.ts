
import { Radius } from '../../shared/theme/radius';
import { Spacing } from '../../shared/theme/spacing';

export const modalTokens = {
  borderRadius: Radius.xl,
  padding: Spacing.xl,
  headerPadding: Spacing.lg,
  footerPadding: Spacing.lg,
  maxWidthPhone: '100%' as const,
  maxWidthTablet: 480,
  animationDuration: 250,
  closeAnimationDuration: 200,
  backdropOpacity: 0.5,
  dragHandleWidth: 40,
  dragHandleHeight: 4,
  iconSize: 48,
} as const;
