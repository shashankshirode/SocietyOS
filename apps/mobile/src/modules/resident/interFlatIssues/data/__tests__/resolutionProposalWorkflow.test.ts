import { InterFlatMockSource } from '../interFlat.mockSource';

describe('Resident inter-flat resolution proposal workflow', () => {
  it('loads linked proposal parties and persists the reporting residence decision', async () => {
    const source = new InterFlatMockSource();
    const detail = await source.getResolutionProposalDetail('prop-001');

    expect(detail?.reporterFlat).toBe('A-1204');
    expect(detail?.proposal.mediationId).toBe('med-001');

    await source.acceptResolutionProposal('prop-001', {
      role: 'REPORTER',
      feedback: 'The proposal is acceptable.',
    });

    const updated = await source.getResolutionProposalDetail('prop-001');
    expect(updated?.proposal.reporterAccepted).toBe(true);
    expect(updated?.proposal.reporterFeedback).toBe('The proposal is acceptable.');
  });

  it('returns no detail for an expired deep link', async () => {
    const source = new InterFlatMockSource();
    await expect(source.getResolutionProposalDetail('missing-proposal')).resolves.toBeUndefined();
  });
});
