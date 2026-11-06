import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/api/auth/$')({
  server: { handlers: { ANY: () => new Response('Not available', { status: 404 }) } },
});
