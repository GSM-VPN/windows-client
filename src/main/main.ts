import { app, BrowserWindow } from "electron";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolvePreloadPath(): string {
  const runningFromSource = __dirname.includes(`${path.sep}src${path.sep}`);
  return runningFromSource ? path.join(__dirname, "../preload.cjs") : path.join(__dirname, "../preload.js");
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

async function createMainWindow(): Promise<void> {
  const window = new BrowserWindow({
    width: 1200,
    height: 820,
    backgroundColor: "#0b1020",
    icon: resolveIconPath(),
    webPreferences: {
      preload: resolvePreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  await window.loadURL("about:blank");
}

app.whenReady().then(async (): Promise<void> => {
  app.setAppUserModelId("com.gsmvpn.client");
  await createMainWindow();

  app.on("activate", async (): Promise<void> => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createMainWindow();
    }
  });
});

app.on("window-all-closed", (): void => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
