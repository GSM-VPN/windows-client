import { execFile } from "child_process";
import { existsSync } from "fs";
import { mkdtemp, writeFile } from "fs/promises";
import os from "os";
import path from "path";
type KeyPair = {
  publicKey: string;
  privateKey: string;
};

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

async function installTunnelConfig(
  payload: {
    serverId: string;
    connection: {
      clientAddress: string;
      publicKey: string;
      allowedIps: string[];
      endpoint: string;
    };
  },
  privateKey: string,
): Promise<void> {
  if (process.platform !== "win32") {
    return;
  }

  const tunnelName = `gsm-vpn-${payload.serverId}`;
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "gsm-vpn-"));
  const configPath = path.join(tempDir, `${tunnelName}.conf`);
  const config = [
    "[Interface]",
    `PrivateKey = ${privateKey}`,
    `Address = ${payload.connection.clientAddress}`,
    "DNS = 1.1.1.1",
    "",
    "[Peer]",
    `PublicKey = ${payload.connection.publicKey}`,
    `AllowedIPs = ${payload.connection.allowedIps.join(", ")}`,
    `Endpoint = ${payload.connection.endpoint}`,
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

export async function createKeyPair(): Promise<KeyPair> {
  const { createWireGuardKeyPair } = await import("../shared/wireguard.js");
  return createWireGuardKeyPair();
}

export async function installTunnel(
  payload: {
    serverId: string;
    connection: {
      clientAddress: string;
      publicKey: string;
      allowedIps: string[];
      endpoint: string;
    };
  },
  privateKey: string,
): Promise<void> {
  await installTunnelConfig(payload, privateKey);
}

export async function uninstallTunnel(serverId: string): Promise<void> {
  await removeTunnel(serverId);
}
