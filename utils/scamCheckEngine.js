// Modular scam detection engine
const url = require('url');
const whois = require('whois-json');

const rules = [
  {
    name: 'Domain age < 6 months',
    check: async (input) => {
      if (!input.url) return false;
      try {
        const parsedUrl = input.url.replace(/^https?:\/\//, '').split('/')[0];
        const whoisData = await whois(parsedUrl);
        if (whoisData.created) {
          const createdDate = new Date(whoisData.created);
          const now = new Date();
          const diffMonths = (now.getFullYear() - createdDate.getFullYear()) * 12 + (now.getMonth() - createdDate.getMonth());
          return diffMonths < 6;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
    weight: 0.2,
    flag: 'Domain age < 6 months',
  },
  {
    name: 'Free email domain used',
    check: (input) => {
      const freeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      if (input.email) {
        const domain = input.email.split('@')[1];
        return freeDomains.includes(domain);
      }
      return false;
    },
    weight: 0.1,
    flag: 'Free email domain used',
  },
  {
    name: 'Urgency phrase in message',
    check: (input) => {
      if (!input.textContent) return false;
      const phrases = ['urgent', 'immediately', 'asap', 'act now', 'limited time'];
      return phrases.some((p) => input.textContent.toLowerCase().includes(p));
    },
    weight: 0.15,
    flag: 'Urgency phrase in message',
  },
];

async function scamCheckEngine(input) {
  let score = 0;
  let flags = [];
  for (const rule of rules) {
    const flagged = await rule.check(input);
    if (flagged) {
      score += rule.weight;
      flags.push(rule.flag);
    }
  }
  return {
    score: Math.min(score, 1),
    flags,
    explanation: flags.length ? `Flags: ${flags.join(', ')}` : 'No scam indicators found',
    confidence: score,
  };
}

module.exports = scamCheckEngine;
