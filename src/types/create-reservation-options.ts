import { ServerConfigId } from './server-config-option';
import { ServerId } from './server-option';
import { WhitelistId } from './whitelist-option';

export interface CreateReservationOptions {
  serverId: ServerId;
  startsAt?: Date;
  endsAt?: Date;
  rcon?: string;
  password?: string;
  serverConfigId?: ServerConfigId;
  whitelistId?: WhitelistId;
  enablePlugins?: boolean;
  enableDemosTf?: boolean;
  firstMap?: string;
}
