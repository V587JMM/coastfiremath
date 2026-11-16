import handler from '@tanstack/react-start/server-entry';
import { redirectPageRequest } from './lib/page-redirect';

export default {
  fetch(request: Request) {
    return redirectPageRequest(request) ?? handler.fetch(request);
  },
};
