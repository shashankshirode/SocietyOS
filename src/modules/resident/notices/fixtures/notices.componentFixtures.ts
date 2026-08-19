import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'notices-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.notices.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.notices.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'notices-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.notices.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.notices.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
