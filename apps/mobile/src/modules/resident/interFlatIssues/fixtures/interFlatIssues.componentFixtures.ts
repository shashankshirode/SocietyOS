import type { ComponentFixture } from '../../../../shared/testing/componentFixture.types';

export const componentFixtures: ComponentFixture<JsonObject>[] = [
  {
    id: 'interFlatIssues-fixture-phone',
    titleMessageKey: 'resident.componentFixtures.interFlatIssues.phone.title',
    descriptionMessageKey: 'resident.componentFixtures.interFlatIssues.phone.desc',
    props: { id: 'test-1', label: 'Test Label' },
    viewport: 'phone',
    themeMode: 'light'
  },
  {
    id: 'interFlatIssues-fixture-tablet',
    titleMessageKey: 'resident.componentFixtures.interFlatIssues.tablet.title',
    descriptionMessageKey: 'resident.componentFixtures.interFlatIssues.tablet.desc',
    props: { id: 'test-2', label: 'Test Label Tablet' },
    viewport: 'tablet',
    themeMode: 'dark'
  }
];
