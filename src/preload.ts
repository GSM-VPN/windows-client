import { contextBridge, ipcRenderer } from "electron";
import { mountApp } from "./renderer/app.js";
import type { ClientState, ConnectResult, LoginResult, ServersResult } from "./shared/types.js";

type LoginPayload = {
  email: string;
  inviteCode: string;
  deviceId?: string;
};

type AppBridge = {
  getState: () => ClientState;
  getFixedGateway: () => string;
  setGatewayUrl: (gatewayUrl: string) => void;
  setCredentials: (email: string, inviteCode: string) => void;
  signIn: (payload: { email: string; inviteCode: string }) => Promise<unknown>;
  refreshServers: () => Promise<unknown>;
  connect: (serverId: string) => Promise<ConnectResult>;
  disconnect: () => Promise<{ ok: true }>;
};

type KeyPair = {
  publicKey: string;
  privateKey: string;
};

const FIXED_GATEWAY: string = process.env.GATEWAY_URL ?? "";

const initialState: ClientState = {
  signedIn: false,
  sessionToken: null,
  email: "",
  inviteCode: "",
  selectedServerId: null,
  connected: false,
  gatewayUrl: FIXED_GATEWAY || "http://127.0.0.1:8080",
  servers: [],
  clientKeyPair: null,
  connection: null,
  lastError: null,
};

const deviceId = globalThis.crypto?.randomUUID?.() ?? `gsm-vpn-${Date.now()}`;

function setError(message: string | null): void {
  initialState.lastError = message;
}

function getGatewayUrl(): string {
  return initialState.gatewayUrl.replace(/\/+$/, "");
}

async function apiFetch<T>(pathName: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type") && init.body) {
    headers.set("content-type", "application/json");
  }
  if (initialState.sessionToken) {
    headers.set("authorization", `Bearer ${initialState.sessionToken}`);
  }

  const response = await fetch(`${getGatewayUrl()}${pathName}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

async function signIn(payload: LoginPayload): Promise<LoginResult> {
  const response = await fetch(`${getGatewayUrl()}/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as LoginResult | { ok: false; message: string };
  if (!response.ok || !data.ok) {
    throw new Error("message" in data ? data.message : "Login failed");
  }

  initialState.signedIn = true;
  initialState.email = payload.email;
  initialState.inviteCode = payload.inviteCode;
  initialState.sessionToken = data.accessToken;
  setError(null);
  return data;
}

async function refreshServers(): Promise<ServersResult> {
  const data = await apiFetch<ServersResult>("/servers");
  initialState.servers = data.servers;
  initialState.selectedServerId = data.servers[0]?.id ?? null;
  setError(null);
  return data;
}

async function createKeyPair(): Promise<KeyPair> {
  return (await ipcRenderer.invoke("gsm-vpn:create-keypair")) as KeyPair;
}

async function installTunnel(result: ConnectResult): Promise<void> {
  if (!initialState.clientKeyPair) {
    throw new Error("Client key pair is missing.");
  }

  await ipcRenderer.invoke("gsm-vpn:install-tunnel", {
    serverId: result.selectedServer.id,
    privateKey: initialState.clientKeyPair.privateKey,
    connection: result.connection,
  });
}

async function removeTunnel(serverId: string): Promise<void> {
  await ipcRenderer.invoke("gsm-vpn:remove-tunnel", { serverId });
}

async function connect(serverIdInput: string): Promise<ConnectResult> {
  if (!initialState.signedIn || !initialState.sessionToken) {
    throw new Error("Please sign in first.");
  }

  const serverId = serverIdInput || initialState.selectedServerId || initialState.servers[0]?.id;
  if (!serverId) {
    throw new Error("No VPN server is available.");
  }

  if (!initialState.clientKeyPair) {
    initialState.clientKeyPair = await createKeyPair();
  }

  const response = await apiFetch<{ ok: true; selectedServer: ServersResult["servers"][number]; connection: ConnectResult["connection"] }>(
    "/connect",
    {
      method: "POST",
      body: JSON.stringify({
        serverId,
        clientPublicKey: initialState.clientKeyPair.publicKey,
        deviceId,
      }),
    },
  );

  initialState.selectedServerId = response.selectedServer.id;
  initialState.connection = response.connection;
  initialState.connected = true;
  setError(null);

  await installTunnel({
    selectedServer: response.selectedServer,
    connection: response.connection,
  });

  return {
    selectedServer: response.selectedServer,
    connection: response.connection,
  };
}

async function disconnect(): Promise<{ ok: true }> {
  if (!initialState.sessionToken) {
    throw new Error("Please sign in first.");
  }

  await apiFetch<{ ok: true }>("/disconnect", {
    method: "POST",
    body: JSON.stringify({
      serverId: initialState.selectedServerId,
    }),
  });

  if (initialState.selectedServerId) {
    await removeTunnel(initialState.selectedServerId);
  }

  initialState.connected = false;
  initialState.connection = null;
  setError(null);
  return { ok: true };
}

const bridge: AppBridge = {
  getState: (): ClientState => initialState,
  getFixedGateway: (): string => FIXED_GATEWAY,
  setGatewayUrl: (gatewayUrl: string): void => {
    if (!FIXED_GATEWAY) initialState.gatewayUrl = gatewayUrl;
  },
  setCredentials: (email: string, inviteCode: string): void => {
    initialState.email = email;
    initialState.inviteCode = inviteCode;
  },
  signIn,
  refreshServers,
  connect,
  disconnect,
};

contextBridge.exposeInMainWorld("gsmVpn", bridge);

window.addEventListener("DOMContentLoaded", () => {
  mountApp(document.body, bridge);
});
