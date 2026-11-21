import { visitorExitAssuranceMockNowIso } from '../data/visitorExitPolicy';
import {
  addMinutesToIso,
  getVisitorExitPolicy,
  resolveExpectedExitAtIso,
  resolveVisitorCategory,
  validateExpectedExitSelection,
} from '../utils/visitorExitPolicyResolver';

describe('visitorExitPolicyResolver', () => {
  it('uses short non-overridable policy windows for cab and delivery categories', () => {
    expect(getVisitorExitPolicy('cab')).toMatchObject({
      defaultExpectedDurationMinutes: 30,
      gracePeriodMinutes: 10,
      residentCanOverrideExitTime: false,
      alertPriority: 'high',
    });
    expect(getVisitorExitPolicy('delivery')).toMatchObject({
      defaultExpectedDurationMinutes: 30,
      gracePeriodMinutes: 10,
      residentCanOverrideExitTime: false,
      alertPriority: 'high',
    });
    expect(getVisitorExitPolicy('parcel')).toMatchObject({
      defaultExpectedDurationMinutes: 30,
      gracePeriodMinutes: 10,
      residentCanOverrideExitTime: false,
      alertPriority: 'high',
    });
  });

  it('maps vendor purposes to service-oriented policy categories', () => {
    expect(resolveVisitorCategory('VENDOR', 'Renovation material inspection')).toBe('renovationWorker');
    expect(resolveVisitorCategory('VENDOR', 'Painting estimate')).toBe('paintingWorker');
    expect(resolveVisitorCategory('VENDOR', 'Plumbing repair')).toBe('repairTechnician');
    expect(resolveVisitorCategory('VENDOR', 'Contractor visit')).toBe('contractor');
  });

  it('rejects invalid resident selected timing for categories that require selection', () => {
    const policy = getVisitorExitPolicy('serviceProvider');
    const beforeEntry = validateExpectedExitSelection({
      expectedEntryAtIso: visitorExitAssuranceMockNowIso,
      expectedExitAtIso: addMinutesToIso(visitorExitAssuranceMockNowIso, -1),
      policy,
    });
    const missingSelection = validateExpectedExitSelection({
      expectedEntryAtIso: visitorExitAssuranceMockNowIso,
      policy,
    });

    expect(beforeEntry).toEqual({ isValid: false, messageKey: 'visitor.validation.expectedExitAfterEntry' });
    expect(missingSelection).toEqual({ isValid: false, messageKey: 'visitor.validation.expectedExitRequired' });
  });

  it('keeps resident selected timing for overridable service categories', () => {
    const selectedExitAtIso = addMinutesToIso(visitorExitAssuranceMockNowIso, 95);

    expect(
      resolveExpectedExitAtIso(
        visitorExitAssuranceMockNowIso,
        getVisitorExitPolicy('repairTechnician'),
        selectedExitAtIso
      )
    ).toBe(selectedExitAtIso);
  });
});
