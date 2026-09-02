import { isResidentPrimaryTabRoute, residentPrimaryTabRoutes, residentTabIcons } from '../residentPrimaryNavigation';

describe('residentPrimaryNavigation', () => {
  it('exposes the four Society OS primary destinations in order', () => {
    expect(residentPrimaryTabRoutes).toEqual(['HomeTab', 'ActivityTab', 'CommunityTab', 'ServicesTab']);
  });

  it('keeps compatibility routes out of the visible capsule', () => {
    expect(isResidentPrimaryTabRoute('VisitorTab')).toBe(false);
    expect(isResidentPrimaryTabRoute('BillTab')).toBe(false);
    expect(residentTabIcons.VisitorTab).toBeDefined();
  });
});
