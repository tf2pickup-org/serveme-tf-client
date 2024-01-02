import { HttpClientError } from './http-client.error';

export class ServemeTfApiError extends Error {
  constructor(
    public readonly message: string,
    public readonly httpClientError: HttpClientError,
  ) {
    super(`Ssrveme.tf API error: ${message}`);
  }
}
