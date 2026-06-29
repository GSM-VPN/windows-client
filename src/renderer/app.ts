import type { ClientState } from "../shared/types.js";
import { createElement } from "./components.js";
import { createHeroSection } from "./hero.js";
import { createLoginView } from "./login.js";
import { renderServerList } from "./server-list.js";
import { createSidebarSection, type SidebarRefs } from "./sidebar.js";

type AppBridge = {
  getState: () => ClientState;
  setCredentials: (email: string, inviteCode: string) => void;
  signIn: (payload: { email: string; inviteCode: string }) => Promise<unknown>;
  refreshServers: () => Promise<unknown>;
  connect: (serverId: string) => Promise<unknown>;
  disconnect: () => Promise<{ ok: true }>;
};

type MainRefs = SidebarRefs & {
  statusEl: HTMLElement;
  statusLabel: HTMLElement;
  sessionValue: HTMLElement;
  serverValue: HTMLElement;
  addressValue: HTMLElement;
};

function renderMainState(bridge: AppBridge, refs: MainRefs): void {
  const s = bridge.getState();
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
        renderMainState(bridge, refs);
      } catch (err) {
        refs.errorEl.textContent = err instanceof Error ? err.message : String(err);
      }
    });
  }
}

export function mountApp(root: HTMLElement, bridge: AppBridge): void {
  root.replaceChildren();

  const flipContainer = createElement("div", { className: "flip-container" });
  const flipCard      = createElement("div", { className: "flip-card" });

  const flipFront = createElement("div", { className: "flip-front" });
  const { loginEl, refs: loginRefs } = createLoginView();
  flipFront.append(loginEl);

  const flipBack = createElement("div", { className: "flip-back" });
  const { hero, statusEl, statusLabel, sessionValue, serverValue, addressValue } = createHeroSection();
  const { sidebar, refs: mainRefs } = createSidebarSection();
  const appLayout = createElement("div", { className: "app-layout" });
  appLayout.append(hero, sidebar);
  flipBack.append(appLayout);

  flipCard.append(flipFront, flipBack);
  flipContainer.append(flipCard);
  root.append(flipContainer);

  const allMainRefs: MainRefs = {
    statusEl, statusLabel, sessionValue, serverValue, addressValue,
    ...mainRefs,
  };

  loginRefs.emailEl.addEventListener("input", () =>
    bridge.setCredentials(loginRefs.emailEl.value, loginRefs.inviteCodeEl.value),
  );
  loginRefs.inviteCodeEl.addEventListener("input", () =>
    bridge.setCredentials(loginRefs.emailEl.value, loginRefs.inviteCodeEl.value),
  );

  loginRefs.signInEl.addEventListener("click", async () => {
    loginRefs.signInEl.textContent = "Signing in";
    loginRefs.signInEl.classList.add("btn--loading");
    loginRefs.errorEl.textContent = "";

    try {
      bridge.setCredentials(loginRefs.emailEl.value, loginRefs.inviteCodeEl.value);
      await bridge.signIn({ email: loginRefs.emailEl.value, inviteCode: loginRefs.inviteCodeEl.value });
      await bridge.refreshServers();

      renderMainState(bridge, allMainRefs);
      /* slight delay so the main view renders before the flip starts */
      requestAnimationFrame(() => flipCard.classList.add("flipped"));
    } catch (err) {
      loginRefs.errorEl.textContent = err instanceof Error ? err.message : String(err);
      loginRefs.signInEl.textContent = "Sign in";
      loginRefs.signInEl.classList.remove("btn--loading");
    }
  });

  mainRefs.refreshEl.addEventListener("click", async () => {
    try {
      await bridge.refreshServers();
      renderMainState(bridge, allMainRefs);
    } catch (err) {
      mainRefs.errorEl.textContent = err instanceof Error ? err.message : String(err);
    }
  });

  mainRefs.toggleEl.addEventListener("click", async () => {
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
      mainRefs.errorEl.textContent = err instanceof Error ? err.message : String(err);
    }
    renderMainState(bridge, allMainRefs);
  });
}
