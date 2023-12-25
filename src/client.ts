import { AxiosInstance } from 'axios';
import { KnownEndpoint } from './types/known-endpoint';
import { createServemeTfHttpClient } from './create-serveme-tf-http-client';
import { Reservation } from './reservation';
import { Response } from './types/serveme-tf-responses';
import { Actions } from './types/actions';
import { ReservationOptions } from './types/reservation-options';
import { ServerId } from './types/server-option';
import { ServerConfigId } from './types/server-config-option';
import { WhitelistId } from './types/whitelist-option';
import { generatePassword } from './generate-password';
import { add } from 'date-fns';
import { ReservationId } from './types/reservation-id';

interface ClientOptions {
  apiKey: string;
  endpoint: KnownEndpoint | string;
}

interface CreateReservationOptions {
  serverId: ServerId;
  startsAt?: Date;
  endsAt?: Date;
  rcon?: string;
  password?: string;
  serverConfigId?: ServerConfigId;
  whitelistId?: WhitelistId;
  enablePlugins?: boolean;
  enableDemosTf?: boolean;
}

export class Client {
  readonly endpoint: KnownEndpoint | string;
  readonly httpClient: AxiosInstance;
  readonly actions: Actions = {};
  private reservation?: Response.Reservation;

  constructor(options: ClientOptions) {
    this.endpoint = options.endpoint;
    this.httpClient = createServemeTfHttpClient(this.endpoint, options.apiKey);
  }

  async findOptions(): Promise<ReservationOptions> {
    const entryResponse =
      await this.httpClient.get<Response.ServemeTfEntry>('/reservations/new');

    this.actions.findServers = entryResponse.data.actions.find_servers;

    const reservationResponse =
      await this.httpClient.post<Response.ServemeTfFindOptions>(
        this.actions.findServers,
        { reservation: entryResponse.data.reservation },
      );

    this.actions.create = reservationResponse.data.actions.create;

    const servers = reservationResponse.data.servers.map(server => ({
      ...server,
      id: server.id as ServerId,
    }));
    const serverConfigs = reservationResponse.data.server_configs.map(
      config => ({
        ...config,
        id: config.id as ServerConfigId,
      }),
    );
    const whitelists = reservationResponse.data.whitelists.map(whitelist => ({
      ...whitelist,
      id: whitelist.id as WhitelistId,
    }));

    return {
      servers,
      serverConfigs,
      whitelists,
    };
  }

  async create(options: CreateReservationOptions): Promise<Reservation> {
    const url = this.actions.create ?? '/reservations';
    const startsAt = options.startsAt || new Date();
    const endsAt = options.endsAt || add(startsAt, { hours: 2 });
    const rcon = this.reservation?.rcon || options.rcon || generatePassword();
    const password =
      this.reservation?.password || options.password || generatePassword();

    const response =
      await this.httpClient.post<Response.ServemeTfReservationDetails>(url, {
        reservation: {
          server_id: options.serverId,
          starts_at: startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
          rcon,
          password,
          enable_plugins: options.enablePlugins,
          enable_demos_tf: options.enableDemosTf,
        },
      });

    this.actions.delete = response.data.actions.delete;
    this.actions.idle_reset = response.data.actions.idle_reset;
    return new Reservation(this, response.data.reservation);
  }

  async fetch(id: ReservationId): Promise<Reservation> {
    const response =
      await this.httpClient.get<Response.ServemeTfReservationDetails>(
        `/reservations/${id}`,
      );

    this.actions.delete = response.data.actions.delete;
    this.actions.idle_reset = response.data.actions.idle_reset;
    return new Reservation(this, response.data.reservation);
  }
}
