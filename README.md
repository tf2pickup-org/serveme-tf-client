<h1 align="center">serveme-tf-client</h1>

<p align="center">A wrapper around serveme.tf's API</p>

### Installation

```bash
npm i @tf2pickup-org/serveme-tf-client
```

### Usage

#### Create a new reservation

```typescript
import { Client, KnownEndpoint } from '@tf2pickup-org/serveme-tf-client';

const client = new Client({ apiKey: process.env.SERVEME_TF_API_KEY, endpoint: KnownEndpoint.europe });

// fetch all servers, configs and whitelists that serveme.tf provides
const { servers, serverConfigs, whitelists } = await client.findOptions();

// select a server
const selectedServer = servers[0];

// create a new reservation
const reservation = await client.create({ serverId: selectedServer.id });
console.log(`connect string: connect ${reservation.server.ip_and_port}; password ${reservation.password}`);
console.log(`rcon password: ${reservation.rcon}`);
```

#### Fetch and manage an existing reservation

```typescript
import { Client, KnownEndpoint, ReservationId } from '@tf2pickup-org/serveme-tf-client';

const client = new Client({ apiKey: process.env.SERVEME_TF_API_KEY, endpoint: KnownEndpoint.europe });

const reservation = await client.fetch(1383514 as ReservationId);
console.log(`connect string: connect ${reservation.server.ip_and_port}; password ${reservation.password}`);
console.log(`rcon password: ${reservation.rcon}`);

// end the reservation
await reservation.end();
```
