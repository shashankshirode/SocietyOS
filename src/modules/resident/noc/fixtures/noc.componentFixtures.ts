import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'noc-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.noc.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.noc.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'noc-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.noc.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.noc.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
