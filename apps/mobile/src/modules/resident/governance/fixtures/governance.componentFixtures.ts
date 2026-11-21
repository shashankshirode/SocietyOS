import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'governance-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.governance.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.governance.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'governance-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.governance.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.governance.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
