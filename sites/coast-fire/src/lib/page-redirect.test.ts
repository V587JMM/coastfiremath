import assert from 'node:assert/strict';
import { test } from 'node:test';
import { redirectPageRequest } from './page-redirect.ts';

const origin = 'https://coastfire-fixture.com';

test('public pages redirect once to a trailing slash and preserve query parameters', () => {
  for (const path of [
    '/what-is-coast-fire',
    '/coast-fire-calculator-by-age',
    '/barista-fire-calculator',
    '/about',
    '/editorial-policy',
    '/privacy',
    '/contact',
    '/terms',
    '/dmca',
    '/refunds',
  ]) {
    for (const method of ['GET', 'HEAD']) {
      for (const suffix of ['', '//', '///']) {
        const response = redirectPageRequest(new Request(`${origin}${path}${suffix}?ref=a%2Fb`, { method }));
        assert.ok(response, `${method} ${path}${suffix}`);
        assert.equal(response.status, 301);
        const target = response.headers.get('Location');
        assert.ok(target);
        assert.equal(target, `${origin}${path}/?ref=a%2Fb`);
        assert.equal(redirectPageRequest(new Request(target, { method })), null, 'no redirect loop');
      }
    }
  }
});

test('home, canonical pages, files, APIs and unknown routes are passed through', () => {
  for (const path of [
    '/',
    '/barista-fire-calculator/',
    '/what-is-coast-fire/?ref=home',
    '/coast-fire-calculator-by-age/',
    '/robots.txt',
    '/sitemap.xml',
    '/llms.txt',
    '/brand-logo.webp',
    '/assets/app.js',
    '/api/auth',
    '/api/stripe/webhook',
    '/_server/function-id',
    '/missing-page',
    '//another-domain.example/path',
  ]) {
    assert.equal(redirectPageRequest(new Request(`${origin}${path}`)), null, path);
  }
});

test('non-read requests keep their original method, body and routing', () => {
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
    assert.equal(redirectPageRequest(new Request(`${origin}/barista-fire-calculator`, { method })), null);
  }
});
