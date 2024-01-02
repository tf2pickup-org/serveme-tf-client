export class HttpClientError extends Error {
  constructor(
    public readonly url: URL,
    public readonly status: number,
    public readonly statusText: string,
  ) {
    super(`${url.toString()}: ${status} ${statusText}`);
  }
}
