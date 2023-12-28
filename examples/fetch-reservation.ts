import { Client } from '../src/client';
import { KnownEndpoint } from '../src/types/known-endpoint';
import { ReservationId } from '../src/types/reservation-id';

const apiKey = process.env.SERVEME_TF_API_KEY;
const reservationId = process.argv[2] ? parseInt(process.argv[2]) : undefined;

const fetchReservation = async (id: number) => {
  if (!apiKey) {
    throw new Error('export your SERVEME_TF_API_KEY environment variable');
  }

  const client = new Client({
    apiKey,
    endpoint: KnownEndpoint.europe,
  });

  const reservation = await client.fetch(id as ReservationId);
  console.log(`reservation status: ${reservation.status}`);
};

if (!reservationId) {
  throw new Error('no reservation id provided');
}

fetchReservation(reservationId).catch(error => console.error(error));
