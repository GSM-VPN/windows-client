import { contextBridge } from "electron";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { mountApp } from "./renderer/app.js";
import { createWireGuardKeyPair } from "./shared/wireguard.js";
import type { ClientState, ConnectResult, LoginResult, ServersResult } from "./shared/types.js";

type LoginPayload = {
  email: string;
  inviteCode: string;
  deviceId?: string;
};

type AppBridge = {
  getState: () => ClientState;
  setGatewayUrl: (gatewayUrl: string) => void;
  setCredentials: (email: string, inviteCode: string) => void;
  signIn: (payload: { email: string; inviteCode: string }) => Promise<unknown>;
  refreshServers: () => Promise<unknown>;
  connect: (serverId: string) => Promise<ConnectResult>;
  disconnect: () => Promise<{ ok: true }>;
};

const initialState: ClientState = {
  signedIn: false,
  sessionToken: null,
  email: "",
  inviteCode: "",
  selectedServerId: null,
  connected: false,
  gatewayUrl: "http://127.0.0.1:8080",
  servers: [],
  clientKeyPair: null,
  connection: null,
  lastError: null,
};

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

function getWireGuardExecutablePath(): string | null {
  if (process.platform !== "win32") {
    return null;
  }

  const candidates = [
    path.join(process.env.ProgramFiles ?? "C:\\Program Files", "WireGuard", "wireguard.exe"),
    path.join(process.env["ProgramFiles(x86)"] ?? "C:\\Program Files (x86)", "WireGuard", "wireguard.exe"),
  ];

  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

async function downloadWireGuardInstaller(): Promise<string> {
  const installerUrl = "https://download.wireguard.com/windows-client/wireguard-installer.exe";
  const targetDir = await mkdtemp(path.join(os.tmpdir(), "gsm-vpn-wireguard-"));
  const installerPath = path.join(targetDir, "wireguard-installer.exe");
  const response = await fetch(installerUrl);
  if (!response.ok) {
    throw new Error("Unable to download WireGuard installer.");
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(installerPath, bytes);

  return installerPath;
}

async function ensureWireGuardInstalled(): Promise<string> {
  const existing = getWireGuardExecutablePath();
  if (existing) {
    return existing;
  }

  if (process.platform !== "win32") {
    throw new Error("WireGuard is required on Windows.");
  }

  const installerPath = await downloadWireGuardInstaller();

  await new Promise<void>((resolve, reject) => {
    execFile(installerPath, [], { windowsHide: true }, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });

  const installed = getWireGuardExecutablePath();
  if (!installed) {
    throw new Error("WireGuard installation finished, but the executable was not found.");
  }

  return installed;
}

async function runWireGuard(argumentsList: string[]): Promise<void> {
  const exePath = await ensureWireGuardInstalled();

  await new Promise<void>((resolve, reject) => {
    execFile(exePath, argumentsList, { windowsHide: true }, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function installTunnelConfig(result: ConnectResult): Promise<void> {
  if (process.platform !== "win32") {
    return;
  }

  const tunnelName = `gsm-vpn-${result.selectedServer.id}`;
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "gsm-vpn-"));
  const configPath = path.join(tempDir, `${tunnelName}.conf`);
  const config = [
    "[Interface]",
    `PrivateKey = ${initialState.clientKeyPair?.privateKey ?? ""}`,
    `Address = ${result.connection.clientAddress}`,
    "DNS = 1.1.1.1",
    "",
    "[Peer]",
    `PublicKey = ${result.connection.publicKey}`,
    `AllowedIPs = ${result.connection.allowedIps.join(", ")}`,
    `Endpoint = ${result.connection.endpoint}`,
    "PersistentKeepalive = 25",
    "",
  ].join("\n");

  await writeFile(configPath, config, "utf8");
  await runWireGuard(["/installtunnelservice", configPath]);
}

async function removeTunnel(serverId: string): Promise<void> {
  if (process.platform !== "win32") {
    return;
  }

  const tunnelName = `gsm-vpn-${serverId}`;
  await runWireGuard(["/uninstalltunnelservice", tunnelName]);
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
    initialState.clientKeyPair = createWireGuardKeyPair();
  }

  const response = await apiFetch<{ ok: true; selectedServer: ServersResult["servers"][number]; connection: ConnectResult["connection"] }>(
    "/connect",
    {
      method: "POST",
      body: JSON.stringify({
        serverId,
        clientPublicKey: initialState.clientKeyPair.publicKey,
        deviceId: `${os.hostname()}-${process.pid}`,
      }),
    },
  );

  initialState.selectedServerId = response.selectedServer.id;
  initialState.connection = response.connection;
  initialState.connected = true;
  setError(null);

  await installTunnelConfig({
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
  setGatewayUrl: (gatewayUrl: string): void => {
    initialState.gatewayUrl = gatewayUrl;
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
