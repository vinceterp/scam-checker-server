const scamCheckEngine = require('./scamCheckEngine');

describe('Scam Detection Engine', () => {
  it('flags free email domains', async () => {
    const input = { email: 'test@gmail.com' };
    const result = await scamCheckEngine(input);
    expect(result.flags).toContain('Free email domain used');
    expect(result.score).toBeGreaterThan(0);
  });

  it('flags urgency phrases in text', async () => {
    const input = { textContent: 'This is urgent, act now!' };
    const result = await scamCheckEngine(input);
    expect(result.flags).toContain('Urgency phrase in message');
    expect(result.score).toBeGreaterThan(0);
  });

  it('does not flag safe input', async () => {
    const input = { email: 'user@company.com', textContent: 'Hello there.' };
    const result = await scamCheckEngine(input);
    expect(result.flags.length).toBe(0);
    expect(result.score).toBe(0);
  });
});
