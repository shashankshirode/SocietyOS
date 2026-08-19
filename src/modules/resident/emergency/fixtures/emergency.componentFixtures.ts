import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'emergency-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.emergency.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.emergency.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'emergency-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.emergency.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.emergency.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
