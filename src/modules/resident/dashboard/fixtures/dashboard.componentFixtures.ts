import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'dashboard-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.dashboard.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.dashboard.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'dashboard-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.dashboard.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.dashboard.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
