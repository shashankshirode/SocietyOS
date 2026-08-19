import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'parcelHandover-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.parcelHandover.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.parcelHandover.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'parcelHandover-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.parcelHandover.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.parcelHandover.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
