import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'complaints-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.complaints.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.complaints.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'complaints-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.complaints.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.complaints.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
