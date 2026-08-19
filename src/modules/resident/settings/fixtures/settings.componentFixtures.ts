import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'settings-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.settings.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.settings.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'settings-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.settings.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.settings.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
