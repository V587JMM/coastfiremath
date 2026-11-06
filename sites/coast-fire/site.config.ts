import { defineSite } from '@shipwords/core/site';
import { publicationIssues } from './src/lib/publication';
export const publicUrl = (import.meta.env.VITE_PUBLIC_SITE_URL || '').replace(/\/$/, '');
export const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || '';
export const operator = import.meta.env.VITE_OPERATOR_NAME || '';
export const configured = publicationIssues(publicUrl, contactEmail, operator).length === 0;
export default defineSite({
  id: 'coast-fire',
  name: 'Coast FIRE Calculator',
  url: publicUrl || 'http://localhost:5030',
  locales: ['en'],
  defaultLocale: 'en',
  products: [],
  signup: { bonusCredits: 0, bonusExpiresDays: null, bonusPerIpDaily: 0, bonusSiteDaily: 0 },
  guest: { dailyPerDevice: 0, dailyPerIp: 0, dailySiteBudget: 0, minRecaptchaScore: 0.5 },
  billing: { provider: 'stripe', automaticTax: false },
  analytics: {},
});
