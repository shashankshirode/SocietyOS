import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'residentConnect-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.residentConnect.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.residentConnect.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'residentConnect-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.residentConnect.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.residentConnect.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
