import { ServemeTfApiError } from '../src';
import { Client } from '../src/client';
import { KnownEndpoint } from '../src/types/known-endpoint';

const apiKey = process.env.SERVEME_TF_API_KEY;

const reserveServer = async () => {
  if (!apiKey) {
    throw new Error('export your SERVEME_TF_API_KEY environment variable');
  }

  const client = new Client({
    apiKey,
    endpoint: KnownEndpoint.europe,
  });

  const { servers, serverConfigs, whitelists } = await client.findOptions();
  console.log(`found ${servers.length} available servers`);
  console.log(`found ${serverConfigs.length} server configs`);
  console.log(`found ${whitelists.length} whitelists`);

  const selectedServer = servers.find(s => s.flag === 'de');
  if (!selectedServer) {
    throw new Error('No server found');
  }

  const selectedServerConfig = serverConfigs.find(
    c => c.file === 'etf2l_6v6_5cp',
  );
  if (!selectedServerConfig) {
    throw new Error('No server config found');
  }

  const selectedWhitelist = whitelists.find(
    w => w.file === 'etf2l_whitelist_6v6.txt',
  );
  if (!selectedWhitelist) {
    throw new Error('No whitelist found');
  }

  console.log(`selected server: ${selectedServer.name}`);
  const reservation = await client.create({
    serverId: selectedServer.id,
    serverConfigId: selectedServerConfig.id,
    whitelistId: selectedWhitelist.id,
  });

  console.log(`reservation created: ${reservation.id}`);

  await reservation.waitForStarted();
  console.log(`server started`);
  console.log(
    `connect string: connect ${reservation.server.ip_and_port}; password ${reservation.password}`,
  );
  console.log(`rcon password: ${reservation.rcon}`);
};

reserveServer().catch(error => {
  if (error instanceof ServemeTfApiError) {
    console.error(error.message);
  } else {
    console.error(error);
  }
});
