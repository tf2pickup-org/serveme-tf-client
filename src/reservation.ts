import { Client } from './client';
import { ReservationStatus } from './types/reservation-status';
import { SdrDetails } from './types/sdr-details';
import { Response } from './types/serveme-tf-responses';
import { ServerConfigId } from './types/server-config-option';
import { WhitelistId } from './types/whitelist-option';

export class Reservation {
  constructor(
    public readonly client: Client,
    private r: Response.ActiveReservation,
  ) {}

  get id(): number {
    return this.r.id;
  }

  get startsAt(): Date {
    return new Date(this.r.starts_at);
  }

  get endsAt(): Date {
    return new Date(this.r.ends_at);
  }

  get status(): ReservationStatus {
    return this.r.status as ReservationStatus;
  }

  get password(): string {
    return this.r.password;
  }

  get rcon(): string {
    return this.r.rcon;
  }

  get tvPassword(): string {
    return this.r.tv_password;
  }

  get tvRelayPassword(): string {
    return this.r.tv_relaypassword;
  }

  get firstMap(): string | null {
    return this.r.first_map;
  }

  get serverConfigId(): ServerConfigId | null {
    return this.r.server_config_id as ServerConfigId;
  }

  get whitelistId(): WhitelistId | null {
    return this.r.whitelist_id as WhitelistId;
  }

  get customWhitelistId(): number | null {
    return this.r.custom_whitelist_id;
  }

  get autoEnd(): boolean {
    return this.r.auto_end;
  }

  get sdr(): SdrDetails | null {
    if (
      this.r.sdr_ip === undefined ||
      this.r.sdr_port === undefined ||
      this.r.sdr_tv_port === undefined ||
      this.r.sdr_final === undefined
    ) {
      return null;
    }

    return {
      ip: this.r.sdr_ip,
      port: this.r.sdr_port,
      tvPort: this.r.sdr_tv_port,
      final: this.r.sdr_final,
    };
  }

  get pluginsEnabled(): boolean {
    return this.r.enable_plugins;
  }

  get demosTfEnabled(): boolean {
    return this.r.enable_demostf;
  }

  get lastNumberOfPlayers(): number {
    return this.r.last_number_of_players;
  }

  get inactiveMinuteCounter(): number {
    return this.r.inactive_minute_counter;
  }

  get logSecret(): string {
    return this.r.logsecret;
  }

  get isStartedInstantly(): boolean {
    return this.r.start_instantly;
  }

  get isEndedInstantly(): boolean {
    return this.r.end_instantly;
  }

  get isProvisioned(): boolean {
    return this.r.provisioned;
  }

  get ended(): boolean {
    return this.r.ended;
  }

  get reservedBy(): string {
    return this.r.steam_uid;
  }

  get serverId(): number | null {
    return this.r.server_id;
  }

  async refresh(): Promise<this> {
    const response =
      await this.client.httpClient.get<Response.ServemeTfReservationDetails>(
        `/reservations/${this.r.id}`,
      );

    this.r = response.data.reservation;
    return this;
  }

  async end(): Promise<this> {
    const response =
      await this.client.httpClient.delete<Response.ServemeTfReservationDetails>(
        `/reservations/${this.r.id}`,
      );

    this.r = response.data.reservation;
    return this;
  }
}
