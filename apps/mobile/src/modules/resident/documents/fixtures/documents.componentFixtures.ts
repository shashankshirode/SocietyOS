import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'documents-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.documents.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.documents.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'documents-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.documents.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.documents.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
