import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/api/webhooks/stripe')({
  server: { handlers: { ANY: () => new Response('Not available', { status: 404 }) } },
});
