import React from 'react';
import type { MessageKey, ResidentHeaderVariant } from './residentHeader.types';

export type ResidentRouteName = string;

export type ResidentFeatureFlag = 'visitorManagement' | 'complaints' | 'maintenanceBilling';
export type ResidentPermission = 'VISITOR_VIEW' | 'COMPLAINT_VIEW' | 'BILL_VIEW';

export type ResidentScreenComponent = React.ComponentType<{
  navigation: { navigate: (screen: string) => void; goBack: () => void };
  route: { params?: Record<string, never> };
}>;

export type ResidentRouteConfig<RouteName extends ResidentRouteName = ResidentRouteName> = {
  name: RouteName;
  component: ResidentScreenComponent;
  titleKey: MessageKey;
  subtitleKey?: MessageKey;
  headerVariant: ResidentHeaderVariant;
  showBackButton: boolean;
  featureFlag?: ResidentFeatureFlag;
  permission?: ResidentPermission;
};
