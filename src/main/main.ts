import { app, BrowserWindow, ipcMain, Tray, Menu } from "electron";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createKeyPair, installTunnel, uninstallTunnel } from "./wireguard.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type SavedSession = { email: string; inviteCode: string; sessionToken: string };

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;

function getSessionPath(): string {
  return path.join(app.getPath("userData"), "session.json");
}

// Load .env for dev mode (in production the value is baked in by esbuild at build time)
(function loadDotEnv(): void {
  const envPath = path.resolve(__dirname, "../../.env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (k && !(k in process.env)) process.env[k] = v;
  }
})();

function resolvePreloadPath(): string {
  return path.join(__dirname, "../preload.cjs");
}

function resolveIconPath(): string | undefined {
  if (process.platform !== "win32") {
    return undefined;
  }

  const sourcePath = app.isPackaged
    ? path.join(process.resourcesPath, "GSM_VPN.ico")
    : __dirname.includes(`${path.sep}src${path.sep}`)
      ? path.join(__dirname, "..", "assets", "GSM_VPN.ico")
      : path.join(__dirname, "..", "..", "assets", "GSM_VPN.ico");

  if (existsSync(sourcePath)) {
    return sourcePath;
  }

  return undefined;
}

function registerIpcHandlers(): void {
  ipcMain.handle("gsm-vpn:create-keypair", async (): Promise<{ publicKey: string; privateKey: string }> => {
    return createKeyPair();
  });

  ipcMain.handle(
    "gsm-vpn:install-tunnel",
    async (_event, payload: { connection: { clientAddress: string; publicKey: string; allowedIps: string[]; endpoint: string }; privateKey: string; serverId: string }): Promise<{ ok: true }> => {
      await installTunnel(payload, payload.privateKey);

      return { ok: true };
    },
  );

  ipcMain.handle("gsm-vpn:remove-tunnel", async (_event, payload: { serverId: string }): Promise<{ ok: true }> => {
    await uninstallTunnel(payload.serverId);
    return { ok: true };
  });

  ipcMain.handle("gsm-vpn:load-session", (): SavedSession | null => {
    const p = getSessionPath();
    if (!existsSync(p)) return null;
    try {
      const data = JSON.parse(readFileSync(p, "utf8")) as Partial<SavedSession>;
      if (data.sessionToken) return data as SavedSession;
    } catch { /* ignore */ }
    return null;
  });

  ipcMain.handle("gsm-vpn:save-session", (_event, data: SavedSession): void => {
    writeFileSync(getSessionPath(), JSON.stringify(data), "utf8");
  });

  ipcMain.handle("gsm-vpn:clear-session", (): void => {
    const p = getSessionPath();
    if (existsSync(p)) writeFileSync(p, "{}", "utf8");
  });
}

function createTray(): void {
  const iconPath = resolveIconPath();
  if (!iconPath) return;

  tray = new Tray(iconPath);
  tray.setToolTip("GSM VPN");
  tray.on("click", () => {
    mainWindow?.show();
    mainWindow?.focus();
  });
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: "Open", click: () => { mainWindow?.show(); mainWindow?.focus(); } },
    { type: "separator" },
    { label: "Quit", click: () => { isQuitting = true; app.quit(); } },
  ]));
}

async function createMainWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    backgroundColor: "#ffffff",
    icon: resolveIconPath(),
    webPreferences: {
      preload: resolvePreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.on("close", (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow?.hide();
    }
  });

  await mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
}

app.whenReady().then(async (): Promise<void> => {
  registerIpcHandlers();
  app.setAppUserModelId("com.gsmvpn.client");
  await createMainWindow();
  createTray();
});

app.on("before-quit", (): void => {
  isQuitting = true;
});
