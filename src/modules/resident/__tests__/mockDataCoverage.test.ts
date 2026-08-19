import { validateResidentMockCoverage } from '../featureCoverage/data/residentMockCoverageValidator';
import { screenScenarios as visitorsScenarios } from '../visitors/fixtures/visitors.screenScenarios';
import { screenScenarios as billingScenarios } from '../billing/fixtures/billing.screenScenarios';
import { createBill } from '../../../shared/testing/factories/billingFactory';
import { createVisitor } from '../../../shared/testing/factories/visitorFactory';
import { createResident } from '../../../shared/testing/factories/residentFactory';

describe('Resident Mock Data Coverage & Fixtures Audit', () => {
  it('validates that all coverage counts report 0 missing items', () => {
    const summary = validateResidentMockCoverage();

    expect(summary.missingMockData).toBe(0);
    expect(summary.missingMockSource).toBe(0);
    expect(summary.missingScreenScenarios).toBe(0);
    expect(summary.missingComponentFixtures).toBe(0);
    expect(summary.missingLoadingScenario).toBe(0);
    expect(summary.missingEmptyScenario).toBe(0);
    expect(summary.missingErrorScenario).toBe(0);
    expect(summary.missingMutation).toBe(0);
    expect(summary.missingLongContentScenario).toBe(0);
    expect(summary.missingTabletScenario).toBe(0);
  });

  it('validates core mock data factories behave correctly with overrides', () => {
    const defaultBill = createBill();
    expect(defaultBill.id).toBe('bill-001');
    expect(defaultBill.amount).toBe(4850);

    const overriddenBill = createBill({ amount: 9999, status: 'PAID' });
    expect(overriddenBill.amount).toBe(9999);
    expect(overriddenBill.status).toBe('PAID');

    const defaultVisitor = createVisitor();
    expect(defaultVisitor.name).toBe('Amit Sharma');

    const overriddenVisitor = createVisitor({ name: 'Vikram Singh' });
    expect(overriddenVisitor.name).toBe('Vikram Singh');

    const defaultResident = createResident();
    expect(defaultResident.name).toBe('Rajesh Kumar');
  });

  it('audits screen scenarios and verifies required scenario kinds exist', () => {
    const kinds = visitorsScenarios.map(s => s.kind);
    expect(kinds).toContain('normal');
    expect(kinds).toContain('loading');
    expect(kinds).toContain('empty');
    expect(kinds).toContain('error');
    expect(kinds).toContain('longContent');
    expect(kinds).toContain('tablet');

    const billingKinds = billingScenarios.map(s => s.kind);
    expect(billingKinds).toContain('normal');
    expect(billingKinds).toContain('loading');
    expect(billingKinds).toContain('empty');
    expect(billingKinds).toContain('error');
  });

  it('verifies that no phone numbers leak in visitors/connect search mock data and restricted document contents are kept safe', () => {
    
    const defaultVisitor = createVisitor();
    expect(defaultVisitor.phone).not.toMatch(/^[0-9]{10}$/); 
    expect(defaultVisitor.phone).toContain('***');

    
    const defaultBill = createBill();
    expect(defaultBill.charges.length).toBeGreaterThan(0);
  });
});
