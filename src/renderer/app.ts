import type { ClientState } from "../shared/types.js";
import { createElement } from "./components.js";
import { createHeroSection } from "./hero.js";
import { renderServerList } from "./server-list.js";
import { createSidebarSection, type SidebarRefs } from "./sidebar.js";
import { injectStyles } from "./styles.js";

type AppBridge = {
  getState: () => ClientState;
  setGatewayUrl: (gatewayUrl: string) => void;
  setCredentials: (email: string, inviteCode: string) => void;
  signIn: (payload: { email: string; inviteCode: string }) => Promise<unknown>;
  refreshServers: () => Promise<unknown>;
  connect: (serverId: string) => Promise<unknown>;
  disconnect: () => Promise<{ ok: true }>;
};

type AppRefs = SidebarRefs & {
  statusLabel: HTMLElement;
  sessionValue: HTMLElement;
  serverValue: HTMLElement;
  addressValue: HTMLElement;
};

function renderState(bridge: AppBridge, refs: AppRefs): void {
  const current = bridge.getState();
  refs.gatewayUrlEl.value = current.gatewayUrl;
  refs.emailEl.value = current.email;
  refs.inviteCodeEl.value = current.inviteCode;
  refs.statusLabel.textContent = current.connected ? "Connected" : "Ready to connect";
  refs.toggleEl.textContent = current.connected ? "Disconnect" : "Connect";
  refs.errorEl.textContent = current.lastError || "";
  refs.sessionValue.textContent = current.signedIn ? current.email : "Not signed in";
  refs.serverValue.textContent = current.connection?.serverId ?? current.selectedServerId ?? "No server selected";
  refs.addressValue.textContent = current.connection?.clientAddress ?? "Unassigned";

  renderServerList(refs.serversEl, current.servers, current.selectedServerId);

  for (const node of refs.serversEl.querySelectorAll<HTMLButtonElement>("[data-server-id]")) {
    node.addEventListener("click", async () => {
      const serverId = node.dataset.serverId;
      if (!serverId) {
        return;
      }

      try {
        await bridge.connect(serverId);
        renderState(bridge, refs);
      } catch (error) {
        refs.errorEl.textContent = error instanceof Error ? error.message : String(error);
      }
    });
  }
}

export function mountApp(root: HTMLElement, bridge: AppBridge): void {
  injectStyles();
  root.replaceChildren();

  const wrap = createElement("div", { className: "wrap" });
  const card = createElement("div", { className: "card" });
  const { hero, statusLabel, sessionValue, serverValue, addressValue } = createHeroSection();
  const { sidebar, refs } = createSidebarSection();

  const fullRefs: AppRefs = {
    statusLabel,
    sessionValue,
    serverValue,
    addressValue,
    ...refs,
  };

  card.append(hero, sidebar);
  wrap.append(card);
  root.append(wrap);

  refs.gatewayUrlEl.addEventListener("input", () => bridge.setGatewayUrl(refs.gatewayUrlEl.value));
  refs.emailEl.addEventListener("input", () => bridge.setCredentials(refs.emailEl.value, refs.inviteCodeEl.value));
  refs.inviteCodeEl.addEventListener("input", () => bridge.setCredentials(refs.emailEl.value, refs.inviteCodeEl.value));

  refs.signInEl.addEventListener("click", async () => {
    try {
      bridge.setGatewayUrl(refs.gatewayUrlEl.value);
      bridge.setCredentials(refs.emailEl.value, refs.inviteCodeEl.value);
      await bridge.signIn({ email: refs.emailEl.value, inviteCode: refs.inviteCodeEl.value });
      await bridge.refreshServers();
      renderState(bridge, fullRefs);
    } catch (error) {
      refs.errorEl.textContent = error instanceof Error ? error.message : String(error);
      renderState(bridge, fullRefs);
    }
  });

  refs.refreshEl.addEventListener("click", async () => {
    try {
      await bridge.refreshServers();
      renderState(bridge, fullRefs);
    } catch (error) {
      refs.errorEl.textContent = error instanceof Error ? error.message : String(error);
    }
  });

  refs.toggleEl.addEventListener("click", async () => {
    const current = bridge.getState();
    if (current.connected) {
      try {
        await bridge.disconnect();
      } catch (error) {
        refs.errorEl.textContent = error instanceof Error ? error.message : String(error);
      }
    } else {
      try {
        const target = current.selectedServerId ?? current.servers[0]?.id;
        if (!target) {
          throw new Error("No server selected.");
        }
        await bridge.connect(target);
      } catch (error) {
        refs.errorEl.textContent = error instanceof Error ? error.message : String(error);
      }
    }

    renderState(bridge, fullRefs);
  });

  renderState(bridge, fullRefs);
}
