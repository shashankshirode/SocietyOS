import { DomesticHelpOperationsService } from '../services/domesticHelpOperationsService';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';

describe('Domestic Help Operations & Invariants', () => {
  const residentA: StaffOperationsActor = {
    userId: 'usr-res-101',
    societyId: 'soc-green-valley',
    role: 'RESIDENT',
    unitId: 'unit-a101',
    displayName: 'Resident A101',
  };

  const residentB: StaffOperationsActor = {
    userId: 'usr-res-202',
    societyId: 'soc-green-valley',
    role: 'RESIDENT',
    unitId: 'unit-a202',
    displayName: 'Resident A202',
  };

  const securitySupervisor: StaffOperationsActor = {
    userId: 'usr-sec-sup',
    societyId: 'soc-green-valley',
    role: 'SECURITY_SUPERVISOR',
    displayName: 'Supervisor Jagtap',
  };

  it('Invariant 4 & 5: Domestic Help != Society Staff and Profile != Unit relationship', () => {
    const service = new DomesticHelpOperationsService();

    const reg = service.registerDomesticHelp(residentA, 'soc-green-valley', {
      name: 'Sunita Bai',
      helpType: 'MAID',
      mobile: '9820055443',
      unitId: 'unit-a101',
      unitNumber: 'A-101',
      allowedDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
      allowedTimeFrom: '08:00',
      allowedTimeTo: '12:00',
    });

    expect(reg.profile.helpType).toBe('MAID');
    expect(reg.profile.linkedFlatCount).toBe(1);
    expect(reg.link.unitId).toBe('unit-a101');
    expect(reg.link.residentId).toBe(residentA.userId);
  });

  it('Invariant 6: One Domestic Help can serve multiple units simultaneously', () => {
    const service = new DomesticHelpOperationsService();

    const reg = service.registerDomesticHelp(residentA, 'soc-green-valley', {
      name: 'Sunita Bai',
      helpType: 'MAID',
      mobile: '9820055443',
      unitId: 'unit-a101',
      unitNumber: 'A-101',
      allowedDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
    });

    const linkB = service.linkToUnit(residentB, 'soc-green-valley', {
      domesticHelpId: reg.profile.id,
      unitId: 'unit-a202',
      unitNumber: 'A-202',
      effectiveFrom: '2026-02-01',
      allowedDays: ['TUESDAY', 'THURSDAY', 'SATURDAY'],
    });

    expect(linkB.unitId).toBe('unit-a202');
    const profile = service.getProfile(reg.profile.id);
    expect(profile?.linkedFlatCount).toBe(2);
    expect(profile?.linkedFlatNumbers).toContain('A-101');
    expect(profile?.linkedFlatNumbers).toContain('A-202');
  });

  it('Invariant 7: Resident ending service revokes only their unit link and does not Society-block the helper', () => {
    const service = new DomesticHelpOperationsService();

    const reg = service.registerDomesticHelp(residentA, 'soc-green-valley', {
      name: 'Radha Shinde',
      helpType: 'COOK',
      mobile: '9820077889',
      unitId: 'unit-a101',
      unitNumber: 'A-101',
      allowedDays: ['MONDAY', 'TUESDAY'],
    });

    const linkB = service.linkToUnit(residentB, 'soc-green-valley', {
      domesticHelpId: reg.profile.id,
      unitId: 'unit-a202',
      unitNumber: 'A-202',
      effectiveFrom: '2026-01-01',
      allowedDays: ['WEDNESDAY', 'THURSDAY'],
    });

    const revokedLinkA = service.revokeUnitLink(residentA, 'soc-green-valley', {
      linkId: reg.link.id,
      reason: 'Cook no longer needed at A-101',
    });

    expect(revokedLinkA.linkStatus).toBe('REVOKED');

    const profile = service.getProfile(reg.profile.id);
    expect(profile?.accessStatus).toBe('ACTIVE');
    expect(profile?.linkedFlatCount).toBe(1);
    expect(profile?.linkedFlatNumbers).toEqual(['A-202']);

    const linksForHelper = service.getLinksForHelper(reg.profile.id);
    const linkBState = linksForHelper.find(l => l.id === linkB.id);
    expect(linkBState?.linkStatus).toBe('ACTIVE');
  });

  it('Invariant 8: Resident move-out ends their domestic-help link; new occupant does not inherit it', () => {
    const service = new DomesticHelpOperationsService();

    const reg = service.registerDomesticHelp(residentA, 'soc-green-valley', {
      name: 'Gita More',
      helpType: 'MAID',
      mobile: '9820099887',
      unitId: 'unit-a101',
      unitNumber: 'A-101',
      allowedDays: ['ALL_DAYS'],
    });

    const revokedCount = service.handleResidentMoveOut(residentA, 'soc-green-valley', 'unit-a101');
    expect(revokedCount).toBe(1);

    const linksA101 = service.getLinksForUnit('unit-a101');
    expect(linksA101[0]?.linkStatus).toBe('EXPIRED');
    expect(linksA101[0]?.revocationReason).toContain('move-out');

    const activeLinksA101 = linksA101.filter(l => l.linkStatus === 'ACTIVE');
    expect(activeLinksA101.length).toBe(0);
  });

  it('Scenario F: Society-wide block revokes gate access across all linked units with security audit', () => {
    const service = new DomesticHelpOperationsService();

    const reg = service.registerDomesticHelp(residentA, 'soc-green-valley', {
      name: 'Ashok Driver',
      helpType: 'DRIVER',
      mobile: '9820033221',
      unitId: 'unit-a101',
      unitNumber: 'A-101',
      allowedDays: ['ALL_DAYS'],
    });

    service.linkToUnit(residentB, 'soc-green-valley', {
      domesticHelpId: reg.profile.id,
      unitId: 'unit-a202',
      unitNumber: 'A-202',
      effectiveFrom: '2026-01-01',
      allowedDays: ['ALL_DAYS'],
    });

    const blocked = service.societyBlockDomesticHelp(securitySupervisor, 'soc-green-valley', reg.profile.id, {
      reason: 'Security violation: Unauthorized entry into restricted electrical room',
      confirmationChecked: true,
      incidentReference: 'INC-2026-0089',
    });

    expect(blocked.accessStatus).toBe('BLOCKED');
    expect(blocked.incidentCount).toBe(1);

    const allLinks = service.getLinksForHelper(reg.profile.id);
    for (const link of allLinks) {
      expect(link.linkStatus).toBe('REVOKED');
      expect(link.revocationReason).toContain('Society Security Block');
    }
  });

  it('Invariant 44: Cross-Society Domestic Help IDOR is rejected', () => {
    const service = new DomesticHelpOperationsService();
    expect(() => {
      service.registerDomesticHelp(residentA, 'soc-other-society', {
        name: 'Spy Maid',
        helpType: 'MAID',
        mobile: '9820011999',
        unitId: 'unit-other-1',
        unitNumber: 'Z-999',
        allowedDays: ['MONDAY'],
      });
    }).toThrow('CROSS_SOCIETY_ACCESS_DENIED');
  });
});
