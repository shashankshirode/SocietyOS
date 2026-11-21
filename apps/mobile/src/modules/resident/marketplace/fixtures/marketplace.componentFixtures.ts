import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'marketplace-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.marketplace.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.marketplace.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'marketplace-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.marketplace.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.marketplace.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
