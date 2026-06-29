import type { ClientState } from "../shared/types.js";
import { createElement } from "./components.js";
import { createHeroSection } from "./hero.js";
import { renderServerList } from "./server-list.js";
import { createSidebarSection, type SidebarRefs } from "./sidebar.js";
import { injectStyles } from "./styles.js";

type AppBridge = {
  getState: () => ClientState;
  getFixedGateway: () => string;
  setGatewayUrl: (gatewayUrl: string) => void;
  setCredentials: (email: string, inviteCode: string) => void;
  signIn: (payload: { email: string; inviteCode: string }) => Promise<unknown>;
  refreshServers: () => Promise<unknown>;
  connect: (serverId: string) => Promise<unknown>;
  disconnect: () => Promise<{ ok: true }>;
};

type AppRefs = SidebarRefs & {
  statusEl: HTMLElement;
  statusLabel: HTMLElement;
  sessionValue: HTMLElement;
  serverValue: HTMLElement;
  addressValue: HTMLElement;
};

function renderState(bridge: AppBridge, refs: AppRefs): void {
  const s = bridge.getState();

  refs.gatewayUrlEl.value = s.gatewayUrl;
  refs.emailEl.value      = s.email;
  refs.inviteCodeEl.value = s.inviteCode;

  const connected = s.connected;
  refs.statusEl.dataset.connected = String(connected);
  refs.statusLabel.textContent    = connected ? "Connected" : "Not connected";
  refs.toggleEl.textContent       = connected ? "Disconnect" : "Connect";
  refs.toggleEl.className         = connected ? "btn btn--danger" : "btn btn--primary";
  refs.errorEl.textContent        = s.lastError ?? "";

  refs.sessionValue.textContent = s.signedIn ? s.email : "Not signed in";
  refs.serverValue.textContent  = s.connection?.serverId ?? s.selectedServerId ?? "No server selected";
  refs.addressValue.textContent = s.connection?.clientAddress ?? "Unassigned";

  renderServerList(refs.serversEl, s.servers, s.selectedServerId);

  for (const node of refs.serversEl.querySelectorAll<HTMLButtonElement>("[data-server-id]")) {
    node.addEventListener("click", async () => {
      const serverId = node.dataset.serverId;
      if (!serverId) return;
      try {
        await bridge.connect(serverId);
        renderState(bridge, refs);
      } catch (err) {
        refs.errorEl.textContent = err instanceof Error ? err.message : String(err);
      }
    });
  }
}

export function mountApp(root: HTMLElement, bridge: AppBridge): void {
  injectStyles();
  root.replaceChildren();

  const layout = createElement("div", { className: "app-layout" });
  const { hero, statusEl, statusLabel, sessionValue, serverValue, addressValue } = createHeroSection();
  const fixedGateway = bridge.getFixedGateway();
  const { sidebar, refs } = createSidebarSection({ fixedGateway });

  const fullRefs: AppRefs = { statusEl, statusLabel, sessionValue, serverValue, addressValue, ...refs };

  layout.append(hero, sidebar);
  root.append(layout);

  if (!fixedGateway) {
    refs.gatewayUrlEl.addEventListener("input", () => bridge.setGatewayUrl(refs.gatewayUrlEl.value));
  }
  refs.emailEl.addEventListener("input",      () => bridge.setCredentials(refs.emailEl.value, refs.inviteCodeEl.value));
  refs.inviteCodeEl.addEventListener("input", () => bridge.setCredentials(refs.emailEl.value, refs.inviteCodeEl.value));

  refs.signInEl.addEventListener("click", async () => {
    try {
      bridge.setGatewayUrl(refs.gatewayUrlEl.value);
      bridge.setCredentials(refs.emailEl.value, refs.inviteCodeEl.value);
      await bridge.signIn({ email: refs.emailEl.value, inviteCode: refs.inviteCodeEl.value });
      await bridge.refreshServers();
      renderState(bridge, fullRefs);
    } catch (err) {
      refs.errorEl.textContent = err instanceof Error ? err.message : String(err);
      renderState(bridge, fullRefs);
    }
  });

  refs.refreshEl.addEventListener("click", async () => {
    try {
      await bridge.refreshServers();
      renderState(bridge, fullRefs);
    } catch (err) {
      refs.errorEl.textContent = err instanceof Error ? err.message : String(err);
    }
  });

  refs.toggleEl.addEventListener("click", async () => {
    const s = bridge.getState();
    try {
      if (s.connected) {
        await bridge.disconnect();
      } else {
        const target = s.selectedServerId ?? s.servers[0]?.id;
        if (!target) throw new Error("No server selected.");
        await bridge.connect(target);
      }
    } catch (err) {
      refs.errorEl.textContent = err instanceof Error ? err.message : String(err);
    }
    renderState(bridge, fullRefs);
  });

  renderState(bridge, fullRefs);
}
