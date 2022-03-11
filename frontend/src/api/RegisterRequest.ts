import { DOMAIN, Service } from '../constants';
import { RequestFactory } from './api';

type RegisterRequestResult = [string, string];

interface RegisterRequestArgs {
  email: string;
  username: string;
  password: string;
}

interface RegisterRequestError {
  statusCode: number;
  message: string;
}

const RegisterRequest: RequestFactory<RegisterRequestResult, RegisterRequestArgs, RegisterRequestError> = args => ({
  url: `//${Service.AUTH}.${DOMAIN}/register`,
  request: {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  }
});

export { RegisterRequest };
