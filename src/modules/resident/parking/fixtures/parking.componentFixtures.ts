import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'parking-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.parking.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.parking.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'parking-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.parking.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.parking.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
