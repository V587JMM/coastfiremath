export function publicationIssues(url: string, email: string, operator: string): string[] {
  const issues: string[] = [];
  try {
    const parsed = new URL(url);
    if (
      parsed.protocol !== 'https:' ||
      parsed.username ||
      parsed.password ||
      parsed.search ||
      parsed.hash ||
      parsed.pathname !== '/' ||
      !parsed.hostname.includes('.') ||
      /^\d+\.\d+\.\d+\.\d+$/.test(parsed.hostname) ||
      /(^|\.)(localhost|example\.com|example\.org|example\.net)$|\.(test|invalid|example|localhost)$/.test(
        parsed.hostname,
      )
    )
      throw new Error('Invalid public origin');
  } catch {
    issues.push('VITE_PUBLIC_SITE_URL: set a real HTTPS domain origin.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /@example\.(com|org|net)$/i.test(email))
    issues.push('VITE_CONTACT_EMAIL: set a real feedback email.');
  if (!operator.trim()) issues.push('VITE_OPERATOR_NAME: identify the actual operator.');
  return issues;
}
