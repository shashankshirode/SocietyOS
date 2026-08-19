import { residentNavigationConfig } from '../residentNavigationConfig';
import { enMessages } from '../../../../messages/en';

function collectStringPaths<Value>(value: Value, prefix = '', paths = new Set<string>()): Set<string> {
  if (value === null || typeof value !== 'object') return paths;
  Object.entries(value).forEach(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof child === 'string') {
      paths.add(path);
    } else if (child !== null && typeof child === 'object') {
      collectStringPaths(child, path, paths);
    }
  });
  return paths;
}

describe('residentNavigationConfig', () => {
  it('defines config for home, visitors, complaints, bills, profile, marketplace, and community', () => {
    const routeNames = ['ResidentHome', 'VisitorList', 'ComplaintList', 'BillList', 'ProfileHome', 'MarketplaceHome', 'CommunityHome'];
    routeNames.forEach((name) => {
      const config = residentNavigationConfig.getRouteConfig(name);
      expect(config).toBeDefined();
      expect(config?.titleKey).toBeDefined();
    });
  });

  it('verifies that all navigation titleKey and subtitleKey point to valid message keys', () => {
    const stringMessagePaths = collectStringPaths(enMessages);
    residentNavigationConfig.routes.forEach((route) => {
      expect(stringMessagePaths.has(route.titleKey)).toBe(true);

      if (route.subtitleKey) {
        expect(stringMessagePaths.has(route.subtitleKey)).toBe(true);
      }
    });
  });

  it('verifies back accessibility label exists in english messages', () => {
    expect(enMessages.accessibility.navigation.goBack).toBe('Go back');
  });
});
