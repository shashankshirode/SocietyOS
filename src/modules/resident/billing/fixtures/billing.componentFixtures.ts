import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'billing-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.billing.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.billing.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'billing-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.billing.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.billing.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
