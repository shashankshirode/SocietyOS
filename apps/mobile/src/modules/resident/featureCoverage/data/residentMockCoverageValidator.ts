import { screenScenarios as dashboardScenarios } from '../../dashboard/fixtures/dashboard.screenScenarios';
import { componentFixtures as dashboardFixtures } from '../../dashboard/fixtures/dashboard.componentFixtures';
import { screenScenarios as profileScenarios } from '../../profile/fixtures/profile.screenScenarios';
import { componentFixtures as profileFixtures } from '../../profile/fixtures/profile.componentFixtures';
import { screenScenarios as visitorsScenarios } from '../../visitors/fixtures/visitors.screenScenarios';
import { componentFixtures as visitorsFixtures } from '../../visitors/fixtures/visitors.componentFixtures';
import { screenScenarios as billingScenarios } from '../../billing/fixtures/billing.screenScenarios';
import { componentFixtures as billingFixtures } from '../../billing/fixtures/billing.componentFixtures';
import { screenScenarios as complaintsScenarios } from '../../complaints/fixtures/complaints.screenScenarios';
import { componentFixtures as complaintsFixtures } from '../../complaints/fixtures/complaints.componentFixtures';
import { screenScenarios as noticesScenarios } from '../../notices/fixtures/notices.screenScenarios';
import { componentFixtures as noticesFixtures } from '../../notices/fixtures/notices.componentFixtures';
import { screenScenarios as documentsScenarios } from '../../documents/fixtures/documents.screenScenarios';
import { componentFixtures as documentsFixtures } from '../../documents/fixtures/documents.componentFixtures';
import { screenScenarios as nocScenarios } from '../../noc/fixtures/noc.screenScenarios';
import { componentFixtures as nocFixtures } from '../../noc/fixtures/noc.componentFixtures';
import { screenScenarios as moveInMoveOutScenarios } from '../../moveInMoveOut/fixtures/moveInMoveOut.screenScenarios';
import { componentFixtures as moveInMoveOutFixtures } from '../../moveInMoveOut/fixtures/moveInMoveOut.componentFixtures';
import { screenScenarios as residentConnectScenarios } from '../../residentConnect/fixtures/residentConnect.screenScenarios';
import { componentFixtures as residentConnectFixtures } from '../../residentConnect/fixtures/residentConnect.componentFixtures';
import { screenScenarios as interFlatIssuesScenarios } from '../../interFlatIssues/fixtures/interFlatIssues.screenScenarios';
import { componentFixtures as interFlatIssuesFixtures } from '../../interFlatIssues/fixtures/interFlatIssues.componentFixtures';
import { screenScenarios as facilityBookingScenarios } from '../../facilityBooking/fixtures/facilityBooking.screenScenarios';
import { componentFixtures as facilityBookingFixtures } from '../../facilityBooking/fixtures/facilityBooking.componentFixtures';
import { screenScenarios as parkingScenarios } from '../../parking/fixtures/parking.screenScenarios';
import { componentFixtures as parkingFixtures } from '../../parking/fixtures/parking.componentFixtures';
import { screenScenarios as parcelHandoverScenarios } from '../../parcelHandover/fixtures/parcelHandover.screenScenarios';
import { componentFixtures as parcelHandoverFixtures } from '../../parcelHandover/fixtures/parcelHandover.componentFixtures';
import { screenScenarios as governanceScenarios } from '../../governance/fixtures/governance.screenScenarios';
import { componentFixtures as governanceFixtures } from '../../governance/fixtures/governance.componentFixtures';
import { screenScenarios as emergencyScenarios } from '../../emergency/fixtures/emergency.screenScenarios';
import { componentFixtures as emergencyFixtures } from '../../emergency/fixtures/emergency.componentFixtures';
import { screenScenarios as marketplaceScenarios } from '../../marketplace/fixtures/marketplace.screenScenarios';
import { componentFixtures as marketplaceFixtures } from '../../marketplace/fixtures/marketplace.componentFixtures';
import { screenScenarios as settingsScenarios } from '../../settings/fixtures/settings.screenScenarios';
import { componentFixtures as settingsFixtures } from '../../settings/fixtures/settings.componentFixtures';
import { screenScenarios as smartAssistanceScenarios } from '../../smartAssistance/fixtures/smartAssistance.screenScenarios';
import { componentFixtures as smartAssistanceFixtures } from '../../smartAssistance/fixtures/smartAssistance.componentFixtures';

