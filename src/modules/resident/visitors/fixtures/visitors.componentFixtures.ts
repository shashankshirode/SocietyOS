import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'visitors-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.visitors.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.visitors.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'visitors-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.visitors.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.visitors.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
