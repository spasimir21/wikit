import { DOMAIN, Service } from '../constants';
import { RequestFactory } from './api';

interface LogoutRequestArgs {
  token: string;
}

const LogoutRequest: RequestFactory<null, LogoutRequestArgs, null> = args => ({
  url: `//${Service.AUTH}.${DOMAIN}/logout`,
  request: {
    method: 'POST',
    headers: { Authorization: `Bearer ${args.token}` }
  }
});

export { LogoutRequest };
