export type ServerChoice = {
  id: string;
  name: string;
  region: string;
  loadPercent: number;
  endpoint: string;
};

export type GatewayHealth = {
  ok: true;
  app: string;
};

export type ClientState = {
  signedIn: boolean;
  sessionToken: string | null;
  email: string;
  inviteCode: string;
  selectedServerId: string | null;
  connected: boolean;
  gatewayUrl: string;
  servers: ServerChoice[];
  clientKeyPair: {
    publicKey: string;
    privateKey: string;
  } | null;
  connection: {
    serverId: string;
    endpoint: string;
    publicKey: string;
    allowedIps: string[];
    clientPublicKey: string;
    clientAddress: string;
  } | null;
  lastError: string | null;
};

export type LoginResult = {
  ok: true;
  accessToken: string;
  expiresAt: string;
  user: {
    email: string;
    deviceId: string;
  };
};

export type ServersResult = {
  servers: ServerChoice[];
};

export type ConnectResult = {
  connection: {
    serverId: string;
    endpoint: string;
    publicKey: string;
    allowedIps: string[];
    clientPublicKey: string;
    clientAddress: string;
  };
  selectedServer: ServerChoice;
};
