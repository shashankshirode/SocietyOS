import type Ionicons from '@expo/vector-icons/Ionicons';
import type { RootTabParamList } from '../../../app/navigation/navigation.types';

export type ResidentTabRoute = keyof RootTabParamList;
export type ResidentPrimaryTabRoute = 'HomeTab' | 'ActivityTab' | 'CommunityTab' | 'ServicesTab';
type IconName = keyof typeof Ionicons.glyphMap;

export const residentPrimaryTabRoutes: readonly ResidentPrimaryTabRoute[] = [
  'HomeTab',
  'ActivityTab',
  'CommunityTab',
  'ServicesTab',
];

export const residentTabIcons: Record<ResidentTabRoute, { filled: IconName; outline: IconName }> = {
  HomeTab: { filled: 'home', outline: 'home-outline' },
  ActivityTab: { filled: 'pulse', outline: 'pulse-outline' },
  CommunityTab: { filled: 'people-circle', outline: 'people-circle-outline' },
  ServicesTab: { filled: 'grid', outline: 'grid-outline' },
  VisitorTab: { filled: 'shield-checkmark', outline: 'shield-checkmark-outline' },
  ComplaintTab: { filled: 'construct', outline: 'construct-outline' },
  BillTab: { filled: 'wallet', outline: 'wallet-outline' },
  ChatTab: { filled: 'chatbubbles', outline: 'chatbubbles-outline' },
};

export const isResidentPrimaryTabRoute = (route: string): route is ResidentPrimaryTabRoute =>
  residentPrimaryTabRoutes.includes(route as ResidentPrimaryTabRoute);
