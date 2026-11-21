import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'smartAssistance-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.smartAssistance.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.smartAssistance.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'smartAssistance-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.smartAssistance.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.smartAssistance.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
