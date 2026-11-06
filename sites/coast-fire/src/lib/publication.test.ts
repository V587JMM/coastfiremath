import assert from 'node:assert/strict';
import { test } from 'node:test';
import { publicationIssues } from './publication.ts';

test('domain alone never enables publishing without contact and operator', () => {
  assert.equal(publicationIssues('https://coastfire-fixture.com', '', '').length, 2);
  assert.equal(publicationIssues('', '', '').length, 3);
});
test('real-shaped complete public configuration passes; placeholders and URLs with credentials do not', () => {
  assert.equal(
    publicationIssues('https://coastfire-fixture.com', 'hello@coastfire-fixture.com', 'Test Operator').length,
    0,
  );
  for (const url of [
    'http://localhost:5031',
    'https://example.com',
    'https://coast.test',
    'https://name:password@coastfire-fixture.com',
    'https://coastfire-fixture.com/path',
    'https://coastfire-fixture.com?input=1',
  ])
    assert.ok(publicationIssues(url, 'hello@coastfire-fixture.com', 'Test Operator').length);
  assert.ok(publicationIssues('https://coastfire-fixture.com', 'hello@example.com', 'Test Operator').length);
});
