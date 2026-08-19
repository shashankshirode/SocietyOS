import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'facilityBooking-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.facilityBooking.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.facilityBooking.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'facilityBooking-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.facilityBooking.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.facilityBooking.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
