import { getResidentHeaderOptions, residentHeaderHiddenOptions } from '../residentHeaderOptions';

describe('residentHeaderOptions', () => {
  it('returns options with headerShown set to false', () => {
    const options = getResidentHeaderOptions();
    expect(options).toEqual(residentHeaderHiddenOptions);
    expect(options.headerShown).toBe(false);
  });
});
