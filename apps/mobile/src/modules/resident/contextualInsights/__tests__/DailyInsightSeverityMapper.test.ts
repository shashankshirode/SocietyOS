import { resolveSeverity, getSeverityTone } from '../../dashboard/components/insights/dailyInsightMapper';

describe('DailyInsightSeverityMapper', () => {
  it('maps low priority to information severity', () => {
    expect(resolveSeverity('low', 'utility', 'Title')).toBe('information');
  });

  it('maps medium priority to advisory severity', () => {
    expect(resolveSeverity('medium', 'utility', 'Title')).toBe('advisory');
  });

  it('maps high priority to important severity', () => {
    expect(resolveSeverity('high', 'utility', 'Title')).toBe('important');
  });

  it('maps critical priority to urgent if not a real safety emergency', () => {
    expect(resolveSeverity('critical', 'utility', 'Regular Lift Outage')).toBe('urgent');
  });

  it('maps critical priority to critical only for safety emergencies', () => {
    expect(resolveSeverity('critical', 'utility', 'Fire alarm reported in Tower C')).toBe('critical');
    expect(resolveSeverity('critical', 'utility', 'Gas leak in kitchen')).toBe('critical');
    expect(resolveSeverity('critical', 'utility', 'Resident trapped in lift')).toBe('critical');
  });

  it('maps severities to correct semantic tones', () => {
    expect(getSeverityTone('critical')).toBe('danger');
    expect(getSeverityTone('urgent')).toBe('danger');
    expect(getSeverityTone('important')).toBe('warning');
    expect(getSeverityTone('advisory')).toBe('info');
    expect(getSeverityTone('information')).toBe('neutral');
  });
});
