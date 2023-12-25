import { ServerConfigOption } from './server-config-option';
import { ServerOption } from './server-option';
import { WhitelistOption } from './whitelist-option';

export interface ReservationOptions {
  servers: ServerOption[];
  serverConfigs: ServerConfigOption[];
  whitelists: WhitelistOption[];
}