export interface MockCoverageSummary {
  missingMockData: number;
  missingMockSource: number;
  missingScreenScenarios: number;
  missingComponentFixtures: number;
  missingLoadingScenario: number;
  missingEmptyScenario: number;
  missingErrorScenario: number;
  missingMutation: number;
  missingLongContentScenario: number;
  missingTabletScenario: number;
}

const mockRegistry = {
  dashboard: { scenarios: dashboardScenarios, fixtures: dashboardFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  profile: { scenarios: profileScenarios, fixtures: profileFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  visitors: { scenarios: visitorsScenarios, fixtures: visitorsFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  billing: { scenarios: billingScenarios, fixtures: billingFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  complaints: { scenarios: complaintsScenarios, fixtures: complaintsFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  notices: { scenarios: noticesScenarios, fixtures: noticesFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  documents: { scenarios: documentsScenarios, fixtures: documentsFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  noc: { scenarios: nocScenarios, fixtures: nocFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  moveInMoveOut: { scenarios: moveInMoveOutScenarios, fixtures: moveInMoveOutFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  residentConnect: { scenarios: residentConnectScenarios, fixtures: residentConnectFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  interFlatIssues: { scenarios: interFlatIssuesScenarios, fixtures: interFlatIssuesFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  facilityBooking: { scenarios: facilityBookingScenarios, fixtures: facilityBookingFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  parking: { scenarios: parkingScenarios, fixtures: parkingFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  parcelHandover: { scenarios: parcelHandoverScenarios, fixtures: parcelHandoverFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  governance: { scenarios: governanceScenarios, fixtures: governanceFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  emergency: { scenarios: emergencyScenarios, fixtures: emergencyFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  marketplace: { scenarios: marketplaceScenarios, fixtures: marketplaceFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  settings: { scenarios: settingsScenarios, fixtures: settingsFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true },
  smartAssistance: { scenarios: smartAssistanceScenarios, fixtures: smartAssistanceFixtures, hasData: true, hasSource: true, hasRepo: true, hasMutation: true }
};

export function validateResidentMockCoverage(): MockCoverageSummary {
  const summary: MockCoverageSummary = {
    missingMockData: 0,
    missingMockSource: 0,
    missingScreenScenarios: 0,
    missingComponentFixtures: 0,
    missingLoadingScenario: 0,
    missingEmptyScenario: 0,
    missingErrorScenario: 0,
    missingMutation: 0,
    missingLongContentScenario: 0,
    missingTabletScenario: 0
  };

  Object.entries(mockRegistry).forEach(([key, value]) => {
    if (!value.hasData) summary.missingMockData++;
    if (!value.hasSource) summary.missingMockSource++;
    if (!value.scenarios || value.scenarios.length === 0) summary.missingScreenScenarios++;
    if (!value.fixtures || value.fixtures.length === 0) summary.missingComponentFixtures++;
    if (!value.hasMutation) summary.missingMutation++;

    const kinds = value.scenarios.map(s => s.kind);
    if (!kinds.includes('loading')) summary.missingLoadingScenario++;
    if (!kinds.includes('empty')) summary.missingEmptyScenario++;
    if (!kinds.includes('error')) summary.missingErrorScenario++;
    if (!kinds.includes('longContent')) summary.missingLongContentScenario++;
    if (!kinds.includes('tablet')) summary.missingTabletScenario++;
  });

  return summary;
}
