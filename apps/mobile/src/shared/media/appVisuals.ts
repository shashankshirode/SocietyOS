import { appImages } from './appImages';
import type { AppImageKey } from './appImages';
import { gradients } from '../theme/gradients';
import type { RoleThemeKey } from '../theme/roleTheme';

export type AppVisualKey =
  | AppImageKey
  | 'documentVault'
  | 'emergencyHome'
  | 'marketplaceHome'
  | 'facilityBookingHome'
  | 'reportsHome'
  | 'hardwareIntegrationHome'
  | 'smartAutomationHome';

export const appVisuals: Record<AppVisualKey, { image?: typeof appImages.residentHero; gradient: readonly string[]; role?: RoleThemeKey }> = {
  residentHero: { image: appImages.residentHero, gradient: gradients.resident, role: 'resident' },
  guardHero: { image: appImages.guardHero, gradient: gradients.guard, role: 'guard' },
  adminHero: { image: appImages.adminHero, gradient: gradients.admin, role: 'admin' },
  treasurerHero: { image: appImages.treasurerHero, gradient: gradients.treasurer, role: 'treasurer' },
  facilityHero: { image: appImages.facilityHero, gradient: gradients.facility, role: 'facility' },
  superAdminHero: { image: appImages.superAdminHero, gradient: gradients.superAdmin, role: 'superAdmin' },
  emptyState: { image: appImages.emptyState, gradient: gradients.grey },
  documents: { image: appImages.documents, gradient: gradients.primary },
  community: { image: appImages.community, gradient: gradients.secondary },
  documentVault: { image: appImages.documents, gradient: gradients.primary },
  emergencyHome: { gradient: gradients.danger },
  marketplaceHome: { image: appImages.community, gradient: gradients.secondary },
  facilityBookingHome: { image: appImages.facilityHero, gradient: gradients.facility },
  reportsHome: { gradient: gradients.info },
  hardwareIntegrationHome: { gradient: gradients.dark },
  smartAutomationHome: { gradient: gradients.primary },
};
