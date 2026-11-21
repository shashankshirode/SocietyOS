import type { ResidentRouteConfig } from './residentNavigation.types';
import { MarketplaceHomeScreen } from '../marketplace/screens/MarketplaceHomeScreen';
import { CommunityHomeScreen } from '../../community/screens/CommunityHomeScreen';
import { ComplaintListScreen } from '../complaints/screens/ComplaintListScreen';
import { BillListScreen } from '../billing/screens/BillListScreen';
import { ResidentProfileScreen } from '../profile/screens/ResidentProfileScreen';
import { VisitorListScreen } from '../visitors/screens/VisitorListScreen';
import { ResidentHomeScreen } from '../dashboard/screens/ResidentHomeScreen';

export const residentRoutes: ResidentRouteConfig[] = [
  {
    name: 'ResidentHome',
    component: ResidentHomeScreen as never,
    titleKey: 'resident.navigation.home.title',
    subtitleKey: 'resident.navigation.home.subtitle',
    headerVariant: 'dashboard',
    showBackButton: false,
  },
  {
    name: 'VisitorList',
    component: VisitorListScreen as never,
    titleKey: 'resident.navigation.visitors.title',
    subtitleKey: 'resident.navigation.visitors.subtitle',
    headerVariant: 'list',
    showBackButton: true,
  },
  {
    name: 'ComplaintList',
    component: ComplaintListScreen as never,
    titleKey: 'resident.navigation.complaints.title',
    subtitleKey: 'resident.navigation.complaints.subtitle',
    headerVariant: 'list',
    showBackButton: true,
  },
  {
    name: 'BillList',
    component: BillListScreen as never,
    titleKey: 'resident.navigation.bills.title',
    subtitleKey: 'resident.navigation.bills.subtitle',
    headerVariant: 'list',
    showBackButton: true,
  },
  {
    name: 'ProfileHome',
    component: ResidentProfileScreen as never,
    titleKey: 'resident.navigation.profile.title',
    subtitleKey: 'resident.navigation.profile.subtitle',
    headerVariant: 'list',
    showBackButton: true,
  },
  {
    name: 'MarketplaceHome',
    component: MarketplaceHomeScreen as never,
    titleKey: 'resident.navigation.marketplace.title',
    subtitleKey: 'resident.navigation.marketplace.subtitle',
    headerVariant: 'marketplace',
    showBackButton: true,
  },
  {
    name: 'CommunityHome',
    component: CommunityHomeScreen as never,
    titleKey: 'resident.navigation.communityHub.title',
    subtitleKey: 'resident.navigation.communityHub.subtitle',
    headerVariant: 'community',
    showBackButton: true,
  },
];
