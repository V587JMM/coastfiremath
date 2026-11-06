import { publicationIssues } from './src/lib/publication.ts';

const issues = publicationIssues(
  process.env.VITE_PUBLIC_SITE_URL || '',
  process.env.VITE_CONTACT_EMAIL || '',
  process.env.VITE_OPERATOR_NAME || '',
);
if (issues.length) {
  console.error('Not ready for public launch:\n' + issues.join('\n') + '\nLocal preview remains available.');
  process.exit(1);
}
