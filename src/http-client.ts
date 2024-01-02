import { HttpClientError } from './errors/http-client.error';
import { HttpMethod } from './http-method';
import { isAbsoluteUrl } from './is-absolute-url';

interface HttpClientOptions {
  baseUrl?: string;
  params?: Record<string, string>;
}

export class HttpClient {
  readonly baseUrl?: string;
  readonly params?: Record<string, string>;

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl;
    this.params = options.params;
  }

  async request<Response, Body extends object = object>(
    method: HttpMethod,
    path: string,
    body?: Body,
  ): Promise<Response> {
    const url = this.createUrl(path);
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (response.ok) {
      return (await response.json()) as Response;
    } else {
      throw new HttpClientError(
        url,
        response.status,
        response.statusText,
        await response.json(),
      );
    }
  }

  async get<Response>(path: string): Promise<Response> {
    return await this.request(HttpMethod.GET, path);
  }

  async post<Response, Body extends object = object>(
    path: string,
    body: Body,
  ): Promise<Response> {
    return await this.request(HttpMethod.POST, path, body);
  }

  async put<Response, Body extends object = object>(
    path: string,
    body: Body,
  ): Promise<Response> {
    return await this.request(HttpMethod.PUT, path, body);
  }

  async delete<Response>(path: string): Promise<Response> {
    return await this.request(HttpMethod.DELETE, path, {});
  }

  private createUrl(path: string): URL {
    let url: URL;
    if (isAbsoluteUrl(path)) {
      url = new URL(path);
    } else {
      url = new URL(
        [this.baseUrl, path]
          .filter(Boolean)
          .join('/')
          .replace(/([^:]\/)\/+/g, '$1'),
      );
    }

    if (this.params) {
      for (const [key, value] of Object.entries(this.params)) {
        url.searchParams.append(key, value);
      }
    }

    return url;
  }
}
