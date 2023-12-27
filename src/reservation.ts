import { Client } from './client';
import { Response } from './types/serveme-tf-responses';
import { ReservationDetails } from './reservation-details';

export class Reservation extends ReservationDetails {
  constructor(
    public readonly client: Client,
    r: Response.ActiveReservation,
  ) {
    super(r);
  }

  async refresh(): Promise<this> {
    const response =
      await this.client.httpClient.get<Response.ServemeTfReservationDetails>(
        `/reservations/${this.id}`,
      );

    this.setResponse(response.data.reservation);
    return this;
  }

  async end(): Promise<this> {
    const response =
      await this.client.httpClient.delete<Response.ServemeTfReservationDetails>(
        `/reservations/${this.id}`,
      );

    this.setResponse(response.data.reservation);
    return this;
  }
}
